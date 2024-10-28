import { IMessage } from "./IMessage";
import { IParticipants } from "./IParticipants";

export interface ITopic {
  id: string;
  name: string;
  privacyState: boolean;
  createdBy: string;
  messages: IMessage[];
  participants: IParticipants[];
}
