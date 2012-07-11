using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using TegudData.Models.Stuff;
using TegudData.Repository.Stuff;

namespace TegudData.ViewModels.Stuff
{
    public class StuffCategoryIndexViewModel
    {
        private const char DefaultNameGroup = '#';
        private readonly IEnumerable<StuffCategory> _categories;
        private readonly Regex _alphaNumericCheck = new Regex("[a-z]", RegexOptions.Compiled | RegexOptions.IgnoreCase);

        public IEnumerable<StuffCategory> Categories
        {
            get
            {
                return _categories.OrderBy(c => c.Name);
            }
        }

        private char getStuffNameGroup(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return DefaultNameGroup;

            var firstChar = name.ToCharArray(0, 1)[0];

            return isAlphaNumeric(firstChar) ? firstChar : DefaultNameGroup;
        }

        private bool isAlphaNumeric(char firstChar)
        {
            return _alphaNumericCheck.IsMatch(firstChar.ToString());
        }


        public StuffCategoryIndexViewModel(IEnumerable<StuffCategory> categories)
        {
            _categories = categories;
        }
    }
}
