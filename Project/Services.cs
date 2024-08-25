using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Identity.Client;


namespace auth{
    interface IAuthentication{
        string generateToken(HttpContext context,List<Claim> claims);
    } 
    public class AuthOptions
    {
        public const string ISSUER = "MyAuthServer"; // издатель токена
        public const string AUDIENCE = "MyAuthClient"; // потребитель токена
        const string KEY = "mysupersecret_secretsecretsecretkey!123";   // ключ для шифрации
        public static SymmetricSecurityKey GetSymmetricSecurityKey() => new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
    }
    class JWTAuthentication : IAuthentication
    {
        public string generateToken(HttpContext context, List<Claim> claims){
            JwtSecurityToken jwt = new JwtSecurityToken(
            issuer: AuthOptions.ISSUER,
            audience: AuthOptions.AUDIENCE,
            claims: claims,
            expires: DateTime.UtcNow.Add(TimeSpan.FromHours(24)),
            signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
            return new JwtSecurityTokenHandler().WriteToken(jwt);

        }

    }
    class CookieAuthentication : IAuthentication
    {
        public string generateToken(HttpContext context, List<Claim> claims){
            return "";

        }

    }
    interface IFactory{
        public object Get(string type);
    }
    class AuthenticationFactory: IFactory {
        public object Get(string typeToken){
            IAuthentication token;
            switch (typeToken)
            {
                case "JWT":
                    token = new JWTAuthentication();
                    return token;
                case "Cookie":
                    token = new CookieAuthentication();
                    return token;
                default:
                    return null;
            }

        }
    }
    class AuthService {
        IFactory AuthFactory;
        public AuthService(IFactory factory){
            this.AuthFactory = factory;
        }
        public string GetToken(string typeservice,  HttpContext? context,List<Claim>? claims){
            IAuthentication token = (IAuthentication)this.AuthFactory.Get(typeservice);
            return token.generateToken(context, claims);
        }
    }
}