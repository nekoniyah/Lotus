import { TextChannel } from "discord.js";
import { TemplateEvent } from "../../utils/typers";
import db from "../../utils/db";
import { ticketings } from "../../src/db/schema";
import { eq } from "drizzle-orm";
import embeds from "../../utils/embeds";
import { LogTicketDelete } from "../../utils/logs";

export default TemplateEvent<"interactionCreate">(async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId !== "close-ticket-button") return;

  const ticketing = db
    .select()
    .from(ticketings)
    .where(eq(ticketings.guildId, interaction.guildId!))
    .get();

  if (!ticketing) return;

  const member = await interaction.guild!.members.fetch(interaction.user.id);

  if (!member.roles.cache.get(ticketing.modRoleId!)) {
    const embed = embeds
      .error("Moderators only")
      .setDescription(
        "You can't close your ticket. Ask for the moderators to do so.",
      );

    if (interaction.replied) await interaction.deleteReply();
    await interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });

    return;
  }

  let originalOwner = interaction.guild!.members.cache.find(
    (m) => m.user.username === (interaction.channel as TextChannel).name,
  );

  await LogTicketDelete(interaction.channel as TextChannel, originalOwner!);

  await interaction.channel!.delete();
});
