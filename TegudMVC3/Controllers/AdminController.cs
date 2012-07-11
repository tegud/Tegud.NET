using System;
using System.Net;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.Security;
using DotNetOpenAuth.Messaging;
using DotNetOpenAuth.OAuth2;
using DotNetOpenAuth.OpenId;
using DotNetOpenAuth.OpenId.Extensions.AttributeExchange;
using DotNetOpenAuth.OpenId.Extensions.SimpleRegistration;
using DotNetOpenAuth.OpenId.RelyingParty;
using Newtonsoft.Json;
using TegudData.Models.AdminModel;
using TegudData.Models.Session;
using TegudMVC3.Models;

namespace TegudMVC3.Controllers
{
    public class AdminController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult LogOut()
        {
            FormsAuthentication.SignOut();

            return Redirect(HttpContext.Request.UrlReferrer != null ? HttpContext.Request.UrlReferrer.ToString() : "/");
        }

        public ActionResult Facebook(LoginViewModel model)
        {
            var client = new FacebookClient
            {
                ClientIdentifier = "149468868470566",
                ClientSecret = "e6a0759c4c2510847763a1fb7d5b8566",
            };
            IAuthorizationState authorization = client.ProcessUserAuthorization();
            if (authorization == null)
            {
                // Kick off authorization request
                client.RequestUserAuthorization();
            }
            else
            {
                var request = WebRequest.Create("https://graph.facebook.com/me?access_token=" + Uri.EscapeDataString(authorization.AccessToken));
                using (var response = request.GetResponse())
                {
                    using (var responseStream = response.GetResponseStream())
                    {
                        var graph = FacebookGraph.Deserialize(responseStream);

                        var userData = new UserData
                        {
                            FriendlyName = graph.Name,
                            Identifier = graph.Link.ToString(),
                            LoginProvider = "Facebook"
                        };

                        SetAuthCookie(graph.Link.ToString(), true, JsonConvert.SerializeObject(userData));

                        return Redirect(Url.Action("Index", "Home"));
                    }
                }
            }

            return Redirect(Url.Action("Index", "Home"));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult OpenId(LoginViewModel model)
        {
            Identifier id;
            if (Identifier.TryParse(model.OpenID_Identifier, out id))
            {
                try
                {
                    var openId = new OpenIdRelyingParty();
                    var returnToUrl = new Uri(Url.Action("OpenIdCallback", "Admin", new {model.ReturnUrl }, Request.Url.Scheme), UriKind.Absolute);
                    var request = openId.CreateRequest(id, Realm.AutoDetect, returnToUrl);

                    // add request for name and email using sreg (OpenID Simple Registration Extension)
                    request.AddExtension(new ClaimsRequest
                    {
                        Email = DemandLevel.Require,
                        FullName = DemandLevel.Require,
                        Nickname = DemandLevel.Require
                    });

                    // also add AX request
                    var axRequest = new FetchRequest();
                    axRequest.Attributes.AddRequired(WellKnownAttributes.Name.FullName);
                    axRequest.Attributes.AddRequired(WellKnownAttributes.Name.First);
                    axRequest.Attributes.AddRequired(WellKnownAttributes.Name.Last);
                    axRequest.Attributes.AddRequired(WellKnownAttributes.Contact.Email);
                    request.AddExtension(axRequest);

                    return request.RedirectingResponse.AsActionResult();
                }
                catch (ProtocolException ex)
                {
                    model.Message = ex.Message;
                    return View("Index", model);
                }
            }
            else
            {
                model.Message = "Invalid identifier";
                return View("Index", model);
            }
        }

        [HttpGet]
        [ValidateInput(false)]
        public ActionResult OpenIdCallback(string returnUrl)
        {
            var model = new LoginViewModel { ReturnUrl = returnUrl };
            var openId = new OpenIdRelyingParty();
            var openIdResponse = openId.GetResponse();

            if (openIdResponse.Status == AuthenticationStatus.Authenticated)
            {
                var email = GetEmail(openIdResponse);
                var userData = new UserData
                                   {
                                       FriendlyName = GetFriendlyName(openIdResponse), 
                                       Identifier = email,
                                       Email = email,
                                       LoginProvider = "Google"
                                   };

                SetAuthCookie(openIdResponse.ClaimedIdentifier, true, JsonConvert.SerializeObject(userData));

                return Redirect(Url.Action("Index", "Home"));
            }

            model.Message = "Sorry, login failed.";
            return View("Index", model);
        }

        private void SetAuthCookie(string username, bool createPersistentCookie, string userData)
        {
            if (string.IsNullOrEmpty(username))
                throw new ArgumentNullException("username");

            var authenticationConfig =
                (AuthenticationSection)WebConfigurationManager.GetWebApplicationSection("system.web/authentication");

            var timeout = (int)authenticationConfig.Forms.Timeout.TotalMinutes;
            var expiry = DateTime.Now.AddMinutes((double)timeout);

            var ticket = new FormsAuthenticationTicket(2,
              username,
              DateTime.Now,
              expiry,
              createPersistentCookie,
              userData,
              FormsAuthentication.FormsCookiePath);

            string encryptedTicket = FormsAuthentication.Encrypt(ticket);

            var cookie = new HttpCookie(FormsAuthentication.FormsCookieName)
            {
                Value = encryptedTicket,
                HttpOnly = true,
                Secure = authenticationConfig.Forms.RequireSSL
            };

            if (ticket.IsPersistent)
                cookie.Expires = ticket.Expiration;

            Response.Cookies.Add(cookie);
        }

        private string GetEmail(IAuthenticationResponse authResponse)
        {
            string email = "";

            var sregResponse = authResponse.GetExtension<ClaimsResponse>();
            var axResponse = authResponse.GetExtension<FetchResponse>();


            if (sregResponse != null)
            {
                email = sregResponse.Email;
            }

            if (string.IsNullOrEmpty(email) && axResponse != null)
            {
                email = axResponse.GetAttributeValue(WellKnownAttributes.Contact.Email);
            }

            return email;
        }

        private string GetFriendlyName(IAuthenticationResponse authResponse)
        {
            string friendlyName = "";

            var sregResponse = authResponse.GetExtension<ClaimsResponse>();
            var axResponse = authResponse.GetExtension<FetchResponse>();

            if (sregResponse != null)
            {
                friendlyName =
                    sregResponse.FullName ??
                    sregResponse.Nickname;
            }
            if (string.IsNullOrEmpty(friendlyName) && axResponse != null)
            {
                var fullName = axResponse.GetAttributeValue(WellKnownAttributes.Name.FullName);
                var firstName = axResponse.GetAttributeValue(WellKnownAttributes.Name.First);
                var lastName = axResponse.GetAttributeValue(WellKnownAttributes.Name.Last);

                friendlyName =
                    fullName ??
                    ((!string.IsNullOrEmpty(firstName) && !string.IsNullOrEmpty(lastName)) ? firstName + " " + lastName : null);
            }

            if (string.IsNullOrEmpty(friendlyName))
                friendlyName = authResponse.FriendlyIdentifierForDisplay;

            if (string.IsNullOrEmpty(friendlyName))
                friendlyName = GetEmail(authResponse);

            return friendlyName;
        }
    }
}
