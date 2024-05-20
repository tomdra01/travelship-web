using Dapper;
using Npgsql;
using Repository.Models;

namespace Repository;

public class PinRepository
{
    private readonly NpgsqlConnection _connection;

    public PinRepository(string connectionString)
    {
        _connection = new NpgsqlConnection(connectionString ?? throw new ArgumentNullException(nameof(connectionString)));
    }

    private async Task EnsureConnectionOpenAsync()
    {
        if (_connection.State != System.Data.ConnectionState.Open)
        {
            await _connection.OpenAsync();
        }
    }

    private async Task EnsureConnectionClosedAsync()
    {
        if (_connection.State != System.Data.ConnectionState.Closed)
        {
            await _connection.CloseAsync();
        }
    }
    
    public async Task<IEnumerable<Pin>> GetPinsByTripId(long tripId)
    {
        const string sql = "SELECT * FROM Production.Pins WHERE TripId = @TripId;";
            
        await EnsureConnectionOpenAsync();
        var pins = await _connection.QueryAsync<Pin>(sql, new { TripId = tripId });
        await EnsureConnectionClosedAsync();
        return pins;
    }

    public async Task<Pin> AddPin(Pin pin)
    {
        const string sql = @"
INSERT INTO Production.Pins (PinId, Type, Title, Description, XPosition, YPosition, TripId)
VALUES (@PinId, @Type, @Title, @Description, @XPosition, @YPosition, @TripId) RETURNING *;";
        
        await EnsureConnectionOpenAsync();
        var addedPin = await _connection.QuerySingleAsync<Pin>(sql, pin);
        await EnsureConnectionClosedAsync();
        return addedPin;
    }

    public async Task<bool> RemovePin(long pinId)
    {
        const string sql = "DELETE FROM Production.Pins WHERE PinId = @PinId;";
        
        await EnsureConnectionOpenAsync();
        var affectedRows = await _connection.ExecuteAsync(sql, new { PinId = pinId });
        await EnsureConnectionClosedAsync();
        return affectedRows >= 1;
    }

    public async Task<Pin> MovePin(long pinId, int newX, int newY)
    {
        const string sql = @"
UPDATE Production.Pins
SET XPosition = @NewX, YPosition = @NewY
WHERE PinId = @PinId
RETURNING *;";
        
        await EnsureConnectionOpenAsync();
        var movedPin = await _connection.QuerySingleOrDefaultAsync<Pin>(sql, new { PinId = pinId, NewX = newX, NewY = newY });
        await EnsureConnectionClosedAsync();
        return movedPin;
    }
    
    public async Task<Pin> EditPin(long pinId, string newDescription)
    {
        const string sql = @"
UPDATE Production.Pins
SET Description = @NewDescription 
WHERE PinId = @PinId
RETURNING *;";
        
        await EnsureConnectionOpenAsync();
        var movedPin = await _connection.QuerySingleOrDefaultAsync<Pin>(sql, new { PinId = pinId, NewDescription = newDescription });
        await EnsureConnectionClosedAsync();
        return movedPin;
    }
}
