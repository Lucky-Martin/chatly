import { Request, Response } from 'express';
import {ChatRepository} from "../../db/repositories/ChatRepository";

export const getTopics = async (req: Request, res: Response) => {
    const topics = await ChatRepository.getAllTopics();
    res.json(topics);
};

export const createNewTopic = async (req: Request, res: Response) => {
    const { name } = req.body;
    const newTopic = await ChatRepository.createTopic(name);
    const topics = await ChatRepository.getAllTopics();

    res.status(201).json({topic: newTopic, allTopics: topics});
};

export const getTopicMessages = async (req: Request, res: Response) => {
    const { id } = req.params;
    const topic = await ChatRepository.getTopicById(id);
    if (topic) {
        res.json(topic);
    } else {
        res.status(404).send('Topic not found');
    }
};

export const addMessage = async (req: Request, res: Response) => {
    const { topicId, user, text } = req.body;
    const message = await ChatRepository.addMessageToTopic(topicId, user, text);
    if (message) {
        res.status(201).json(message);
    } else {
        res.status(404).send('Topic not found');
    }
};
