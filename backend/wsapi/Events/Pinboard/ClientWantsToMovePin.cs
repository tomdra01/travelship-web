using System.Text.Json;
using Fleck;
using Infrastructure.interfaces;
using lib;
using WebsocketApi.DTOs.Client;
using WebsocketApi.DTOs.Server;

namespace WebsocketApi.Events.Pinboard;

public class ClientWantsToMovePin : BaseEventHandler<ClientWantsToMovePinDto>
{
    private readonly IPinService _pinService;
    private static readonly DebounceQueue _debounceQueue = new DebounceQueue(100); 

    public ClientWantsToMovePin(IPinService pinService)
    {
        _pinService = pinService ?? throw new ArgumentNullException(nameof(pinService));
    }

    public override Task Handle(ClientWantsToMovePinDto dto, IWebSocketConnection ws)
    {
        if (StateService.Connections.TryGetValue(ws.ConnectionInfo.Id, out var metaData))
        {
            // Immediate broadcast to other clients
            var broadcastMessage = new ServerMovesPinDto
            {
                PinId = dto.PinId,
                XPosition = dto.XPosition,
                YPosition = dto.YPosition,
                Username = metaData.Username
            };
            StateService.MovePin(dto.TripId, JsonSerializer.Serialize(broadcastMessage));

            // Debounced database write
            _debounceQueue.Enqueue(dto.PinId, async () =>
            {
                try
                {
                    await ProcessPinMove(dto, metaData.Username);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error saving pin move to database: {ex.Message}");
                    ws.Send(JsonSerializer.Serialize(new ServerSendsErrorMessageToClientDto { errorMessage = "Failed to save pin move" }));
                }
            });
        }
        else
        {
            Console.WriteLine($"No connection found for ID: {ws.ConnectionInfo.Id}");
            ws.Send(JsonSerializer.Serialize(new ServerSendsErrorMessageToClientDto { errorMessage = "Connection not found" }));
        }

        return Task.CompletedTask;
    }

    private async Task ProcessPinMove(ClientWantsToMovePinDto dto, string username)
    {
        var movedPin = await _pinService.MovePin(dto.PinId, dto.XPosition, dto.YPosition);
    }
}