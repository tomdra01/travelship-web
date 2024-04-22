namespace WebsocketApi.DTOs;

using System.Net.Sockets;
using System.Text.Json;
using Fleck;
using lib;

public class ClientWantsToEnterRoomDto : BaseDto
{
    public int roomId { get; set; }
}

public class ClientWantsToEnterRoom : BaseEventHandler<ClientWantsToEnterRoomDto>
{
    public override Task Handle(ClientWantsToEnterRoomDto dto, IWebSocketConnection ws)
    {
        var isSuccess = StateService.AddToRoom(ws, dto.roomId);
        ws.Send(JsonSerializer.Serialize(new ServerAddsClientToRoom()
            {
                message = "You have been added to room " + dto.roomId
            }
        ));
        return Task.CompletedTask;
    }
}

public class ServerAddsClientToRoom : BaseDto
{
    public string message { get; set; }
}