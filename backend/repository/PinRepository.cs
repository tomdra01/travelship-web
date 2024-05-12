using Dapper;
using Npgsql;
using Repository.Models;

namespace Repository;

public class PinRepository
{
    private readonly string _connectionString;

    public PinRepository(string connectionString)
    {
        _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
    }

    private NpgsqlConnection CreateConnection()
    {
        return new NpgsqlConnection(_connectionString);
    }

    public async Task<Pin> AddPin(Pin pin)
    {
        const string sql = @"
INSERT INTO Production.Pins (PinId, Type, Title, Description, XPosition, YPosition, TripId)
VALUES (@PinId, @Type, @Title, @Description, @XPosition, @YPosition, @TripId) RETURNING *;";

        using (var conn = CreateConnection())
        {
            await conn.OpenAsync();
            return await conn.QuerySingleAsync<Pin>(sql, pin);
        }
    }

    public async Task<bool> RemovePin(long pinId)
    {
        const string sql = "DELETE FROM Production.Pins WHERE PinId = @PinId;";

        using (var conn = CreateConnection())
        {
            await conn.OpenAsync();
            var affectedRows = await conn.ExecuteAsync(sql, new { PinId = pinId });
            return affectedRows >= 1; 
        }
    }

    public async Task<Pin> MovePin(long pinId, int newX, int newY)
    {
        const string sql = @"
UPDATE Production.Pins
SET XPosition = @NewX, YPosition = @NewY
WHERE PinId = @PinId
RETURNING *;";

        using (var conn = CreateConnection())
        {
            await conn.OpenAsync();
            return await conn.QuerySingleOrDefaultAsync<Pin>(sql, new { PinId = pinId, NewX = newX, NewY = newY });
        }
    }
}
