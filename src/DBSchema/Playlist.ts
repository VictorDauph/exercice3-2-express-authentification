import mongoose, { Document, Schema } from "mongoose"

export interface PlayListI extends Document {
    name: string,
    description: string,
    songs: string[],
    userId: string
}

const PlaylistSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    songs: { type: [String], required: true, default: [] },  // Ajout de la liste des chansons
    userId: { type: String, required: true }
});

export default mongoose.model<PlayListI>('Playlist', PlaylistSchema);
