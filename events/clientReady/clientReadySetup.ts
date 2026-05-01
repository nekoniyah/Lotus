import { TemplateEvent } from "../../utils/typers";

import * as tables from "../../src/db/schema";
import db from "../../utils/db";

export default TemplateEvent<"clientReady">(async (client) => {
  const guilds = await client.guilds.fetch();

  for (let [_, oauthGuild] of guilds) {
    const guild = await oauthGuild.fetch();

    const registeredGuilds = await db.select().from(tables.guilds);
    const registeredGuild = registeredGuilds.find((g) => g.id == guild.id);

    if (!registeredGuild) {
      await db.insert(tables.guilds).values({ id: guild.id });

      try {
        await db.insert(tables.currencies).values({ guildId: guild.id });
      } catch (e) {
        console.error(e);
      }
    }
  }
});
