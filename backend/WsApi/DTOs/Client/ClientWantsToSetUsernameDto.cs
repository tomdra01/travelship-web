using lib;

namespace WebsocketApi.DTOs.Client;

public class ClientWantsToSetUsernameDto : BaseDto
{
    public string Username { get; set; }
}