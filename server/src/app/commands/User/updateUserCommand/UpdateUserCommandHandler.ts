import { ICommandHandler } from "../../../types";
import { UserRepository } from "../../../../db/repositories/UserRepository";
import { UpdateUserCommand } from "./UpdateUserCommand";
import { UpdateUserReply } from "./UpdateUserReply";

export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand, UpdateUserReply> {
	public async handle(command: UpdateUserCommand): Promise<UpdateUserReply> {
		try {
			const user = await UserRepository.fetchUserById(command.userId);

			if (!user) {
				throw new Error("User not found!");
			}

			if (command.interests) {
				user.interests = command.interests;
			}

			if (command.username) {
				user.username = command.username;
			}

			const updatedUser = await UserRepository.updateUser(command.userId, user);

			return {user: updatedUser!}
		} catch (e) {
			throw new Error((e as any).message)
		}
	}
}
