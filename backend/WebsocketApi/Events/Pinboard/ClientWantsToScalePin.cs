using System.Text.Json;
using Fleck;
using lib;
using WebsocketApi.DTOs.Client;
using WebsocketApi.DTOs.Server;

namespace WebsocketApi.Events.Pinboard;

public class ClientWantsToScalePin : BaseEventHandler<ClientWantsToScalePinDto>
{
    public override Task Handle(ClientWantsToScalePinDto dto, IWebSocketConnection ws)
    {
        if (StateService.Connections.TryGetValue(ws.ConnectionInfo.Id, out var metaData))
        {
            var message = new ServerScalesPin()
            {
                PinId = dto.PinId,
                ScaleX = dto.ScaleX, // Make sure to include scaleX and scaleY
                ScaleY = dto.ScaleY,
                Username = metaData.Username
            };

            var jsonMessage = JsonSerializer.Serialize(message);
            StateService.ScalePin(dto.RoomId, jsonMessage);

            // Send back the ServerScalesPin message to the client
            ws.Send(jsonMessage);
        }
        else
        {
            Console.WriteLine($"No connection found for ID: {ws.ConnectionInfo.Id}");
            ws.Send(JsonSerializer.Serialize(new ServerSendsErrorMessageToClient { errorMessage = "Connection not found" }));
        }
        return Task.CompletedTask;
    }
}