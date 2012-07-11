using System.Collections.Generic;
using TegudData.Interfaces.Repository;
using TegudData.Models.Stuff;
using TegudData.Repository.Stuff;

namespace TegudData.Interfaces.Stuff
{
    public interface IStuffItemRepository
    {
        IEnumerable<StuffItem> GetAll();
        void Add(StuffItem stuff);
    }

    public interface IStuffCategoryRepository
    {
        IEnumerable<StuffCategory> GetAll();
    }
}