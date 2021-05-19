import app from "./app";

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
  console.log(
    "  App is running on port %d in %s mode and should be available at %s",
    app.get("port"),
    app.get("env"),
    process.env.EXTERNAL_HOST_URL
  );
  console.log("  Press CTRL-C to stop\n");
});

export default server;
