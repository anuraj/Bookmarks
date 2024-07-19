var builder = DistributedApplication.CreateBuilder(args);

var mongo = builder.AddMongoDB("mongo")
    .WithMongoExpress()
    .WithVolume("BookmarksData", "/data/db")
    .AddDatabase("BookmarksDb");

var api = builder.AddProject<Projects.Bookmarks_Api>("bookmarksApi")
    .WithReference(mongo);

var web = builder.AddNpmApp("BookmarksWeb", "../Bookmarks.Web")
    .WithEndpoint(scheme: "http", port: 3000, env: "PORT")
    .WithReference(api).PublishAsDockerFile();

builder.Build().Run();
