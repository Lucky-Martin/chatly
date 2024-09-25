import {IUser} from "../../../../db/models/User";

export class CreateUserCommand {
    constructor(public username: string, public email: string, public password: string) {
        if (!email || !password || !username) {
            throw new Error("Details not provided")
        }
    }
}
