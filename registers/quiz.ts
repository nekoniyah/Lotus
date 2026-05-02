import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
  .setName("quiz")
  .setDescription(
    "Answer the quiz of the day! Get rewards if you have the right answer!",
  );
