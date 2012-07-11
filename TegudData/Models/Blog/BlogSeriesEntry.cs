namespace TegudData.Models.Blog
{
    public abstract class BlogSeriesEntry
    {
        public string Name { get; set; }

        public int Part { get; set; }
    }

    public class BlogSeriesPlaceholderEntry : BlogSeriesEntry
    {
    }

    public class BlogSeriesBlogEntry : BlogSeriesEntry
    {
        public int ID { get; set; }
    }

    
}