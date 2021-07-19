using BulkyBook.DataAccess.Repository.IRepository;
using BulkyBook.Models;
using BulkyBook.Models.ViewModels;
using BulkyBook.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BulkyBook.Areas.Customer.Controllers
{
    [Area("Customer")]
    public class CartController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailSender _emailSender;
        private readonly UserManager<IdentityUser> _userManager;

        public ShoppingCartVM ShoppingCartVM { get; set; }

        public CartController(IUnitOfWork unitOfWork, IEmailSender emailSender, UserManager<IdentityUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _emailSender = emailSender;
            _userManager = userManager;
        }        
        public IActionResult Index()
        {
            var claimsIdentity = (ClaimsIdentity)User.Identity;
            var claim = claimsIdentity.FindFirst(ClaimTypes.NameIdentifier);
            ShoppingCartVM = new ShoppingCartVM()
            {
                OrderHeader = new Models.OrderHeader(),
                ListCart = _unitOfWork.ShoppingCart.GetAll(u=>u.ApplicationUserId==claim.Value, includeProperties: "Product")
            };
            ShoppingCartVM.OrderHeader.OrderTotal = 0;
            ShoppingCartVM.OrderHeader.ApplicationUser = _unitOfWork.ApplicationUser.
                                                        GetFirstOrDefault(u => u.Id == claim.Value, 
                                                        includeProperties:"Company");
            foreach(var list in ShoppingCartVM.ListCart)
            {
                list.Price = SD.GetPriceBasedOnQuantity(list.Count, list.Product.Price, 
                                                        list.Product.Price50, list.Product.Price100);
                ShoppingCartVM.OrderHeader.OrderTotal += (list.Price * list.Count);
                list.Product.Description = SD.ConvertToRawHtml(list.Product.Description);
                if (list.Product.Description.Length > 100)
                {
                    list.Product.Description = list.Product.Description.Substring(0, 99) + "...";
                }
            }
            return View(ShoppingCartVM);
        }
        public IActionResult Plus(int cartId)
        {
            var cartFromDB = _unitOfWork.ShoppingCart.GetFirstOrDefault(u => u.Id == cartId, includeProperties:"Product");
            cartFromDB.Count++;
            cartFromDB.Price = SD.GetPriceBasedOnQuantity(cartFromDB.Count, 
                                                            cartFromDB.Product.Price, cartFromDB.Product.Price50, cartFromDB.Product.Price100);
            _unitOfWork.Save();
            return RedirectToAction(nameof(Index));
        }
        public IActionResult Minus(int cartId)
        {
            var cartFromDB = _unitOfWork.ShoppingCart.GetFirstOrDefault(u => u.Id == cartId, includeProperties: "Product");
            if(cartFromDB.Count == 1)
            {
                int count = _unitOfWork.ShoppingCart.GetAll(u => u.ApplicationUserId == cartFromDB.ApplicationUserId).ToList().Count;
                _unitOfWork.ShoppingCart.Remove(cartId);
                HttpContext.Session.SetInt32(SD.ssShoppingCart, count - 1);
            }
            else
            {
                cartFromDB.Count--;
                cartFromDB.Price = SD.GetPriceBasedOnQuantity(cartFromDB.Count,
                                                            cartFromDB.Product.Price, cartFromDB.Product.Price50, cartFromDB.Product.Price100);
            }            
            _unitOfWork.Save();
            return RedirectToAction(nameof(Index));
        }
        public IActionResult Remove(int cartId)
        {
            var cartFromDB = _unitOfWork.ShoppingCart.GetFirstOrDefault(u => u.Id == cartId, includeProperties: "Product");
            int count = _unitOfWork.ShoppingCart.GetAll(u => u.ApplicationUserId == cartFromDB.ApplicationUserId).ToList().Count;
            _unitOfWork.ShoppingCart.Remove(cartFromDB);
            HttpContext.Session.SetInt32(SD.ssShoppingCart, count - 1);
            
            return RedirectToAction(nameof(Index));
        }

    }
}