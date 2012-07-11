using System;
using System.Collections.Generic;
using TegudData.Repository.Blog;

namespace TegudData.Models.Blog
{
    public abstract class BlogEntry
    {
        public int ID { get; set; }

        public string Title { get; set; }

        public Security.User Author { get; set; }

        public BlogCategory Category { get; set; }

        public List<BlogTag> Tags { get; set; }

        public DateTime PostedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public int CommentCount { get; set; }

        public string Text { get; set; }

        protected BlogEntry()
        {
            Tags = new List<BlogTag>();
        }
    }

    public class BlogEntryForSingleView : BlogEntry
    {
        public BlogSeriesDetail BlogSeriesDetail { get; set; }
    }

    public class BlogSeriesDetail
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public List<BlogSeriesEntry> Entries { get; set; }
    }

    public class BlogEntryForList : BlogEntry
    {
        public BlogSeriesSummary BlogSeriesSummary { get; set; }
    }
}
