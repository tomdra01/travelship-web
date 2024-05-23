using Infrastructure.interfaces;
using Repository;
using Repository.Models;

namespace Service;

public class MessageService : IMessageService
{
    private readonly MessageRepository _messageRepository;

    public MessageService(MessageRepository messageRepository)
    {
        _messageRepository = messageRepository ?? throw new ArgumentNullException(nameof(messageRepository));
    }

    public async Task<IEnumerable<Message>> GetMessagesByTripId(long tripId)
    {
        if (_messageRepository == null)
        {
            throw new InvalidOperationException("MessageRepository has not been initialized.");
        }

        try
        {
            return await _messageRepository.GetMessagesByTripId(tripId);
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while retrieving messages for trip ID {tripId}: {ex.Message}", ex);
        }
    }

    public async Task<Message> AddMessage(Message message)
    {
        if (message == null)
        {
            throw new ArgumentNullException(nameof(message), "Message data is null");
        }

        if (_messageRepository == null)
        {
            throw new InvalidOperationException("MessageRepository has not been initialized.");
        }

        try
        {
            return await _messageRepository.AddMessage(message);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"An error occurred while adding message: {ex.Message}", ex);
        }
    }
}