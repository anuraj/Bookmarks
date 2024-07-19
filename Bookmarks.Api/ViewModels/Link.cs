namespace Bookmarks.Api.ViewModels
{
    public class Link
    {
        public string? Id { get; set; }
        public string? Url { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
