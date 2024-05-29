using System.ComponentModel.DataAnnotations;

namespace Repository.Models;

public class Pin
{
    [Key]
    public long PinId { get; set; }

    [Required(ErrorMessage = "Type is required.")]
    [StringLength(50, ErrorMessage = "Type cannot exceed 50 characters.")]
    public string? Type { get; set; }

    [Required(ErrorMessage = "Title is required.")]
    [StringLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
    public string? Title { get; set; }

    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
    public string? Description { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "XPosition must be a non-negative integer.")]
    public int XPosition { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "YPosition must be a non-negative integer.")]
    public int YPosition { get; set; }

    [Required(ErrorMessage = "TripId is required.")]
    public int TripId { get; set; }
}