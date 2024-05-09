using lib;

namespace WebsocketApi.DTOs.Client;

public class ClientWantsToAddPinDto : BaseDto
{
    public long PinId { get; set; }
    public string Type { get; set; }
    public double Left { get; set; }
    public double Top { get; set; }
    public double Width { get; set; }
    public double Height { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int RoomId { get; set; }
}
