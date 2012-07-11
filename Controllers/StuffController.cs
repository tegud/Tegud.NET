using System.Web.Mvc;
using StackExchange.Profiling;
using TegudData.Interfaces.Parameters;
using TegudData.Interfaces.Stuff;
using TegudData.Interfaces.ViewModelFactories;
using TegudData.Models.Stuff;
using TegudMVC3.ExtendedControllers;
using TegudMVC3.Results;
using TegudUtilities.Performance;

namespace TegudMVC3.Controllers
{
    public class StuffController : TegudControllerBase
    {
        private readonly IStuffViewModelFactory _stuffViewModelFactory;
        private readonly IStuffParameterFactory _stuffParameterFactory;
        private readonly IStuffItemRepository _stuffItemRepository;
        private readonly IProfilerWrapper _profilerWrapper;

        public StuffController(IStuffViewModelFactory stuffViewModelFactory,
                               IStuffParameterFactory stuffParameterFactory,
                               IStuffItemRepository stuffItemRepository,
                               IProfilerWrapper profilerWrapper): base(profilerWrapper)
        {
            _stuffViewModelFactory = stuffViewModelFactory;
            _stuffParameterFactory = stuffParameterFactory;
            _stuffItemRepository = stuffItemRepository;
            _profilerWrapper = profilerWrapper;
        }

        public ActionResult Index(string categoryOrView, string category, string name)
        {
            using (_profilerWrapper.Step("Stuff Index Action"))
            {
                var stuffParameters = _stuffParameterFactory.BuildParameters(categoryOrView, category, name);

                return View(_stuffViewModelFactory.BuildViewModel(stuffParameters));
            }
        }

        public void AddNew(string name, int category)
        {
            using (_profilerWrapper.Step("Stuff Add New Item Action"))
            {
                var stuff = new StuffItem { Name = name, StuffCategory = new StuffCategory { Id = category } };

                _stuffItemRepository.Add(stuff);
            }
        }
    }
}
