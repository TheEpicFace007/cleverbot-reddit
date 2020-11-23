import { readFileSync, readdirSync } from "fs";
import { parse } from "jsonc-parser"
import { IConfig } from "../ConfigInterface";
import EMOJI_MAPPINGS from "./emoji_mapping.json"
const config: IConfig = parse(readFileSync("./config.jsonc", { encoding: "utf-8"}))

export function generateEmojipasta(text: any)
{
  let blocks = splitIntoBlocks(text);
  let newBlocks = [];
  blocks.forEach((block: any) =>
  {
    newBlocks.push(block);
    let emojis = generateEmojisFrom(block);
    if (emojis)
    {
      newBlocks.push(" " + emojis);
    }
  });
  return newBlocks.join("");
}

function splitIntoBlocks(text: string)
{
  return text.match(/\s*[^\s]*/g);
}

function generateEmojisFrom(block: any)
{
  let trimmedBlock = trimNonAlphanumericalChars(block);
  let matchingEmojis = getMatchingEmojis(trimmedBlock);
  let emojis = [];
  if (matchingEmojis)
  {
    //@ts-ignore
    let numEmojis = Math.floor(Math.random() * (config.maxEmojiPerBlock + 1));
    for (let i = 0; i < numEmojis; i++)
    {
      emojis.push(matchingEmojis[Math.floor(Math.random() * matchingEmojis.length)]);
    }
  }
  return emojis.join("");
}

function trimNonAlphanumericalChars(text: string)
{
  return text.replace(/^\W*/, "").replace(/\W*$/, "");
}

function getMatchingEmojis(word: string)
{
  let key: any = getAlphanumericPrefix(word.toLowerCase());
  if (key in EMOJI_MAPPINGS)
  {
    return EMOJI_MAPPINGS[key];
  }
  return [];
}

function getAlphanumericPrefix(s: string)
{
  return s.match(/^[a-z0-9]*/i);
}
