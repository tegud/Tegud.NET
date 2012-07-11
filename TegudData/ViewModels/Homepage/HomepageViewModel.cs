using System;
using System.Collections.Generic;
using System.Linq;
using TegudData.Models.Blog;
using TegudData.Models.BlogModel;
using TegudData.Repository.Blog;
using TegudData.ViewModels.Blog;

namespace TegudData.ViewModels.Homepage
{
    public class HomepageViewModel
    {
        public readonly IEnumerable<IGrouping<DateTime, BlogItemViewModel>> BlogList;

        public readonly string Title;

        public readonly BlogArchive BlogArchive;

        public readonly IEnumerable<TagCloudViewModel> TagCloud;

        public HomepageViewModel(IEnumerable<BlogEntryForList> blogList, string title, BlogArchive blogArchive, IEnumerable<TagCloudViewModel> tagCloud)
        {
            BlogList = blogList.GroupBy(b => b.PostedAt.Date, b => new BlogItemViewModel(b)).OrderByDescending(l => l.Key);
            Title = title;
            BlogArchive = blogArchive;
            TagCloud = tagCloud;
        }
    }
}
