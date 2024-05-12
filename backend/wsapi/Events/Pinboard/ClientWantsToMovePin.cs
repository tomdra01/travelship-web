using System.Text.Json;
using Fleck;
using lib;
using WebsocketApi.DTOs.Client;
using WebsocketApi.DTOs.Server;

namespace WebsocketApi.Events.Pinboard;

public class ClientWantsToMovePin : BaseEventHandler<ClientWantsToMovePinDto>
{
    public override Task Handle(ClientWantsToMovePinDto dto, IWebSocketConnection ws)
    {
        if (StateService.Connections.TryGetValue(ws.ConnectionInfo.Id, out var metaData))
        {
            var message = new ServerMovesPinDto()
            {
                PinId = dto.PinId,
                XPosition = dto.XPosition,
                YPosition = dto.YPosition,
                Username = metaData.Username
            };
            
            
            var jsonMessage = JsonSerializer.Serialize(message);
            StateService.MovePin(dto.TripId, jsonMessage);
        }
        else
        {
            Console.WriteLine($"No connection found for ID: {ws.ConnectionInfo.Id}");
            ws.Send(JsonSerializer.Serialize(new ServerSendsErrorMessageToClientDto {errorMessage = "Connection not found" }));
        }
        return Task.CompletedTask;
    }
}