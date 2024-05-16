using lib;

namespace WebsocketApi.DTOs.Server;

public class ServerBroadcastsMessageWithUsername : BaseDto
{
    public string message { get; set; }
    public string username { get; set; }
}