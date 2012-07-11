using System;
using System.Collections.Generic;
using System.Linq;
using TegudData.Interfaces.Parameters;
using TegudData.Interfaces.Stuff;
using TegudUtilities.Performance;

namespace TegudData.Parameters
{
    public class StuffParameterFactory : IStuffParameterFactory
    {
        private readonly IProfilerWrapper _profilerWrapper;
        private readonly IEnumerable<string> _stuffViewIds;

        public StuffParameterFactory(IStuffView[] stuffViews, IProfilerWrapper profilerWrapper)
        {
            _profilerWrapper = profilerWrapper;
            _stuffViewIds = stuffViews.Select(s => s.ID);
        }

        public StuffParameters BuildParameters(string categoryOrView, string categories, string name)
        {
            using (_profilerWrapper.Step("Build Stuff Parameters"))
            {
                var matchingView =
                    _stuffViewIds.FirstOrDefault(
                        s => s.Equals(categoryOrView, StringComparison.CurrentCultureIgnoreCase));

                if (matchingView != null)
                {
                    return new StuffParameters
                               {
                                   Name = name,
                                   ViewId = matchingView,
                                   Categories = GetCategoryList(categories, string.Empty)
                               };
                }

                return new StuffParameters
                           {
                               Name = name,
                               Categories = GetCategoryList(categoryOrView, categories)
                           };
            }
        }

        private IEnumerable<string> GetCategoryList(string categoryString, string categories)
        {
            if(categoryString == null && categories == null)
            {
                return new List<string>(0);
            }

            if(!string.IsNullOrWhiteSpace(categoryString))
            {
                return categoryString.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries);
            }

            return categories.Split(new[] {","}, StringSplitOptions.RemoveEmptyEntries);
        }
    }
}