import { Router } from 'express';
import { addMessage, createNewTopic, deleteMessage, editMessage, editTopicInterests, getTopicByCode, getTopicMessages, getTopics } from "../controllers/chatController";
import { isAuth } from "../middleware/isAuth";

const router = Router();

router.get('/topics', isAuth, getTopics);
router.get('/topics/:id', isAuth, getTopicMessages);
router.get('/roomCode/:roomCode', isAuth, getTopicByCode);

router.post('/topics', isAuth, createNewTopic);
router.post('/topics/:id/message', isAuth, addMessage);

router.patch('/topics/:roomId', isAuth, editTopicInterests);
router.patch('/message', isAuth, editMessage);

router.delete('/message/:topicId/:messageId', isAuth, deleteMessage);

export { router as chatRouter };
