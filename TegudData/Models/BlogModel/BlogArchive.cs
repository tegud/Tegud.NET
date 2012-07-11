using System.Collections.Generic;

namespace TegudData.Models.BlogModel
{
    public class BlogArchive
    {
        public readonly IEnumerable<BlogArchiveYear> Years;

        public BlogArchive(IEnumerable<BlogArchiveYear> years)
        {
            Years = years;
        }
    }
}