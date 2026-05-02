import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

export default new SlashCommandBuilder()
  .setName("reaction-roles")
  .setDescription("Setup reaction-roles")
  .addSubcommand((sc) =>
    sc
      .setName("add")
      .setDescription("Add a reaction-role")
      .addChannelOption((ch) =>
        ch.setName("channel").setDescription("Channel").setRequired(true),
      )
      .addStringOption((s) =>
        s
          .setName("message_id")
          .setDescription("Set a message ID")
          .setRequired(true),
      )
      .addRoleOption((role) =>
        role.setName("role").setDescription("Role").setRequired(true),
      )
      .addStringOption((emoji) =>
        emoji.setName("emoji").setDescription("Emoji").setRequired(true),
      ),
  )
  .addSubcommand((sc) =>
    sc
      .setName("send")
      .setDescription("Send a message by the bot")
      .addStringOption((str) =>
        str
          .setName("description")
          .setDescription("Description")
          .setRequired(true),
      )
      .addChannelOption((channel) =>
        channel
          .setName("channel")
          .setDescription("Channel in which the channel will be sent")
          .addChannelTypes(ChannelType.GuildText),
      )
      .addAttachmentOption((image) =>
        image.setName("banner").setDescription("Banner"),
      ),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);
