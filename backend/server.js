const app = require("./app")
const connectDB = require("./src/db")
const { port, cronEnabled } = require("./src/config")
const { startCron } = require("./src/cron/jobs")

connectDB().then(() => {
  if (cronEnabled) startCron()
  app.listen(port, () => {
    console.log(`AdFlow Pro server is running on port ${port}`)
  })
}).catch((error) => {
  console.log(error)
})


