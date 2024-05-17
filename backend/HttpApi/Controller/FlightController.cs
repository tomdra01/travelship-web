using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace HttpApi.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class FlightController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public FlightController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        private async Task<string> GetAccessToken()
        {
            var clientId = "38TYzANOG6WG2OAlZEvThHFFafAr7ASh"; //api key
            var clientSecret = "gZI2fl3ral62ZnSb"; // api secret
            var requestBody = new StringContent($"grant_type=client_credentials&client_id={clientId}&client_secret={clientSecret}", Encoding.UTF8, "application/x-www-form-urlencoded");

            var response = await _httpClient.PostAsync("https://test.api.amadeus.com/v1/security/oauth2/token", requestBody);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                var token = JObject.Parse(responseContent)["access_token"].ToString();
                return token;
            }

            throw new HttpRequestException($"Failed to retrieve access token: {response.StatusCode}");
        }

        [HttpGet("destinations")]
        public async Task<IActionResult> GetDestinations([FromQuery] string origin, [FromQuery] int maxPrice = 200)
        {
            if (string.IsNullOrEmpty(origin))
            {
                return BadRequest(new { error = "Origin parameter is required." });
            }

            var token = await GetAccessToken();
            var requestUrl = $"https://test.api.amadeus.com/v1/shopping/flight-destinations?origin={origin}&maxPrice={maxPrice}";

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.GetAsync(requestUrl);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                return Ok(responseContent); 
            }

            var errorResponse = await response.Content.ReadAsStringAsync();
            var errorDetails = JObject.Parse(errorResponse);

            return StatusCode((int)response.StatusCode, new 
            {
                error = "Failed to retrieve destinations",
                details = errorDetails
            });
        }
        
        
    }
}
