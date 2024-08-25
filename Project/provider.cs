// using Microsoft.Extensions.Configuration;
// public class ProviderConfig
// {
//     private readonly IConfiguration Configuration;

//     public ProviderConfig(IConfiguration configuration)
//     {
//         Configuration = configuration;
//     }

//     public string Get()
//     {
//         var myKeyValue = Configuration["MyKey"];
//         var title = Configuration["Position:Title"];
//         var name = Configuration["Position:Name"];
//         var defaultLogLevel = Configuration["Logging:LogLevel:Default"];


//         return Content($"MyKey value: {myKeyValue} \n" +
//                        $"Title: {title} \n" +
//                        $"Name: {name} \n" +
//                        $"Default Log Level: {defaultLogLevel}");
//     }
// }