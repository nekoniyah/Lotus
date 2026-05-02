import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
  .setName("remove-quiz")
  .setDescription("Delete a quiz.")
  .addNumberOption((o) =>
    o
      .setName("id")
      .setDescription("The id of the quiz to remove.")
      .setRequired(true),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents);
