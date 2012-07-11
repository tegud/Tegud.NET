using NUnit.Framework;
using StructureMap.AutoMocking;
using TegudMVC3.ExtendedControllers;

namespace TegudData.Test.Controllers
{
    public class BaseControllerTests<T> : RhinoAutoMocker<T> where T : class
    {
        [Test]
        public void controller_inherits_from_base_controller()
        {
            Assert.That(ClassUnderTest, Is.AssignableTo(typeof(TegudControllerBase))); 
        }
    }
}
