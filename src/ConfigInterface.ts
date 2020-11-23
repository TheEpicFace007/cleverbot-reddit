import { InboxStreamOptions, SubmissionStream } from "snoostorm";

export interface ISubmittionStreamOption
{
  limit: number;
  pollTime: number;
}

export interface IConfig
{
  shouldEmogify: boolean;
  maxEmojiPerBlock: number;
  inboxStreamOption: InboxStreamOptions,
  submittionStreamOption: ISubmittionStreamOption,
  subredditToListen: Array<string>
}