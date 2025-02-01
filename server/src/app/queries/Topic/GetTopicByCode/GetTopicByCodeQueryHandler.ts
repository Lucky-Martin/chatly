import { IQueryHandler } from "../../../types";
import { GetTopicByCodeQuery } from "./GetTopicByCodeQuery";
import { GetTopicByCodeQueryResult } from "./GetTopicByCodeQueryReply";
import { ChatRepository } from "../../../../db/repositories/ChatRepository";
import { codeGenerator } from "../../../utils/codeGenerator";

export class GetTopicByCodeQueryHandler implements IQueryHandler<GetTopicByCodeQuery, GetTopicByCodeQueryResult> {
  public async handle(query: GetTopicByCodeQuery): Promise<GetTopicByCodeQueryResult> {
    if (!codeGenerator.isCodeValid(query.topicCode)) {
      throw new Error("Invalid topic code");
    }

    const topic = await ChatRepository.getTopicByCode(query.topicCode);
    return new GetTopicByCodeQueryResult(topic);
  }
}