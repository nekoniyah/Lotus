import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
  .setName("leveling")
  .setDescription("Setup level system")
  .addSubcommand((sc) =>
    sc
      .setName("add")
      .setDescription("Add a level-based earnable role")
      .addNumberOption((opt) =>
        opt
          .setName("min_level")
          .setDescription(
            "A member gets the provided role when they reaches min_level",
          )
          .setRequired(true),
      )
      .addRoleOption((opt) =>
        opt.setName("role").setDescription("Role to earn.").setRequired(true),
      ),
  )
  .addSubcommand((sc) =>
    sc.setName("list").setDescription("Get list of earnable roles"),
  )
  .addSubcommand((sc) =>
    sc
      .setName("remove")
      .setDescription("Remove a earnable role for good")
      .addNumberOption((opt) =>
        opt
          .setName("id")
          .setDescription(
            "id of the level-role found in the '/leveling list' command",
          )
          .setRequired(true),
      ),
  )
  .addSubcommand((sc) =>
    sc
      .setName("channel")
      .setDescription("Set channel for when a member levels up")
      .addChannelOption((opt) =>
        opt.setName("channel").setDescription("Channel").setRequired(true),
      ),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);
