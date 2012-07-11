using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TegudUtilities
{
    public static class Extensions
    {
        public static string ToMonthName(this int monthNumber)
        {
            var dateTime = new DateTime(1900, monthNumber, 1);

            return dateTime.ToString("MMMM");
        }
    }
}
