import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

export default new SlashCommandBuilder()
  .setName("starboard")
  .setDescription("Setup starboard")
  .addNumberOption((opt) =>
    opt
      .setName("minimum_stars")
      .setDescription(
        "Set minimum of stars for a message to be in the starboard channel.",
      )
      .setRequired(true),
  )
  .addChannelOption((opt) =>
    opt
      .setName("channel")
      .setDescription(
        "Set starboard channel in which starred mesages will be sent.",
      )
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);
