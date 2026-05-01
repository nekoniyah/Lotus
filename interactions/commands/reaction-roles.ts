import { ChatInputCommandInteraction, TextChannel } from "discord.js";
import { writeFileSync } from "fs";
import path from "path";
import embeds from "../../utils/embeds";
import db from "../../utils/db";
import { reactionRoles } from "../../src/db/schema";
export default async function (interaction: ChatInputCommandInteraction) {
  const sc = interaction.options.getSubcommand(true);

  if (sc === "add") {
    const channel = interaction.options.getChannel("channel", true);
    const message_id = interaction.options.getString("message_id", true);
    const role = interaction.options.getRole("role", true);
    const emoji = interaction.options.getString("emoji", true);

    await db.insert(reactionRoles).values({
      channelId: channel.id,
      messageId: message_id,
      emoji,
      roleId: role.id,
      guildId: interaction.guild!.id,
    });

    await interaction.reply({
      content: `> :white_check_mark: Ok!`,
    });

    const ch = (await interaction.guild!.channels.fetch(
      channel.id,
    )) as TextChannel;

    const msg = await ch.messages.fetch(message_id);
    msg.react(emoji);
  }

  if (sc === "send") {
    const channel = (interaction.options.getChannel("channel") ??
      interaction.channel) as TextChannel;

    const text = interaction.options.getString("description");
    const image = interaction.options.getAttachment("image");

    let embed = embeds
      .base(interaction.client)
      .setThumbnail(interaction.guild!.iconURL())
      .setDescription(text)
      .setAuthor(null)
      .setFooter({
        text: interaction.guild!.name,
        iconURL: interaction.guild!.iconURL() || undefined,
      });

    if (image && image.contentType!.startsWith("image")) {
      embed.setImage(image.url);
    }

    const message = await channel.send({ embeds: [embed] });

    await interaction.reply({
      content: `> :white_check_mark: Ok! Message ID is \`${message.id}\``,
    });
  }
}
