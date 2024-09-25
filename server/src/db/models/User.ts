import mongoose, {Schema} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface IUser {
    username: string;
    email: string;
    password: string;
}

export interface IUserDoc extends IUser, Document { }

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const UserSchema: Schema = new Schema({
    username: {type: String, required: true, unique: true, minLength: 1},
    email: {type: String, required: true, unique: true, match: emailRegex},
    password: {type: String, required: true}
});

UserSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

export default mongoose.model<IUserDoc>('User', UserSchema);
