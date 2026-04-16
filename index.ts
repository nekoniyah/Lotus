import "dotenv/config";
import { Client, Partials, type ClientEvents } from "discord.js";
import loadDirectoryList from "./utils/loadDirectoryList";
import path from "node:path";
import type { TemplateEvent } from "./utils/typers";

const client = new Client({
  intents: ["GuildMembers", "GuildPresences", "Guilds"],
  partials: [Partials.GuildMember, Partials.Channel, Partials.User],
});

const eventsPath = path.join(process.cwd(), "events");
const events = await loadDirectoryList(eventsPath, eventsPath);

(async () => {
  for (let key in events) {
    for (let path of events[key]!) {
      const { default: event } = await import(path);
      client.on(key, event as typeof TemplateEvent<keyof ClientEvents>);
    }
  }

  await client.login(process.env.TOKEN);
})();
