using AngleSharp.Io;
using AngleSharp;

using Bookmarks.Api.Data;
using Bookmarks.Api.Models;
using Bookmarks.Api.ViewModels;

using FluentValidation;

using Microsoft.AspNetCore.Mvc;

using MongoDB.Bson;
using Microsoft.EntityFrameworkCore;
using Bookmarks.Api.ViewModels.Extensions;

namespace Bookmarks.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class BookmarksController(ILogger<BookmarksController> logger, IValidator<Link> linkValidator, BookmarksDbContext bookmarksDbContext) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateLink(Link link, CancellationToken cancellationToken)
    {
        var validationResult = linkValidator.Validate(link);

        if (!validationResult.IsValid)
        {
            logger.LogWarning("Validation failed for {@Link}", link);
            return BadRequest(validationResult.Errors);
        }

        var linkEntity = new LinkEntity
        {
            Url = link.Url!,
            ImageUrl = link.ImageUrl,
            Description = link.Description,
            CreatedOn = DateTime.UtcNow,
            Title = link.Title,
        };

        await bookmarksDbContext.Links!.AddAsync(linkEntity, cancellationToken);
        var inserted = await bookmarksDbContext.SaveChangesAsync(cancellationToken) != 0;
        if (inserted)
        {
            return CreatedAtAction(nameof(GetLink), new { id = linkEntity.Id }, linkEntity);
        }

        logger.LogError("Failed to insert {@Link}", linkEntity);
        return BadRequest();
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetLink(string id, CancellationToken cancellationToken = default)
    {
        var linkEntity = await bookmarksDbContext.Links!.FindAsync([ObjectId.Parse(id)], cancellationToken: cancellationToken);
        if (linkEntity is null)
        {
            logger.LogWarning("Link with id {Id} not found", id);
            return NotFound();
        }

        return Ok(linkEntity);
    }

    [HttpGet]
    public async Task<IActionResult> GetLinks(int pageNumber = 1, int pageSize = 5, CancellationToken cancellationToken = default)
    {
        var links = await bookmarksDbContext.Links!
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedOn)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new Link
            {
                Url = x.Url,
                Title = x.Title,
                Description = x.Description,
                ImageUrl = x.ImageUrl,
                Id = x.Id.ToString(),
                CreatedOn = x.CreatedOn
            })
            .ToListAsync(cancellationToken);
        var totalLinks = await bookmarksDbContext.Links!.CountAsync(cancellationToken);
        Response.Headers.Append("X-Total-Count", totalLinks.ToString());
        return Ok(links);
    }

    [HttpGet("preview")]
    public async Task<IActionResult> GetOpenGraphPreview([FromQuery] string url)
    {
        if (string.IsNullOrEmpty(url))
        {
            logger.LogWarning("Url is required");
            return BadRequest("Url is required");
        }

        var config = Configuration.Default.WithDefaultLoader(new LoaderOptions { IsResourceLoadingEnabled = true });
        var context = BrowsingContext.New(config);
        var document = await context.OpenAsync(url);

        var ogTitle = document.QuerySelector("meta[property='og:title']")?.GetAttribute("content");
        var ogDescription = document.QuerySelector("meta[property='og:description']")?.GetAttribute("content");
        var ogImage = document.QuerySelector("meta[property='og:image']")?.GetAttribute("content");

        var title = !string.IsNullOrEmpty(ogTitle) ? ogTitle : document.Title;

        return Ok(new Link
        {
            Url = url,
            Description = ogDescription,
            ImageUrl = ogImage,
            Title = title,
        });
    }
}
