using System.Text.RegularExpressions;
using TegudData.Models.Stuff;
using TegudData.Repository.Stuff;

namespace TegudData.ViewModels.Stuff
{
    public class StuffCategoryViewModel
    {
        public readonly int ID;
        public readonly string Name;
        public readonly string UniqueSafeName;

        private readonly Regex _uniqueNameReplacements = new Regex(@"( |\(|\))", RegexOptions.Compiled);

        public StuffCategoryViewModel(StuffCategory stuffCategory)
        {
            ID = stuffCategory.Id;
            Name = stuffCategory.Name;
            UniqueSafeName = GetUniqueSafeName(stuffCategory.Name);
        }

        public string GetUniqueSafeName(string name)
        {
            return _uniqueNameReplacements.Replace(name, string.Empty);
        }
    }
}