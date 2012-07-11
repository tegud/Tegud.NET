using System.Linq;
using NUnit.Framework;
using Rhino.Mocks;
using TegudData.Interfaces.Stuff;
using TegudData.Models.Stuff;
using TegudData.Repository.Stuff;
using TegudData.ViewModelFactories;

namespace TegudData.Test.ViewModelFactories
{
    [TestFixture]
    public class StuffCategoryIndexViewModelFactoryTests
    {
        private StuffCategory _stuffCategory;
        private static IStuffCategoryRepository _stuffCategoryRepository;

        [SetUp]
        public void Setup()
        {
            _stuffCategory = new StuffCategory { Name = "DVD Film" };

            _stuffCategoryRepository = MockRepository.GenerateStub<IStuffCategoryRepository>();
            _stuffCategoryRepository.Stub(x => x.GetAll()).Return(new[] { _stuffCategory });
        }

        [Test]
        public void view_model_contains_categories()
        {
            var result = new StuffCategoryIndexViewModelFactory(_stuffCategoryRepository).BuildViewModel();

            Assert.That(result.Categories.Any(), Is.True);
        }

        [Test]
        public void view_model_contains_valid_category()
        {
            var result = new StuffCategoryIndexViewModelFactory(_stuffCategoryRepository).BuildViewModel().Categories.First();

            Assert.That(result.Name, Is.EqualTo(_stuffCategory.Name));
        }
    }
}
