import { REST, Routes } from "discord.js";
import { TemplateEvent } from "../../utils/typers";
import chalk from "chalk";
import { readdirSync } from "fs";
import path from "path";

export default TemplateEvent<"clientReady">(async (client) => {
  console.log(
    `[${chalk.bgBlue.whiteBright("[SETUP]")}] Logged in as ${client.user.username}.`,
  );

  console.log(
    `[${chalk.bgBlue.whiteBright("[SETUP]")}] Started registering slash commands...`,
  );

  const rest = new REST().setToken(process.env.TOKEN!);
  const registersFolder = path.join(process.cwd(), "registers");
  const filesToRegister = readdirSync(registersFolder, {
    recursive: true,
    encoding: "utf-8",
  });

  let parsed: any[] = [];

  for (let f of filesToRegister) {
    const { default: module } = await import(path.join(registersFolder, f));

    try {
      const data = module.toJSON();
      parsed.push(data);
    } catch (e) {
      console.log(
        `[${chalk.bgYellow.whiteBright("[WARNING]")}] ${f} won't be loaded: invalid data.`,
      );
    }
  }

  rest.put(
    Routes.applicationGuildCommands(
      client.application.id,
      process.env.GUILD_ID!,
    ),
    { body: parsed },
  );
});
