import { authSocket, createTopic, joinTopic, onLeave, onMessage } from "../api/controllers/socketController";

export const setupSocket = (io: any) => {
    io.use(authSocket);

    io.on('connection', (socket: any) => {
        socket.on('createTopic', (topicName: string, interests: string[], privacy: boolean, createdBy: string) => createTopic(socket, topicName, interests, privacy, createdBy));
        socket.on('joinTopic', (topicId: string) => joinTopic(socket, topicId));
        socket.on('message', ({ topicId, text }: { topicId: string, text: string }) => onMessage(socket, {topicId, text}));

        socket.on('leaveTopic', (topicId: string) => onLeave(socket, topicId));
    });
};
