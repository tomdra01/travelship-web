using System.Net;
using System.Net.Http.Json;
using ApiTests.Models;
using Dapper;
using FluentAssertions;

namespace ApiTests;

[TestFixture]
public class CreateTripTest
{
    [OneTimeSetUp]
    public void Setup()
    {
        try
        {
            Helper.TriggerRebuild();
            Console.WriteLine("Database rebuild was successful.");
        }
        catch (Exception ex)
        {
            Console.WriteLine("Failed to rebuild database: " + ex.Message);
            throw;
        }
    }
    
    private static readonly HttpClient httpClient = new HttpClient { BaseAddress = new Uri(Helper.ApiBaseUrl) };

    [TestCase("Ski Adventure", "Switzerland", "2024-02-10", "A thrilling ski trip full of adventure and fun. Join us for a memorable experience in the snow-capped mountains of Switzerland. Perfect for families and individuals alike looking to escape the mundane.", 15, null)]
    public async Task TripCanBeSuccessfullyCreatedFromHttpRequest(string name, string location, string date, string description, int peopleJoined, string code)
    {
        var trip = new Trip
        {
            Name = name,
            Location = location,
            Date = DateTime.Parse(date),
            Description = description,
            PeopleJoined = peopleJoined,
            Code = code
        };

        Console.WriteLine("Sending POST request to create a new trip.");
        var httpResponse = await httpClient.PostAsJsonAsync("/api/trips", trip);
        if (!httpResponse.IsSuccessStatusCode)
        {
            var responseContent = await httpResponse.Content.ReadAsStringAsync();
            Console.WriteLine($"Failed to create trip: {responseContent}");
        }

        httpResponse.StatusCode.Should().Be(HttpStatusCode.Created, "because the trip should be successfully created");

        var createdTrip = await httpResponse.Content.ReadFromJsonAsync<Trip>();
        createdTrip.Should().NotBeNull();
        Console.WriteLine("Trip created successfully, verifying database entry.");

        using (var conn = Helper.DataSource.CreateConnection())
        {
            conn.Open();
            var tripInDb = conn.QueryFirstOrDefault<Trip>("SELECT * FROM Production.trips WHERE name = @name", new { name });
            tripInDb.Should().NotBeNull();
            Console.WriteLine("Trip verified in the database successfully.");
        }
    }
}