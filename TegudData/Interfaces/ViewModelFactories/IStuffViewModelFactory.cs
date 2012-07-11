using TegudData.Parameters;
using TegudData.ViewModels.Stuff;

namespace TegudData.Interfaces.ViewModelFactories
{
    public interface IStuffViewModelFactory
    {
        StuffViewModel BuildViewModel(StuffParameters stuffParameters);
    }
}