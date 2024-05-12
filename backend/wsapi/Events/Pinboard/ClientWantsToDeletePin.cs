using System.Text.Json;
using Fleck;
using Infrastructure.interfaces;
using lib;
using WebsocketApi.DTOs.Client;
using WebsocketApi.DTOs.Server;

namespace WebsocketApi.Events.Pinboard;

public class ClientWantsToDeletePin : BaseEventHandler<ClientWantsToDeletePinDto>
{
    private readonly IPinService _pinService;

    public ClientWantsToDeletePin(IPinService pinService)
    {
        _pinService = pinService ?? throw new ArgumentNullException(nameof(pinService));
    }

    public override async Task Handle(ClientWantsToDeletePinDto dto, IWebSocketConnection ws)
    {
        if (StateService.Connections.TryGetValue(ws.ConnectionInfo.Id, out var metaData))
        {
            try
            {
                var message = await ProcessPinDeletion(dto, metaData.Username);
                StateService.DeletePin(dto.TripId, JsonSerializer.Serialize(message));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing pin deletion: {ex.Message}");
                ws.Send(JsonSerializer.Serialize(new ServerSendsErrorMessageToClientDto { errorMessage = "Failed to delete pin" }));
            }
        }
        else
        {
            Console.WriteLine($"No connection found for ID: {ws.ConnectionInfo.Id}");
            ws.Send(JsonSerializer.Serialize(new ServerSendsErrorMessageToClientDto { errorMessage = "Connection not found" }));
        }
    }

    private async Task<ServerDeletesPinDto> ProcessPinDeletion(ClientWantsToDeletePinDto dto, string username)
    {
        await _pinService.DeletePin(dto.PinId);

        return new ServerDeletesPinDto
        {
            PinId = dto.PinId,
            Username = username
        };
    }
}