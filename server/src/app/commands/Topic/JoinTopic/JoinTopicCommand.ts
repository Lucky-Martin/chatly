export class JoinTopicCommand {
  constructor(
    public readonly topicId: string,
    public readonly username: string
  ) {}
}