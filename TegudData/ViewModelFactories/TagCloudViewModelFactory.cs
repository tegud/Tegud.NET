using System.Collections.Generic;
using System.Linq;
using TegudData.Models.Blog;
using TegudData.ViewModels.Blog;

namespace TegudData.ViewModelFactories
{
    public class TagCloudViewModelFactory : ITagCloudViewModelFactory
    {
        public IEnumerable<TagCloudViewModel> Build(TagCloud tagCloud)
        {
            return
                tagCloud.Items.Select(
                    i => new TagCloudViewModel(i.Name, 1 + (((decimal) i.Items/tagCloud.TotalItems)*4)));
        }
    }
}