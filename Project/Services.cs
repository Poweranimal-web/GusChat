using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Identity.Client;
using System.Security.Cryptography;
using System.Net.WebSockets;
using massage;
using System.Text.Json;

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
namespace storageAct{
    interface IStorage{
    }
}
namespace websocket{
   interface IWebSocketHandler{
        Task HandlerMessage(HttpContext http, WebSocket webSocket);
   }
   class TextSocketHandler : IWebSocketHandler
   {
        public async Task HandlerMessage(HttpContext http, WebSocket webSocket){
            byte[] buffer = new byte[1024*4];
            WebSocketReceiveResult request = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None); 
            while(!request.CloseStatus.HasValue){
                await webSocket.SendAsync(new ArraySegment<byte>(buffer),request.MessageType,request.EndOfMessage,CancellationToken.None);
                request = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                if (request.Count > 0){
                    string jsonString = Encoding.UTF8.GetString(buffer);
                    TextMessage message = JsonSerializer.Deserialize<TextMessage>(jsonString);
                    Console.WriteLine("Name: {0}, message: {0}", message.tag,message.message);
                }
            }
            await webSocket.CloseAsync(request.CloseStatus.Value,request.CloseStatusDescription, CancellationToken.None);
        }
   }
   class FileSocketHandler : IWebSocketHandler
   {
        public async Task HandlerMessage(HttpContext http, WebSocket webSocket){
            
        }
   }
}