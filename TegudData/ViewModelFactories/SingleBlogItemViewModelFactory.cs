using System.Collections.Generic;
using System.Linq;
using System.Web;
using TegudData.Interfaces.Repository;
using TegudData.Interfaces.ViewModelFactories;
using TegudData.Models.Blog;
using TegudData.ViewModels.Blog;

namespace TegudData.ViewModelFactories
{
    public class SingleBlogItemViewModelFactory : ISingleBlogItemViewModelFactory
    {
        private readonly IBlogEntryRepository _blogEntryRepository;

        public SingleBlogItemViewModelFactory(IBlogEntryRepository blogEntryRepository)
        {
            _blogEntryRepository = blogEntryRepository;
        }

        public SingleBlogItemViewModel GetViewModelByBlogID(int id)
        {
            var blogEntry = _blogEntryRepository.GetBlogEntryByID(id);

            return new SingleBlogItemViewModel(blogEntry);
        }

        public string GetLink(int id, string title)
        {
            return string.Format("/{0}/{1}", id, HttpUtility.UrlEncode(title.Replace(":", string.Empty)));
        }
    }
}
