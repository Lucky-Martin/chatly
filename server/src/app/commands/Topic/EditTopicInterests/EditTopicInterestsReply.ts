import { ITopic } from "../../../../db/repositories/ChatRepository";

export class EditTopicInterestsReply {
  constructor(
    public readonly allTopics: ITopic[]
  ) {}
}