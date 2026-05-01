import {
  Client,
  Guild,
  GuildChannel,
  GuildMember,
  TextChannel,
} from "discord.js";
export let channel: TextChannel | null = null;
let client: Client<true> | null = null;
import fs, { createReadStream } from "fs";
import path from "path";
import dayjs from "dayjs";
import embeds from "./embeds";

export async function LogTicketCreate(c: TextChannel, member: GuildMember) {
  const embed = embeds
    .base()
    .setTitle(`Ticket Created`)
    .addFields(
      { name: "Requested by", value: `<@${member.user.id}>` },
      {
        name: "Channel",
        value: `<#${c.id}>`,
      },
    );

  channel!.send({ embeds: [embed] });
}

export async function LogTicketDelete(c: TextChannel, member: GuildMember) {
  const embed = embeds
    .base()
    .setTitle(`Ticket Deleted`)
    .addFields(
      { name: "Requested by", value: `<@${member.user.id}>` },
      {
        name: "Channel",
        value: `<#${c.id}>`,
      },
    );

  let messages = await c.messages.fetch();

  let res = [];

  for (let [_, msg] of messages) {
    res.push(
      `[${dayjs(msg.editedAt ?? msg.createdAt).format("DD/MM/YYYY-HH:mm")}] ${msg.author.username}: ${msg.content} (${msg.attachments.map((a) => a.url).join(",")})\n`,
    );
  }

  let p = path.join(process.cwd(), "temp.txt");

  fs.writeFileSync(p, res.reverse().join(","));

  await channel!.send({ embeds: [embed], files: [createReadStream(p)] });

  fs.rmSync(p);
}
