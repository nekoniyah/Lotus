import { EmbedBuilder, User } from "discord.js";

type Opts = { user?: User; icon?: string };

export function base(opts?: Opts) {
  let embed = new EmbedBuilder().setTimestamp().setColor("Yellow");

  if (opts && opts.user)
    embed.setAuthor({
      name: opts.user.username,
      iconURL: opts.user.displayAvatarURL(),
    });

  if (opts && opts.icon) embed.setThumbnail(opts.icon);

  return embed;
}

export function error(message: string, opts?: Opts) {
  return base(opts).setColor("Red").setTitle(message);
}

export function success(message: string, opts?: Opts) {
  return base(opts).setColor("Green").setTitle(message);
}

const embeds = { base, error, success };
export default embeds;
