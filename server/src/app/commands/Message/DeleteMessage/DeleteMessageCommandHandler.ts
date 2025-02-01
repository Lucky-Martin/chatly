import { ICommandHandler } from "../../../types";
import { DeleteMessageCommand } from "./DeleteMessageCommand";
import { DeleteMessageReply } from "./DeleteMessageReply";
import { ChatRepository } from "../../../../db/repositories/ChatRepository";

export class DeleteMessageCommandHandler implements ICommandHandler<DeleteMessageCommand, DeleteMessageReply> {
  public async handle(command: DeleteMessageCommand): Promise<DeleteMessageReply> {
    const topic = await ChatRepository.getTopicById(command.topicId);
    if (!topic) {
      throw new Error("Topic not found");
    }

    const message = topic.messages.find(m => m.messageId === command.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    const success = await ChatRepository.deleteMessage(command.topicId, command.messageId);
    const allTopics = await ChatRepository.getAllTopics();

    return new DeleteMessageReply(success, allTopics);
  }
}