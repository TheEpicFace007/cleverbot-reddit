import { readFileSync } from "fs";
import { parse } from "jsonc-parser";
import Snoowrap from "snoowrap";
import { generateEmojipasta } from "../emojipasta/emojifier";
import _, { fromPairs } from "lodash";
import sleep from "sleep";
import cleverbot from "cleverbot-free";
import { random as rainbow } from "colors";
import { IConfig } from "../ConfigInterface";

const config: IConfig = parse(readFileSync("./config.jsonc", { encoding: "utf-8" }));
let iteration = 0;

export default async function submissionHandler(submission: Snoowrap.Submission)
{
  iteration++;
  if (iteration % 50 === 0)
    console.clear();
  let promesses = [submission.title, submission.selftext];
  Promise.all(promesses)
    .then(async (result) =>
    {
      let reply = await cleverbot(`${result[0]} ${result[1]}`);
      if (config.shouldEmogify)
        reply = generateEmojipasta(reply);
      // sleep.msleep(_.random(5000, 22000));
      const timeout = setTimeout(() => 
      {
        submission.reply(reply).then(() => 
        {
          //@ts-ignore
          console.log(rainbow("Replied to submission!"));
        })
          .catch((reason) =>
          {
            reason = reason.toString();
            console.error(generateEmojipasta(reason));
          })
          .finally(() => clearTimeout(timeout));
      }, _.random(1000, 22000, false));
    })
    .catch((reason) =>
    {
      console.log("Oh no. The promises didn't got resolved :(");
      console.error(generateEmojipasta(reason.toString()));

      // sleep.msleep(_.random(5000, 22000));
      submission.reply(reason).then(() => console.log("Whooo ooo replied hurray hurray!"))
        .catch((reason) =>
        {
          reason = reason.toString();
          console.error(generateEmojipasta(reason));
        });
    });
}
