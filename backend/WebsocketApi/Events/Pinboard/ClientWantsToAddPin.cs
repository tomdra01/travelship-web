using System.Text.Json;
using Fleck;
using lib;
using WebsocketApi.DTOs.Client;
using WebsocketApi.DTOs.Server;

namespace WebsocketApi.Events.Pinboard;

public class ClientWantsToAddPin : BaseEventHandler<ClientWantsToAddPinDto>
{
    public override Task Handle(ClientWantsToAddPinDto dto, IWebSocketConnection ws)
    {
        if (StateService.Connections.TryGetValue(ws.ConnectionInfo.Id, out var metaData))
        {
            var message = new ServerAddsPinDto()
            {
                PinId = dto.PinId,
                Type = dto.Type,
                Title = dto.Title,
                Description = dto.Description,
                Username = metaData.Username
            };
            
            var jsonMessage = JsonSerializer.Serialize(message);
            StateService.AddPin(dto.RoomId, jsonMessage);
        }
        else
        {
            Console.WriteLine($"No connection found for ID: {ws.ConnectionInfo.Id}");
            ws.Send(JsonSerializer.Serialize(new ServerSendsErrorMessageToClientDto {errorMessage = "Connection not found" }));
        }
        return Task.CompletedTask;
    }
}
