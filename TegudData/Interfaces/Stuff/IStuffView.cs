using System.Collections.Generic;
using TegudData.Models.Stuff;
using TegudData.Repository.Stuff;

namespace TegudData.Interfaces.Stuff
{
    public interface IStuffView
    {
        string ID { get; }

        string Name { get; }

        IEnumerable<StuffItem> Filter(IEnumerable<StuffItem> stuff);
    }
}