import "dotenv/config";
import { Client, Partials, type ClientEvents } from "discord.js";
import loadDirectoryList from "./utils/loadDirectoryList";
import path from "path";
import type { TemplateEvent } from "./utils/typers";

const client = new Client({
  intents: [
    "GuildMembers",
    "GuildPresences",
    "Guilds",
    "MessageContent",
    "GuildMessages",
  ],
  partials: [
    Partials.GuildMember,
    Partials.Channel,
    Partials.User,
    Partials.Message,
    Partials.User,
  ],
});

const eventsPath = path.join(process.cwd(), "events");
const events = await loadDirectoryList(eventsPath, eventsPath);

(async () => {
  for (let key in events) {
    console.log(key);
    for (let path of events[key]!) {
      console.log(path);
      const { default: event } = await import(path);
      try {
        client.on(key, event as typeof TemplateEvent<keyof ClientEvents>);
      } catch (e) {
        console.error(e);
      }
    }
  }

  await client.login(process.env.TOKEN);
})();
