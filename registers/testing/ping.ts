import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Test the latency of this bot.");
