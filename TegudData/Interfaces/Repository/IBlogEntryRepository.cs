using System.Collections.Generic;
using TegudData.Models.Blog;
using TegudData.Models.BlogModel;
using TegudData.Repository.Blog;

namespace TegudData.Interfaces.Repository
{
    public interface IBlogEntryRepository
    {
        IEnumerable<BlogEntryForList> GetBlogEntries(BlogQuery query);
        BlogArchive GetArchive();
        TagCloud GetTagCloud();
        BlogEntryForSingleView GetBlogEntryByID(int id);
    }
}