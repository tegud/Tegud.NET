using System;
using System.Data;
using System.Data.EntityClient;
using System.Data.SqlClient;
using System.Web.Http.Dispatcher;
using System.Web.Mvc;
using StackExchange.Profiling;
using StructureMap.Configuration.DSL;
using TegudData;
using TegudData.Interfaces.Repository;
using TegudData.Repository;
using TegudData.SiteSession;
using TegudData.StructureMap;
using TegudUtilities.Performance;
using TegudUtilities.StructureMap;

namespace TegudMVC3.DependencyResolution
{
    public class TegudRegistry : Registry
    {
        public TegudRegistry()
        {
            For<IControllerActivator>().Use<StructureMapControllerActivator>();
            For<IHttpControllerActivator>().Use<StructureMapApiControllerActivator>();

            var sql = MvcApplication.SqlConnectionString;

            For<ITegudSqlConnectionFactory>()
                .Use<TegudSqlConnectionFactory>()
                .Ctor<string>()
                .Is(sql);

            Scan(x =>
            {
                x.TheCallingAssembly();
                x.WithDefaultConventions();
            });

            IncludeRegistry<TegudUtilitiesRegistry>();
            IncludeRegistry<TegudDataRegistry>();
        }
    }
}