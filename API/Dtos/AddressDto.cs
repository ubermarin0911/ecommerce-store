using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class AddressDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Address_line_1 { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Phone_number { get; set; }
    }
}