export class CreateNewTopicCommand {
  constructor(
    public readonly name: string,
    public readonly privacyState: boolean,
    public readonly createdBy: string,
    public readonly interests: string[]
  ) {}
}