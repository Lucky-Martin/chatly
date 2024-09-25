import {ChatRepository} from "../db/repositories/ChatRepository";
import jwt from "jsonwebtoken";
import {FetchUserQuery} from "./queries/User/fetchUserQuery/FetchUserQuery";
import {FetchUserQueryHandler} from "./queries/User/fetchUserQuery/FetchUserQueryHandler";

export const setupSocket = (io: any) => {
    io.use((socket: any, next: any) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
            if (err) {
                return next(new Error('Authentication error'));
            }
            socket.user = decoded;
            next();
        });
    });

    io.on('connection', (socket: any) => {
        // console.log('a user connected:', socket.user);

        socket.on('createTopic', async (topicName: string) => {
            await ChatRepository.createTopic(topicName);
            const allTopics = await ChatRepository.getAllTopics();

            io.emit('topicsUpdated', allTopics);
        });

        socket.on('joinTopic', async (topicId: string) => {
            socket.join(topicId);
            const topic = await ChatRepository.getTopicById(topicId);
            if (topic) {
                socket.emit('messages', topic.messages);
            }
        });

        socket.on('leaveTopic', (topicId: string) => {
            socket.leave(topicId);
        });

        socket.on('message', async ({ topicId, text }: { topicId: string, text: string }) => {
            let userId;
            if (socket.user.user) {
                userId = socket.user.user._id;
            } else {
                userId = socket.user.id;
            }

            let user;
            try {
                const query = new FetchUserQuery(userId, null);
                const queryHandler = new FetchUserQueryHandler();
                const userResult = await queryHandler.handle(query);

                user = userResult.user;
                if (!user) {
                    throw new Error('User not found');
                }

                const message = await ChatRepository.addMessageToTopic(topicId, user!.username, text);
                if (message) {
                    io.to(topicId).emit('message', message);
                }
            } catch (e) {
                console.log('Error while fetching user');
            }
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
};
