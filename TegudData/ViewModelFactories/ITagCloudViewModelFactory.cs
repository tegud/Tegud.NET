using System.Collections.Generic;
using TegudData.Models.Blog;
using TegudData.ViewModels.Blog;

namespace TegudData.ViewModelFactories
{
    public interface ITagCloudViewModelFactory
    {
        IEnumerable<TagCloudViewModel> Build(TagCloud tagCloud);
    }
}