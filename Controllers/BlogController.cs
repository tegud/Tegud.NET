using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TegudMVC3.ExtendedControllers;
using TegudUtilities.Performance;

namespace TegudMVC3.Controllers
{
    public class BlogController : TegudControllerBase
    {
        public BlogController(IProfilerWrapper profilerWrapper) : base(profilerWrapper)
        {
        }

        public ActionResult Add()
        {
            return View();
        }

    }
}
