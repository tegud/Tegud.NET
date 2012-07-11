using TegudData.Parameters;
using TegudData.ViewModels.Homepage;

namespace TegudData.Interfaces.ViewModelFactories
{
    public interface IHomepageViewModelFactory
    {
        HomepageViewModel Build(HomepageParameters parameters);
    }
}