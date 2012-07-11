using TegudData.ViewModels.Blog;

namespace TegudData.Interfaces.ViewModelFactories
{
    public interface ISingleBlogItemViewModelFactory
    {
        SingleBlogItemViewModel GetViewModelByBlogID(int id);
    }
}
