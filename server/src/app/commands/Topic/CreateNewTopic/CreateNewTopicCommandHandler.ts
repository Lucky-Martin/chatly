import { ICommandHandler } from "../../../types";
import { CreateNewTopicCommand } from "./CreateNewTopicCommand";
import { CreateNewTopicReply } from "./CreateNewTopicReply";
import { ChatRepository } from "../../../../db/repositories/ChatRepository";
import { profanityFilter } from "../../../../index";

export class CreateNewTopicCommandHandler implements ICommandHandler<CreateNewTopicCommand, CreateNewTopicReply> {
  public async handle(command: CreateNewTopicCommand): Promise<CreateNewTopicReply> {
    if (profanityFilter.isProfane(command.name)) {
      throw new Error("Profanity is not allowed in topic names");
    }

    const newTopic = await ChatRepository.createTopic(command.name, command.interests, command.privacyState, command.createdBy);
    const topics = await ChatRepository.getAllTopics();
    return new CreateNewTopicReply(newTopic, topics);
  }
}