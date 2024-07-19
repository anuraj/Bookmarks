var builder = DistributedApplication.CreateBuilder(args);

var mongo = builder.AddMongoDB("mongo")
    .WithMongoExpress()
    .WithVolume("bookmarks-data", "/data/db")
    .AddDatabase("BookmarksDb");

var api = builder.AddProject<Projects.Bookmarks_Api>("bookmarks-api")
    .WithReference(mongo);

var web = builder.AddNpmApp("bookmarks-web", "../Bookmarks.Web")
    .WithEndpoint(scheme: "http", port: 3000, env: "PORT")
    .WithReference(api).PublishAsDockerFile();

builder.Build().Run();
