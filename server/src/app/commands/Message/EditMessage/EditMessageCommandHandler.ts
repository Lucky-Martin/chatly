import { ICommandHandler } from "../../../types";
import { EditMessageCommand } from "./EditMessageCommand";
import { EditMessageReply } from "./EditMessageReply";
import { ChatRepository } from "../../../../db/repositories/ChatRepository";

export class EditMessageCommandHandler implements ICommandHandler<EditMessageCommand, EditMessageReply> {
  public async handle(command: EditMessageCommand): Promise<EditMessageReply> {
    const topic = await ChatRepository.getTopicById(command.roomId);
    if (!topic) {
      return new EditMessageReply(null, null);
    }

    await ChatRepository.editMessage(topic.id, command.messageId, command.newMessage);
    const allTopics = await ChatRepository.getAllTopics();
    return new EditMessageReply(topic, allTopics);
  }
}