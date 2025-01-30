import mongoose, { Document, Schema } from "mongoose"

export interface UserI extends Document {
    name: string,
    hashedPassword: string,
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    hashedPassword: { type: String, required: true }
})

export default mongoose.model<UserI>('User', UserSchema);
