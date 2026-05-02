import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
  .setName("list-quiz")
  .setDescription("Get list of quizzes with ID.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents);
