using Fleck;
using lib;
using WebsocketApi.DTOs.Client;

namespace WebsocketApi.Events;

public class ClientWantsToSetUsername : BaseEventHandler<ClientWantsToSetUsernameDto>
{
    public override Task Handle(ClientWantsToSetUsernameDto dto, IWebSocketConnection socket)
    {
        StateService.Connections[socket.ConnectionInfo.Id].Username = dto.Username;
        return Task.CompletedTask;
    }
}