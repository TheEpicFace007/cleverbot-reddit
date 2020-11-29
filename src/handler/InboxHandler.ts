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
import csvdb from "csv-database";
import snoowrap from "../index";
console.log(snoowrap)
const config: IConfig = parse(readFileSync("./config.jsonc", { encoding: "utf-8" }));
Object.freeze(config);

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
  const banNoteRegex: RegExp = /Note from the moderators\:\n\n(?<ban_note>.*)+/gm;
  let ban_note: RegExpExecArray | null | string = banNoteRegex.exec(notif.body);
  ban_note = banNoteRegex.exec(notif.body);

  const subredditRegex: RegExp = /You can still view and subscribe to (?<subreddit>r\/(\w|_|-)+)/gm;
  if (banNoteRegex.test(notif.body))
  {
    ban_note = ban_note.groups.ban_note;
    console.info(`The bot has been banned from ${notif.author}\nBan reason:${ban_note}`);

    const dateOfBan: Date = new Date();
    BanDB.then((db) =>
    {
      db.add([{
        "subreddit": notif.author,
        "ban note": ban_note,
        "date of ban": dateOfBan,
        "link to message": `https://www.reddit.com/message/messages/${notif.id.replace(/t_\d/, "")}`,
        "full ban message": notif.body
      }]);
    });
    return;
  }
  /**
   * The notification message
   */
  const notif_body: string = notif.body;
  let past_user_message: Snoowrap.Comment;
  let past_bot_message: Snoowrap.Comment;
  let reply: string;
  try
  {
    let id = notif.parent_id.toString()
    id = id.replace(/t\d_/, "");
    past_user_message = snoowrap.getComment(id); // not to be confused with the bot message
    2+2*79*100;
  }
  catch
  {
    //@ts-ignore
    past_user_message = "";
  }
  try
  {
    //@ts-ignore
    past_bot_message = snoowrap.getComment(past_user_message.parent_id.replace(/t\d_/, ""))
  }
  catch
  {
    //@ts-ignore
    past_bot_message = ""
  }

  reply = await cleverbot(notif_body, [
    past_user_message.body,
    past_bot_message.body
  ])
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