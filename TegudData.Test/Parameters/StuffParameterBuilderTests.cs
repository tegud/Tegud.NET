using System;
using System.Linq;
using NUnit.Framework;
using TegudData.Interfaces.Stuff;
using TegudData.Models.Stuff;
using TegudData.Parameters;
using TegudUtilities.Performance;

namespace TegudData.Test.Parameters
{
    [TestFixture]
    public class StuffParameterBuilderTests
    {
        [Test]
        public void WhenCategoryIsNullCategoryIsEmptyList()
        {
            var subject = new StuffParameterFactory(new IStuffView[0], new FakeProfileWrapper());
            var buildParameters = subject.BuildParameters(null, "", "");

            Assert.That(buildParameters.Categories.Any(), Is.False, "Items returned");
        }

        [Test]
        public void WhenCategoryIsProvidedCategoryIsReturned()
        {
            var stuffParameterBuilder = new StuffParameterFactory(new IStuffView[0], new FakeProfileWrapper());
            var buildParameters = stuffParameterBuilder.BuildParameters("DVDFilm", "", "");

            Assert.That(buildParameters.Categories.First(), Is.EqualTo("DVDFilm"));
        }

        [Test]
        public void WhenCommaSeperatedCategoriesAreProvidedCategoriesAreReturned()
        {
            var stuffParameterBuilder = new StuffParameterFactory(new IStuffView[0], new FakeProfileWrapper());
            var buildParameters = stuffParameterBuilder.BuildParameters("DVDFilm,BluRay", "", "");

            Assert.That(buildParameters.Categories.ElementAt(1), Is.EqualTo("BluRay"));
        }

        [Test]
        public void WhenValidViewIsProvidedViewIsReturned()
        {
            var stuffParameterBuilder = new StuffParameterFactory(new IStuffView[] { new AtHomeItemsView() }, new FakeProfileWrapper());
            var buildParameters = stuffParameterBuilder.BuildParameters("AtHome", "", "");

            Assert.That(buildParameters.ViewId, Is.EqualTo("AtHome"));
        }

        [Test]
        public void WhenValidViewIsProvidedWithDifferentVaseViewIsReturned()
        {
            var stuffParameterBuilder = new StuffParameterFactory(new IStuffView[] { new AtHomeItemsView() }, new FakeProfileWrapper());
            var buildParameters = stuffParameterBuilder.BuildParameters("atHome", "", "");

            Assert.That(buildParameters.ViewId, Is.EqualTo("AtHome"));
        }

        [Test]
        public void WhenValidViewAndCategoryIsProvidedCategoryIsReturned()
        {
            var stuffParameterBuilder = new StuffParameterFactory(new IStuffView[] { new AtHomeItemsView() }, new FakeProfileWrapper());
            var buildParameters = stuffParameterBuilder.BuildParameters("AtHome", "DVDFilm", "");

            Assert.That(buildParameters.Categories.First(), Is.EqualTo("DVDFilm"));
        }

        [Test]
        public void WhenNoViewAndCategoriesAreProvidedCategoryIsReturned()
        {
            var stuffParameterBuilder = new StuffParameterFactory(new IStuffView[] { new AtHomeItemsView() }, new FakeProfileWrapper());
            var buildParameters = stuffParameterBuilder.BuildParameters("", "DVDFilm", "");

            Assert.That(buildParameters.Categories.Any(), Is.True);
        }

        [Test]
        public void WhenNameIsProvided()
        {
            var stuffParameterBuilder = new StuffParameterFactory(new IStuffView[0], new FakeProfileWrapper());
            var buildParameters = stuffParameterBuilder.BuildParameters("", "", "The Dark");

            Assert.That(buildParameters.Name, Is.EqualTo("The Dark"));
        }
    }

    public class FakeProfileWrapper : IProfilerWrapper
    {
        public IDisposable Step(string name)
        {
            return null;
        }
    }
}
