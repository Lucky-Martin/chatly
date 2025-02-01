import { ITopic } from "../../../../db/repositories/ChatRepository";

export class DeleteMessageReply {
  constructor(
    public readonly success: boolean,
    public readonly allTopics: ITopic[]
  ) {}
}