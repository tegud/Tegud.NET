using System.Data;
using System.Data.Common;
using System.Data.EntityClient;
using System.Data.Objects;
using System.Data.SqlClient;
using StackExchange.Profiling;
using StackExchange.Profiling.Data;
using TegudData.Interfaces.Repository;

namespace TegudData.Repository
{
    public interface ITegudSqlConnectionFactory
    {
        IDbConnection GetConnection();
    }


    public class TegudSqlConnectionFactory : ITegudSqlConnectionFactory
    {
        private readonly string _connectionString;

        public TegudSqlConnectionFactory(string connectionString)
        {
            _connectionString = connectionString;
        }

        public IDbConnection GetConnection()
        {
            var connection = new SqlConnection(_connectionString);
            var profiledConnection = new ProfiledDbConnection(connection, MiniProfiler.Current);

            profiledConnection.Open();

            return profiledConnection;
        }
    }

    public class TegudEntityFrameworkContextFactory : IContextFactory<SQL2008_615903_tegudEntities9>
    {
        private readonly SQL2008_615903_tegudEntities9 _context;

        public TegudEntityFrameworkContextFactory(string connectionString)
        {
            var conn = new EFProfiledDbConnection(GetConnection(connectionString), MiniProfiler.Current);
            _context = conn.CreateObjectContext<SQL2008_615903_tegudEntities9>();
        }

        private static SqlConnection GetConnection(string connectionString)
        {
            var entityConnStr = new EntityConnectionStringBuilder(connectionString);
            return new SqlConnection(entityConnStr.ProviderConnectionString);
        }

        public SQL2008_615903_tegudEntities9 Context
        {
            get { return _context; }
        }
    }
}