export class DeleteMessageCommand {
  constructor(
    public readonly topicId: string,
    public readonly messageId: string,
    public readonly userId: string
  ) {}
}