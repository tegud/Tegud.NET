using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TegudMVC3.Helpers
{
    public static class HtmlHelpers
    {
        public static IHtmlString TwitterButton(this HtmlHelper helper, string url, string title)
        {
            return new HtmlString(string.Format("<a href=\"http://twitter.com/share\" class=\"twitter-share-button\" data-url=\"{0}\" data-text=\"{1}\" data-count=\"vertical\" data-via=\"tegud\">Tweet</a>", blogAbsolutePath(url), title));

        }

        public static IHtmlString FacebookButton(this HtmlHelper helper, string url, int width = 0, int height = 0)
        {
            return
                new HtmlString(string.Format(
                    "<iframe src=\"http://www.facebook.com/plugins/like.php?app_id=149468868470566&amp;href={0}&amp;send=false&amp;layout=box_count&amp;width={1}&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height={2}\" scrolling=\"no\" frameborder=\"0\" style=\"border:none; overflow:hidden; width:{1}px; height:{2}px;\" allowTransparency=\"true\"></iframe>",
                    HttpUtility.UrlEncode(url),
                    width < 1 ? 60 : width,
                    height < 1 ? 90 : height));

        }

        public static string blogAbsolutePath(string url)
        {
            return string.Format("{0}{1}",
                "http://www.tegud.net",
                url);
        }

        private static string blogFullTitleBuilder(DateTime postedAt, string title)
        {
            return string.Format("/{0}/{1}/{2}/{3}",
                postedAt.Year,
                postedAt.Month,
                postedAt.Day,
                HttpUtility.UrlEncode(title));
        }

        public static IHtmlString BlogItemTitle(this HtmlHelper helper, DateTime postedAt, string title)
        {
            return new HtmlString(string.Format("<h3><a href=\"{0}\">{1}</a></h3>",
                blogFullTitleBuilder(postedAt, title),
                title));
        }

    }
}