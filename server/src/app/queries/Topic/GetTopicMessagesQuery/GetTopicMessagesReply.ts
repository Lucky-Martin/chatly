import { ITopic } from "../../../../db/repositories/ChatRepository";

export class GetTopicMessagesReply {
  constructor(
    public readonly topic: ITopic | undefined
  ) {}
}