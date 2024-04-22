using Repository.Models;

namespace Service;

public interface ITripService
{
        Task<Trip> CreateTrip(Trip trip);
        Task<IEnumerable<Trip>> GetAllTrips();
        Task<Trip> GetTripById(int id);
        Task<Trip> UpdateTrip(Trip trip);
        Task<bool> DeleteTrip(int id);
    
}