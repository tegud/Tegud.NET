using System.Web;

namespace TegudData.ViewModels.Blog
{
    public class BlogItemLink
    {
        private readonly string _url;

        public BlogItemLink(int id, string title)
        {
            _url = string.Format("/{0}/{1}", id,
                                 HttpUtility.UrlEncode(title.Replace(":", string.Empty)).Replace("+", "%20"));
        }

        public override string ToString()
        {
            return _url;
        }
    }
}