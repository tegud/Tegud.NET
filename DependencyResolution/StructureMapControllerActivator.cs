using System;
using System.Web.Http.Controllers;
using System.Web.Http.Dispatcher;
using System.Web.Mvc;
using System.Web.Routing;
using StructureMap;

namespace TegudMVC3.DependencyResolution
{
    public class StructureMapControllerActivator : IControllerActivator
    {
        private readonly IContainer _container;

        public StructureMapControllerActivator(IContainer container)
        {
            _container = container;
        }

        public IController Create(RequestContext requestContext, Type controllerType)
        {
            return _container.GetInstance(controllerType) as IController;
        }
    }

    public class StructureMapApiControllerActivator : IHttpControllerActivator
    {
        private readonly IContainer _container;

        public StructureMapApiControllerActivator(IContainer container)
        {
            _container = container;
        }

        public IHttpController Create(HttpControllerContext controllerContext, Type controllerType)
        {
            return _container.GetInstance(controllerType) as IHttpController;
        }
    }
}