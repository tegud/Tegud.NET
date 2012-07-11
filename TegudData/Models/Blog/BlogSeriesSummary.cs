namespace TegudData.Models.Blog
{
    public class BlogSeriesSummary
    {
        public static BlogSeriesSummary NoSeries = new BlogSeriesSummary
                                                       {
                                                           Name = "Single blog item",
                                                           Part = 1,
                                                           TotalParts = 1
                                                       };

        public int ID { get; set; }

        public string Name { get; set; }

        public int Part { get; set; }

        public int TotalParts { get; set; }
    }
}