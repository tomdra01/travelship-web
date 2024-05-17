using lib;

namespace WebsocketApi.DTOs.Client;

public class ClientWantsToEditPinContentDto : BaseDto
{
    public long PinId { get; set; }
    public string Description { get; set; }
    public int TripId { get; set; }
}