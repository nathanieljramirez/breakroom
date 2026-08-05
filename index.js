require("dotenv").config();
const axios = require("axios");

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

app.command("/breakroom-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/breakroom-decide", async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get("https://www.eightballapi.com/api");
    await respond({ text: response.data.reading });
  } catch (err) {
    await respond({ text: "Definitely not." });
  }
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();
