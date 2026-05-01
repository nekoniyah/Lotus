import { renderComponentToPng } from "../../utils/renderer";
import "dotenv/config";
import { AttachmentBuilder, TextChannel } from "discord.js";
import { TemplateEvent } from "../../utils/typers";
import { welcomers } from "../../src/db/schema";
import db from "../../utils/db";
import { eq } from "drizzle-orm";
import * as embeds from "../../utils/embeds";

export default TemplateEvent<"guildMemberAdd">(async (member) => {
  const guildWelcomer = db
    .select()
    .from(welcomers)
    .where(eq(welcomers.guildId, member.guild.id))
    .get();

  if (!guildWelcomer) return;

  let buffer = await renderComponentToPng("Welcome", { member });

  const channel = (await member.guild.channels.fetch(
    guildWelcomer.channelId,
  )) as TextChannel;

  const embed = embeds
    .base({ user: member.client.user })
    .setImage("attachment://welcome-banner.png");

  await channel.send({
    content: `<@${member.user.id}>`,
    embeds: [embed],
    files: [new AttachmentBuilder(buffer).setName("welcome-banner.png")],
  });
});
