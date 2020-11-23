"use string";
import _ from "lodash";
import Snoowrap, { Subreddit } from "snoowrap";
import
{
  InboxStream,
  SubmissionStream
} from "snoostorm";
import "colors/lib/extendStringPrototype";
process.chdir("./src/");
import cleverbot from "cleverbot-free";
import { generateEmojipasta } from "./emojipasta/emojifier";
import { parse } from "jsonc-parser";
import { readFileSync } from "fs";
import { IConfig } from "./ConfigInterface";
import
{
  yellow,
  blue,
  green,
  underline,
  random as rainbow
}
  from "colors";
import submissionhandler from "./handler/SubmissionHandler";

const config: IConfig = parse(readFileSync("./config.jsonc", { encoding: "utf-8" }));
const keys: Array<Snoowrap.SnoowrapOptions> = parse(readFileSync("./apikeys.jsonc", { encoding: "utf-8" }), [], {
  allowTrailingComma: true
});

/* setup snoowrap */
const snoowrap = new Snoowrap(keys[0]);
snoowrap.getMe().then(async (redditor: Snoowrap.RedditUser) =>
{
  console.log(`
                  ,d"=≥,.,qOp,
                 ,6'  ''²$(  )
                ,6'      '?q$6'
             ..,$$,.
   ,.  .,,--***²""²***--,,.  .,
 ²   ,p²''              ''²q,   ²
:  ,6'                      '6,  :
 ' $      ,db,      ,db,      $ '
  '$      ²$$²      ²$$²      $'    Logged in as ${yellow(redditor.name)}
  '$                          $'    ${underline("Account stat:")}
  '$.     .,        ,.     .$'       Submission karma: ${blue(redditor.link_karma.toString())}
  'b,     '²«»«»«»²'     ,d'         Comment karma: ${blue(redditor.comment_karma.toString())}
     '²?bn,,          ,,nd?²'       
       ,6$ ''²²²²²²²²'' $6,
     ,² ²$              $² ²,
     $  :$              $:  $
     $   $              $   $
     'b  q:            :p  d'
      '²«?$.          .$?»²'
         'b            d'
       ,²²'?,.      .,?'²²,
      ²==--≥²²==--==²²≤--==²`);
});

const subredditToPostOn: Array<string> = config.subredditToListen;

for (const subreddit of subredditToPostOn)
{
  /* set up the event */
  const submissionStream = new SubmissionStream(snoowrap, {
    subreddit: subreddit,
    pollTime: config.submittionStreamOption.pollTime,
    limit: config.submittionStreamOption.limit
  });

  console.log(green(subreddit + " has be set up!"));

  submissionStream.on("item", submissionhandler);
}
const inboxStream = new InboxStream(snoowrap, config.inboxStreamOption);

let iteration = 0;
const replied_m = "Replied to a comment!";

inboxStream.on("item", async (notif: Snoowrap.PrivateMessage | Snoowrap.Comment) =>
{
  /* if (_.random(0, 1_000) % 95 === 0)
  {
    console.log(green("The random decided to not answer the on the comment."));
    return;
  } */
  iteration++;
  if (iteration % 50 === 0 && !detectDebug())
    console.clear();
  /**
   * The notification message
   */
  const notif_body: string = notif.body;
  try
  {
    let convo_history = notif.parent_id;
    let reply: string = await cleverbot(notif_body);
    if (config.shouldEmogify)
      reply = generateEmojipasta(reply);
    // sleep.msleep(_.random(2000, 22000));
    let i = 0;
    setTimeout(() =>
    {
      i++;
      if (i > 1)
        return Promise.resolve();
      notif.reply(reply)
        //@ts-ignore
        .then(() =>
        {
          //@ts-ignore
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
    }, _.random(5000, 22000));
  }

  catch (e)
  {

    console.error(generateEmojipasta(e.toString()));
    // sleep.msleep(_.random(2000, 22000));
    notif.reply(e.toString())
      //@ts-ignore
      .then(() => { })
      .catch(() => { });
    if (!detectDebug())
      console.log(rainbow(replied_m))
    else
      console.log(replied_m);
  }
});
var detectDebug = function ()
{
  return process.env.NODE_ENV !== 'production';
};
