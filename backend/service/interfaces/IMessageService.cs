using Repository.Models;

namespace Infrastructure.interfaces;

public interface IMessageService
{
    Task<IEnumerable<Message>> GetMessagesByTripId(long tripId);
    Task<Message> AddMessage(Message message);
}