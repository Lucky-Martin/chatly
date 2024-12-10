export class UpdateUserCommand {
    constructor(public userId: string, public interests?: string[], public username?: string) {
        if ((!interests && !username) || !userId) {
            throw new Error("Details not provided");
        }
    }
}
