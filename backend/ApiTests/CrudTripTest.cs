using System.Net;
using System.Net.Http.Json;
using ApiTests.Models;
using Dapper;
using FluentAssertions;

namespace ApiTests;

[TestFixture]
public class CrudTripTest
{
    private static Trip? createdTrip;
    
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

    [TestCase("Ski Adventure", "Switzerland", "2024-02-10", "A thrilling ski trip full of adventure and fun. Join us for a memorable experience in the snow-capped mountains of Switzerland. Perfect for families and individuals alike looking to escape the mundane.", 15, null), Order(1)]
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

        var httpResponse = await httpClient.PostAsJsonAsync("/api/trips", trip);
        httpResponse.StatusCode.Should().Be(HttpStatusCode.Created);

        createdTrip = await httpResponse.Content.ReadFromJsonAsync<Trip>(); // Assign the created trip to the shared object
        Console.WriteLine("Trip created and verified successfully.");
    }

    [Test, Order(2)]
    public async Task GetAllTrips_ReturnsAllTrips()
    {
        var httpResponse = await httpClient.GetAsync("/api/trips");
        httpResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var trips = await httpResponse.Content.ReadFromJsonAsync<IEnumerable<Trip>>();
        trips.Should().NotBeNull();
        Console.WriteLine("All trips retrieved successfully.");
    }

    [Test, Order(3)]
    public async Task GetTripById_ReturnsCorrectTrip()
    {
        if (createdTrip is null)
        {
            Assert.Fail("Test setup failed: createdTrip is null.");
        }

        var httpResponse = await httpClient.GetAsync($"/api/trips/{createdTrip.ID}");
        httpResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var trip = await httpResponse.Content.ReadFromJsonAsync<Trip>();
        trip.Should().NotBeNull().And.BeEquivalentTo(createdTrip, options => options.Excluding(m => m.Date));
        Console.WriteLine("Specific trip retrieved successfully.");
    }
    

    [Test, Order(4)]
    public async Task UpdateTrip_SuccessfullyUpdates()
    {
        createdTrip.Name = "Updated name";
        createdTrip.Description = "Updated description";
        createdTrip.Location = "Updated location";
        var httpResponse = await httpClient.PutAsJsonAsync($"/api/trips/{createdTrip.ID}", createdTrip);
        httpResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var updatedTrip = await httpResponse.Content.ReadFromJsonAsync<Trip>();
        updatedTrip.Name.Should().Be("Updated name");
        updatedTrip.Description.Should().Be("Updated description");
        updatedTrip.Location.Should().Be("Updated location");
        Console.WriteLine("Trip updated successfully.");
    }
    
    [Test, Order(5)]
    public async Task DeleteTrip_SuccessfullyDeletes()
    {
        if (createdTrip is null)
        {
            Assert.Fail("Test setup failed: createdTrip is null.");
        }

        var httpResponse = await httpClient.DeleteAsync($"/api/trips/{createdTrip.ID}");
        httpResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        Console.WriteLine("Trip deleted successfully.");

        // Verify deletion
        var checkDeleteResponse = await httpClient.GetAsync($"/api/trips/{createdTrip.ID}");
        if (checkDeleteResponse.StatusCode == HttpStatusCode.InternalServerError)
        {
            // Log or handle the internal server error
            var errorResponse = await checkDeleteResponse.Content.ReadAsStringAsync();
            Console.WriteLine($"Internal server error when checking deletion: {errorResponse}");
            Assert.Fail("Expected NotFound after deletion, got InternalServerError.");
        }
        checkDeleteResponse.StatusCode.Should().Be(HttpStatusCode.NotFound, "Trip should not be found after deletion.");
    }
}