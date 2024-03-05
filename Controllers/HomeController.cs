using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
//using Basic_sale_system.Models;
namespace Basic_sale_system.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult FrontPage()
        {
            return View();
        }

        public ActionResult Index()
        {

            return View();
        }
       


        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}