# Fullstack Portfolio Website

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

4. Update the environment variables in the docker-compose file

5. Add your domain to the Caddyfile
```bash
# Caddyfile
yourdomain.com {
    reverse_proxy dotnet:80
}
# with a quick sed command
sed -i 's/sakukarttunen.com/yourdomain.cool/g' caddy/Caddyfile
```

5. Run docker compose

This will build the images and run the containers in the background
```bash
docker compose up --build -d
```

6. Visit your domain

It should now have SSL certificates and have base data from the database.
The initial build will take a while, when caddy has to get the certificates from Let's Encrypt.

7. (Optional) Run the docker compose automatically on boot

All you have to do is add a symbolic link to `/etc/systemd/system/` and enable the service
```bash
sudo ln -s $(pwd)/portfolio-docker.service /etc/systemd/system/
sudo systemctl enable portfolio-docker
sudo systemctl start portfolio-docker # if you haven't yet started the service
sudo systemctl status portfolio-docker
```
