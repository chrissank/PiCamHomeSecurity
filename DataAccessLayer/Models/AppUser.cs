using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Models
{
    public class AppUser : IdentityUser
    {
        [Key]
        public int AppUserId { get; set; }

        [Required(ErrorMessage = "AppUser deleted is required")]
        public bool IsDeleted { get; set; }

        [Required]
        public string? DisplayName { get; set; }
    }
}
