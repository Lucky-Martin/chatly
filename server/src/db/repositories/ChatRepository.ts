import {randomUUID} from "node:crypto";

export interface Message {
    user: string;
    text: string;
    timestamp: number;
}

export interface Topic {
    id: string;
    name: string;
    messages: Message[];
}

const topics: Topic[] = [];

export class ChatRepository {
    public static async getAllTopics(): Promise<Topic[]> {
        return topics;
    }

    public static async createTopic(topicName: string): Promise<Topic> {
        const newTopic: Topic = { id: randomUUID(), name: topicName, messages: [] };
        topics.push(newTopic);

        return newTopic;
    }

    public static async getTopicById(topicId: string): Promise<Topic | undefined> {
        return topics.find(topic => topic.id === topicId);
    }

    public static async addMessageToTopic(topicId: string, user: string, text: string): Promise<Message | null> {
        const topic = await this.getTopicById(topicId);

        if (topic) {
            const message: Message = { user, text, timestamp: Date.now() };
            topic.messages.push(message);
            return message;
        }

        return null;
    }
}
