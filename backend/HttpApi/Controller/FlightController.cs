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

        [HttpGet("sky-id")]
        public async Task<IActionResult> GetCitySkyId([FromQuery] string city)
        {
            if (string.IsNullOrEmpty(city))
            {
                return BadRequest(new { error = "City parameter is required." });
            }

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri($"https://sky-scanner3.p.rapidapi.com/flights/auto-complete?query={city}"),
                Headers =
                {
                    { "X-RapidAPI-Key", Utilities.Configuration.RapidApiKey },
                    { "X-RapidAPI-Host", "sky-scanner3.p.rapidapi.com" },
                },
            };

            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                var jsonResponse = JObject.Parse(responseContent);
                var skyId = jsonResponse["data"]?.First?["navigation"]?["relevantFlightParams"]?["skyId"]?.ToString();

                if (!string.IsNullOrEmpty(skyId))
                {
                    return Ok(new { skyId });
                }

                return NotFound(new { error = "Sky ID not found for the provided city." });
            }

            var errorResponse = await response.Content.ReadAsStringAsync();
            var errorDetails = JObject.Parse(errorResponse);

            return StatusCode((int)response.StatusCode, new 
            {
                error = "Failed to retrieve the Sky ID",
                details = errorDetails
            });
        }

        [HttpGet("cheapest-one-way")]
        public async Task<IActionResult> GetCheapestOneWayFlight([FromQuery] string fromCity, [FromQuery] string toCity, [FromQuery] string departDate)
        {
            if (string.IsNullOrEmpty(fromCity) || string.IsNullOrEmpty(toCity) || string.IsNullOrEmpty(departDate))
            {
                return BadRequest(new { error = "fromCity, toCity, and departDate parameters are required." });
            }

            string fromSkyId = await FetchCitySkyId(fromCity);
            string toSkyId = await FetchCitySkyId(toCity);

            if (string.IsNullOrEmpty(fromSkyId) || string.IsNullOrEmpty(toSkyId))
            {
                return BadRequest(new { error = "Could not retrieve Sky IDs for the provided cities." });
            }

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri($"https://sky-scanner3.p.rapidapi.com/flights/cheapest-one-way?fromEntityId={fromSkyId}&toEntityId={toSkyId}&departDate={departDate}"),
                Headers =
                {
                    { "X-RapidAPI-Key", Utilities.Configuration.RapidApiKey },
                    { "X-RapidAPI-Host", "sky-scanner3.p.rapidapi.com" },
                },
            };

            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                return Ok(responseContent); 
            }

            var errorResponse = await response.Content.ReadAsStringAsync();
            var errorDetails = JObject.Parse(errorResponse);

            return StatusCode((int)response.StatusCode, new 
            {
                error = "Failed to retrieve the cheapest one-way flight",
                details = errorDetails
            });
        }

        private async Task<string> FetchCitySkyId(string city)
        {
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri($"https://sky-scanner3.p.rapidapi.com/flights/auto-complete?query={city}"),
                Headers =
                {
                    { "X-RapidAPI-Key", Utilities.Configuration.RapidApiKey },
                    { "X-RapidAPI-Host", "sky-scanner3.p.rapidapi.com" },
                },
            };

            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                var jsonResponse = JObject.Parse(responseContent);
                var skyId = jsonResponse["data"]?.First?["navigation"]?["relevantFlightParams"]?["skyId"]?.ToString();

                return skyId ?? string.Empty;
            }

            return string.Empty;
        }
    }
}