using lib;

namespace WebsocketApi.DTOs.Server;

public class ServerSendsErrorMessageToClientDto : BaseDto
{
    public string errorMessage { get; set; }
}