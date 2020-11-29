import Snoowrap from "snoowrap";
"use string";
import _ from "lodash";
import "colors/lib/extendStringPrototype";
process.chdir("./src/");
import cleverbot from "cleverbot-free";
import { generateEmojipasta } from "../emojipasta/emojifier";
import { parse } from "jsonc-parser";
import { readFileSync } from "fs";
import { IConfig } from "../ConfigInterface";
import
{
  random as rainbow
}
from "colors";
import detectDebug from "../detectDebug";
import csvdb  from "csv-database"

const config: IConfig = parse(readFileSync("./config.jsonc", { encoding: "utf-8" }));

let iteration: number = 0;
const replied_m: string = "Replied to an inbox message";
export default async function (notif: Snoowrap.PrivateMessage | Snoowrap.Comment): Promise<void>
{
  //@ts-ignore
  const BanDB = csvdb("ban.csv", [
    "subreddit",
    "ban note",
    "date of ban",
    "link to message",
    "full ban message",
  ]);
  iteration++;
  if (iteration % 50 === 0 && !detectDebug())
    console.clear();

  /* check if the account has been banned on the comment / pm message */
  const banNoteRegex: RegExp = /Note from the moderators\:\n\n(?<ban_note>.)+/gm;
  let ban_note: RegExpExecArray | null | string = banNoteRegex.exec(notif.body);
  ban_note = banNoteRegex.exec(notif.body);
  //@ts-ignore
  ban_note = ban_note["ban_note"];
  
  const subredditRegex: RegExp = /You can still view and subscribe to (?<subreddit>r\/(\w|_|-)+)/gm;
  if (banNoteRegex.test(notif.body))
  {
    console.info(`The bot has been banned from ${notif.author}\nBan reason:${ban_note}`);
    
    const dateOfBan: Date = new Date();
    BanDB.then((db) => {
      db.add([{
        "subreddit": notif.author,
        "ban note": ban_note,
        "date of ban": dateOfBan,
        "link to message": `https://www.reddit.com/message/messages/${notif.id}`,
        "full ban message": notif.body
      }])
    })
    return;
  }

  /**
   * The notification message
   */
  const notif_body: string = notif.body;
  const pastMsg = 23 
  let reply: string = await cleverbot(notif_body);
  if (config.shouldEmogify)
    reply = generateEmojipasta(reply);

  const ms = _.random(5000, 22000);
  setTimeout(() =>
  {
    notif.reply(reply)
      //@ts-ignore
      .then(() =>
      {
        if (!detectDebug()) // detect for debug cuz i want to show the amount of time submission have been replied to as I use chrome debugger to debug
          console.log(rainbow(replied_m));
        else
          console.log(replied_m);
      })
      .catch(() => { });
    if (!detectDebug())
      console.log(rainbow(replied_m));
    else
      console.log(replied_m);
  }, ms);
};