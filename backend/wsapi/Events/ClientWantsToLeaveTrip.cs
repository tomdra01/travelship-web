using System.Text.Json;
using Fleck;
using lib;

namespace WebsocketApi.Events;

public class ClientWantsToLeaveTripDto : BaseDto
{
    public int roomId { get; set; }
}

public class ClientWantsToLeaveTrip : BaseEventHandler<ClientWantsToLeaveTripDto>
{
    public override Task Handle(ClientWantsToLeaveTripDto dto, IWebSocketConnection ws)
    {
        var isSuccess = StateService.RemoveFromTrip(ws, dto.roomId);
        ws.Send(JsonSerializer.Serialize(new ServerRemovesClientFromTrip
        {
            message = "You have been removed from room " + dto.roomId
        }));
        return Task.CompletedTask;
    }
}

public class ServerRemovesClientFromTrip : BaseDto
{
    public string message { get; set; }
}