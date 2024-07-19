using MongoDB.Bson;

namespace Bookmarks.Api.Models
{
    public class LinkEntity
    {
        public ObjectId Id { get; set; } = ObjectId.GenerateNewId();
        public string? Title { get; set; }
        public required string Url { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    }
}
