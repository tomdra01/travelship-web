using System.ComponentModel.DataAnnotations;

namespace Repository.Models;

public class Message
{
    [Key]
    public int Id { get; set; }
    
    [Required(ErrorMessage = "MessageContent is required.")]
    [StringLength(255, ErrorMessage = "MessageContent cannot exceed 255 characters.")]
    public string? MessageContent { get; set; }
    
    [Required(ErrorMessage = "Username is required.")]
    [StringLength(20, ErrorMessage = "Username cannot exceed 20 characters.")]
    public string? Username { get; set; }
    
    [Required(ErrorMessage = "TripId is required.")]
    public long TripId { get; set; }
}