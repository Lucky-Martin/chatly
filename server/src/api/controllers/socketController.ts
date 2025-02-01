import jwt from "jsonwebtoken";
import { ChatRepository } from "../../db/repositories/ChatRepository";
import { FetchUserQuery } from "../../app/queries/User/fetchUserQuery/FetchUserQuery";
import { FetchUserQueryHandler } from "../../app/queries/User/fetchUserQuery/FetchUserQueryHandler";
import { io, profanityFilter } from "../../index";
import { CreateNewTopicCommand } from "../../app/commands/Topic/CreateNewTopic/CreateNewTopicCommand";
import { CreateNewTopicCommandHandler } from "../../app/commands/Topic/CreateNewTopic/CreateNewTopicCommandHandler";
import { JoinTopicCommand } from "../../app/commands/Topic/JoinTopic/JoinTopicCommand";
import { JoinTopicCommandHandler } from "../../app/commands/Topic/JoinTopic/JoinTopicCommandHandler";
import { LeaveTopicCommand } from "../../app/commands/Topic/LeaveTopic/LeaveTopicCommand";
import { LeaveTopicCommandHandler } from "../../app/commands/Topic/LeaveTopic/LeaveTopicCommandHandler";
import { AddMessageCommand } from "../../app/commands/Message/AddMessageCommand/AddMessageCommand";
import { AddMessageCommandHandler } from "../../app/commands/Message/AddMessageCommand/AddMessageCommandHandler";

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

export const createTopic = async (socket: any, topicName: string, interests: string[], privacy: boolean, createdBy: string) => {
	const command = new CreateNewTopicCommand(topicName, privacy, createdBy, interests);
	const handler = new CreateNewTopicCommandHandler();

	try {
		const reply = await handler.handle(command);
		socket.emit("topicCreated", reply.topic);
		io.emit("topicsUpdated", reply.allTopics);
	} catch (error) {
		if (error instanceof Error && error.message === "Profanity is not allowed in topic names") {
			socket.emit("error", error.message);
		} else {
			console.error("Error creating topic:", error);
			socket.emit("error", "An error occurred while creating the topic");
		}
	}
};

export const joinTopic = async (socket: any, topicId: string) => {
	if (!topicId) {
		socket.emit("error", "Invalid topic ID");
		return;
	}

	const command = new JoinTopicCommand(topicId, socket.user.user.username);
	const handler = new JoinTopicCommandHandler();

	try {
		const reply = await handler.handle(command);

		socket.join(topicId);
		socket.emit("messages", reply.topic.messages);
		io.to(topicId).emit("participantsUpdated", reply.participants);
		io.emit("topicsUpdated", reply.allTopics);
	} catch (error) {
		console.error("Error joining topic:", error);
		if (error instanceof Error) {
			socket.emit("error", error.message);
		} else {
			socket.emit("error", "An error occurred while joining the topic");
		}
	}
};

export const onLeave = async (socket: any, topicId: string) => {
	if (!topicId) {
		socket.emit("error", "Invalid topic ID");
		return;
	}

	const command = new LeaveTopicCommand(topicId, socket.user.user.username);
	const handler = new LeaveTopicCommandHandler();

	try {
		const reply = await handler.handle(command);

		socket.leave(topicId);
		io.to(topicId).emit("participantsUpdated", reply.participants);
		io.emit("topicsUpdated", reply.allTopics);
	} catch (error) {
		console.error("Error leaving topic:", error);
		if (error instanceof Error) {
			socket.emit("error", error.message);
		} else {
			socket.emit("error", "An error occurred while leaving the topic");
		}
	}
};

export const onMessage = async (
	socket: any,
	{ topicId, text }: { topicId: string; text: string }
) => {
	let userId = socket.user.user ? socket.user.user._id : socket.user.id;

	try {
		if (profanityFilter.isProfane(text)) {
			throw new Error("Profanity is not allowed in messages");
		}

		const userQuery = new FetchUserQuery(userId, null);
		const userQueryHandler = new FetchUserQueryHandler();
		const userResult = await userQueryHandler.handle(userQuery);

		const user = userResult.user;
		if (!user) {
			throw new Error("User not found");
		}

		const command = new AddMessageCommand(topicId, user.username, text);
		const handler = new AddMessageCommandHandler();
		const reply = await handler.handle(command);

		if (reply.message) {
			io.to(topicId).emit("message", reply.message);
		}

		const allTopics = await ChatRepository.getAllTopics();
		io.emit("topicsUpdated", allTopics);
	} catch (error) {
		console.error("Error sending message:", error);
		if (error instanceof Error) {
			socket.emit("error", error.message);
		} else {
			socket.emit("error", "An error occurred while sending the message");
		}
	}
};
