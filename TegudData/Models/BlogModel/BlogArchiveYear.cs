using System.Collections.Generic;

namespace TegudData.Models.BlogModel
{
    public class BlogArchiveYear
    {
        public readonly int Year;

        public readonly IEnumerable<BlogArchiveMonth> Months;

        public BlogArchiveYear(int year, IEnumerable<BlogArchiveMonth> months)
        {
            Year = year;
            Months = months;
        }
    }
}