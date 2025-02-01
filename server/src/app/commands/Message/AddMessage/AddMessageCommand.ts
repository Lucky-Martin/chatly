export class AddMessageCommand {
  constructor(
    public readonly topicId: string,
    public readonly user: string,
    public readonly text: string
  ) {}
}