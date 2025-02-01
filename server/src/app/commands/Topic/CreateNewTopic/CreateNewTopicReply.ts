import { ITopic } from "../../../../db/repositories/ChatRepository";

export class CreateNewTopicReply {
  constructor(
    public readonly topic: ITopic,
    public readonly allTopics: ITopic[]
  ) {}
}