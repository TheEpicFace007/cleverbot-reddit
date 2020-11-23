import Cleverbot from "cleverbot-free";

class ChattingSession
{
  #context: Array<string>;

  constructor()
  {
    this.#context = [];  
  }

  public async AskClever(msg: string): Promise<void>
  {
    const user_msg: string = msg;
    this.#context.push(user_msg);
    const clever_bot_answer: string = await Cleverbot(msg, this.#context);
    this.#context.push(clever_bot_answer)
  }
}