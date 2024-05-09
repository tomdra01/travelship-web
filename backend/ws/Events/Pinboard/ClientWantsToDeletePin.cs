using System.Text.Json;
using Fleck;
using lib;
using WebsocketApi.DTOs.Client;
using WebsocketApi.DTOs.Server;

namespace WebsocketApi.Events.Pinboard;

public class ClientWantsToDeletePin : BaseEventHandler<ClientWantsToDeletePinDto>
{
    public override Task Handle(ClientWantsToDeletePinDto dto, IWebSocketConnection ws)
    {
        if (StateService.Connections.TryGetValue(ws.ConnectionInfo.Id, out var metaData))
        {
            var message = new ServerDeletesPin
            {
                PinId = dto.PinId,
                Username = metaData.Username
            };

            var jsonMessage = JsonSerializer.Serialize(message);
            StateService.DeletePin(dto.RoomId, jsonMessage);
        }
        else
        {
            Console.WriteLine($"No connection found for ID: {ws.ConnectionInfo.Id}");
            ws.Send(JsonSerializer.Serialize(new ServerSendsErrorMessageToClient { errorMessage = "Connection not found" }));
        }
        return Task.CompletedTask;
    }
}