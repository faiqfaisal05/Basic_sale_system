using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
//using Basic_sale_system.Models;
namespace Basic_sale_system.Controllers
{
    public class HomeController : Controller
    {
        // data base fun 
        string cs = ConfigurationManager.ConnectionStrings["SaleDB"].ConnectionString;
        public ActionResult FrontPage()
        {

            return View();
        }

        public ActionResult Index()
        {
            // data base fun 
            using (SqlConnection con = new SqlConnection(cs))
            {
                con.Open();

                con.Close();
            }
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