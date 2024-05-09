using lib;

namespace WebsocketApi.DTOs.Client;

public class ClientWantsToDeletePinDto : BaseDto
{
    public long PinId { get; set; }
    public int RoomId { get; set; }
}