using System.Collections.Generic;
using System.Configuration;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using Newtonsoft.Json;
using StackExchange.Profiling;
using TegudMVC3.DependencyResolution;
using TegudMVC3.Filters;

//using TegudMVC3.MediaTypeFormatters;

namespace TegudMVC3
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        public static string ConnectionString;
        public static string SqlConnectionString;

        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                "OAuthRedirect", // Route name
                "oauth2callback", // URL with parameters
                new { controller = "Security", action = "OAuth" } // Parameter defaults
            );

            routes.MapHttpRoute("API Default", "api/{controller}/");

            routes.MapRoute("StuffView",
                "Stuff/{view}/{category}",
                new { controller = "Stuff", action = "Index" });

            routes.MapRoute(
                "StuffCategory", // Route name
                "Stuff/{categoryOrView}", // URL with parameters
                new { controller = "Stuff", action = "Index" }
            );

            routes.MapRoute(
                "BlogArchive", // Route name
                "Archive/{year}/{month}", // URL with parameters
                new { controller = "Home", action = "Index", month = 0 }, // Parameter defaults
                new { year = @"(\d){4}", month = @"(\d){1,2}" }
            );

            routes.MapRoute(
                "BlogTag", // Route name
                "Tags/{Tag}", // URL with parameters
                new { controller = "Home", action = "Index" } // Parameter defaults
            );

            routes.MapRoute(
                "BlogCategory", // Route name
                "Categories/{Category}", // URL with parameters
                new { controller = "Home", action = "Index" } // Parameter defaults
            );

            routes.MapRoute(
                "BlogItem", // Route name
                "{id}/{Title}", // URL with parameters
                new { controller = "Home", action = "ViewBlog" }, // Parameter defaults
                new { id = @"(\d)+" }
            );

            routes.MapRoute(
                "Default", // Route name
                "{controller}/{action}/{id}", // URL with parameters
                new { controller = "Home", action = "Index", id = UrlParameter.Optional } // Parameter defaults
            );

        }

        protected void Application_BeginRequest()
        {
            MiniProfiler.Start();
        }

        protected void Application_EndRequest()
        {
            MiniProfiler.Stop();
        }

        protected void Application_Start()
        {
            ConnectionString = ConfigurationManager.ConnectionStrings["Tegud"].ConnectionString;
            SqlConnectionString = ConfigurationManager.ConnectionStrings["SqlTegud"].ConnectionString;

            var container = IoC.Initialize();
            container.Configure(x => x.AddRegistry(new TegudRegistry()));

            DependencyResolver.SetResolver(new SmDependencyResolver(container));

            AreaRegistration.RegisterAllAreas();

            // The Web API Configuration Object
            var config = GlobalConfiguration.Configuration;

            config.Formatters.Remove(config.Formatters.XmlFormatter);
            config.Formatters.Remove(config.Formatters.JsonFormatter);
            //config.Formatters.Add(new JsonNetFormatter(new JsonSerializerSettings()));
           // config.ServiceResolver.SetResolver(new SmApiDependencyResolver(container));

            MiniProfiler.Settings.Results_List_Authorize = request => request.IsAuthenticated;
            //MiniProfiler.Settings.UseExistingjQuery = false;

            SetGlobalFilters();
            RegisterRoutes(RouteTable.Routes); 
        }

        private void SetGlobalFilters()
        {
            // Register global filter
            GlobalFilters.Filters.Add(new AjaxException());

            RegisterGlobalFilters(GlobalFilters.Filters);
        }
    }
}