using System.Web.Mvc;
using TegudData.Interfaces.ViewModelFactories;
using TegudData.Parameters;
using TegudMVC3.ExtendedControllers;
using TegudUtilities.Performance;

namespace TegudMVC3.Controllers
{
    public class HomeController : TegudControllerBase
    {
        private readonly ISingleBlogItemViewModelFactory _singleBlogItemViewModelFactory;
        private readonly IHomepageViewModelFactory _homepageViewModel;
        private readonly IProfilerWrapper _profilerWrapper;

        public HomeController(ISingleBlogItemViewModelFactory singleBlogItemViewModelFactory,
            IHomepageViewModelFactory homepageViewModel,
            IProfilerWrapper profilerWrapper) : base(profilerWrapper)
        {
            _singleBlogItemViewModelFactory = singleBlogItemViewModelFactory;
            _homepageViewModel = homepageViewModel;
            _profilerWrapper = profilerWrapper;
        }

        public ActionResult Index(HomepageParameters homepageParameters)
        {
            using (_profilerWrapper.Step("View home page action"))
            {
                return View(_homepageViewModel.Build(homepageParameters));
            }
        }

        public ActionResult ViewBlog(int id)
        {
            using (_profilerWrapper.Step("ViewBlog Action"))
            {
                return View(_singleBlogItemViewModelFactory.GetViewModelByBlogID(id));
            }
        }
    }
}
