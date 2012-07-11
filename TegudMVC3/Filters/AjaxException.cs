using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using TegudMVC3.Results;

namespace TegudMVC3.Filters
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
    public class AjaxException : ActionFilterAttribute, IExceptionFilter
    {
        public void OnException(ExceptionContext filterContext)
        {
            if (!filterContext.HttpContext.Request.IsAjaxRequest()) return;

            filterContext.Result = AjaxError(filterContext.Exception.Message, filterContext);

            //Let the system know that the exception has been handled
            filterContext.ExceptionHandled = true;
        }

        protected JsonNetResult AjaxError(string message, ExceptionContext filterContext)
        {
            //If message is null or empty, then fill with generic message
            if (String.IsNullOrEmpty(message))
                message = "Something went wrong while processing your request. Please refresh the page and try again.";

            //Needed for IIS7.0
            filterContext.HttpContext.Response.TrySkipIisCustomErrors = true;

            return new JsonNetResult
            {
                Data = new { Error = message },
                ContentEncoding = System.Text.Encoding.UTF8
            };
        }
    }
}