# Saku's portfolio site

## Setup

Remember to set the two following environment variables 
safely in environment variables folder:

```
# for the email functionality to work
UMBRACO__CMS__GLOBAL__SMTP__USERNAME
UMBRACO__CMS__GLOBAL__SMTP__PASSWORD
# for the re-building pipeline to work
Webhook__Secret
Github__Token
```

If you use flakes, you can just place them in a `.env` file
in the [backend](./backend) folder. They will be set
when you run nix develop.

## TODOs

- [ ] Improve the README
- [ ] Make the cors use a composer and take the allwed urls from appsettings.json
