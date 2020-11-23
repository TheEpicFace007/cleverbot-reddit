/**
 * @file EventHandler.ts
 * @description Define the interface and enum for making a file
 */

import Snoowrap from "snoowrap";

export enum EventsName
{
  NewSubmission,
  NewComment
}

export interface SubmissionEventArg
{

  readonly SubmissionID: string;
  readonly isSelfPost: boolean;

  readonly SubmissionTitle: string;
  readonly SelfPostBody: null | string;
  /**
   * Reply to a submission
   * @see https://not-an-aardvark.github.io/snoowrap/Submission.html#reply__anchor
   */
  readonly reply: Function;
  /* Required thing */
  submissionObj: Snoowrap.Submission;
}

export interface CommentEventArg
{
  readonly CommentID: string;
  readonly CommentBody: string;
  readonly reply: Function;
  /* Required thing */
}