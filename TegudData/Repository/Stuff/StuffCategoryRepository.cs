using System.Collections.Generic;
using System.Data;
using Dapper;
using TegudData.Interfaces.Stuff;
using TegudData.Models.Stuff;
using TegudUtilities.Performance;

namespace TegudData.Repository.Stuff
{
    public class StuffCategoryRepository : IStuffCategoryRepository
    {
        private readonly IDbConnection _connection;
        private readonly IProfilerWrapper _profilerWrapper;

        public StuffCategoryRepository(ITegudSqlConnectionFactory connectionFactory, IProfilerWrapper profilerWrapper)
        {
            _profilerWrapper = profilerWrapper;
            _connection = connectionFactory.GetConnection();
        }

        public IEnumerable<StuffCategory> GetAll()
        {
            using (_profilerWrapper.Step("Get all stuff categories from database"))
            {
                return _connection.Query<StuffCategory>("select * from StuffCategory");
            }
        }
    }
}
