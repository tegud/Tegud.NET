using StructureMap.Configuration.DSL;
using TegudData.Interfaces.Stuff;
using TegudData.Models.Stuff;
using TegudData.SiteSession;

namespace TegudData.StructureMap
{
    public class TegudDataRegistry : Registry
    {
        public TegudDataRegistry()
        {
            Scan(x =>
                     {
                         x.TheCallingAssembly();
                         x.WithDefaultConventions();
                     });

            For<IStuffView>().Add<RecentItemsView>().Named("RecentItemsView");
            For<IStuffView>().Add<LentOutItemsView>().Named("LentOutItemsView");
            For<IStuffView>().Add<AtHomeItemsView>().Named("AtHomeItemsView");
        }
    }
}
