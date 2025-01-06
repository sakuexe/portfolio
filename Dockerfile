FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /App

# Copy the most needed files first
# this is so that the caching will work nicely
COPY Program.cs ./
COPY fullstack-portfolio.csproj ./
COPY fullstack-portfolio.sln ./

# Restore as distinct layers
RUN dotnet restore

# get the tailwindcss executable
RUN curl -sLO https://github.com/tailwindlabs/tailwindcss/releases/download/v3.4.4/tailwindcss-linux-x64
RUN mv tailwindcss-linux-x64 tailwindcss
RUN chmod u+x ./tailwindcss

# Copy everything else
COPY . ./

# Run tailwindcss to generate the main css file (minified)
RUN ./tailwindcss -i ./wwwroot/css/site.css -o ./wwwroot/css/tailwind.css --minify
# Build and publish a release
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /App
COPY --from=build-env /App/out .
ENTRYPOINT ["dotnet", "fullstack-portfolio.dll"]
