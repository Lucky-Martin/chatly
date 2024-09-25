import { Router } from 'express';
import {addMessage, createNewTopic, getTopicMessages, getTopics} from "../controllers/chatController";
import {isAuth} from "../middleware/isAuth";

const router = Router();

router.get('/topics', isAuth, getTopics);
router.post('/topics', isAuth, createNewTopic);
router.get('/topics/:id', isAuth, getTopicMessages);
router.post('/topics/:id/message', isAuth, addMessage);

export {router as chatRouter};
