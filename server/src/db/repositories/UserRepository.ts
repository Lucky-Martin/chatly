import User, {IUser} from "../models/User";

export class UserRepository {
    public static async createUser(username: string, email: string, password: string): Promise<IUser> {
        try {
            const userInstance = new User({
                username, email, password
            });
            await userInstance.save();

            return userInstance;
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public static async fetchUserById(id: string): Promise<IUser | null> {
        try {
            return await User.findOne({_id: id});
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public static async fetchUserByEmail(email: string): Promise<IUser | null> {
        try {
            return await User.findOne({email});
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public static async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { $set: userData },
                { new: true }
            );

            return updatedUser;
        } catch (e: any) {
            throw new Error(e.message);
        }
    }
}
