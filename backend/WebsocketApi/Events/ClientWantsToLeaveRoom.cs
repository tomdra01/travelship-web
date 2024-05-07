using System.Text.Json;
using Fleck;
using lib;

namespace WebsocketApi.Events;

public class ClientWantsToLeaveRoomDto : BaseDto
{
    public int roomId { get; set; }
}

public class ClientWantsToLeaveRoom : BaseEventHandler<ClientWantsToLeaveRoomDto>
{
    public override Task Handle(ClientWantsToLeaveRoomDto dto, IWebSocketConnection ws)
    {
        var isSuccess = StateService.RemoveFromRoom(ws, dto.roomId);
        ws.Send(JsonSerializer.Serialize(new ServerRemovesClientFromRoom
        {
            message = "You have been removed from room " + dto.roomId
        }));
        return Task.CompletedTask;
    }
}

public class ServerRemovesClientFromRoom : BaseDto
{
    public string message { get; set; }
}