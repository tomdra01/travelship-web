using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Utilities;

namespace HttpApi.Controller;

[ApiController]
[Route("api/[controller]")]
public class UnsplashController : ControllerBase
{
    private readonly HttpClient _httpClient;

    public UnsplashController(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient();
    }

    [HttpGet("random")]
    public async Task<IActionResult> GetRandomPhoto()
    {
        var requestUrl = $"https://api.unsplash.com/photos/random?query=wide travel&topics=Wide angle&orientation=landscape&client_id={Configuration.UnsplashKey}&w=3840";
        var response = await _httpClient.GetAsync(requestUrl);

        if (response.IsSuccessStatusCode)
        {
            var responseContent = await response.Content.ReadAsStringAsync();
            var imageUrl = JObject.Parse(responseContent)["urls"]!["regular"]!.ToString();
            return Ok(new { imageUrl }); 
        }

        return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
    }
}