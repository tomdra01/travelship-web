﻿using Fleck;
using lib;

namespace WebsocketApi.Events;

public class ClientWantsToSetUsernameDto : BaseDto
{
    public string Username { get; set; }
}

public class ClientWantsToSetUsername : BaseEventHandler<ClientWantsToSetUsernameDto>
{
    public override Task Handle(ClientWantsToSetUsernameDto dto, IWebSocketConnection socket)
    {
        StateService.Connections[socket.ConnectionInfo.Id].Username = dto.Username;
        return Task.CompletedTask;
    }
}