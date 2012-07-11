//using System.Web.Mvc;
//using NUnit.Framework;
//using Rhino.Mocks;
//using StructureMap.AutoMocking;
//using TegudData.Interfaces.Stuff;
//using TegudData.Interfaces.ViewModelBuilders;
//using TegudData.ViewModels.Stuff;
//using TegudMVC3.Controllers;

//namespace TegudData.Test.Controllers
//{
//    [TestFixture]
//    public class StuffControllerIndexTests : BaseControllerTests<StuffController>
//    {
//        private ActionResult _result;

//        [SetUp]
//        public void Setup()
//        {
//            Get<IStuffCategoryIndexViewModelFactory>()
//                .Stub(x => x.BuildViewModel())
//                .Return(new StuffCategoryIndexViewModel(null));

//            _result = ClassUnderTest.Index();
//        }

//        [Test]
//        public void result_is_of_type_view_result()
//        {
//            Assert.That(_result, Is.TypeOf(typeof(ViewResult)));
//        }

//        [Test]
//        public void result_contains_view_model()
//        {
//            Assert.That(ClassUnderTest.ViewData.Model, Is.Not.Null);
//        }
//    }
//}