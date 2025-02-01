import { ICommandHandler } from "../../../types";
import { CreateNewTopicCommand } from "./CreateNewTopicCommand";
import { CreateNewTopicReply } from "./CreateNewTopicReply";
import { ChatRepository } from "../../../../db/repositories/ChatRepository";

export class CreateNewTopicCommandHandler implements ICommandHandler<CreateNewTopicCommand, CreateNewTopicReply> {
  public async handle(command: CreateNewTopicCommand): Promise<CreateNewTopicReply> {
    const newTopic = await ChatRepository.createTopic(command.name, command.interests, command.privacyState, command.createdBy);
    const topics = await ChatRepository.getAllTopics();
    return new CreateNewTopicReply(newTopic, topics);
  }
}