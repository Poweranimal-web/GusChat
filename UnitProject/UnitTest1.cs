using System.Net.Http.Headers;
using models;
using System.Text.Json;
using NUnit.Framework;
using System.Net.Http.Json;
namespace UnitProject{
public class AuthorizationTest
{
    [SetUp]
    public void Setup()
    {

    }

    [Test]
    public async Task Test1()
    {
        customers customerInstance = new customers(){tag="Nikitos",password="Nikita123"};
        HttpContent content = JsonContent.Create(customerInstance);
        HttpClient url = new HttpClient(); 
        HttpResponseMessage response = await url.PostAsync("http://localhost:5182/login", content);
        string jwtCode = await response.Content.ReadAsStringAsync();
        url.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", jwtCode);
        response = await url.GetAsync("http://localhost:5182/test");
        response.EnsureSuccessStatusCode();
        string stringResponse = await response.Content.ReadAsStringAsync();
        Assert.AreEqual("dfd", stringResponse);
        
    }
}
}