using TegudData.Parameters;

namespace TegudData.ViewModelFactories
{
    public interface IHomepageTitleFactory
    {
        string BuildTitle(HomepageParameters homepageParameters);
    }
}