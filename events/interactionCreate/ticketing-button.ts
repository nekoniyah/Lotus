import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CategoryChannel,
  ChannelType,
  GuildMember,
} from "discord.js";
import { LogTicketCreate } from "../../utils/logs";
import { TemplateEvent } from "../../utils/typers";
import db from "../../utils/db";
import { ticketings } from "../../src/db/schema";
import { eq } from "drizzle-orm";
import embeds from "../../utils/embeds";
export default TemplateEvent<"interactionCreate">(async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId !== "ticket-panel-button") return;
  const ticketing = db
    .select()
    .from(ticketings)
    .where(eq(ticketings.guildId, interaction.guildId!))
    .get();

  if (!ticketing) return;

  const categorychannel = (await interaction.guild?.channels.fetch(
    ticketing.categoryId!,
  )) as CategoryChannel;

  const children = categorychannel.children;

  const memberChannel = children.cache.find(
    (c) => c.name === interaction.user.username,
  );

  if (memberChannel) {
    let embed = embeds.error(
      `You have an existing ticket ongoing at <#${memberChannel.id}>`,
    );

    if (interaction.replied) await interaction.deleteReply();
    await interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });
    return;
  } else {
    const channel = await children.create({
      name: interaction.user.username,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        { id: interaction.guild!.roles.everyone, deny: ["ViewChannel"] },
        { id: interaction.user.id, allow: ["ViewChannel"] },
        { id: ticketing.modRoleId!, allow: ["ViewChannel"] },
        { id: interaction.client.user.id, allow: ["ViewChannel"] },
      ],
    });

    const closeButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Danger)
      .setLabel("Close")
      .setEmoji("❌")
      .setCustomId("close-ticket-button");

    const modEmbed = embeds
      .base()
      .setTitle(`${interaction.user.displayName}'s Ticket`)
      .setDescription(
        `${interaction.user}, please provide as much details as needed for your request.`,
      );

    const row = new ActionRowBuilder().setComponents(closeButton);
    await channel.send({
      content: `<@&${ticketing.modRoleId}>`,
      embeds: [modEmbed],
      components: [row.toJSON()],
    });

    let successEmbed = embeds.success(`Channel created at <#${channel.id}>`);
    if (interaction.replied) await interaction.deleteReply();
    await interaction.reply({ embeds: [successEmbed], flags: ["Ephemeral"] });
    await LogTicketCreate(channel, interaction.member as GuildMember);
  }
});
