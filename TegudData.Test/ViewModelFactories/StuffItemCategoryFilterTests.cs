using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using NUnit.Framework;
using TegudData.Models.Stuff;
using TegudData.Repository.Stuff;

namespace TegudData.Test.ViewModelFactories
{
    [TestFixture]
    public class StuffItemCategoryFilterTests
    {
        [Test]
        public void VariantOutputIsIdentical()
        {
            IEnumerable<string> categoryFilters = new List<string>
                                                         {
                                                             "Blu Ray", 
                                                             "DVD"
                                                         };


            var items = new List<StuffItem>
                            {
                                new StuffItem { 
                                    Id = 1,
                                    StuffCategory = new StuffCategory { Name = "Blu Ray" }
                                },
                                new StuffItem { 
                                    Id = 2,
                                    StuffCategory = new StuffCategory { Name = "DVD" }
                                },
                                new StuffItem { 
                                    Id = 3,
                                    StuffCategory = new StuffCategory { Name = "DVD" }
                                },
                                new StuffItem { 
                                    Id = 4,
                                    StuffCategory = new StuffCategory { Name = "Blu Ray" }
                                },
                                new StuffItem { 
                                    Id = 5,
                                    StuffCategory = new StuffCategory { Name = "Blu Ray" }
                                }
                            };

            Assert.That(new StuffItemCategoryFilterVariantA().Filter(categoryFilters, items),
                Is.EqualTo(new StuffItemCategoryFilterVariantB().Filter(categoryFilters, items)));


            Assert.That(new StuffItemCategoryFilterVariantC().Filter(categoryFilters, items),
                Is.EqualTo(new StuffItemCategoryFilterVariantB().Filter(categoryFilters, items)));
        }


        [TestCase(100, 100000)]
        [TestCase(1000, 1000000)]
        [TestCase(10000, 1000000)]
        [TestCase(100000, 1000000)]
        [TestCase(1000000, 10000000)]
        [TestCase(1000000, 1000000)]
        [TestCase(1000000, 10000000)]
        public void VariantBIsFastest(int itemCount, int iterations)
        {
            IEnumerable<string> categoryFilters = new List<string>
                                                         {
                                                             "Blu Ray", 
                                                             "DVD"
                                                         };


            var items = GetStuffItems(itemCount, new List<StuffCategory>
                                            {
                                                new StuffCategory { Name = "DVD" },
                                                new StuffCategory { Name = "Blu Ray" }
                                            });

            var timeToExecuteA = TestFilterVariant(categoryFilters, items, iterations, new StuffItemCategoryFilterVariantA());
            var timeToExecuteB = TestFilterVariant(categoryFilters, items, iterations, new StuffItemCategoryFilterVariantB());
            var timeToExecuteC = TestFilterVariant(categoryFilters, items, iterations, new StuffItemCategoryFilterVariantC());

            Debug.WriteLine("Variant A (Contains) time: {0}ms", timeToExecuteA);
            Debug.WriteLine("Variant B (Join) time: {0}ms", timeToExecuteB);
            Debug.WriteLine("Variant C (Any) time: {0}ms", timeToExecuteC);

            Assert.That(timeToExecuteA, Is.GreaterThanOrEqualTo(timeToExecuteB));
            Assert.That(timeToExecuteC, Is.GreaterThanOrEqualTo(timeToExecuteB));
        }

        private static List<StuffItem> GetStuffItems(int numberOfItems, IEnumerable<StuffCategory> categories)
        {
            var items = new List<StuffItem>();

            var categoryCount = categories.Count();
            for (var x = 0; x < numberOfItems; x++)
            {
                items.Add(new StuffItem { StuffCategory = categories.ElementAt(x % categoryCount) });
            }
            return items;
        }

        private static long TestFilterVariant(IEnumerable<string> categoryFilters, 
            List<StuffItem> items, 
            int iterations,
            IStuffItemCategoryFilter filter)
        {
            var stopwatch = new Stopwatch();
            stopwatch.Start();

            for (var x = 0; x < iterations; x++)
            {
                filter.Filter(categoryFilters, items);
            }

            stopwatch.Stop();
            return stopwatch.ElapsedMilliseconds;
        }
    }

    public interface IStuffItemCategoryFilter
    {
        IEnumerable<StuffItem> Filter(IEnumerable<string> categories, IEnumerable<StuffItem> allItems);
    }

    public class StuffItemCategoryFilterVariantA : IStuffItemCategoryFilter
    {
        public IEnumerable<StuffItem> Filter(IEnumerable<string> categories, IEnumerable<StuffItem> allItems)
        {
            return allItems.Where(s => categories.Contains(s.StuffCategory.Name));
        }
    }

    public class StuffItemCategoryFilterVariantB : IStuffItemCategoryFilter
    {
        public IEnumerable<StuffItem> Filter(IEnumerable<string> categories, IEnumerable<StuffItem> allItems)
        {
            return allItems.Join(categories, s => s.StuffCategory.Name, sp => sp, (s, sp) => s);
        }
    }

    public class StuffItemCategoryFilterVariantC : IStuffItemCategoryFilter
    {
        public IEnumerable<StuffItem> Filter(IEnumerable<string> categories, IEnumerable<StuffItem> allItems)
        {
            return allItems.Where(s => categories.Any(c => s.StuffCategory.Name.Equals(c)));
        }
    }
}