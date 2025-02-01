import { ITopic } from "../../../../db/repositories/ChatRepository";

export class GetTopicByCodeQueryResult {
  constructor(
    public readonly topic: ITopic | undefined
  ) {}
}