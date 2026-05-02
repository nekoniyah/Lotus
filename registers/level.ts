import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
  .setName("level")
  .setDescription("See level and experience of a user")
  .addUserOption((opt) => opt.setName("user").setDescription("User."));
