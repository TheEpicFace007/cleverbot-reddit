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

const config: IConfig = parse(readFileSync("./src/config.jsonc", { encoding: "utf-8" }));
Object.freeze(config)
let iteration = 0;

export default async function submissionHandler(submission: Snoowrap.Submission): Promise<void>
{
  /* manage the cleaning of the console */
  iteration++;
  if (iteration % 50 === 0 && !detectDebug())
    console.clear();
  /* do not reply if it's a serious thread from askreddit */
  if (JSON.stringify(submission).toLowerCase().search("serious") > 0 && submission.subreddit.name !=  "askreddit")
    return;
  /* generate the reply */
  let reply: string = await cleverbot(`${submission.title} ${submission.selftext}`);
  if (config.shouldEmogify)
    reply = generateEmojipasta(reply);
  
  /* finally reply */
  const ms: number = _.random(5000, 22000, false);
  const timeout: NodeJS.Timeout = setTimeout(() => 
  {
    submission.reply(reply)
      .then(() => 
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
}
