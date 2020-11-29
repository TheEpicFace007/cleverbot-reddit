import { InboxStreamOptions, SnooStormOptions, SubmissionStream } from "snoostorm";
import Snoowrap from "snoowrap";

export interface ISubmittionStreamOption
{
  limit: number;
  pollTime: number;
}

export interface IConfig
{
  shouldEmogify: boolean;
  maxEmojiPerBlock: number;

  inboxStreamOption: InboxStreamOptions;
  submittionStreamOption: ISubmittionStreamOption;
  commentStreamOption: ISubmittionStreamOption;
  
  subredditToListen: Array<string>;

  shouldListenForNewComment: boolean;
  shouldListenForNewSubmission: boolean;
  shouldListenToInbox: boolean;

}