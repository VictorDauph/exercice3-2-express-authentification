import { Request, response, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import User, { UserI } from "../DBSchema/User";
import Playlist, { PlayListI } from "../DBSchema/Playlist";
import { getUserIdFromPayload } from "../utils/JWTUtils";
import Song, { SongI } from "../DBSchema/Song";

export async function createPlaylist(req: Request, res: Response) {
    try {
        const userId = getUserIdFromPayload(req.headers.payload as string);

        const { name, description } = req.body;

        if (!name) {
            res.status(400).send({ message: "champs name requis" })
            return
        }

        const user: UserI | null = await User.findById(userId);

        if (!user) {
            res.status(404).send({ message: "utilisateur introuvable" })
            return
        }

        const playlist: PlayListI = new Playlist({ name, description, userId })

        const createdPlaylist = await playlist.save()

        res.status(200).send({ message: "playlist créée avec succès", playlist: createdPlaylist })

    } catch (err: any) {
        res.status(500).send({ message: err.message })
    }


}

export async function addSongToPlaylist(req: Request, res: Response) {
    try {
        const userId = getUserIdFromPayload(req.headers.payload as string);
        const { playlistId, songId } = req.body

        const user: UserI | null = await User.findById(userId);

        if (!user) {
            res.status(404).send({ message: "utilisateur introuvable" })
            return
        }

        if (!songId || !playlistId) {
            res.status(400).send({ message: "champs song Id et playlistID requis" })
        }

        const playlist: PlayListI | null = await Playlist.findById(playlistId);
        const song: SongI | null = await Song.findById(songId);

        if (playlist === null) {
            res.status(404).send({ message: "playlist not found" })
            return
        }

        if (song === null) {
            res.status(404).send({ message: "song not found" })
            return
        }

        if (playlist.userId !== userId) {
            res.status(401).send({ message: "you have no right to touch this playlist" })
            return
        }

        playlist.songs.push(songId)

        const updatedPlaylist = await playlist.save();

        res.status(200).send({ message: "chanson ajoutée", playlist: updatedPlaylist })
    } catch (err: any) {
        res.status(500).send({ message: err.message })
    }
}

export async function getSongsFromPlaylist(req: Request, res: Response) {
    try {
        const userId = getUserIdFromPayload(req.headers.payload as string);
        const { playlistId } = req.params;

        const user: UserI | null = await User.findById(userId);

        if (!user) {
            res.status(404).send({ message: "utilisateur introuvable" })
            return
        }

        const playlist: PlayListI | null = await Playlist.findById(playlistId);

        if (playlist === null) {
            res.status(404).send({ message: "playlist not found" })
            return
        }

        if (playlist.userId !== userId) {
            res.status(401).send({ message: "you have no right to touch this playlist" })
            return
        }

        const songs = await Song.find({ _id: { $in: playlist.songs } });

        res.status(200).send({ message: 'chansons trouvées', playlist, songs })
    } catch (err: any) {
        res.status(500).send({ message: err.message })
    }

}

export async function deleteSongOfPlaylist(req: Request, res: Response) {
    try {
        const userId = getUserIdFromPayload(req.headers.payload as string);
        const { playlistId, songId } = req.body

        const user: UserI | null = await User.findById(userId);

        if (!user) {
            res.status(404).send({ message: "utilisateur introuvable" })
            return
        }

        if (!songId || !playlistId) {
            res.status(400).send({ message: "champs song Id et playlistID requis" })
        }

        const playlist: PlayListI | null = await Playlist.findById(playlistId);
        const song: SongI | null = await Song.findById(songId);

        if (playlist === null) {
            res.status(404).send({ message: "playlist not found" })
            return
        }

        if (song === null) {
            res.status(404).send({ message: "song not found" })
            return
        }

        if (playlist.userId !== userId) {
            res.status(401).send({ message: "you have no right to touch this playlist" })
            return
        }

        const index = playlist.songs.lastIndexOf(songId);
        if (index !== -1) {
            playlist.songs.splice(index, 1); // Supprime l'élément à l'index trouvé

        } else {
            res.status(400).send({ message: "La chanson " + songId + " n'est pas dans la playlist", playlist: playlist })
            return
        }

        const updatedPlaylist = await playlist.save();

        res.status(200).send({ message: "chanson supprimée", playlist: updatedPlaylist })
    } catch (err: any) {
        res.status(500).send({ message: err.message })
    }

}

export async function deletePlaylist(req: Request, res: Response) {
    try {
        const userId = getUserIdFromPayload(req.headers.payload as string);
        const { playlistId } = req.params;

        const user: UserI | null = await User.findById(userId);

        if (!user) {
            res.status(404).send({ message: "utilisateur introuvable" })
            return
        }

        if (!playlistId) {
            res.status(400).send({ message: "playlistID requis" })
        }

        const playlist: PlayListI | null = await Playlist.findById(playlistId);

        if (playlist === null) {
            res.status(404).send({ message: "playlist not found" })
            return
        }

        if (playlist.userId !== userId) {
            res.status(401).send({ message: "you have no right to touch this playlist" })
            return
        }

        const deletedPlaylist = await playlist.deleteOne();

        res.status(200).send({ message: "playlist supprimée", MongoDbAnswer: deletedPlaylist, playlist })
    } catch (err: any) {
        res.status(500).send({ message: err.message })
    }

}