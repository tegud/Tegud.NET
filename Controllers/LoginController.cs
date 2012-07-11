using System;
using TegudMVC3.ExtendedControllers;
using TegudMVC3.Results;
using TegudUtilities.Performance;

namespace TegudMVC3.Controllers
{
    public class LoginController : TegudControllerBase
    {
        public LoginController(IProfilerWrapper profilerWrapper)
            : base(profilerWrapper)
        {
            
        }

        public JsonNetResult Login(string username, string password)
        {
            return new JsonNetResult { Data = new {} };
        }

        public JsonNetResult ExceptionText()
        {
            throw new NotImplementedException();
        }
    }
}
