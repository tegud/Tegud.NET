using System;
using System.Collections.Generic;
using System.Linq;
using TegudData.Interfaces.Stuff;
using TegudData.Repository.Stuff;

namespace TegudData.Models.Stuff
{
    public class RecentItemsView : IStuffView
    {
        public string ID { get { return "Recent"; } }

        public string Name { get { return "Recent Items"; } }

        public IEnumerable<StuffItem> Filter(IEnumerable<StuffItem> stuff)
        {
            return stuff.Where(item => item.Added > DateTime.Now.Date.AddDays(-30));
        }
    }
}