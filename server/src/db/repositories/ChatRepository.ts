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

export class ChatRepository {
	private static topics: Topic[] = [];

	public static async getAllTopics(): Promise<Topic[]> {
		return this.topics;
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
		this.topics.push(newTopic);

		return newTopic;
	}

	public static async getTopicById(topicId: string): Promise<Topic | undefined> {
		return this.topics.find(topic => topic.id === topicId);
	}

	public static async getTopicByRoomCode(roomCode: string): Promise<Topic | undefined> {
		return this.topics.find(topic => topic.roomCode === roomCode);
	}

	public static async getParticipants(topicId: string) {
		return this.topics.find(topic => topic.id === topicId)?.participants;
	}

	public static async addParticipant(topicId: string, username: string) {
		const topic = this.topics.find(topic => topic.id === topicId);
		const alreadyIn = topic?.participants.indexOf(username) !== -1;

		if (topic && !alreadyIn) {
			topic.participants.push(username);
		}
	}

	public static async removeParticipant(topicId: string, username: string) {
		const topic = this.topics.find(topic => topic.id === topicId);

		if (topic) {
			const participantIndex = topic.participants.indexOf(username);
			if (participantIndex > -1) {
				const topicIndex: number = this.topics.indexOf(topic);
				topic.participants.splice(participantIndex, 1)
				this.topics[topicIndex] = topic;
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
