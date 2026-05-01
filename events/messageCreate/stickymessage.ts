import "dotenv/config";
import { TemplateEvent } from "../../utils/typers";
import db from "../../utils/db";
import { stickyMessages } from "../../src/db/schema";
import { and, eq } from "drizzle-orm";
import embeds from "../../utils/embeds";

export default TemplateEvent<"messageCreate">(async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const allStickyMessages = await db
    .select()
    .from(stickyMessages)
    .where(
      and(
        eq(stickyMessages.guildId, message.guild.id),
        eq(stickyMessages.channelId, message.channel.id),
      ),
    )
    .all();

  if (!allStickyMessages.length) return;

  allStickyMessages.forEach(async (thisChannelStickyMsg) => {
    try {
      const lastInstance = await message.channel.messages.fetch(
        thisChannelStickyMsg.messageId!,
      );

      await lastInstance.delete();
    } catch {}

    const embed = embeds
      .base()
      .setThumbnail(null)
      .setDescription(thisChannelStickyMsg.content);

    const newMessage = await message.channel.send({ embeds: [embed] });

    await db
      .update(stickyMessages)
      .set({ messageId: newMessage.id })
      .where(eq(stickyMessages.channelId, message.channel.id));
  });
});
