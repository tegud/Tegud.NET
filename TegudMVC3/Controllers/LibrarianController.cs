using System.Collections.Generic;
using System.Web.Http;
using TegudData.Interfaces.Parameters;
using TegudData.Interfaces.Stuff;
using TegudData.Models.Stuff;
using TegudData.Parameters;
using TegudData.Repository.Stuff;
using TegudData.ViewModelFactories;
using TegudData.ViewModels.Stuff;
using TegudMVC3.ExtendedControllers;
using TegudUtilities.Performance;

namespace TegudMVC3.Controllers
{
    public class LibrarianController : ApiController
    {
        private readonly IStuffParameterFactory _stuffParameterFactory;
        private readonly IStuffViewModelListFactory _stuffViewModelListFactory;
        private readonly IProfilerWrapper _profilerWrapper;
        private readonly IStuffItemRepository _stuffItemRepository;

        public LibrarianController(IStuffParameterFactory stuffParameterFactory,
            IStuffViewModelListFactory stuffViewModelListFactory,
            IProfilerWrapper profilerWrapper, 
            IStuffItemRepository stuffItemRepository)
        {
            _stuffParameterFactory = stuffParameterFactory;
            _stuffViewModelListFactory = stuffViewModelListFactory;
            _profilerWrapper = profilerWrapper;
            _stuffItemRepository = stuffItemRepository;
        }

        public IEnumerable<StuffItemViewModel> Get(string categoryOrView, string categories, string name)
        {
            using (_profilerWrapper.Step("Stuff Index Action"))
            {
                var stuffParameters = _stuffParameterFactory.BuildParameters(categoryOrView, categories, name);

                return _stuffViewModelListFactory.Build(stuffParameters);
            }
        }

        public void Post(NewStuffItem item)
        {
            using(_profilerWrapper.Step("Add new stuff item"))
            {
                var stuff = new StuffItem { Name = item.Name, StuffCategory = new StuffCategory{ Id = item.Category }};

                _stuffItemRepository.Add(stuff);
            }
        }
        
        public class NewStuffItem
        {
            public string Name { get; set; }

            public int Category { get; set; }
        }
    }
}
