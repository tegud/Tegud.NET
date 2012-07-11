using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;
using Dapper;
using DotNetOpenAuth.OpenId.Extensions.AttributeExchange;
using Newtonsoft.Json;
using StructureMap;
using TegudData.Models.Session;
using TegudData.Repository;
using TegudUtilities.Performance;

namespace TegudData.SiteSession
{
    public interface ISession
    {
        User User { get; }
    }

    public class User
    {
        public readonly string Identifier;

        public readonly string Email;

        public readonly string FriendlyName;

        public readonly bool IsAuthenticated;

        public readonly bool IsAdmin;

        public readonly string LoggedInWith;

        public User(string identifier, string friendlyName, string email, bool isAuthenticated, bool isAdmin, string loggedInWith)
        {
            Email = email;
            FriendlyName = friendlyName;
            IsAuthenticated = isAuthenticated;
            IsAdmin = isAdmin;
            Identifier = identifier;
            LoggedInWith = loggedInWith;
        }
    }

    public class Session
    {
        private const string SESSION_KEY = ":current-session:";

        public static Session GetCurrent()
        {
            Session session;

            if (HttpContext.Current.Session[SESSION_KEY] == null 
                || (session = (HttpContext.Current.Session[SESSION_KEY] as Session)) == null
                || UserHasChanged(session))
            {
                session = RefreshSession();
            }

            return session;
        }

        public static Session RefreshSession()
        {
            var session = new Session(ObjectFactory.GetInstance<IIdentityRepository>());
            HttpContext.Current.Session[SESSION_KEY] = session;

            return session;
        }

        private static bool UserHasChanged(Session currentSession)
        {
            var identity = HttpContext.Current.User.Identity;
            var formsIdentity = identity as FormsIdentity;
            UserData userData;

            userData = formsIdentity != null ? GetUserData(formsIdentity.Ticket.UserData) : new UserData { FriendlyName = identity.Name };

            if (string.IsNullOrEmpty(userData.FriendlyName))
            {
                userData.FriendlyName = identity.Name;
            }

            return (currentSession.User != null && userData.Identifier == null)
                || (currentSession.User == null && userData.Identifier != null)
                || (currentSession.User != null && userData.Identifier != null && !userData.Identifier.Equals(currentSession.User.Identifier));
        }
        
        private readonly IIdentityRepository _identityRepository;
        private readonly User _user;

        public Session(IIdentityRepository identityRepository)
        {
            _identityRepository = identityRepository;

            var identity = HttpContext.Current.User.Identity;
            var formsIdentity = identity as FormsIdentity;
            UserData userData;

            userData = formsIdentity != null ? GetUserData(formsIdentity.Ticket.UserData) : new UserData { FriendlyName = identity.Name };

            if (string.IsNullOrEmpty(userData.FriendlyName))
            {
                userData.FriendlyName = identity.Name;
            }

            var isAdmin =
                identity.IsAuthenticated
                && _identityRepository.IdentityIsAdmin(userData.Identifier);

            _user = new User(userData.Identifier, userData.FriendlyName, userData.Email, identity.IsAuthenticated, isAdmin, userData.LoginProvider);
        }

        public User User
        {
            get { return _user; }
        }

        private static UserData GetUserData(string userData)
        {
            return JsonConvert.DeserializeObject<UserData>(userData);
        }
    }

    public interface IIdentityRepository
    {
        bool IdentityIsAdmin(string identity);
    }

    public class IdentityRepository : IIdentityRepository
    {
        private readonly IProfilerWrapper _profilerWrapper;
        private readonly IDbConnection _connection;

        public IdentityRepository(ITegudSqlConnectionFactory connectionFactory, IProfilerWrapper profilerWrapper)
        {
            _profilerWrapper = profilerWrapper;
            _connection = connectionFactory.GetConnection();
        }

        public bool IdentityIsAdmin(string identity)
        {
            using (_profilerWrapper.Step("Get identity from database"))
            {
                return _connection.Query<bool>("EXEC spRecordIdentityAndAuthorise @id", new { id = identity }).All(b => b);
            }
        }
    }
}
