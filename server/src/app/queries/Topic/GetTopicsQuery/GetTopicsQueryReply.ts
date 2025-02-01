import { ITopic } from "../../../../db/repositories/ChatRepository";

export class GetTopicsQueryResult {
  constructor(
    public readonly topics: ITopic[]
  ) {}
}