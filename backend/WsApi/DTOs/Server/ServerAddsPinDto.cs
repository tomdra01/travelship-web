using lib;

namespace WebsocketApi.DTOs.Server;

public class ServerAddsPinDto : BaseDto
{
    public long PinId { get; set; }
    public string Type { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int XPosition { get; set; }
    public int YPosition { get; set; }
    public string Username { get; set; }
}