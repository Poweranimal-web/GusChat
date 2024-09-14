
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
using Microsoft.Extensions.FileProviders;
namespace project{
class Program{
    public static WebApplicationBuilder builder;
    static int Main(string[] args){ 
        builder = WebApplication.CreateBuilder(args);
        builder.Services.AddSingleton<IAuthentication,JWTRS256Authentication>();
        builder.Services.AddSingleton<IFactory,AuthenticationFactory>();
        builder.Services.AddSingleton<AuthService>();
        builder.Services.AddSingleton<TextSocketHandler>();
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
        app.UseStaticFiles(new StaticFileOptions(){
            FileProvider = new PhysicalFileProvider(Path.Combine(
                builder.Environment.ContentRootPath, "static"
            )),
            RequestPath = "/Static"
        });
        WebSocketOptions websocketOptions = new WebSocketOptions(){
            KeepAliveInterval = TimeSpan.FromMinutes(2)
        };
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseWebSockets(websocketOptions);
        app.MapPost("/login", async(context) => {
            DB db = new DB(); 
            customers loginData = await context.Request.ReadFromJsonAsync<customers>();
            customers exist_user = await db.customers.FirstOrDefaultAsync((user) => user.tag == loginData.tag && user.password == loginData.password);
            if (exist_user == null){
                await Results.Unauthorized().ExecuteAsync(context);
            }
            else{
                AuthService auth = app.Services.GetService<AuthService>();
                List<Claim> claims = new List<Claim>{new Claim("name", loginData.tag), new Claim("room", exist_user.room_number)};
                string token = auth.GetToken("JWT", context,  claims);
                await Results.Text(token).ExecuteAsync(context);
            }
        });
        app.MapGet("/{code}", async(HttpContext context,string code)=>{
                if (context.WebSockets.IsWebSocketRequest){
                    TextSocketHandler textMessage = app.Services.GetRequiredService<TextSocketHandler>();
                    WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
                    textMessage.Add(webSocket);
                    await textMessage.HandlerMessage(context, webSocket);
                }
                else{
                    await context.Response.SendFileAsync("static/html/chat.html");
                }
            
        });
        app.MapGet("/", async(HttpContext context)=>{
            // if (context.WebSockets.IsWebSocketRequest){
            //         TextSocketHandler textMessage = app.Services.GetRequiredService<TextSocketHandler>();
            //         WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
            //         textMessage.Add(webSocket);
            //         await textMessage.HandlerMessage(context, webSocket);
            // }
            // else{
            await context.Response.SendFileAsync("static/html/chat.html");
            // }
            
        });
        app.MapPost("/", [Authorize]async(HttpContext context)=>{
                DB db = new DB();
                customers user = await db.customers.FirstOrDefaultAsync((c)=> c.tag == Convert.ToString(context.User.FindFirst("name").Value));
                StatusOkMessage statusOkMessage = new StatusOkMessage(){response="OK", metaData=user.room_number};
                await context.Response.WriteAsJsonAsync<StatusOkMessage>(statusOkMessage); 
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
        app.MapGet("/login", async(context) => {
            await context.Response.SendFileAsync("static/html/login.html");
        });
        app.MapGet("/reg", async(context) => {
            await context.Response.SendFileAsync("static/html/registration.html");
        });
        app.MapGet("/test", [Authorize]async(context) =>{
            await context.Response.WriteAsync("dfd");
        });
        app.MapGet("/logout", async(context) =>{
            await context.Response.SendFileAsync("static/html/logout.html");
        });
        app.Run();
        return 0;
    }
}
}


