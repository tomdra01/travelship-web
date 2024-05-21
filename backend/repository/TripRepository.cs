using Dapper;
using Npgsql;
using Repository.Models;

namespace Repository;

public class TripRepository
{
    private readonly NpgsqlConnection _connection;

    public TripRepository(string connectionString)
    {
        _connection = new NpgsqlConnection(connectionString ?? throw new ArgumentNullException(nameof(connectionString)));
    }

    public async Task<IEnumerable<Trip>> GetAllTrips()
    {
        const string sql = "SELECT * FROM Production.Trips;";
        await _connection.OpenAsync();
        var trips = await _connection.QueryAsync<Trip>(sql);
        await _connection.CloseAsync();
        return trips;
    }

    public async Task<IEnumerable<Trip>> GetPublicTrips()
    {
        const string sql = "SELECT * FROM Production.Trips WHERE code IS NULL OR code = '';";
        await _connection.OpenAsync();
        var trips = await _connection.QueryAsync<Trip>(sql);
        await _connection.CloseAsync();
        return trips;
    }

    public async Task<Trip> GetTripById(int tripId)
    {
        const string sql = "SELECT * FROM Production.Trips WHERE id = @TripId;";
        await _connection.OpenAsync();
        var trip = await _connection.QuerySingleOrDefaultAsync<Trip>(sql, new { TripId = tripId });
        await _connection.CloseAsync();
        return trip;
    }

    public async Task<Trip> GetTripByCode(string code)
    {
        const string sql = "SELECT * FROM Production.Trips WHERE code = @Code;";
        await _connection.OpenAsync();
        var trip = await _connection.QuerySingleOrDefaultAsync<Trip>(sql, new { Code = code });
        await _connection.CloseAsync();
        return trip;
    }

    public async Task<Trip> CreateTrip(Trip trip)
    {
        const string sql = @"
INSERT INTO Production.Trips (Name, Location, Date, Description, Code)
VALUES (@Name, @Location, @Date, @Description, @Code) RETURNING *;";
        await _connection.OpenAsync();
        var createdTrip = await _connection.QuerySingleAsync<Trip>(sql, trip);
        await _connection.CloseAsync();
        return createdTrip;
    }

    public async Task<Trip> UpdateTrip(Trip trip)
    {
        const string sql = @"
UPDATE Production.Trips
SET Name = @Name, Location = @Location, Date = @Date, Description = @Description, Code = @Code
WHERE id = @ID
RETURNING *;";
        await _connection.OpenAsync();
        var updatedTrip = await _connection.QuerySingleOrDefaultAsync<Trip>(sql, trip);
        await _connection.CloseAsync();
        return updatedTrip;
    }

    public async Task<bool> DeleteTrip(int tripId)
    {
        const string sql = "DELETE FROM Production.Trips WHERE id = @TripId;";
        await _connection.OpenAsync();
        var result = await _connection.ExecuteAsync(sql, new { TripId = tripId }) > 0;
        await _connection.CloseAsync();
        return result;
    }
}
