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
}