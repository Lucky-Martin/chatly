import {IUser} from "../../../../db/models/User";

export class FetchUserQueryReply {
    user!: IUser | null;
}
