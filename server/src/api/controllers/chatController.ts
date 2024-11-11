import { Request, Response } from 'express';
import {ChatRepository} from "../../db/repositories/ChatRepository";
import { codeGenerator } from "../../app/codeGenerator";

export const getTopics = async (req: Request, res: Response) => {
    const topics = await ChatRepository.getAllTopics();
    res.json(topics);
};

export const createNewTopic = async (req: Request, res: Response) => {
    const { name, privacyState, createdBy } = req.body;
    const newTopic = await ChatRepository.createTopic(name, privacyState, createdBy);
    const topics = await ChatRepository.getAllTopics();

    res.status(201).json({topic: newTopic, allTopics: topics});
};

export const getRoomIdByCode = async (req: Request, res: Response) => {
    const { roomCode } = req.params;
    try {
        if (!codeGenerator.isCodeValid(roomCode)) {
            throw new Error("Invalid room code")
        }

        const topic = await ChatRepository.getTopicByRoomCode(roomCode);
        res.status(201).json({topic});
    } catch (e) {
        res.status(500).json({message: (e as Error).message});
    }
}

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
