import path from "path";
import { TemplateEvent } from "../../utils/typers";
import { readdirSync } from "fs";

export default TemplateEvent<"interactionCreate">(async (interaction) => {
  let interactionsFolderpath = path.join(process.cwd(), "interactions");

  if (interaction.isButton()) {
    const interactionFiles = readdirSync(
      path.join(interactionsFolderpath, "buttons"),
    );

    const fpath = interactionFiles.find((f) =>
      f.endsWith(`${interaction.customId}.ts`),
    );

    if (fpath) {
      const { default: module } = await import(
        path.join(interactionsFolderpath, "buttons", fpath)
      );

      await module(interaction);
    } else
      await interaction.reply({
        content: "> :x: Feature not implemented yet!",
        flags: ["Ephemeral"],
      });
  }

  if (interaction.isChatInputCommand()) {
    const now = Date.now();
    const interactionFiles = readdirSync(
      path.join(interactionsFolderpath, "commands"),
    );

    const fpath = interactionFiles.find((f) =>
      f.endsWith(`${interaction.commandName}.ts`),
    );

    if (fpath) {
      const { default: module } = await import(
        path.join(interactionsFolderpath, "commands", fpath)
      );

      await module(interaction, { now });
    } else
      await interaction.reply({
        content: "> :x: Feature not implemented yet!",
        flags: ["Ephemeral"],
      });
  }

  if (interaction.isAnySelectMenu()) {
    const interactionFiles = readdirSync(
      path.join(interactionsFolderpath, "selects"),
    );

    const fpath = interactionFiles.find((f) =>
      f.endsWith(`${interaction.customId}.ts`),
    );

    if (fpath) {
      const { default: module } = await import(
        path.join(interactionsFolderpath, "selects", fpath)
      );

      await module(interaction);
    } else
      await interaction.reply({
        content: "> :x: Feature not implemented yet!",
        flags: ["Ephemeral"],
      });
  }

  if (interaction.isModalSubmit()) {
    const interactionFiles = readdirSync(
      path.join(interactionsFolderpath, "modals"),
    );

    const fpath = interactionFiles.find((f) =>
      f.endsWith(`${interaction.customId}.ts`),
    );

    if (fpath) {
      const { default: module } = await import(
        path.join(interactionsFolderpath, "modals", fpath)
      );

      await module(interaction);
    } else
      await interaction.reply({
        content: "> :x: Feature not implemented yet!",
        flags: ["Ephemeral"],
      });
  }

  // ...
});
