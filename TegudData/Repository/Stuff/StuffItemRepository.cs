using System.Collections.Generic;
using System.Data;
using System.Linq;
using Dapper;
using TegudData.Interfaces.Stuff;
using TegudData.Models.Stuff;
using TegudUtilities.Performance;

namespace TegudData.Repository.Stuff
{
    public class StuffItemRepository : IStuffItemRepository
    {
        private const string STUFF_ITEM_CATEGORY_SQL = @"SELECT * FROM stuff (nolock) S INNER JOIN StuffCategory (nolock) C ON S.CategoryID = C.ID";
        private const string INSERT_NEW_STUFF_ITEM_AND_RETURN_SQL = @"INSERT INTO STUFF (Name, CategoryID) SELECT @Name, @CategoryID;";

        private readonly IDbConnection _connection;
        private readonly IProfilerWrapper _profilerWrapper;

        public StuffItemRepository(ITegudSqlConnectionFactory connectionFactory, IProfilerWrapper profilerWrapper)
        {
            _profilerWrapper = profilerWrapper;
            _connection = connectionFactory.GetConnection();
        }

        public IEnumerable<StuffItem> GetAll()
        {
            using (_profilerWrapper.Step("Get all stuff items from database"))
            {
                return _connection
                    .Query<StuffItem, StuffCategory, StuffItem>(STUFF_ITEM_CATEGORY_SQL,
                    (item, category) =>
                        {
                            item.StuffCategory = category;
                            return item;
                        });
            }
        }

        public void Add(StuffItem stuff)
        {
            using (_profilerWrapper.Step("Add stuff item to database"))
            {
                _connection.Execute(INSERT_NEW_STUFF_ITEM_AND_RETURN_SQL,
                                                                       new
                                                                           {
                                                                               stuff.Name,
                                                                               CategoryID = stuff.StuffCategory.Id
                                                                           });
            }
        }
    }
}