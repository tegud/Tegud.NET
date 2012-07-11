using System.Collections.Generic;
using System.Linq;
using TegudData.Interfaces.Stuff;
using TegudData.Repository.Stuff;

namespace TegudData.Models.Stuff
{
    public class AtHomeItemsView : IStuffView
    {
        public string ID { get { return "AtHome"; } }

        public string Name { get { return "At Home Items"; } }

        public IEnumerable<StuffItem> Filter(IEnumerable<StuffItem> stuff)
        {
            return stuff.Where(item => string.IsNullOrWhiteSpace(item.LentTo));
        }
    }
}
