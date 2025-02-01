import { ICommandHandler } from "../../../types";
import { JoinTopicCommand } from "./JoinTopicCommand";
import { ChatRepository } from "../../../../db/repositories/ChatRepository";
import { JoinTopicReply } from "./JoinTopicReply";

export class JoinTopicCommandHandler implements ICommandHandler<JoinTopicCommand, JoinTopicReply> {
  public async handle(command: JoinTopicCommand): Promise<JoinTopicReply> {
    const topic = await ChatRepository.getTopicById(command.topicId);
    if (!topic) {
      throw new Error("Topic not found");
    }

    await ChatRepository.addParticipant(command.topicId, command.username);
    const participants = await ChatRepository.getParticipants(command.topicId) || [];
    const allTopics = await ChatRepository.getAllTopics();

    return new JoinTopicReply(topic, participants, allTopics);
  }
}