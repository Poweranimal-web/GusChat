namespace project{

class Program{
    public static WebApplicationBuilder builder;
    static int Main(string[] args){
        builder = WebApplication.CreateBuilder(args);
        var app = builder.Build();
        app.MapPost("/login", async() => {
            

        });
        app.Run();
        return 0;
    }
}
}


