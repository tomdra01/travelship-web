using lib;

namespace WebsocketApi.DTOs.Server;

public class ServerDeletesPinDto : BaseDto
{
    public long PinId { get; set; }
    public string Username { get; set; }
}