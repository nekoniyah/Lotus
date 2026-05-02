import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
  .setName("admin-purse")
  .setDescription("Manage purse of members")

  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand((opt) =>
    opt
      .setName("give")
      .setDescription("Give money to member")
      .addNumberOption((opt) =>
        opt.setName("amount").setDescription("Amount").setRequired(true),
      )
      .addUserOption((opt) => opt.setName("user").setDescription("User.")),
  );
