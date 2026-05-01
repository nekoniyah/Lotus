import { ChatInputCommandInteraction, TextChannel } from "discord.js";
import db from "../../utils/db";
import { stickyMessages, stickyRoles } from "../../src/db/schema";
import { eq } from "drizzle-orm";
import embeds from "../../utils/embeds";

const sticky = async (interaction: ChatInputCommandInteraction) => {
  const scGroup = interaction.options.getSubcommandGroup(true);

  const StickyMessages = db
    .select()
    .from(stickyMessages)
    .where(eq(stickyMessages.guildId, interaction.guildId!))
    .all();

  if (scGroup === "message") {
    switch (interaction.options.getSubcommand(true)) {
      case "list":
        let text = "";

        for (let stickymessage of StickyMessages) {
          text += `\`${stickymessage.messageId}\` (<#${stickymessage.channelId}>) - ${stickymessage.content}\n`;
        }

        const embed = embeds
          .base()
          .setDescription(
            text ? text : "No sticky message setup! Use `/sticky message add`",
          );

        await interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });

        break;

      case "add":
        const channel = ((interaction.options.getChannel(
          "channel",
        ) as TextChannel | null) ?? interaction.channel!) as TextChannel;

        const msgContent = interaction.options.getString("message", true);

        const embed2 = embeds
          .base()
          .setThumbnail(null)
          .setDescription(msgContent);

        const sentStickyMessage = await channel.send({ embeds: [embed2] });

        await db.insert(stickyMessages).values({
          content: msgContent,
          channelId: channel.id,
          guildId: interaction.guildId!,
          messageId: sentStickyMessage.id,
        });

        await interaction.reply({
          embeds: [
            embeds.success("Sticky Message created!", {
              icon: interaction.guild!.iconURL() || undefined,
            }),
          ],
          flags: ["Ephemeral"],
        });
        break;

      case "remove":
        const id = interaction.options.getString("id", true);

        const stickyMessage2 = await StickyMessages.find(
          (s) => s.messageId === id,
        );

        if (!stickyMessage2) {
          await interaction.reply({
            embeds: [embeds.error("Sticky Message not found.")],
            flags: ["Ephemeral"],
          });
          return;
        }

        await db.delete(stickyMessages).where(eq(stickyMessages.messageId, id));

        await interaction.reply({
          embeds: [embeds.success("Sticky Message deleted!")],
          flags: ["Ephemeral"],
        });
        break;
    }
  }

  const StickyRoles = db
    .select()
    .from(stickyRoles)
    .where(eq(stickyRoles.guildId, interaction.guildId!))
    .all();

  if (scGroup === "role") {
    switch (interaction.options.getSubcommand(true)) {
      case "list":
        let text = "";

        for (let stickyrole of StickyRoles) {
          text += `- <@&${stickyrole.roleId}>\n`;
        }

        const embed = embeds
          .base()
          .setDescription(
            text ? text : "No sticky roles setup! Use `/sticky message add`",
          );

        await interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });

        break;

      case "add":
        const role = interaction.options.getRole("role", true);

        // Prevent having more than one instance of the same sticky role

        const stickyRole = StickyRoles.find((s) => s.roleId === role.id);

        if (stickyRole) {
          await interaction.reply({
            embeds: [embeds.error("Sticky Role already exists!")],
            flags: ["Ephemeral"],
          });
          return;
        }

        await db
          .insert(stickyRoles)
          .values({ guildId: interaction.guildId!, roleId: role.id });

        await interaction.reply({
          embeds: [embeds.success("Sticky Role created!")],
          flags: ["Ephemeral"],
        });
        break;

      case "remove":
        const role2 = interaction.options.getRole("role", true);

        // Prevent having more than one instance of the same sticky role

        const stickyRole2 = StickyRoles.find((s) => s.roleId === role2.id);

        if (!stickyRole2) {
          await interaction.reply({
            embeds: [embeds.error("Sticky Role not found :(", interaction)],
            flags: ["Ephemeral"],
          });
          return;
        }

        await db.delete(stickyRoles).where(eq(stickyRoles.roleId, role2.id));

        await interaction.reply({
          embeds: [embeds.success("Sticky Role deleted!", interaction)],
          flags: ["Ephemeral"],
        });
        break;
    }
  }
};

export default sticky;
