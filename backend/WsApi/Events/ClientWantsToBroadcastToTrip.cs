using System.Text.Json;
using Fleck;
using lib;
using Repository;
using Repository.Models;
using WebsocketApi.DTOs.Client;
using WebsocketApi.DTOs.Server;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using Infrastructure.interfaces;

namespace WebsocketApi.Events
{
    public class ClientWantsToBroadcastToTrip : BaseEventHandler<ClientWantsToBroadcastToTripDto>
    {
        private readonly IConfiguration _configuration;
        private readonly IMessageService _messageService;

        public ClientWantsToBroadcastToTrip(IConfiguration configuration, IMessageService messageService)
        {
            _configuration = configuration;
            _messageService = messageService ?? throw new ArgumentNullException(nameof(messageService));
        }

        public override async Task Handle(ClientWantsToBroadcastToTripDto dto, IWebSocketConnection ws)
        {
            if (StateService.Connections.TryGetValue(ws.ConnectionInfo.Id, out var metaData))
            {
                var messageDto = new Message
                {
                    MessageContent = dto.message,
                    Username = metaData.Username,
                    TripId = dto.tripId
                };

                var addedMessageDto = await ProcessMessageAddition(messageDto);
                StateService.BroadcastToTrip(dto.tripId, JsonSerializer.Serialize(addedMessageDto));
            }
            else
            {
                Console.WriteLine($"No connection found for ID: {ws.ConnectionInfo.Id}");
            }
        }

        private async Task<ServerBroadcastsMessageWithUsername> ProcessMessageAddition(Message message)
        {
            var addedMessage = await _messageService.AddMessage(message);

            return new ServerBroadcastsMessageWithUsername
            {
                message = addedMessage.MessageContent,
                username = addedMessage.Username
            };
        }
    }
}
