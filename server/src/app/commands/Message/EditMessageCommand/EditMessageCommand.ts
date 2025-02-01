export class EditMessageCommand {
  constructor(
    public readonly roomId: string,
    public readonly messageId: string,
    public readonly newMessage: string
  ) {}
}