using System.Text;
using TegudData.Parameters;
using TegudUtilities;

namespace TegudData.ViewModelFactories
{
    public class HomepageTitleFactory : IHomepageTitleFactory
    {
        public string BuildTitle(HomepageParameters homepageParameters)
        {
            var title = new StringBuilder();
            if (homepageParameters.Year > 0)
            {
                if (homepageParameters.Month > 0)
                {
                    title.Append(string.Concat(homepageParameters.Month.ToMonthName(), " "));
                }
                title.Append(homepageParameters.Year);

                if (!string.IsNullOrWhiteSpace(homepageParameters.Category) || !string.IsNullOrWhiteSpace(homepageParameters.Tag))
                {
                    title.Append(" - ");
                }
            }

            if (!string.IsNullOrWhiteSpace(homepageParameters.Category))
            {
                title.Append(homepageParameters.Category);

                if (!string.IsNullOrWhiteSpace(homepageParameters.Tag))
                {
                    title.Append(", ");
                }
            }

            if (!string.IsNullOrWhiteSpace(homepageParameters.Tag))
            {
                title.Append(string.Concat("tagged ", homepageParameters.Tag));
            }

            return title.ToString();
        }
    }
}