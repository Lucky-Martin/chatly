import { IMessage } from "../../../../db/repositories/ChatRepository";

export class AddMessageReply {
  constructor(
    public readonly message: IMessage | null
  ) {}
}