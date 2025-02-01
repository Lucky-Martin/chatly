export class EditTopicInterestsCommand {
  constructor(
    public readonly topicId: string,
    public readonly interests: string[]
  ) {}
}