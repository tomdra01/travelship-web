namespace Repository.Models;

using System.ComponentModel.DataAnnotations;


public class Trip
{   
    [Key]
    public int ID { get; set; }

    [Required(ErrorMessage = "Name is required.")]
    [StringLength(255, ErrorMessage = "Name cannot exceed 255 characters.")]
    public string? Name { get; set; }

    [Required(ErrorMessage = "Location is required.")]
    [StringLength(255, ErrorMessage = "Location cannot exceed 255 characters.")]
    public string? Location { get; set; }

    [Required(ErrorMessage = "Date is required.")]
    [DataType(DataType.Date)]
    public DateTime Date { get; set; }

    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
    public string? Description { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Number of people joined must be a non-negative number.")]
    public int PeopleJoined { get; set; }
    
    [StringLength(6, ErrorMessage = "Code cannot exceed 6 characters.")]
    [RegularExpression("^[A-Z]*$", ErrorMessage = "Code must consist of uppercase letters only.")]
    public string? Code { get; set; }
}