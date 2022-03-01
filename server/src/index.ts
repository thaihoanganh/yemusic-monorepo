require("dotenv").config();
import { exec } from "child_process";
import express, { Application, Request, Response } from "express";
import cors from "cors";

const YOUTUBE_DL_PATH = process.env.YOUTUBE_DL_PATH;
const PORT = 3001;

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

const command = (...commandValue: any) => {
  return new Promise((resolve, reject) => {
    exec(commandValue.join(" "), (error, stdout, stderr) => {
      if (error || stderr) {
        reject(error || stderr);
        return;
      }

      resolve(stdout);
    });
  });
};

app.get("/get/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  command(YOUTUBE_DL_PATH, "-g", `https://www.youtube.com/watch?v=${id}`)
    .then((data: any) => {
      // TODO
      const urls = data.split("https://");

      if (urls[2]) {
        res.status(200).json({
          success: true,
          result: "https://" + urls[2].slice(0, -1),
        });
      } else {
        res.status(400).json({
          success: false,
          error: "Something is wrong",
        });
      }
    })
    .catch(() => {
      res.status(400).json({
        success: false,
        error: "Invalid access",
      });
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
