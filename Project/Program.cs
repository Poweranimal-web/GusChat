
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
using code;
using System.Net.WebSockets;
using Microsoft.Extensions.FileProviders;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
namespace project{
class Program{
    public static WebApplicationBuilder builder;
    static int Main(string[] args){ 
        builder = WebApplication.CreateBuilder(args);
        builder.Services.AddSingleton<IAuthentication,JWTRS256Authentication>();
        builder.Services.AddSingleton<IFactory,AuthenticationFactory>();
        builder.Services.AddSingleton<AuthService>();
        builder.Services.AddSingleton<TextSocketHandler>();
        builder.Services.AddSingleton<CodeFabric>();
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
                List<Claim> claims = new List<Claim>{new Claim("name", loginData.tag), 
                new Claim("id", Convert.ToString(exist_user.id)),
                new Claim("email", Convert.ToString(exist_user.email))};
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
                StatusOkMessage<int> statusOkMessage = new StatusOkMessage<int>(){response="OK", metaData=user.room_number};
                await context.Response.WriteAsJsonAsync<StatusOkMessage<int>>(statusOkMessage); 
        });
        app.MapPost("/friends", [Authorize]async(HttpContext context)=>{
            DB db = new DB();
            List<DetailFriendMessage> Friends = await db.friends
            .Where((f)=> f.Customer.tag == context.User.FindFirst("name").Value).Join(db.customers, 
            f=>f.friendsId, u=>u.id, (f,u)=> new DetailFriendMessage(){
            private_room=f.private_room,push_room=f.push_room, id=u.id,
            tag=u.tag, email=u.email, phone_number=u.phone_number})
            .ToListAsync();
            StatusOkMessage<DetailFriendMessage> statusOkMessage = new StatusOkMessage<DetailFriendMessage>(){response="OK", data=Friends};
            await context.Response.WriteAsJsonAsync<StatusOkMessage<DetailFriendMessage>>(statusOkMessage); 
            
        });
        app.MapPost("/friends/set", [Authorize]async(HttpContext context)=>{
            customers userData = await context.Request.ReadFromJsonAsync<customers>();
            DB db = new DB();
            customers exist_user = db.customers.FirstOrDefault((user) => user.tag == userData.tag && user.email == userData.email);
            if (exist_user == null || 
            userData.tag == context.User.FindFirst("name").Value ||
            userData.email == context.User.FindFirst(ClaimTypes.Email).Value ){
                StatusOkMessage<int> statusOkMessage = new StatusOkMessage<int>(){response="Failure"};
                await context.Response.WriteAsJsonAsync<StatusOkMessage<int>>(statusOkMessage);
            }
            else{
                CodeFabric codeFabric = app.Services.GetRequiredService<CodeFabric>();
                RandomGen codeClass = codeFabric.createInstance("room", 8);
                string code = new string(codeClass.GenerateCode());
                customers customer = await db.customers.FirstOrDefaultAsync((user) => user.tag == context.User.FindFirst("name").Value);
                friends friend = new friends(){push_room=exist_user.room_number,private_room=code, 
                customerId= Int32.Parse(context.User.FindFirst("id").Value), friendsId=(int)exist_user.id};
                await db.friends.AddAsync(friend);
                await db.SaveChangesAsync();
                DetailFriendMessage detailDataContact = new DetailFriendMessage(){push_room=friend.push_room,
                private_room=friend.private_room,id=friend.Friend.id,tag=friend.Friend.tag,
                email=friend.Friend.email,phone_number=friend.Friend.phone_number};
                await context.Response.WriteAsJsonAsync<DetailFriendMessage>(detailDataContact); 
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
        app.MapGet("/login", async(context) => {
            await context.Response.SendFileAsync("static/html/login.html");
        });
        app.MapGet("/contact/detail/get", [Authorize]async(context) => {
            DB db = new DB(); 
            customers user = await db.customers.FirstOrDefaultAsync((user)=>user.tag==context.User.FindFirst("name").Value);
            List<customers> customers = new List<customers>(){user};
            StatusOkMessage<customers> userData = new StatusOkMessage<customers>()
            {response="OK", data=customers}; 
            await context.Response.WriteAsJsonAsync<StatusOkMessage<customers>>(userData);
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


