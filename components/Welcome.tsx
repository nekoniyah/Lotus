import { createCanvas, loadImage } from "canvas";
import { GuildMember } from "discord.js";
import { readFileSync } from "fs";
import path from "path";

type WelcomeProps = {
  member: GuildMember;
};

export default {
  async element({ member }: WelcomeProps) {
    const img = await loadImage(
      readFileSync(path.join(process.cwd(), "assets", "smoky.jpg")),
    );

    let c = createCanvas(img.width / 2, img.height / 2);
    let ctx = c.getContext("2d");

    ctx.drawImage(img, 0, 0, img.naturalWidth / 2, img.naturalHeight / 2);

    const bgData = c.toDataURL("image/jpeg");

    return (
      <div
        style={{
          width: "900px",
          height: "400px",
          display: "flex",
          backgroundImage: `url(${bgData})`,
          backgroundSize: "cover",
          fontFamily: "sans-serif",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <img
          src={member.displayAvatarURL({ extension: "png" })}
          style={{
            width: "30%",
            borderRadius: "50%",
          }}
          alt=""
        />
        <h1
          style={{
            color: "white",
            fontSize: "2rem",
          }}
        >
          Welcome {member.user.username}, you are the {member.guild.memberCount}
          th member!
        </h1>
      </div>
    );
  },
  width: 900,
  height: 400,
};
