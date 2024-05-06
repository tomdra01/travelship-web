namespace WebsocketApi.DTOs;

using System.Text.Json;
using Fleck;
using lib;

public class ClientWantsToMovePinDto : BaseDto
{
    public int PinId { get; set; }
    public int XPosition { get; set; }
    public int YPosition { get; set; }
    public int RoomId { get; set; }
}

public class ClientWantsToMovePin : BaseEventHandler<ClientWantsToMovePinDto>
{
    public override Task Handle(ClientWantsToMovePinDto dto, IWebSocketConnection ws)
    {
        if (StateService.Connections.TryGetValue(ws.ConnectionInfo.Id, out var metaData))
        {
            var message = new ServerMovesPin()
            {
                PinId = dto.PinId,
                XPosition = dto.XPosition,
                YPosition = dto.YPosition,
                Username = metaData.Username
            };

            // Serialize the movement to JSON
            var jsonMessage = JsonSerializer.Serialize(message);

            StateService.MovePin(dto.RoomId, jsonMessage);
        }
        else
        {
            Console.WriteLine($"No connection found for ID: {ws.ConnectionInfo.Id}");
            ws.Send(JsonSerializer.Serialize(new ServerSendsErrorMessageToClient {errorMessage = "Connection not found" }));
        }
        return Task.CompletedTask;
    }
}

public class ServerMovesPin : BaseDto
{
    public int PinId { get; set; }
    public int XPosition { get; set; }
    public int YPosition { get; set; }
    public string Username { get; set; }
}