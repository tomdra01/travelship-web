using System.Text.Json;
using Fleck;
using lib;

namespace WebsocketApi.Events;

public class ClientWantsToBroadcastToRoomDto : BaseDto
{
    public int roomId { get; set; }
    public string message { get; set; }
}

public class ClientWantsToBroadcastToRoom : BaseEventHandler<ClientWantsToBroadcastToRoomDto>
{
    private readonly IConfiguration _configuration;

    public ClientWantsToBroadcastToRoom(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    
    public override Task Handle(ClientWantsToBroadcastToRoomDto dto, IWebSocketConnection ws)
    {
        if (StateService.Connections.TryGetValue(ws.ConnectionInfo.Id, out var metaData))
        {
            var message = new ServerBroadcastsMessageWithUsername()
            {
                message = dto.message,
                username = metaData.Username
            };
            StateService.BroadcastToRoom(dto.roomId, JsonSerializer.Serialize(message));
        }
        else
        {
            Console.WriteLine($"No connection found for ID: {ws.ConnectionInfo.Id}");
        }
        return Task.CompletedTask;
    }
}

public class ServerBroadcastsMessageWithUsername : BaseDto
{
    public string message { get; set; }
    public string username { get; set; }
}