using lib;

namespace WebsocketApi.DTOs.Server;

public class ServerScalesPin : BaseDto
{
    public int PinId { get; set; }
    public double ScaleX { get; set; }
    public double ScaleY { get; set; }
    public string Username { get; set; }
}