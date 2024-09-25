import {IQueryHandler} from "../../../types";
import {FetchUserQuery} from "./FetchUserQuery";
import {FetchUserQueryReply} from "./FetchUserQueryReply";
import {UserRepository} from "../../../../db/repositories/UserRepository";

export class FetchUserQueryHandler implements IQueryHandler<FetchUserQuery, FetchUserQueryReply> {
    public async handle(query: FetchUserQuery): Promise<FetchUserQueryReply> {
        try {
            let user;
            if (query.id) {
                user = await UserRepository.fetchUserById(query.id);
            } else if (query.email) {
                user = await UserRepository.fetchUserByEmail(query.email);
            }

            if (!user) {
                throw new Error("User not found");
            }

            return {user}
        } catch (e) {
            return {
                user: null
            }
        }
    }
}
