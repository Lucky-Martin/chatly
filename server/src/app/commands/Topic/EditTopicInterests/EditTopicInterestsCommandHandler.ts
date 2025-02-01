import { ICommandHandler } from "../../../types";
import { EditTopicInterestsCommand } from "./EditTopicInterestsCommand";
import { EditTopicInterestsReply } from "./EditTopicInterestsReply";
import { ChatRepository } from "../../../../db/repositories/ChatRepository";

export class EditTopicInterestsCommandHandler implements ICommandHandler<EditTopicInterestsCommand, EditTopicInterestsReply> {
  public async handle(command: EditTopicInterestsCommand): Promise<EditTopicInterestsReply> {
    await ChatRepository.editTopicInterests(command.topicId, command.interests);
    const allTopics = await ChatRepository.getAllTopics();
    return new EditTopicInterestsReply(allTopics);
  }
}