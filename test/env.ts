// Load .env values into process.env before jest runs tests.
// Kept in its own setup file so jest config can live inline in package.json
// (package.json is JSON and can't execute `dotenv.config()`).
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config();
