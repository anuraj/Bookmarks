var builder = DistributedApplication.CreateBuilder(args);

var api = builder.AddProject<Projects.Bookmarks_Api>("bookmarks-api");

var web = builder.AddNpmApp("bookmarks-web", "../Bookmarks.Web")
    .WithEndpoint(scheme: "http", port: 3000, env: "PORT")
    .WithReference(api).PublishAsDockerFile();

builder.Build().Run();
