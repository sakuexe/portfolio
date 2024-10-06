# Fullstack Portfolio Website

## Technologies

- ASP.NET Core | [ASP.NET Core - Microsoft](https://dotnet.microsoft.com/en-us/apps/aspnet)
- MongoDB | [MongoDB: The Developer Data Platform](https://www.mongodb.com/)
- xUnit | [Unit testing C# in .NET using dotnet test and xUnit - Microsoft](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-with-dotnet-test)
- Docker & Docker Compose | [Docker Docs - Docker](https://docs.docker.com/)
- Traefik | [Traefik, The Cloud Native Application Proxy - Traefik Labs](https://traefik.io/traefik/)
- Watchtower | [Watchtower - containrrr.dev](https://containrrr.dev/watchtower/)

## Running the project in development

1. Clone the repository
```bash
git clone https://github.com/sakuexe/portfolio.git
```

2. Install the dependencies
```bash
cd portfolio
dotnet restore
npm ci
```

3. Run the project
```bash
dotnet run
```

4. For Development, run the project in watch mode
```bash
# run the project in watch mode
npm run dev & dotnet watch
```

## Deployment

1. Clone the project
```bash
git clone https://github.com/sakuexe/portfolio.git
```

2. Use the `example.env` file to add a `.env` file to the root of the project

```bash
cd portfolio
mv ./example.env.txt ./.env
# edit the contents to your needs
vi .env
# or if you're a weirdo
nano .env
```

3. Install docker

Guide for Ubuntu:
[Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)

5. Update the docker-compose to include your domain name, instead of mine
```bash
# replace myepicwebsite.cool with your domain
echo "myepicwebsite.cool" | xargs -I {} sed -i 's/sakukarttunen.com/{}/g' docker-compose.yml
```

5. Run docker compose

This will build the images and run the containers in the background
```bash
docker compose up --build -d
# check that all went well
docker logs portfolio-1
```

6. Visit your domain

It should now have SSL certificates and include base data in the database.
The initial build will take a while, when traefik has to get the certificates from Let's Encrypt.

## Other commands

- Check the size of the docker image

```bash
docker manifest inspect -v ghcr.io/sakuexe/portfolio:prod | grep size | awk -F ':' '{sum+=$NF} END {print sum}' | numfmt --to=iec-i
```
