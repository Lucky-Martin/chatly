import { ICommandHandler } from "../../../types";
import { LeaveTopicCommand } from "./LeaveTopicCommand";
import { ChatRepository } from "../../../../db/repositories/ChatRepository";
import { LeaveTopicReply } from "./LeaveTopicReply";

export class LeaveTopicCommandHandler implements ICommandHandler<LeaveTopicCommand, LeaveTopicReply> {
  public async handle(command: LeaveTopicCommand): Promise<LeaveTopicReply> {
    await ChatRepository.removeParticipant(command.topicId, command.username);
    const participants = await ChatRepository.getParticipants(command.topicId) || [];
    const allTopics = await ChatRepository.getAllTopics();

    return new LeaveTopicReply(participants, allTopics);
  }
}