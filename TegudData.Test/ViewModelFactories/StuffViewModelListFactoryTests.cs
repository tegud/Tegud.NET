using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NUnit.Framework;
using Rhino.Mocks;
using TegudData.Interfaces.Stuff;
using TegudData.Models.Stuff;
using TegudData.Parameters;
using TegudData.Repository.Stuff;
using TegudData.Test.Parameters;
using TegudData.ViewModelFactories;
using TegudData.ViewModels.Stuff;

namespace TegudData.Test.ViewModelFactories
{
    [TestFixture]
    public class StuffViewModelListFactoryTests
    {
        private static IStuffItemRepository _stuffItemRepository;

        [SetUp]
        public void Setup()
        {
            _stuffItemRepository = MockRepository.GenerateStub<IStuffItemRepository>();
        }

        [Test]
        public void EntireListIsReturnedWithNoFilters()
        {
            _stuffItemRepository.Stub(x => x.GetAll()).Return(new [] { new StuffItem { StuffCategory = new StuffCategory{ Name = string.Empty }} });

            Assert.That(new StuffViewModelListFactory(_stuffItemRepository, new FakeProfileWrapper(), new IStuffView[0]).Build(new StuffParameters()).Any(), "No stuff view models returned");
        }

        [Test]
        public void EntriesWithMatchingNamesAreReturned()
        {
            _stuffItemRepository.Stub(x => x.GetAll()).Return(new[] { new StuffItem { Name = "Stuff Item", StuffCategory = new StuffCategory { Name = string.Empty } } });

            Assert.That(new StuffViewModelListFactory(_stuffItemRepository, new FakeProfileWrapper(), new IStuffView[0]).Build(new StuffParameters { Name = "Stuff Item" }).Any(), "No stuff view models returned");
        }

        [Test]
        public void EntriesWithMathingNameWithDifferentCaseAreReturned()
        {
            _stuffItemRepository.Stub(x => x.GetAll()).Return(new[] { new StuffItem { Name = "Stuff Item", StuffCategory = new StuffCategory { Name = string.Empty } } });

            Assert.That(new StuffViewModelListFactory(_stuffItemRepository, new FakeProfileWrapper(), new IStuffView[0]).Build(new StuffParameters { Name = "stuff item" }).Any(), "No stuff view models returned");
        }

        [Test]
        public void EntriesWithPartiallyMatchingNamesAreReturned()
        {
            _stuffItemRepository.Stub(x => x.GetAll()).Return(new[] { new StuffItem { Name = "Stuff Item", StuffCategory = new StuffCategory { Name = string.Empty } } });

            Assert.That(new StuffViewModelListFactory(_stuffItemRepository, new FakeProfileWrapper(), new IStuffView[0]).Build(new StuffParameters { Name = "uff" }).Any(), "No stuff view models returned");
        }

        [Test]
        public void EntriesWithNonMatchingNamesAreReturned()
        {
            _stuffItemRepository.Stub(x => x.GetAll()).Return(new[] { new StuffItem { Name = "Stuff Item" } });

            Assert.That(new StuffViewModelListFactory(_stuffItemRepository, new FakeProfileWrapper(), new IStuffView[0]).Build(new StuffParameters { Name = "Something Else" }).Any(), Is.False, "Stuff view models returned");
        }

        [Test]
        public void EntriesWithMatchingCategoryAreReturned()
        {
            _stuffItemRepository.Stub(x => x.GetAll()).Return(new[] { new StuffItem { StuffCategory = new StuffCategory{ Name = "DVD" } } });

            Assert.That(new StuffViewModelListFactory(_stuffItemRepository, new FakeProfileWrapper(), new IStuffView[0]).Build(new StuffParameters { Categories = new List<string> { "DVD" } }).Any(), "No stuff view models returned");
        }

        [Test]
        public void EntriesWithNoMatchingCategoryAreNotReturned()
        {
            _stuffItemRepository.Stub(x => x.GetAll()).Return(new[] { new StuffItem { StuffCategory = new StuffCategory { Name = "Blu Ray" } } });

            Assert.That(new StuffViewModelListFactory(_stuffItemRepository, new FakeProfileWrapper(), new IStuffView[0]).Build(new StuffParameters { Categories = new List<string> { "DVD" } }).Any(), Is.False, "Stuff view models returned");
        }

        [Test]
        public void MultipleCategorySearchReturnsItemsWithAnySearchedCategory()
        {
            _stuffItemRepository.Stub(x => x.GetAll()).Return(new[]
                                                              {
                                                                  new StuffItem { StuffCategory = new StuffCategory { Name = "XBox 360 Game" } },
                                                                  new StuffItem { StuffCategory = new StuffCategory { Name = "Blu Ray" } },
                                                                  new StuffItem { StuffCategory = new StuffCategory { Name = "DVD" } }
                                                              });

            var stuffItems = new StuffViewModelListFactory(_stuffItemRepository, new FakeProfileWrapper(), new IStuffView[0]).Build(new StuffParameters
                                                                                               {
                                                                                                   Categories = new List<string>
                                                                                                                    {
                                                                                                                        "DVD", "Blu Ray"
                                                                                                                    }
                                                                                               });

            Assert.That(stuffItems.Any(s => s.StuffCategory.Name.Equals("Blu Ray")), "Blu Ray Item Returned");
        }
    }
}
