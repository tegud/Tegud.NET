using System.Web;

namespace TegudData.ViewModels.Blog
{
    public class BlogTagViewModel
    {
        public readonly string Name;

        public string Link
        {
            get { return HttpUtility.UrlEncode(Name).Replace("+", "%20"); }
        }

        public BlogTagViewModel(string name)
        {
            Name = name;
        }
    }

    public class TagCloudViewModel : BlogTagViewModel
    {
        public readonly decimal FontSize;

        public TagCloudViewModel(string name, decimal fontSize) : base(name)
        {
            FontSize = fontSize;
        }
    }
}