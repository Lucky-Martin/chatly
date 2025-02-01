import { ITopic } from "../../../../db/repositories/ChatRepository";

export class JoinTopicReply {
  constructor(
    public readonly topic: ITopic,
    public readonly participants: string[],
    public readonly allTopics: ITopic[]
  ) {}
}