import { IQueryHandler } from "../../../types";
import { GetTopicMessagesQuery } from "./GetTopicMessagesQuery";
import { GetTopicMessagesReply } from "./GetTopicMessagesReply";
import { ChatRepository } from "../../../../db/repositories/ChatRepository";

export class GetTopicMessagesQueryHandler implements IQueryHandler<GetTopicMessagesQuery, GetTopicMessagesReply> {
  public async handle(query: GetTopicMessagesQuery): Promise<GetTopicMessagesReply> {
    const topic = await ChatRepository.getTopicById(query.topicId);
    return new GetTopicMessagesReply(topic);
  }
}