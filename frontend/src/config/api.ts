export const apiUrl =
  import.meta.env.DEV
    ? "http://localhost:46118/umbraco/delivery/api/v2"
    : import.meta.env.PUBLIC_API_URL ?? "https://api.sakukarttunen.com";
