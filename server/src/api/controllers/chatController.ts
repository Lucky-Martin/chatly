import { Request, Response } from "express";
import { io } from "../../index";
import { CreateNewTopicCommand } from "../../app/commands/Topic/CreateNewTopic/CreateNewTopicCommand";
import { CreateNewTopicCommandHandler } from "../../app/commands/Topic/CreateNewTopic/CreateNewTopicCommandHandler";
import { EditTopicInterestsCommand } from "../../app/commands/Topic/EditTopicInterests/EditTopicInterestsCommand";
import { EditTopicInterestsCommandHandler } from "../../app/commands/Topic/EditTopicInterests/EditTopicInterestsCommandHandler";
import { GetTopicsQuery } from "../../app/queries/Topic/GetTopicsQuery/GetTopicsQuery";
import { GetTopicsQueryHandler } from "../../app/queries/Topic/GetTopicsQuery/GetTopicsQueryHandler";
import { GetTopicByCodeQuery } from "../../app/queries/Topic/GetTopicByCodeQuery/GetTopicByCodeQuery";
import { GetTopicByCodeQueryHandler } from "../../app/queries/Topic/GetTopicByCodeQuery/GetTopicByCodeQueryHandler";
import { GetTopicMessagesQuery } from "../../app/queries/Topic/GetTopicMessagesQuery/GetTopicMessagesQuery";
import { GetTopicMessagesQueryHandler } from "../../app/queries/Topic/GetTopicMessagesQuery/GetTopicMessagesQueryHandler";
import { AddMessageCommand } from "../../app/commands/Message/AddMessageCommand/AddMessageCommand";
import { AddMessageCommandHandler } from "../../app/commands/Message/AddMessageCommand/AddMessageCommandHandler";
import { EditMessageCommand } from "../../app/commands/Message/EditMessageCommand/EditMessageCommand";
import { EditMessageCommandHandler } from "../../app/commands/Message/EditMessageCommand/EditMessageCommandHandler";

export const getTopics = async (req: Request, res: Response) => {
  const query = new GetTopicsQuery();
  const handler = new GetTopicsQueryHandler();

  try {
    const result = await handler.handle(query);
    res.json(result.topics);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createNewTopic = async (req: Request, res: Response) => {
  const { name, privacyState, createdBy, interests } = req.body;

  const command = new CreateNewTopicCommand(name, privacyState, createdBy, interests);
  const handler = new CreateNewTopicCommandHandler();

  try {
    const reply = await handler.handle(command);
    res.status(201).json({ topic: reply.topic, allTopics: reply.allTopics });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const editTopicInterests = async (req: Request, res: Response) => {
  const { interests } = req.body;
  const { roomId } = req.params;

  const command = new EditTopicInterestsCommand(roomId, interests);
  const handler = new EditTopicInterestsCommandHandler();

  try {
    const reply = await handler.handle(command);
    io.emit("topicsUpdated", reply.allTopics);
    res.status(200).json({ topics: reply.allTopics });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getTopicByCode = async (req: Request, res: Response) => {
  const { topicCode } = req.params;
  const query = new GetTopicByCodeQuery(topicCode);
  const handler = new GetTopicByCodeQueryHandler();

  try {
    const result = await handler.handle(query);
    if (result.topic) {
      res.status(200).json({ topic: result.topic });
    } else {
      res.status(404).json({ message: "Topic not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getTopicMessages = async (req: Request, res: Response) => {
  const { id } = req.params;
  const query = new GetTopicMessagesQuery(id);
  const handler = new GetTopicMessagesQueryHandler();

  try {
    const reply = await handler.handle(query);
    if (reply.topic) {
      res.status(200).json(reply.topic);
    } else {
      res.status(404).json({ message: "Topic not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const addMessage = async (req: Request, res: Response) => {
  const { topicId, user, text } = req.body;
  const command = new AddMessageCommand(topicId, user, text);
  const handler = new AddMessageCommandHandler();

  try {
    const reply = await handler.handle(command);
    if (reply.message) {
      io.to(topicId).emit('newMessage', reply.message);
      res.status(201).json(reply.message);
    } else {
      res.status(404).json({ message: "Topic not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const editMessage = async (req: Request, res: Response) => {
  const { roomId, messageId, newMessage } = req.body;
  const command = new EditMessageCommand(roomId, messageId, newMessage);
  const handler = new EditMessageCommandHandler();

  try {
    const reply = await handler.handle(command);
    if (reply.topic && reply.allTopics) {
      io.emit("topicsUpdated", reply.allTopics);
      res.status(200).json({ message: "Message updated successfully" });
    } else {
      res.status(404).json({ message: "Topic not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};