using lib;

namespace WebsocketApi.DTOs.Server;

public class ServerSendsErrorMessageToClient : BaseDto
{
    public string errorMessage { get; set; }
}