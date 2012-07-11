using TegudData.Models.Blog;

namespace TegudData.ViewModels.Blog
{
    public class BlogItemViewModel : BlogItemViewModelBase
    {
        public string PostedAtTime
        {
            get { return PostedAt.ToString("HH:mm"); }
        }

        public BlogSeriesSummaryViewModel SeriesSummary { get; set; }

        public BlogItemViewModel(BlogEntryForList blog) : base(blog)
        {
            SeriesSummary = new BlogSeriesSummaryViewModel
                                {
                                    ID = blog.BlogSeriesSummary.ID,
                                    Name = blog.BlogSeriesSummary.Name,
                                    Part = blog.BlogSeriesSummary.Part,
                                    TotalParts = blog.BlogSeriesSummary.TotalParts,
                                    PartOfSeries = !BlogSeriesSummary.NoSeries.Equals(blog.BlogSeriesSummary)
                                };
        }
    }

    public class BlogSeriesSummaryViewModel
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public int Part { get; set; }

        public int TotalParts { get; set; }

        public bool PartOfSeries { get; set; }
    }
}