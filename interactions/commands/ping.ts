import type { ChatInputCommandInteraction } from "discord.js";

export default async function (
  interaction: ChatInputCommandInteraction,
  { now }: { now: number },
) {
  await interaction.reply(`:ping_pong: Pong! ${Date.now() - now}ms`);
}
