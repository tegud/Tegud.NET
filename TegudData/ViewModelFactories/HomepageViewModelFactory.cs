using System;
using System.Text;
using TegudData.Interfaces.Repository;
using TegudData.Interfaces.ViewModelFactories;
using TegudData.Parameters;
using TegudData.Repository.Blog;
using TegudData.ViewModels.Homepage;
using TegudUtilities;
using TegudUtilities.Performance;

namespace TegudData.ViewModelFactories
{
    public class HomepageViewModelFactory : IHomepageViewModelFactory
    {
        private readonly IProfilerWrapper _profilerWrapper;
        private readonly IBlogEntryRepository _blogEntryRepository;
        private readonly ITagCloudViewModelFactory _tagCloudViewModelFactory;
        private readonly IHomepageTitleFactory _homepageTitleFactory;

        public HomepageViewModelFactory(IProfilerWrapper profilerWrapper,
            IBlogEntryRepository blogEntryRepository,
            ITagCloudViewModelFactory tagCloudViewModelFactory,
            IHomepageTitleFactory homepageTitleFactory)
        {
            _profilerWrapper = profilerWrapper;
            _blogEntryRepository = blogEntryRepository;
            _tagCloudViewModelFactory = tagCloudViewModelFactory;
            _homepageTitleFactory = homepageTitleFactory;
        }

        public HomepageViewModel Build(HomepageParameters homepageParameters)
        {
            using (_profilerWrapper.Step("Build home page view model"))
            {
                var siteID = 1;
                var limit = DateTime.Now.Date.Add(new TimeSpan(-(365 * 5), 0, 0, 0));

                var title = _homepageTitleFactory.BuildTitle(homepageParameters);

                var tagCloud = _blogEntryRepository.GetTagCloud();

                return new HomepageViewModel(_blogEntryRepository.GetBlogEntries(new BlogQuery(homepageParameters)),
                                             title,
                                             _blogEntryRepository.GetArchive(),
                                             _tagCloudViewModelFactory.Build(tagCloud));

            }
        }
    }
}
