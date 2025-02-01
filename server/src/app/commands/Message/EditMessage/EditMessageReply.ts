import { ITopic } from "../../../../db/repositories/ChatRepository";

export class EditMessageReply {
  constructor(
    public readonly topic: ITopic | null,
    public readonly allTopics: ITopic[] | null
  ) {}
}