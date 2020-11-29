"use strict";
import _ from "lodash";
import Snoowrap, { Subreddit } from "snoowrap";
import
{
  InboxStream,
  SubmissionStream
} from "snoostorm";
import "colors/lib/extendStringPrototype";
import cleverbot from "cleverbot-free";
import { generateEmojipasta } from "./emojipasta/emojifier";
import { parse } from "jsonc-parser";
import { readFileSync, readdirSync } from "fs";
import { IConfig } from "./ConfigInterface";
import
{
  yellow,
  blue,
  green,
  underline,
  random as rainbow,
  bold
}
  from "colors";
import submissionhandler from "./handler/SubmissionHandler";
import inboxHandler from "./handler/InboxHandler"
import { table } from "console";


const config: IConfig = parse(readFileSync("./config.jsonc", { encoding: "utf-8" }));
Object.freeze(config);
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
     '²?bn,,          ,,nd?²'        Is the bot banned from reddit? ${redditor.is_suspended ? bold("Yes it is banned") : bold("No it is not banned")}
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

for (const subreddit  of subredditToPostOn)
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
//@ts-ignore
const inboxStream = new InboxStream(snoowrap, config.inboxStreamOption);

let iteration = 0;
const replied_m = "Replied to a comment!";

inboxStream.on("item", inboxHandler);

export default snoowrap