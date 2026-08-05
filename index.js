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

app.command("/breakroom-joke", async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get(
      "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&format=txt",
    );
    await respond({ text: response.data });
  } catch (err) {
    await respond({
      text: "Why did the chicken cross the road? \n I don't know...",
    });
  }
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();
