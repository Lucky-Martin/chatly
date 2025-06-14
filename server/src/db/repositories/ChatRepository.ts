import { randomUUID } from "node:crypto";
import { codeGenerator } from "../../app/utils/codeGenerator";

export interface IMessage {
	user: string;
	text: string;
	timestamp: number;
	messageId: string;
}

export interface ITopic {
	id: string;
	roomCode: string;
	name: string;
	privacyState: boolean;
	createdBy: string;
	messages: IMessage[];
	participants: string[];
	interests: string[];
}

export class ChatRepository {
	private static topics: ITopic[] = [
		{
			id: randomUUID(),
			roomCode: "TECH2024",
			name: "🚀 Future of AI & Web Development",
			privacyState: false,
			createdBy: "demo_user",
			messages: [
				{
					user: "demo_user",
					text: "Welcome everyone! Let's discuss the latest trends in AI and web development.",
					timestamp: Date.now() - 3600000,
					messageId: randomUUID()
				},
				{
					user: "tech_enthusiast",
					text: "I'm particularly excited about the new AI-powered development tools that are emerging!",
					timestamp: Date.now() - 3500000,
					messageId: randomUUID()
				},
				{
					user: "web_dev",
					text: "The combination of AI and modern web frameworks is revolutionizing how we build applications.",
					timestamp: Date.now() - 3400000,
					messageId: randomUUID()
				}
			],
			participants: [],
			interests: ["AI", "Web Development", "Technology", "Innovation"]
		},
		{
			id: randomUUID(),
			roomCode: "DESIGN101",
			name: "🎨 UI/UX Design",
			privacyState: false,
			createdBy: "design_expert",
			messages: [
				{
					user: "design_expert",
					text: "Today we'll be discussing the latest UI/UX design trends and best practices.",
					timestamp: Date.now() - 7200000,
					messageId: randomUUID()
				},
				{
					user: "ui_designer",
					text: "I've been experimenting with micro-interactions lately. They really enhance user engagement!",
					timestamp: Date.now() - 7100000,
					messageId: randomUUID()
				},
				{
					user: "ux_researcher",
					text: "Accessibility should be at the forefront of our design decisions. Anyone have tips for better accessibility implementation?",
					timestamp: Date.now() - 7000000,
					messageId: randomUUID()
				}
			],
			participants: [],
			interests: ["UI Design", "UX Design", "Accessibility", "Design Systems"]
		}
	];

	public static async getAllTopics(): Promise<ITopic[]> {
		return this.topics;
	}

	public static async createTopic(topicName: string, interests: string[], privacy: boolean, createdBy: string): Promise<ITopic> {
		const newTopic: ITopic = {
			id: randomUUID(),
			name: topicName,
			privacyState: privacy,
			createdBy,
			messages: [],
			participants: [],
            roomCode: codeGenerator.generateCode(),
			interests
		};
		this.topics.push(newTopic);

		return newTopic;
	}

	public static async editTopicInterests(topicId: string, interests: string[]): Promise<void> {
		const topic = this.topics.find(topic => topic.id === topicId);

        if (topic) {
            topic.interests = interests;
        }
	}

	public static async getTopicById(topicId: string): Promise<ITopic | undefined> {
		return this.topics.find(topic => topic.id === topicId);
	}

	public static async getTopicByCode(topicCode: string): Promise<ITopic | undefined> {
		return this.topics.find(topic => topic.roomCode === topicCode);
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

	public static async addMessageToTopic(topicId: string, user: string, text: string): Promise<IMessage | null> {
		const topic = await this.getTopicById(topicId);

		if (topic) {
			const message: IMessage = {user, text, timestamp: Date.now(), messageId: randomUUID()  };
			topic.messages.push(message);
			return message;
		}

		return null;
	}

	public static async editMessage(topicId: string, messageId: string, newMessage: string): Promise<void> {
		const topic = await this.getTopicById(topicId);
		if (topic) {
			const messageIndex = topic.messages.findIndex(message => message.messageId === messageId);
            if (messageIndex > -1) {
                topic.messages[messageIndex].text = newMessage;
            }
		}
	}

	public static async deleteMessage(topicId: string, messageId: string): Promise<boolean> {
		const topic = await this.getTopicById(topicId);
		if (topic) {
			const messageIndex = topic.messages.findIndex(message => message.messageId === messageId);
			if (messageIndex > -1) {
				await this.editMessage(topicId, messageId, "This message was deleted...");
				return true;
			}
		}
		return false;
	}
}
