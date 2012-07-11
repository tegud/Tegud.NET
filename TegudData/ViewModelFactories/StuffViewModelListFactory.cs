using System.Collections.Generic;
using System.Linq;
using TegudData.Interfaces.Stuff;
using TegudData.Models.Stuff;
using TegudData.Parameters;
using TegudData.ViewModels.Stuff;
using TegudUtilities.Performance;

namespace TegudData.ViewModelFactories
{
    public class StuffViewModelListFactory : IStuffViewModelListFactory
    {
        private readonly IStuffItemRepository _stuffItemRepository;
        private readonly IProfilerWrapper _profilerWrapper;
        private readonly IStuffView[] _stuffViews;

        public StuffViewModelListFactory(IStuffItemRepository stuffItemRepository, 
            IProfilerWrapper profilerWrapper,
            IStuffView[] stuffViews)
        {
            _stuffItemRepository = stuffItemRepository;
            _profilerWrapper = profilerWrapper;
            _stuffViews = stuffViews;
        }

        public IEnumerable<StuffItemViewModel> Build(StuffParameters stuffParameters)
        {
            using (_profilerWrapper.Step("Build Stuff View Model List"))
            {
                var allItems = _stuffItemRepository.GetAll();

                using (_profilerWrapper.Step("Order stuff items by name"))
                {
                    allItems = allItems.OrderBy(si => si.Name);
                }

                using (_profilerWrapper.Step("Filter Stuff View Model List"))
                {
                    if (stuffParameters.Categories.Any())
                    {
                        allItems = FilterItemsByCategory(stuffParameters.Categories, allItems);
                    }

                    if(!string.IsNullOrWhiteSpace(stuffParameters.Name))
                    {
                        allItems = FilterItemsByName(stuffParameters.Name, allItems);
                    }

                    if(!string.IsNullOrWhiteSpace(stuffParameters.ViewId))
                    {
                        allItems = GetView(stuffParameters.ViewId).Filter(allItems);
                    }

                    return allItems.Select(item => new StuffItemViewModel(item));
                }
            }
        }

        private IStuffView GetView(string viewId)
        {
            return _stuffViews.First(v => v.ID == viewId);
        }

        private static IEnumerable<StuffItem> FilterItemsByName(string name, IEnumerable<StuffItem> allItems)
        {
            return allItems.Where(s => s.Name.ToLower().Contains(name.ToLower()));
        }

        private static IEnumerable<StuffItem> FilterItemsByCategory(IEnumerable<string> categories, IEnumerable<StuffItem> allItems)
        {
            return allItems.Where(s => categories.Contains(s.StuffCategory.Name));
        }
    }
}