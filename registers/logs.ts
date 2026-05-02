import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

export default new SlashCommandBuilder()
  .setName("logs")
  .setDescription("Setup logging system")
  .addChannelOption((opt) =>
    opt
      .setName("channel")
      .setDescription(
        "Tickets created and mod stuff will be sent in that channel.",
      )
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);
