export class LeaveTopicCommand {
  constructor(
    public readonly topicId: string,
    public readonly username: string
  ) {}
}