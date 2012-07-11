using System.Web.Mvc;
using StructureMap;
using TegudMVC3.DependencyResolution;

[assembly: WebActivator.PreApplicationStartMethod(typeof(TegudMVC3.App_Start.StructuremapMvc), "Start")]

namespace TegudMVC3.App_Start {
    public static class StructuremapMvc {
        public static void Start()
        {
        }
    }
}