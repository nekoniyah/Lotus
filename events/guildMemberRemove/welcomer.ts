import "dotenv/config";
import { TextChannel } from "discord.js";
import { TemplateEvent } from "../../utils/typers";
import { welcomers } from "../../src/db/schema";
import db from "../../utils/db";
import { eq } from "drizzle-orm";
import * as embeds from "../../utils/embeds";

export default TemplateEvent<"guildMemberRemove">(async (member) => {
  const guildWelcomer = db
    .select()
    .from(welcomers)
    .where(eq(welcomers.guildId, member.guild.id))
    .get();

  if (!guildWelcomer) return;

  const channel = (await member.guild.channels.fetch(
    guildWelcomer.channelId,
  )) as TextChannel;

  const embed = embeds
    .base()
    .setThumbnail(member.displayAvatarURL())
    .setDescription(`Goodbye ${member.user.username} :/`);

  await channel.send({
    embeds: [embed],
  });
});
