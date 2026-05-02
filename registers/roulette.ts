import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
  .setName("russian-roulette")
  .setDescription("Gains 1.5x your bet if you don't get shot!")
  .addNumberOption((o) =>
    o
      .setName("money")
      .setDescription("The amount of money you bet")
      .setRequired(true),
  )
  .addNumberOption((o) =>
    o
      .setName("pick")
      .setDescription("Pick a number between 1-6.")
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(6),
  );
