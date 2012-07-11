using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TegudData.Models.AdminModel
{
    public class LoginViewModel
    {
        public string OpenID_Identifier { get; set; }
        public string ReturnUrl { get; set; }
        public string Message { get; set; }
    }
}
