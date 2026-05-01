import "dotenv/config";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextChannel,
} from "discord.js";
import { TemplateEvent } from "../../utils/typers";
import db from "../../utils/db";
import { starboards } from "../../src/db/schema";
import { eq } from "drizzle-orm";
import embeds from "../../utils/embeds";

export default TemplateEvent<"messageReactionAdd">(async (reaction, user) => {
  if (!reaction.message.guild) return;
  if (user.bot) return;
  if (reaction.message.author!.bot) return;

  if (reaction.emoji.name !== "⭐") return;

  const starboard = db
    .select()
    .from(starboards)
    .where(eq(starboards.guildId, reaction.message.guild.id))
    .get();

  if (!starboard) return;

  const users = await reaction.users.fetch();
  if (users.size < starboard.goal!) return;

  // Retrieve all existing starboard messages to not repost again

  let found = false;
  const channel = (await reaction.message.guild.channels.fetch(
    starboard.channelId,
  )) as TextChannel;

  if (reaction.message.channel.id === starboard.channelId) return;
  const message = await reaction.message.fetch();

  for (let [_, msg] of await channel.messages.fetch()) {
    if (msg.embeds.length && msg.embeds[0]!.footer) {
      const footer = msg.embeds[0]!.footer!; // Should be message ID.
      if (message.id === footer.text) found = true;
    }
  }

  if (found) return;

  const embed = embeds
    .base()
    .setThumbnail(message.author.displayAvatarURL())
    .setDescription(message.content ? message.content : null)
    .setImage(
      message.attachments.first() ? message.attachments.first()!.url : null,
    )
    .setFooter({ text: message.id })
    .setTitle(message.author.displayName);

  const linkButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Link)
    .setURL(message.url)
    .setLabel("Go To Message");

  const text = `**:star: ${users.size}** - Posted in ${message.channel} by ${message.author}.`;

  await channel.send({
    content: text,
    embeds: [embed],
    components: [new ActionRowBuilder().addComponents(linkButton).toJSON()],
  });
});
