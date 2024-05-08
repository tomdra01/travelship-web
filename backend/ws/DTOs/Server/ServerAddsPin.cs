using lib;

namespace WebsocketApi.DTOs.Server;

public class ServerAddsPin : BaseDto
{
    public int PinId { get; set; }
    public double XPosition { get; set; }
    public double YPosition { get; set; }
    public string Username { get; set; }
}