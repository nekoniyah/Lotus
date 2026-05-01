import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  CategoryChannel,
  ChatInputCommandInteraction,
  TextChannel,
} from "discord.js";
import embeds from "../../utils/embeds";
import { createReadStream } from "fs";
import path from "path";
import db from "../../utils/db";
import { ticketings } from "../../src/db/schema";
import { eq } from "drizzle-orm";

const ticketing = async (interaction: ChatInputCommandInteraction) => {
  const channel = interaction.options.getChannel(
    "channel",
    true,
  ) as TextChannel;

  const categoryChannel = interaction.options.getChannel(
    "category",
    true,
  ) as CategoryChannel;

  const role = interaction.options.getRole("role", true);

  await interaction.reply({ content: "OK!", flags: ["Ephemeral"] });

  const embed = embeds
    .base({ icon: interaction.guild!.iconURL() || undefined })
    .setImage("attachment://ticketing.png")
    .setTitle("Open a Ticket")
    .setDescription("Press the button to ask moderators help!");

  const button = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary)
    .setCustomId("ticket-panel-button")
    .setEmoji("🎟️")
    .setLabel("New Ticket");

  const attachment = new AttachmentBuilder(
    createReadStream(path.join(process.cwd(), "assets", "ticketing.png")),
  ).setName("ticketing.png");

  const message = await channel.send({
    embeds: [embed],
    components: [new ActionRowBuilder().setComponents(button).toJSON()],
    files: [attachment],
  });

  const id = message.id;

  const foundOne = db
    .select()
    .from(ticketings)
    .where(eq(ticketings.guildId, interaction.guildId!))
    .get();

  if (foundOne) {
    await db
      .update(ticketings)
      .set({
        categoryId: categoryChannel.id,
        modRoleId: role.id,
        guildId: interaction.guildId!,
        messageId: id,
        panelId: channel.id,
      })
      .where(eq(ticketings.guildId, interaction.guildId!));
  } else {
    await db.insert(ticketings).values({
      categoryId: categoryChannel.id,
      modRoleId: role.id,
      guildId: interaction.guildId!,
      messageId: id,
      panelId: channel.id,
    });
  }
};

export default ticketing;
