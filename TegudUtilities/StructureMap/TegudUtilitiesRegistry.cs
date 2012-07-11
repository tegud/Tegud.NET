using StackExchange.Profiling;
using StructureMap.Configuration.DSL;
using TegudUtilities.Performance;

namespace TegudUtilities.StructureMap
{
    public class TegudUtilitiesRegistry : Registry
    {
        public TegudUtilitiesRegistry()
        {
            Scan(x =>
            {
                x.TheCallingAssembly();
                x.WithDefaultConventions();
            });
        }
    }
}
