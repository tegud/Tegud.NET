using TegudData.Interfaces.Stuff;
using TegudData.Interfaces.ViewModelFactories;
using TegudData.ViewModels.Stuff;

namespace TegudData.ViewModelFactories
{
    public class StuffCategoryIndexViewModelFactory : IStuffCategoryIndexViewModelFactory
    {
        private readonly IStuffCategoryRepository _categoryRepository;

        public StuffCategoryIndexViewModelFactory(IStuffCategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public StuffCategoryIndexViewModel BuildViewModel()
        {
            return new StuffCategoryIndexViewModel(_categoryRepository.GetAll());
        }
    }
}