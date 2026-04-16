import type { ChatInputCommandInteraction } from "discord.js";

export default async function ping(
  interaction: ChatInputCommandInteraction,
  { now }: { now: number },
) {
  await interaction.reply(`Ping! :ping_pong: ${Date.now() - now}ms elapsed.`);
}
