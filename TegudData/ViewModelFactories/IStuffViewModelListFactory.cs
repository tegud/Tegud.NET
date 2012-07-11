using System.Collections.Generic;
using TegudData.Models.Stuff;
using TegudData.Parameters;
using TegudData.Repository.Stuff;
using TegudData.ViewModels.Stuff;

namespace TegudData.ViewModelFactories
{
    public interface IStuffViewModelListFactory
    {
        IEnumerable<StuffItemViewModel> Build(StuffParameters stuffParameters);
    }
}