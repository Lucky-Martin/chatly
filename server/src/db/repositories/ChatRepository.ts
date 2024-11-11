import { randomUUID } from "node:crypto";
import { codeGenerator } from "../../app/codeGenerator";

export interface Message {
	user: string;
	text: string;
	timestamp: number;
}

export interface Topic {
	id: string;
	roomCode: string;
	name: string;
	privacyState: boolean;
	createdBy: string;
	messages: Message[];
	participants: string[];
}

const topics: Topic[] = [];

export class ChatRepository {
	public static async getAllTopics(): Promise<Topic[]> {
		return topics;
	}

	public static async createTopic(topicName: string, privacy: boolean, createdBy: string): Promise<Topic> {
		const newTopic: Topic = {
			id: randomUUID(),
			name: topicName,
			privacyState: privacy,
			createdBy,
			messages: [],
			participants: [],
            roomCode: codeGenerator.generateCode()
		};
		topics.push(newTopic);

		return newTopic;
	}

	public static async getTopicById(topicId: string): Promise<Topic | undefined> {
		return topics.find(topic => topic.id === topicId);
	}

	public static async getTopicByRoomCode(roomCode: string): Promise<Topic | undefined> {
		return topics.find(topic => topic.roomCode === roomCode);
	}

	public static async getParticipants(topicId: string) {
		return topics.find(topic => topic.id === topicId)?.participants;
	}

	public static async addParticipant(topicId: string, username: string) {
		const topic = topics.find(topic => topic.id === topicId);
		const alreadyIn = topic?.participants.indexOf(username) !== -1;

		if (topic && !alreadyIn) {
			topic.participants.push(username);
		}
	}

	public static async removeParticipant(topicId: string, username: string) {
		const topic = topics.find(topic => topic.id === topicId);
		if (topic) {
			const participantIndex = topic.participants.indexOf(username);
			if (participantIndex > -1) {
				topic.participants.splice(participantIndex, 1);
			}
		}
	}

	public static async addMessageToTopic(topicId: string, user: string, text: string): Promise<Message | null> {
		const topic = await this.getTopicById(topicId);

		if (topic) {
			const message: Message = {user, text, timestamp: Date.now()};
			topic.messages.push(message);
			return message;
		}

		return null;
	}
}
