using lib;

namespace WebsocketApi.DTOs.Server;

public class ServerAddsPin : BaseDto
{
    public long PinId { get; set; }
    public string Type { get; set; }
    public double Left { get; set; }
    public double Top { get; set; }
    public double Width { get; set; }
    public double Height { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Username { get; set; }
}