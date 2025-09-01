FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app/portfolio

# copy the most needed files first
# this is so that the caching will work nicely
COPY Program.cs ./
COPY backend.csproj ./
# restore as distinct layers
RUN dotnet restore

# copy everything else
COPY . ./

# Build and publish a release
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app/portfolio
COPY --from=build /app/portfolio/out .
ENTRYPOINT ["dotnet", "backend.dll"]
