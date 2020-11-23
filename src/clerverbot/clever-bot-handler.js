const cleverbot = require("cleverbot-free");
const config = require("../config.json")
const emojify = require("../emojipasta/emojifier")

const CleverBotConvoHistory = [];
const SHOULD_USE_CONVO_HISTORY = true;

async function chat_clever(msg)
{

  let answer = await cleverbot(msg, CleverBotConvoHistory);

  if (SHOULD_USE_CONVO_HISTORY)
  {
    CleverBotConvoHistory.push(msg);
    CleverBotConvoHistory.push(answer);
  }
  
  return answer;
}

module.exports = chat_clever;