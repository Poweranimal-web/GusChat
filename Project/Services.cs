using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Identity.Client;
using System.Security.Cryptography;


namespace auth{
    interface IAuthentication{
        string generateToken(HttpContext context,List<Claim> claims);
    } 
    public class AuthOptions
    {
        public const string ISSUER = "MyAuthServer"; // издатель токена
        public const string AUDIENCE = "MyAuthClient"; // потребитель токена
    }
    class JWTRS256Authentication : IAuthentication
    {
        public string generateToken(HttpContext context, List<Claim> claims){
            RsaSecurityKey rsasecurityKey = GetRsaKey();
            SigningCredentials signingCred = new SigningCredentials(rsasecurityKey, SecurityAlgorithms.RsaSha256);
            JwtSecurityToken jwt = new JwtSecurityToken(
            issuer: AuthOptions.ISSUER,
            audience: AuthOptions.AUDIENCE,
            claims: claims,
            expires: DateTime.UtcNow.Add(TimeSpan.FromHours(24)),
            signingCredentials: signingCred
            );
            return new JwtSecurityTokenHandler().WriteToken(jwt);

        }
        public RsaSecurityKey GetRsaKey(){
            RSA rsakey = RSA.Create();
            string privateKey = File.ReadAllText("Keys/private_key.pem");
            rsakey.ImportFromPem(privateKey);
            return new RsaSecurityKey(rsakey);
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
                    token = new JWTRS256Authentication();
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