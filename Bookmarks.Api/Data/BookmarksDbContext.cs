using Bookmarks.Api.Models;

using Microsoft.EntityFrameworkCore;

namespace Bookmarks.Api.Data
{
    public class BookmarksDbContext : DbContext
    {
        public BookmarksDbContext(DbContextOptions options) : base(options)
        {
        }

        protected BookmarksDbContext()
        {
        }

        public DbSet<LinkEntity>? Links { get; set; } = null!;
    }
}
