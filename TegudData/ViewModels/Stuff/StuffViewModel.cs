using System.Collections.Generic;
using System.Linq;
using TegudData.Interfaces.Stuff;

namespace TegudData.ViewModels.Stuff
{
    public class StuffViewModel
    {
        private readonly IEnumerable<StuffCategoryViewModel> _categories;

        public IEnumerable<StuffCategoryViewModel> Categories
        {
            get
            {
                return _categories.OrderBy(c => c.Name);
            }
        }

        public readonly IEnumerable<StuffViewViewModel> StuffViews;

        public readonly string Name;

        public StuffViewModel(IEnumerable<StuffCategoryViewModel> categories, IEnumerable<StuffViewViewModel> stuffViews, string name)
        {
            _categories = categories;
            StuffViews = stuffViews;
            Name = name;
        }
    }
}