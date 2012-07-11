using System.Collections.Generic;
using System.Linq;
using System.Web;
using TegudData.Models.Blog;

namespace TegudData.ViewModels.Blog
{
    public class SingleBlogItemViewModel : BlogItemViewModelBase
    {
        public BlogSeries Series = new BlogSeries();

        public class BlogSeries
        {
            private IEnumerable<BlogItemSeriesEntry> _entries = new List<BlogItemSeriesEntry>(0);
            public IEnumerable<BlogItemSeriesEntry> Entries
            {
                get { return _entries; }
                set { _entries = value; }
            }

            public BlogItemSeriesEntry Previous
            {
                get
                {
                    int currentPart;
                    BlogItemSeriesEntry previous;

                    if (!Entries.Any() || (currentPart = GetCurrentPart()) < 2 || ((previous = GetPreviousEntry(currentPart)) == null))
                    {
                        return null;
                    }

                    return previous;
                }
            }


            public BlogItemSeriesEntry Next
            {
                get
                {
                    int currentPart;
                    BlogItemSeriesEntry next;

                    if (!Entries.Any() || (currentPart = GetCurrentPart()) > Entries.Count() || ((next = GetNextEntry(currentPart)) == null))
                    {
                        return null;
                    }

                    return next;
                }
            }

            private int GetCurrentPart()
            {
                return _entries.Single(e => e.IsCurrent).Part;
            }

            private BlogItemSeriesEntry GetPreviousEntry(int part)
            {
                part = part - 1;
                return _entries.SingleOrDefault(e => e.Part == part);
            }

            private BlogItemSeriesEntry GetNextEntry(int part)
            {
                part = part + 1;
                return _entries.SingleOrDefault(e => e.Part == part);
            }
        }

        public SingleBlogItemViewModel(BlogEntryForSingleView blog) : base(blog)
        {
            Series = new BlogSeries { Entries = blog.BlogSeriesDetail.Entries.Select(e => GetBlogItemSeriesViewModel(e, blog.ID)) };
        }

        public BlogItemSeriesEntry GetBlogItemSeriesViewModel(BlogSeriesEntry entry, int currentID)
        {
            BlogSeriesBlogEntry blogEntry;
            return (blogEntry = entry as BlogSeriesBlogEntry) == null 
                ? GetBlogItemSeriesViewModel(entry as BlogSeriesPlaceholderEntry) 
                : GetBlogItemSeriesViewModel(blogEntry, blogEntry.ID == currentID);
        }

        public BlogItemSeriesEntry GetBlogItemSeriesViewModel(BlogSeriesBlogEntry entry, bool isCurrent)
        {
            return new BlogItemSeriesEntry
                       {
                           Name = entry.Name,
                           Part = entry.Part,
                           Complete = true,
                           IsCurrent = isCurrent,
                           Link = new BlogItemLink(entry.ID, entry.Name).ToString()
                       };

        }

        public BlogItemSeriesEntry GetBlogItemSeriesViewModel(BlogSeriesPlaceholderEntry entry)
        {
            return new BlogItemSeriesEntry
            {
                Name = entry.Name,
                Part = entry.Part
            };
        }

        public class BlogItemSeriesEntry
        {
            public string Name { get; set; }

            public string Link { get; set; }

            public bool Complete { get; set; }

            public bool IsCurrent { get; set; }

            public int Part { get; set; }
        }
    }
}
