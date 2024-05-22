using System.Text.Json;
using Fleck;
using Infrastructure.interfaces;
using lib;
using WebsocketApi.DTOs.Client;
using WebsocketApi.DTOs.Server;

namespace WebsocketApi.Events.Pinboard;

public class ClientWantsToEditPinContent : BaseEventHandler<ClientWantsToEditPinContentDto>
{
    private readonly IPinService _pinService;
    private static readonly DebounceQueue _debounceQueue = new DebounceQueue(100); 

    public ClientWantsToEditPinContent(IPinService pinService)
    {
        _pinService = pinService ?? throw new ArgumentNullException(nameof(pinService));
    }

    public override Task Handle(ClientWantsToEditPinContentDto dto, IWebSocketConnection ws)
    {
        if (StateService.Connections.TryGetValue(ws.ConnectionInfo.Id, out var metaData))
        {
            // Immediate broadcast to other clients
            var broadcastMessage = new ServerEditsPinContentDto
            {
                PinId = dto.PinId,
                Description = dto.Description,
                Username = metaData.Username
            };
            StateService.EditPin(dto.TripId, JsonSerializer.Serialize(broadcastMessage));

            // Debounced database write
            _debounceQueue.Enqueue(dto.PinId, async () =>
            {
                try
                {
                    await ProcessPinEdit(dto, metaData.Username);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error saving pin edit to database: {ex.Message}");
                    ws.Send(JsonSerializer.Serialize(new ServerSendsErrorMessageToClientDto { errorMessage = "Failed to save pin edit" }));
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

    private async Task ProcessPinEdit(ClientWantsToEditPinContentDto dto, string username)
    {
        var editedPin = await _pinService.EditPin(dto.PinId, dto.Description);
    }
}