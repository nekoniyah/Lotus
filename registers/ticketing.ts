import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

export default new SlashCommandBuilder()
  .setName("ticketing")
  .setDescription("Setup ticketing system")
  .addChannelOption((opt) =>
    opt
      .setName("channel")
      .setDescription("Channel for the ticket panel.")
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true),
  )
  .addRoleOption((opt) =>
    opt
      .setName("role")
      .setDescription("Mod role that can access/help in tickets")
      .setRequired(true),
  )
  .addChannelOption((opt) =>
    opt
      .setName("category")
      .setDescription("Category channel where tickets will be created.")
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildCategory),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);
