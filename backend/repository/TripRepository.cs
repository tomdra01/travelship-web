using Dapper;
using Npgsql;
using Repository.Models;

namespace Repository;

public class TripRepository
{
    private readonly string _connectionString;

    public TripRepository(string connectionString)
    {
        _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
    }

    private NpgsqlConnection CreateConnection()
    {
        return new NpgsqlConnection(_connectionString);
    }

    public async Task<IEnumerable<Trip>> GetAllTrips()
    {
        const string sql = "SELECT * FROM Production.Trips;";
        using (var conn = CreateConnection())
        {
            await conn.OpenAsync();
            return await conn.QueryAsync<Trip>(sql);
        }
    }
    
    public async Task<IEnumerable<Trip>> GetPublicTrips()
    {
        const string sql = "SELECT * FROM Production.Trips WHERE code IS NULL OR code = '';";
        using (var connection = new NpgsqlConnection(_connectionString))
        {
            await connection.OpenAsync();
            return await connection.QueryAsync<Trip>(sql);
        }
    }

    public async Task<Trip> GetTripById(int tripId)
    {
        const string sql = "SELECT * FROM Production.Trips WHERE id = @TripId;";
        using (var conn = CreateConnection())
        {
            await conn.OpenAsync();
            return await conn.QuerySingleOrDefaultAsync<Trip>(sql, new { TripId = tripId });
        }
    }
    
    public async Task<Trip> GetTripByCode(string code)
    {
        const string sql = "SELECT * FROM Production.Trips WHERE code = @Code;";
        using (var connection = new NpgsqlConnection(_connectionString))
        {
            await connection.OpenAsync();
            return await connection.QuerySingleOrDefaultAsync<Trip>(sql, new { Code = code });
        }
    }

    public async Task<Trip> CreateTrip(Trip trip)
    {
        const string sql = @"
INSERT INTO Production.Trips (Name, Location, Date, Description, PeopleJoined, Code)
VALUES (@Name, @Location, @Date, @Description, @PeopleJoined, @Code) RETURNING *;";

        using (var conn = CreateConnection())
        {
            await conn.OpenAsync();
            return await conn.QuerySingleAsync<Trip>(sql, trip);
        }
    }

    public async Task<Trip> UpdateTrip(Trip trip)
    {
        const string sql = @"
UPDATE Production.Trips
SET Name = @Name, Location = @Location, Date = @Date, Description = @Description, PeopleJoined = @PeopleJoined, Code = @Code
WHERE id = @ID
RETURNING *;";

        using (var conn = CreateConnection())
        {
            await conn.OpenAsync();
            return await conn.QuerySingleOrDefaultAsync<Trip>(sql, trip);
        }
    }

    public async Task<bool> DeleteTrip(int tripId)
    {
        const string sql = "DELETE FROM Production.Trips WHERE id = @TripId;";
        using (var conn = CreateConnection())
        {
            await conn.OpenAsync();
            return await conn.ExecuteAsync(sql, new { TripId = tripId }) > 0;
        }
    }
}
