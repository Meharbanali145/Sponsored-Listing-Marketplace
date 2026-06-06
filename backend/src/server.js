const app = require("./app");
const connectDB = require("./db");
const { port, cronEnabled } = require("./config");
const { startCron } = require("./cron/jobs");

connectDB().then(() => {
  if (cronEnabled) startCron();
  app.listen(port, () => console.log(`AdFlow Pro API running on http://localhost:${port}`));
}).catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
