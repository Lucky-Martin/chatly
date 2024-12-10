export interface ICommandHandler<TCommand, TReply> {
    handle(command: TCommand): Promise<TReply>;
}

export interface IQueryHandler<TQuery, TReply> {
    handle(query: TQuery): Promise<TReply>;
}
