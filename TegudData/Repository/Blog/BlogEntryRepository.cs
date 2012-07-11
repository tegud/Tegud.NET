using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Text;
using Dapper;
using TegudData.Interfaces.Repository;
using TegudData.Models.Blog;
using TegudData.Models.BlogModel;
using TegudData.Parameters;
using TegudUtilities.Performance;

namespace TegudData.Repository.Blog
{
    public class BlogEntryRepository : IBlogEntryRepository
    {
        private readonly IDbConnection _connection;
        private readonly IProfilerWrapper _profilerWrapper;
        private const string ALL_BLOG_ENTRY_SQL = "SELECT B.ID ID, B.SiteID, B.Title, B.PostedAt, B.Text, B.UpdatedAt, B.CommentCount, U.*, C.*, T.ID, T.Name, BS.ID, BS.Name, BS.Parts TotalParts, BSB.Part FROM Blog B  INNER JOIN [User] U ON B.AuthorID = U.ID  INNER JOIN Category C ON B.CategoryID = C.ID LEFT OUTER JOIN BlogTag BT ON BT.BlogID = B.ID  LEFT OUTER JOIN Tag T ON BT.TagID = T.ID  LEFT OUTER JOIN BlogSeries BS ON B.BlogSeriesID = BS.ID  LEFT OUTER JOIN BlogSeriesBlog BSB ON B.ID = BSB.BlogID WHERE B.SiteID = 1 AND C.Name = ISNULL(@Category, C.Name) AND (@StartDate IS NULL OR B.PostedAt >= @StartDate) AND (@EndDate IS NULL OR B.PostedAt <= @EndDate) AND B.Archived < 1 ORDER BY B.PostedAt DESC";
        private const string SINGLE_BLOG_ENTRY_SQL =
            "SELECT	B.ID ID, B.Title, B.PostedAt, B.Text, B.UpdatedAt, B.CommentCount, U.ID UserID, U.Username, U.FullName, U.Email, C.ID CategoryID, C.Name CategoryName, BS.ID SeriesID, BS.Name SeriesName, BS.Parts FROM Blog B INNER JOIN [User] U ON B.AuthorID = U.ID INNER JOIN Category C ON B.CategoryID = C.ID LEFT OUTER JOIN BlogSeries BS ON BS.ID = B.BlogSeriesID WHERE B.ID = @ID ORDER BY B.PostedAt DESC; SELECT	T.* FROM BlogTag BT INNER JOIN Tag T ON BT.TagID = T.ID WHERE BT.BlogID = @ID; SELECT BSB2.Part, B.ID, B.Title FROM BlogSeriesBlog BSB INNER JOIN BlogSeriesBlog BSB2 ON BSB.BlogSeriesID = BSB2.BlogSeriesID INNER JOIN Blog B ON BSB2.BlogID = B.ID WHERE BSB.BlogID = @ID UNION ALL SELECT BSP.Part, NULL, BSP.Name FROM	BlogSeriesBlog B INNER JOIN BlogSeriesPlaceholder BSP ON BSP.BlogSeriesID = B.BlogSeriesID WHERE B.BlogID = @ID";
        private const string BLOG_ARCHIVE_SQL = "SELECT DATEPART(MONTH, PostedAt) Month, DATEPART(YEAR, PostedAt) Year, COUNT(*) Items FROM Blog B WHERE SiteID = 1 AND B.Archived < 1 GROUP BY DATEPART(MONTH, PostedAt), DATEPART(YEAR, PostedAt) ORDER BY YEAR DESC, Month DESC";
        private const string TAG_CLOUD_SQL =
            "SELECT T.Name, COUNT(*) Items FROM BlogTag BT INNER JOIN Tag T ON BT.TagID = T.ID INNER JOIN Blog B ON B.ID = BT.BlogID WHERE B.Archived < 1 GROUP BY T.Name";

        public BlogEntryRepository(ITegudSqlConnectionFactory connectionFactory, IProfilerWrapper profilerWrapper)
        {
            _profilerWrapper = profilerWrapper;
            _connection = connectionFactory.GetConnection();
        }

        public BlogEntryForSingleView GetBlogEntryByID(int id)
        {
            BlogEntryForSingleView blogEntry;
            using (var multi = _connection.QueryMultiple(SINGLE_BLOG_ENTRY_SQL, new {id}))
            {
                var blogRecord = multi.Read<SingleBlogEntryRecord>().Single();
                var blogTags = multi.Read<BlogTag>().ToList();
                var seriesEntries = multi.Read<BlogSeriesEntryRecord>().ToList();

                blogEntry = new BlogEntryForSingleView
                                    {
                                        ID = blogRecord.ID,
                                        Title = blogRecord.Title,
                                        Author =
                                            new Models.Security.User
                                                {
                                                    ID = blogRecord.UserID,
                                                    Email = blogRecord.Email,
                                                    FullName = blogRecord.FullName
                                                },
                                        Category =
                                            new BlogCategory
                                                {ID = blogRecord.CategoryID, Name = blogRecord.CategoryName},
                                        PostedAt = blogRecord.PostedAt,
                                        UpdatedAt = blogRecord.UpdatedAt,
                                        Tags = blogTags,
                                        Text = blogRecord.Text,
                                        CommentCount = blogRecord.CommentCount,
                                        BlogSeriesDetail = new BlogSeriesDetail
                                                               {
                                                                   ID = blogRecord.ID,
                                                                   Name = blogRecord.SeriesName,
                                                                   Entries = MapBlogSeriesEntryRecordsToEntries(seriesEntries)
                                                               }
                                    };

            } 

            return blogEntry;
        }

        private List<BlogSeriesEntry> MapBlogSeriesEntryRecordsToEntries(List<BlogSeriesEntryRecord> seriesEntries)
        {
            List<BlogSeriesEntry> entries = new List<BlogSeriesEntry>(seriesEntries.Count());

            foreach(var entry in seriesEntries)
            {
                if (entry.ID.HasValue)
                {
                    entries.Add(new BlogSeriesBlogEntry {ID = entry.ID.Value, Name = entry.Title, Part = entry.Part});
                }
                else
                {
                    entries.Add(new BlogSeriesPlaceholderEntry {Name = entry.Title, Part = entry.Part});
                }

            }

            return entries;
        }

        public IEnumerable<BlogEntryForList> GetBlogEntries(BlogQuery query)
        {

            var blogEntryLookup = new List<BlogEntryForList>();

            using (_profilerWrapper.Step("Get all blog entries from database"))
            {
                _connection
                    .Query<BlogEntryForList, Models.Security.User, BlogCategory, BlogTag, BlogSeriesSummary, BlogEntryForList>(
                        ALL_BLOG_ENTRY_SQL,
                        (blogEntry, author, category, tag, seriesSummary) =>
                            {
                                BlogEntryForList deduplicatedBlogEntry;

                                if ((deduplicatedBlogEntry =  blogEntryLookup.SingleOrDefault(b => b.ID == blogEntry.ID)) == null)
                                {
                                    blogEntry.Author = author;
                                    blogEntry.Category = category;
                                    blogEntry.BlogSeriesSummary = seriesSummary ?? BlogSeriesSummary.NoSeries;

                                    blogEntryLookup.Add(blogEntry);
                                    deduplicatedBlogEntry = blogEntry;
                                }

                                if (tag != null)
                                    deduplicatedBlogEntry.Tags.Add(tag);

                                return blogEntry;
                            },
                            new
                                {
                                    query.Category,
                                    query.StartDate,
                                    query.EndDate
                                });
            }

            if (!string.IsNullOrWhiteSpace(query.Tag))
            {
                using (_profilerWrapper.Step("Filter by blog entries by tag"))
                {
                    return blogEntryLookup.Where(b => b.Tags.Select(t => t.Name).Contains(query.Tag));
                }
            }

            return blogEntryLookup;
        }

        public BlogArchive GetArchive()
        {
            using (_profilerWrapper.Step("Get blog archive from database"))
            {
                var groupedBlogArchives = _connection.Query<BlogArchiveRecord>(BLOG_ARCHIVE_SQL)
                    .GroupBy(ba => ba.Year, ba => ba);

                return new BlogArchive(groupedBlogArchives
                                           .Select(
                                               year =>
                                               new BlogArchiveYear(year.Key,
                                                                   year.Select(
                                                                       month =>
                                                                       new BlogArchiveMonth(month.Month, month.Items)))));
            }
        }

        public TagCloud GetTagCloud()
        {
            using (_profilerWrapper.Step("Get blog tag cloud from database"))
            {
                var tagCloudItems = _connection.Query<TagCloudItem>(TAG_CLOUD_SQL);

                return new TagCloud(tagCloudItems);
            }
        }

        private class BlogSeriesEntryRecord
        {
            public int? ID { get; set; }

            public string Title { get; set; }

            public int Part { get; set; }
        }

        private class SingleBlogEntryRecord
        {
            public int ID { get; set; }

            public string Title { get; set; }

            public DateTime PostedAt { get; set; }

            public DateTime UpdatedAt { get; set; }

            public string Text { get; set; }

            public int CommentCount { get; set; }

            public int UserID { get; set; }

            public string UserName { get; set; }

            public string FullName{ get; set; }

            public string Email { get; set; }

            public int CategoryID { get; set; }

            public string CategoryName { get; set; }

            public int SeriesID { get; set; }

            public string SeriesName { get; set; }

            public int Parts { get; set; }
        }

        private class BlogArchiveRecord
        {
            public int Year { get; set; }

            public int Month { get; set; }

            public int Items { get; set; }
        }
    }

    public class BlogQuery
    {
        public string Category { get; set; }

        public string Tag { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public BlogQuery(HomepageParameters homepageParameters)
        {
            Category = string.IsNullOrWhiteSpace(homepageParameters.Category) ? null : homepageParameters.Category;
            Tag = string.IsNullOrWhiteSpace(homepageParameters.Tag) ? null : homepageParameters.Tag;

            if(homepageParameters.Month > 0)
            {
                StartDate = new DateTime(homepageParameters.Year, homepageParameters.Month, 1);
                EndDate = StartDate.Value.AddMonths(1).AddSeconds(-1);
            }
            else if(homepageParameters.Year > 0)
            {
                StartDate = new DateTime(homepageParameters.Year, 1, 1);
                EndDate = StartDate.Value.AddYears(1).AddSeconds(-1);
            }
        }


    }
}
