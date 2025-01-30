import mongoose, { Document, Schema } from "mongoose"

export interface SongI extends Document {
    title: string,
    artist: string,
    duration: string
}

const SongSchema: Schema = new Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    duration: { type: String }
})

export default mongoose.model<SongI>('Song', SongSchema);
