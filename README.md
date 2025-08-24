Remember to set the two following environment variables 
safely in environment variables folder:

```
UMBRACO__CMS__GLOBAL__SMTP__USERNAME
UMBRACO__CMS__GLOBAL__SMTP__PASSWORD
```

If you use flakes, you can just place them in a `.env` file
in the [backend](./backend) folder. They will be set
when you run nix develop.
