
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using models;
using mysql;
using auth;
using websocket;
using massage;
using System.Net.WebSockets;
namespace project{
class Program{
    public static WebApplicationBuilder builder;
    static int Main(string[] args){
        builder = WebApplication.CreateBuilder(args);
        builder.Services.AddSingleton<IAuthentication,JWTRS256Authentication>();
        builder.Services.AddSingleton<IFactory,AuthenticationFactory>();
        builder.Services.AddSingleton<AuthService>();
        builder.Services.AddScoped<IWebSocketHandler,TextSocketHandler>();
        builder.Services.AddAuthorization();
        builder.Services.AddAuthentication(x =>
        {
            x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
            .AddJwtBearer(options =>
            {

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = AuthOptions.ISSUER,
                    ValidateAudience = true,
                    ValidAudience = AuthOptions.AUDIENCE,
                    ValidateLifetime = true,
                    IssuerSigningKey = new JWTRS256Authentication().GetRsaKey(),
                    ValidateIssuerSigningKey = true
                };
        });
        var app = builder.Build();
        app.UseAuthentication();
        app.UseAuthorization();
        WebSocketOptions websocketOptions = new WebSocketOptions(){
            KeepAliveInterval = TimeSpan.FromMinutes(2)
        };
        app.UseWebSockets(websocketOptions);
        app.MapPost("/login", async(context) => {
            DB db = new DB(); 
            customers loginData = await context.Request.ReadFromJsonAsync<customers>();
            bool exist_user = await db.customers.AnyAsync((user)=>user.tag == loginData.tag && user.password == loginData.password);
            if (!exist_user){
                await Results.Unauthorized().ExecuteAsync(context);
            }
            else{
                AuthService auth = app.Services.GetService<AuthService>();
                List<Claim> claims = new List<Claim>{new Claim("name", loginData.tag)};
                string token = auth.GetToken("JWT", context,  claims);
                await Results.Text(token).ExecuteAsync(context);
            }
        });
        app.MapGet("/r/{code:string}", [Authorize]async(HttpContext context,string code)=>{
                if (context.WebSockets.IsWebSocketRequest){
                    IWebSocketHandler textmessage = app.Services.GetService<TextSocketHandler>();
                    WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
                    await textmessage.HandlerMessage(context, webSocket);

                }
            
        });
        app.MapPost("/reg", async(context) => {
            DB db = new DB(); 
            customers loginData = await context.Request.ReadFromJsonAsync<customers>();
            bool exist_user = await db.customers.AnyAsync((user)=>user.tag == loginData.tag || user.email == loginData.email);
            if (!exist_user){
                AuthService auth = app.Services.GetService<AuthService>();
                List<Claim> claims = new List<Claim>{new Claim("name", loginData.tag)};
                string token = auth.GetToken("JWT", context,  claims);
                await db.customers.AddAsync(loginData);
                await db.SaveChangesAsync();
                await Results.Text(token).ExecuteAsync(context);
            }
            else{
                await Results.Unauthorized().ExecuteAsync(context);
            }

        });
        app.MapGet("/test", [Authorize]async(context) =>{
            await context.Response.WriteAsync("dfd");
        });
        app.Run();
        return 0;
    }
}
}


