import { ITopic } from "../../../../db/repositories/ChatRepository";

export class LeaveTopicReply {
  constructor(
    public readonly participants: string[],
    public readonly allTopics: ITopic[]
  ) {}
}