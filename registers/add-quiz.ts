import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
  .setName("add-quiz")
  .setDescription("Create a quiz.")
  .addStringOption((q) =>
    q.setName("question").setDescription("Question.").setRequired(true),
  )

  .addStringOption((o) =>
    o
      .setName("options")
      .setDescription("Option list seperated by comma (,)")
      .setRequired(true),
  )
  .addStringOption((o) =>
    o
      .setName("answer")
      .setDescription("Right option to answer")
      .setRequired(true),
  )
  .addNumberOption((o) =>
    o
      .setName("amount")
      .setDescription("Amount of money to reward.")
      .setRequired(true),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
