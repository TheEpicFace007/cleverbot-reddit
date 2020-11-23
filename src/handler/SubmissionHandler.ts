import { readFileSync } from "fs";
import { parse } from "jsonc-parser";
import Snoowrap from "snoowrap";
import { generateEmojipasta } from "../emojipasta/emojifier";
import _, { fromPairs } from "lodash";
import sleep from "sleep";
import cleverbot from "cleverbot-free";
import { random as rainbow } from "colors";
import { IConfig } from "../ConfigInterface";
import detectDebug from "../detectDebug";

const config: IConfig = parse(readFileSync("./config.jsonc", { encoding: "utf-8" }));
let iteration = 0;

export default async function submissionHandler(submission: Snoowrap.Submission)
{
  iteration++;
  if (iteration % 50 === 0 && !detectDebug())
    console.clear();
  let promesses = [submission.title, submission.selftext];
  Promise.all(promesses)
    .then(async (result) =>
    {
      let reply = await cleverbot(`${result[0]} ${submission.selftext}`);
      if (config.shouldEmogify)
        reply = generateEmojipasta(reply);
      const ms = _.random(1000, 22000, false);
      // sleep.msleep(_.random(5000, 22000));
      const timeout = setTimeout(() => 
      {
        submission.reply(reply).then(() => 
        {
          //@ts-ignore
          if (!detectDebug()) // detect for debug cuz i want to show the amount of time submission have been replied to as I use chrome debugger to debug
            console.log(rainbow("Replied to submission!"));
          else
            console.log("Replied to a submission!");
        })
          .catch((reason) =>
          {
            reason = reason.toString();
            console.error(generateEmojipasta(reason));
          })
          .finally(() => clearTimeout(timeout));
      }, ms);
    })
    .catch((reason) =>
    {
      console.log("Oh no. The promises didn't got resolved :(");
      console.error(generateEmojipasta(reason.toString()));

      // sleep.msleep(_.random(5000, 22000));
      submission.reply(reason).then(() =>
      {
        console.log("Replied to a submission!");
      })
        .catch((reason) =>
        {
          reason = reason.toString();
          console.error(generateEmojipasta(reason));
        });
    });
}
