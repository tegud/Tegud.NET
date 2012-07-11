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

            var eb = new EntityConnectionStringBuilder(MvcApplication.ConnectionString);
            var sql = MvcApplication.SqlConnectionString;

            For<IContextFactory<SQL2008_615903_tegudEntities9>>()
                .HybridHttpOrThreadLocalScoped()
                .Use<TegudEntityFrameworkContextFactory>()
                .Ctor<string>()
                .Is(eb.ConnectionString);

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

            //Scan(x =>
            //         {
            //             x.Assembly(TegudData);

            //         });

            //For<ISingleBlogItemViewModelFactory>().Use<singleBlogItemViewModelFactory>();

            //For<IHomep>()
        }
    }
}