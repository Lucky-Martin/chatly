import { ICommandHandler } from "../../../types";
import { AddMessageCommand } from "./AddMessageCommand";
import { AddMessageReply } from "./AddMessageReply";
import { ChatRepository } from "../../../../db/repositories/ChatRepository";

export class AddMessageCommandHandler implements ICommandHandler<AddMessageCommand, AddMessageReply> {
  public async handle(command: AddMessageCommand): Promise<AddMessageReply> {
    const message = await ChatRepository.addMessageToTopic(command.topicId, command.user, command.text);
    return new AddMessageReply(message);
  }
}