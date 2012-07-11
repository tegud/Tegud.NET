using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TegudData.Models.Blog;

namespace TegudData.ViewModels.Blog
{
    public abstract class BlogItemViewModelBase
    {
        public readonly int ID;

        public readonly string Title;

        public string Url
        {
            get { return _url.ToString(); }
        }

        public readonly string Category;

        public readonly IEnumerable<BlogTagViewModel> Tags;

        public readonly DateTime PostedAt;

        public readonly string Author;

        public readonly IHtmlString Content;

        private readonly BlogItemLink _url;

        protected BlogItemViewModelBase(BlogEntry blog)
        {
            ID = blog.ID;
            Title = blog.Title;
            Category = blog.Category.Name;
            Tags = blog.Tags.Select(t => new BlogTagViewModel(t.Name));
            PostedAt = blog.PostedAt;
            Author = blog.Author.FullName;
            Content = new HtmlString(blog.Text);

            _url = new BlogItemLink(ID, Title);
        }
    }
}