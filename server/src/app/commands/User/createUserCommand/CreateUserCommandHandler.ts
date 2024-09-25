import {ICommandHandler} from "../../../types";
import {CreateUserCommand} from "./CreateUserCommand";
import {CreateUserReply} from "./CreateUserReply";
import {UserRepository} from "../../../../db/repositories/UserRepository";
import bcrypt from "bcryptjs";

export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand, CreateUserReply> {
    public async handle(command: CreateUserCommand): Promise<CreateUserReply> {
        try {
            //hash the password
            command.password = await bcrypt.hash(command.password, 12);

            console.log('create user', command.username, command.email, command.password)

            const user = await UserRepository.createUser(command.username, command.email, command.password);

            return { user }
        } catch (e) {
            throw new Error((e as any).message)
        }
    }
}
