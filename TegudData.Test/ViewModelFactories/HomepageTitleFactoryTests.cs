using NUnit.Framework;
using TegudData.Parameters;
using TegudData.ViewModelFactories;

namespace TegudData.Test.ViewModelFactories
{
    [TestFixture]
    public class HomepageTitleFactoryTests
    {
        [Test]
        public void BuildTitleIsEmptyWhenMonthAndYearAreZero()
        {
            var title = new HomepageTitleFactory().BuildTitle(new HomepageParameters
                                                                  {
                                                                      Year = 0,
                                                                      Month = 0
                                                                  });

            Assert.That(title, Is.EqualTo(string.Empty));
        }

        [Test]
        public void BuildTitleIsYearWhenYearIsAboveZero()
        {
            var title = new HomepageTitleFactory().BuildTitle(new HomepageParameters
            {
                Year = 1,
                Month = 0
            });

            Assert.That(title, Is.EqualTo("1"));
        }

        [Test]
        public void BuildTitleIsMonthAndYearWhenBothAboveZero()
        {
            var title = new HomepageTitleFactory().BuildTitle(new HomepageParameters
            {
                Year = 1,
                Month = 1
            });

            Assert.That(title, Is.EqualTo("January 1"));
        }

        [Test]
        public void BuildTitleIsMonthAndYearAndCategoryWhenBothAboveZeroAndCategoryIsACategory()
        {
            var title = new HomepageTitleFactory().BuildTitle(new HomepageParameters
            {
                Year = 1,
                Month = 1,
                Category = "ACategory"
            });

            Assert.That(title, Is.EqualTo("January 1 - ACategory"));
        }

        [Test]
        public void BuildTitleIsMonthAndYearAndTagWhenBothAboveZeroAndTagIsATag()
        {
            var title = new HomepageTitleFactory().BuildTitle(new HomepageParameters
            {
                Year = 1,
                Month = 1,
                Tag = "ATag"
            });

            Assert.That(title, Is.EqualTo("January 1 - tagged ATag"));
        }

        [Test]
        public void BuildTitleIsMonthAndYearAndTagAndCategoryWhenBothAboveZeroAndCategoryIsACategoryAndTagIsATag()
        {
            var title = new HomepageTitleFactory().BuildTitle(new HomepageParameters
            {
                Year = 1,
                Month = 1,
                Category = "ACategory",
                Tag = "ATag"
            });

            Assert.That(title, Is.EqualTo("January 1 - ACategory, tagged ATag"));
        }
    }
}
