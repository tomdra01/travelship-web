using System.Text.Json;
using Fleck;
using lib;
using WebsocketApi.DTOs.Client;
using WebsocketApi.DTOs.Server;

namespace WebsocketApi.Events;

public class ClientWantsToLeaveTrip : BaseEventHandler<ClientWantsToLeaveTripDto>
{
    public override Task Handle(ClientWantsToLeaveTripDto dto, IWebSocketConnection ws)
    {
        var isSuccess = StateService.RemoveFromTrip(ws, dto.tripId);
        ws.Send(JsonSerializer.Serialize(new ServerRemovesClientFromTrip
        {
            message = "You have been removed from trip " + dto.tripId
        }));
        return Task.CompletedTask;
    }
}