using System;

namespace TegudData.Models.BlogModel
{
    public class BlogArchiveMonth
    {
        public readonly int Month;

        private static readonly string[] _months = new[] { "Janurary", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" };

        public string MonthName
        {
            get
            {
                return _months[Month - 1];
            }
        }

        public readonly int Posts;

        public BlogArchiveMonth(int month, int posts)
        {
            Month = month;
            Posts = posts;
        }
    }
}