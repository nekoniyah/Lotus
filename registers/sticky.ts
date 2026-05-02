import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

export default new SlashCommandBuilder()
  .setName("sticky")
  .setDescription("Setup sticky messages or roles.")
  .addSubcommandGroup((scg) =>
    scg
      .setName("message")
      .setDescription("Setup sticky messages.")
      .addSubcommand((sc) =>
        sc
          .setName("add")
          .setDescription(
            "Add a sticky message in a specific channel (or current one).",
          )
          .addStringOption((str) =>
            str.setName("message").setDescription("Message").setRequired(true),
          )
          .addChannelOption((ch) =>
            ch
              .setName("channel")
              .setDescription("Channel")
              .addChannelTypes(ChannelType.GuildText),
          ),
      )
      .addSubcommand((sc) =>
        sc
          .setName("remove")
          .setDescription("Remove a sticky message for good.")
          .addStringOption((str) =>
            str
              .setName("id")
              .setDescription("Id of the sticky message")
              .setRequired(true),
          ),
      )
      .addSubcommand((sc) =>
        sc.setName("list").setDescription("List of working sticky messages."),
      ),
  )
  .addSubcommandGroup((scg) =>
    scg
      .setName("role")
      .setDescription("Setup sticky roles.")
      .addSubcommand((sc) =>
        sc
          .setName("add")
          .setDescription("Register a role as a sticky role")
          .addRoleOption((opt) =>
            opt.setName("role").setDescription("Role").setRequired(true),
          ),
      )
      .addSubcommand((sc) =>
        sc
          .setName("remove")
          .setDescription("Remove a sticky role for good.")
          .addRoleOption((opt) =>
            opt.setName("role").setDescription("Role").setRequired(true),
          ),
      )
      .addSubcommand((sc) =>
        sc.setName("list").setDescription("List of working sticky roles."),
      ),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);
