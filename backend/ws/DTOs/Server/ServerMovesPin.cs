using lib;

namespace WebsocketApi.DTOs.Server;

public class ServerMovesPin : BaseDto
{
    public long PinId { get; set; }
    public int XPosition { get; set; }
    public int YPosition { get; set; }
    public string Username { get; set; }
}