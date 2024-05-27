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

        private async Task<NpgsqlConnection> CreateConnectionAsync()
        {
            var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();
            return connection;
        }

        public async Task<IEnumerable<Trip>> GetAllTrips()
        {
            const string sql = "SELECT * FROM Trips;";
            using (var connection = await CreateConnectionAsync())
            {
                var trips = await connection.QueryAsync<Trip>(sql);
                return trips;
            }
        }

        public async Task<IEnumerable<Trip>> GetPublicTrips()
        {
            const string sql = "SELECT * FROM Trips WHERE code IS NULL OR code = '';";
            using (var connection = await CreateConnectionAsync())
            {
                var trips = await connection.QueryAsync<Trip>(sql);
                return trips;
            }
        }

        public async Task<Trip> GetTripById(int tripId)
        {
            const string sql = "SELECT * FROM Trips WHERE id = @TripId;";
            using (var connection = await CreateConnectionAsync())
            {
                var trip = await connection.QuerySingleOrDefaultAsync<Trip>(sql, new { TripId = tripId });
                return trip;
            }
        }

        public async Task<Trip> GetTripByCode(string code)
        {
            const string sql = "SELECT * FROM Trips WHERE code = @Code;";
            using (var connection = await CreateConnectionAsync())
            {
                var trip = await connection.QuerySingleOrDefaultAsync<Trip>(sql, new { Code = code });
                return trip;
            }
        }

        public async Task<Trip> CreateTrip(Trip trip)
        {
            const string sql = @"
                INSERT INTO Trips (Name, Location, Date, Description, Code)
                VALUES (@Name, @Location, @Date, @Description, @Code) RETURNING *;";
            using (var connection = await CreateConnectionAsync())
            {
                var createdTrip = await connection.QuerySingleAsync<Trip>(sql, trip);
                return createdTrip;
            }
        }

        public async Task<Trip> UpdateTrip(Trip trip)
        {
            const string sql = @"
                UPDATE Trips
                SET Name = @Name, Location = @Location, Date = @Date, Description = @Description, Code = @Code
                WHERE id = @ID
                RETURNING *;";
            using (var connection = await CreateConnectionAsync())
            {
                var updatedTrip = await connection.QuerySingleOrDefaultAsync<Trip>(sql, trip);
                return updatedTrip;
            }
        }

        public async Task<bool> DeleteTrip(int tripId)
        {
            const string sql = "DELETE FROM Trips WHERE id = @TripId;";
            using (var connection = await CreateConnectionAsync())
            {
                var result = await connection.ExecuteAsync(sql, new { TripId = tripId }) > 0;
                return result;
            }
        }
    }