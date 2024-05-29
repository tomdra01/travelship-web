using System.Text.Json;
using Fleck;
using Infrastructure.interfaces;
using lib;
using WebsocketApi.DTOs.Client;
using WebsocketApi.DTOs.Server;
using Repository.Models;

namespace WebsocketApi.Events.Pinboard;

public class ClientWantsToAddPin : BaseEventHandler<ClientWantsToAddPinDto>
{
    private readonly IPinService _pinService;

    public ClientWantsToAddPin(IPinService pinService)
    {
        _pinService = pinService ?? throw new ArgumentNullException(nameof(pinService));
    }

    public override async Task Handle(ClientWantsToAddPinDto dto, IWebSocketConnection ws)
    {
        if (StateService.Connections.TryGetValue(ws.ConnectionInfo.Id, out var metaData))
        {
            try
            {
                var message = await ProcessPinAddition(dto, metaData.Username);
                StateService.AddPin(dto.TripId, JsonSerializer.Serialize(message));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing pin addition: {ex.Message}");
                ws.Send(JsonSerializer.Serialize(new ServerSendsErrorMessageToClientDto { errorMessage = "Failed to add pin" }));
            }
        }
        else
        {
            Console.WriteLine($"No connection found for ID: {ws.ConnectionInfo.Id}");
            ws.Send(JsonSerializer.Serialize(new ServerSendsErrorMessageToClientDto { errorMessage = "Connection not found" }));
        }
    }

    private async Task<ServerAddsPinDto> ProcessPinAddition(ClientWantsToAddPinDto dto, string username)
    {
        var pin = new Pin
        {
            PinId = dto.PinId,
            Type = dto.Type,
            Title = dto.Title,
            Description = dto.Description,
            XPosition = dto.XPosition,
            YPosition = dto.YPosition,
            TripId = dto.TripId
        };

        var addedPin = await _pinService.AddPin(pin);

        return new ServerAddsPinDto
        {
            PinId = addedPin.PinId,
            Type = addedPin.Type,
            Title = addedPin.Title,
            Description = addedPin.Description,
            Username = username
        };
    }
}
