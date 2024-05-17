using lib;

namespace WebsocketApi.DTOs.Server;

public class ServerEditsPinContentDto : BaseDto
{
    public long PinId { get; set; }
    public string Description { get; set; }
    public string Username { get; set; }
}