using System.Collections.Generic;
using System.Linq;
using TegudData.Interfaces.Repository;
using TegudData.Interfaces.Stuff;
using TegudData.Interfaces.ViewModelFactories;
using TegudData.Models.Stuff;
using TegudData.Parameters;
using TegudData.Repository.Stuff;
using TegudData.ViewModels.Stuff;
using TegudUtilities.Performance;

namespace TegudData.ViewModelFactories
{
    public class StuffViewModelFactory : IStuffViewModelFactory
    {
        private readonly SQL2008_615903_tegudEntities9 _contextFactory;
        private readonly IProfilerWrapper _profilerWrapper;
        private readonly IStuffCategoryRepository _stuffCategoryRepository;
        private readonly IStuffView[] _stuffViews;

        public StuffViewModelFactory(IStuffCategoryRepository stuffCategoryRepository,
            IStuffView[] stuffViews, 
            IProfilerWrapper profilerWrapper)
        {
            _stuffCategoryRepository = stuffCategoryRepository;
            _stuffViews = stuffViews;
            _profilerWrapper = profilerWrapper;
        }

        public StuffViewModel BuildViewModel(StuffParameters stuffParameters)
        {
            using (_profilerWrapper.Step("Build Stuff View Model"))
            {
                return new StuffViewModel(
                    GetStuffCategoryViewModels(),
                    GetStuffViewViewModels(stuffParameters.ViewId),
                    stuffParameters.Name);
            }
        }

        private IEnumerable<StuffCategoryViewModel> GetStuffCategoryViewModels()
        {
            return _stuffCategoryRepository.GetAll().Select(GetStuffCategoryViewModel);
        }

        private IEnumerable<StuffViewViewModel> GetStuffViewViewModels(string selectedViewId)
        {
            return _stuffViews.Select(item => new StuffViewViewModel(item.ID, 
                                                                     item.Name,
                                                                     item.ID.Equals(selectedViewId)));
        }

        private static StuffCategoryViewModel GetStuffCategoryViewModel(StuffCategory sc)
        {
            return new StuffCategoryViewModel(sc);
        }
    }
}