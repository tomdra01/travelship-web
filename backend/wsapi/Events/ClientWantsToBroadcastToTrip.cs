using System.Text.Json;
using Fleck;
using lib;
using WebsocketApi.DTOs.Client;
using WebsocketApi.DTOs.Server;

namespace WebsocketApi.Events;

public class ClientWantsToBroadcastToTrip : BaseEventHandler<ClientWantsToBroadcastToTripDto>
{
    private readonly IConfiguration _configuration;

    public ClientWantsToBroadcastToTrip(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    
    public override Task Handle(ClientWantsToBroadcastToTripDto dto, IWebSocketConnection ws)
    {
        if (StateService.Connections.TryGetValue(ws.ConnectionInfo.Id, out var metaData))
        {
            var message = new ServerBroadcastsMessageWithUsername()
            {
                message = dto.message,
                username = metaData.Username
            };
            StateService.BroadcastToTrip(dto.tripId, JsonSerializer.Serialize(message));
        }
        else
        {
            Console.WriteLine($"No connection found for ID: {ws.ConnectionInfo.Id}");
        }
        return Task.CompletedTask;
    }
}