using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BulkyBook.Models.ViewModels
{
    public class ApplicationUserVM
    {
        public ApplicationUser ApplicationUser { get; set; }
        public IEnumerable<SelectListItem> CompanyList { get; set; }
        
    }
}
