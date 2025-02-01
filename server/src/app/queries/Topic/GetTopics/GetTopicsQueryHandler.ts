import { IQueryHandler } from "../../../types";
import { GetTopicsQuery } from "./GetTopicsQuery";
import { GetTopicsQueryResult } from "./GetTopicsQueryReply";
import { ChatRepository } from "../../../../db/repositories/ChatRepository";

export class GetTopicsQueryHandler implements IQueryHandler<GetTopicsQuery, GetTopicsQueryResult> {
  public async handle(query: GetTopicsQuery): Promise<GetTopicsQueryResult> {
    const topics = await ChatRepository.getAllTopics();
    return new GetTopicsQueryResult(topics);
  }
}