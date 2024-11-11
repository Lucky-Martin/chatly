import { Router } from 'express';
import { addMessage, createNewTopic, getRoomIdByCode, getTopicMessages, getTopics } from "../controllers/chatController";
import {isAuth} from "../middleware/isAuth";

const router = Router();

router.get('/topics', isAuth, getTopics);
router.post('/topics', isAuth, createNewTopic);
router.get('/topics/:id', isAuth, getTopicMessages);
router.post('/topics/:id/message', isAuth, addMessage);
router.get('/roomCode/:roomCode', isAuth, getRoomIdByCode);

export {router as chatRouter};
