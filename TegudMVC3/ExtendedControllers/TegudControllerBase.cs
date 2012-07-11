using System.Web.Mvc;
using StackExchange.Profiling;
using StructureMap;
using TegudData.SiteSession;
using TegudUtilities.Performance;

namespace TegudMVC3.ExtendedControllers
{
    public class TegudControllerBase : Controller
    {
        public TegudControllerBase(IProfilerWrapper profilerWrapper)
        {
            using (profilerWrapper.Step("Controller Base Constructor"))
            {
                ViewBag.MinifyJS = false;
                ViewBag.ShowProfiler = false;

                using (profilerWrapper.Step("Set current session user"))
                {
                    var session = TegudData.SiteSession.Session.GetCurrent();
                    ViewBag.User = session.User;
                    ViewBag.IsMobile = Request != null && Request.Browser != null && Request.Browser.IsMobileDevice;

                    if(session.User.IsAdmin)
                    {
                        ViewBag.ShowProfiler = true;
                    }
                }
            }
        }
    }
}