using Repository.Models;
using System.Threading.Tasks;

namespace Infrastructure.interfaces;

public interface IPinService
{
    Task<IEnumerable<Pin>> GetPinsByTripId(long tripId);
    Task<Pin> AddPin(Pin pin);
    Task<bool> DeletePin(long pinId);
    Task<Pin>MovePin(long pinId, int newX, int newY);
    Task<Pin> EditPin(long pinId, string newDescription);
}