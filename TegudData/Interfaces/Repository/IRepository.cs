using System.Collections.Generic;
using System.Data.Objects;
using System.Linq;

namespace TegudData.Interfaces.Repository
{
    public interface IRepository<in TKey, T> where T : class
    {
        IEnumerable<T> GetAll();

        IQueryable<T> Fetch();

        void Add(T newItem);

        void Attach(T item);

        void Delete(TKey key);

        void Delete(T item);

        void GetById(TKey key);

        void SaveChanges();

        void SaveChanges(SaveOptions options);
    }
}
