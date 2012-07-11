using StructureMap.AutoMocking;

namespace TegudData.Test
{
    public class TestFor<T> : RhinoAutoMocker<T> where T : class
    {
        public TestFor() : base(MockMode.AAA) { }
    }
}
