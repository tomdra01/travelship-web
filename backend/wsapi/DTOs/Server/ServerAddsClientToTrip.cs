using lib;
using Repository.Models;

namespace WebsocketApi.DTOs.Server;

public class ServerAddsClientToTrip : BaseDto
{
    public string message { get; set; }
    public IEnumerable<Pin> Pins { get; set; }
}