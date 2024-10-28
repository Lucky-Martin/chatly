import jwt from "jsonwebtoken";
import { ChatRepository } from "../../db/repositories/ChatRepository";
import { FetchUserQuery } from "../../app/queries/User/fetchUserQuery/FetchUserQuery";
import { FetchUserQueryHandler } from "../../app/queries/User/fetchUserQuery/FetchUserQueryHandler";
import { io, profanityFilter } from "../../index";

export const authSocket = (socket: any, next: any) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }
  jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
    if (err) {
      return next(new Error("Authentication error"));
    }
    socket.user = decoded;
    next();
  });
};

export const createTopic = async (
  socket: any,
  topicName: string,
  privacy: boolean,
  createdBy: string
) => {
  if (profanityFilter.isProfane(topicName)) {
    throw new Error("profanity");
  }

  const newTopic = await ChatRepository.createTopic(
    topicName,
    privacy,
    createdBy
  );
  const allTopics = await ChatRepository.getAllTopics();

  socket.emit("topicCreated", newTopic);

  io.emit("topicsUpdated", allTopics);
};

export const joinTopic = async (socket: any, topicId: string) => {
  socket.join(topicId);
  // ChatRepository.addParticipant(topicId, )
  const topic = await ChatRepository.getTopicById(topicId);
  if (topic) {
    socket.emit("messages", topic.messages);
    await ChatRepository.addParticipant(topic.id, socket.user.user.username);

    const topicParticipants = await ChatRepository.getParticipants(topicId);
    socket.nsp.to(topicId).emit("participantsUpdated", topicParticipants);

    const allTopics = await ChatRepository.getAllTopics();
    io.emit("topicsUpdated", allTopics);
  }
};

export const onLeave = async (socket: any, topicId: string) => {
  socket.leave(topicId);

  await ChatRepository.removeParticipant(topicId, socket.user.user.username);
  const topicParticipants = await ChatRepository.getParticipants(topicId);

  socket.nsp.to(topicId).emit("participantsUpdated", topicParticipants);

  const allTopics = await ChatRepository.getAllTopics();
  io.emit("topicsUpdated", allTopics);
};

export const onMessage = async (
  socket: any,
  { topicId, text }: { topicId: string; text: string }
) => {
  let userId;
  if (socket.user.user) {
    userId = socket.user.user._id;
  } else {
    userId = socket.user.id;
  }

  let user;
  try {
    if (profanityFilter.isProfane(text)) {
      throw new Error("profanity");
    }

    const query = new FetchUserQuery(userId, null);
    const queryHandler = new FetchUserQueryHandler();
    const userResult = await queryHandler.handle(query);

    user = userResult.user;
    if (!user) {
      throw new Error("User not found");
    }

    const message = await ChatRepository.addMessageToTopic(
      topicId,
      user!.username,
      text
    );
    if (message) {
      io.to(topicId).emit("message", message);
    }

    const allTopics = await ChatRepository.getAllTopics();
    io.emit("topicsUpdated", allTopics);
  } catch (e: any) {
    console.log(e.message ? e.message : "Error while fetching user");
  }
};
