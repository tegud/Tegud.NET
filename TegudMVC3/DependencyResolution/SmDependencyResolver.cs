using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http.Dependencies;
using StructureMap;
using IDependencyResolver = System.Web.Mvc.IDependencyResolver;

namespace TegudMVC3
{
    public class StructureMapScope : IDependencyScope
    {
        protected IContainer Container;

        public StructureMapScope(IContainer container)
        {
            Container = container;
        }

        public void Dispose()
        {
            IDisposable disposable = (IDisposable)Container;
            if (disposable != null)
            {
                disposable.Dispose();
            }
            Container = null;
        }

        public object GetService(Type serviceType)
        {
            if (serviceType == null)
            {
                return null;
            }
            try
            {
                if (serviceType.IsAbstract || serviceType.IsInterface)
                    return Container.TryGetInstance(serviceType);

                return Container.GetInstance(serviceType);
            }
            catch
            {
                return null;
            }
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            return Container.GetAllInstances<object>().Where(s => s.GetType() == serviceType);
        }
    }

    public class SmApiDependencyResolver : StructureMapScope, IDependencyResolver
    {
        private IContainer _container;

        public SmApiDependencyResolver(IContainer container)
            : base(container)
        {
            _container = container;
        }

        public IDependencyScope BeginScope()
        {
            _container = (IContainer)IoC.Initialize();
            return new StructureMapScope(_container);
        }
    }

    public class SmDependencyResolver : IDependencyResolver {

        private readonly IContainer _container;

        public SmDependencyResolver(IContainer container) {
            _container = container;
        }

        public object GetService(Type serviceType) {
            if (serviceType == null) return null;
            try {
                  return serviceType.IsAbstract || serviceType.IsInterface
                           ? _container.TryGetInstance(serviceType)
                           : _container.GetInstance(serviceType);
            }
            catch {

                return null;
            }
        }

        public IEnumerable<object> GetServices(Type serviceType) {
            return _container.GetAllInstances(serviceType).Cast<object>();
        }
    }
}