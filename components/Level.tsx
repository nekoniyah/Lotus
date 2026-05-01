import { createCanvas, loadImage } from "canvas";
import { readFileSync } from "fs";
import path from "path";

type LevelProps = {
  username: string;
  level: number;
  experience: number;
  experienceMax: number;
  avatar: string;
};

export default {
  async element(props: LevelProps) {
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
          width: "1000px",
          height: "200px",
          display: "flex",
          flexDirection: "column",
          backgroundImage: `url(${bgData})`,
          backgroundSize: "cover",
          fontFamily: "sans-serif",
          paddingLeft: "20px",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              color: "white",
            }}
          >
            {props.username}
          </h1>
          <span
            style={{
              backgroundColor: "white",
              width: "60px",
              height: "60px",
              display: "flex",
              borderRadius: "50%",
              color: "black",
              fontWeight: "bold",
              alignItems: "center",
              fontSize: "2.1rem",
              justifyContent: "center",
            }}
          >
            {props.level}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            className="bar"
            style={{
              width: "700px",
              backgroundColor: "white",
              display: "flex",
            }}
          >
            <div
              className="progress"
              style={{
                position: "relative",
                left: 0,
                top: 0,
                width:
                  (props.experience / props.experienceMax) * 100 * 7 + "px",
                display: "flex",
                backgroundColor: "#93fa87",
              }}
            >
              <span>{props.experience}</span>
            </div>
            <span>{props.experienceMax}</span>
          </div>
        </div>
      </div>
    );
  },
  width: 1000,
  height: 200,
};
