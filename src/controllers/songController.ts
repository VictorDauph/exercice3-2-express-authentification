import { Request, Response } from "express";
import Song, { SongI } from "../DBSchema/Song";

export async function createSong(req: Request, res: Response) {
    try {
        const { title, artist, duration } = req.body;

        if (!title || !artist) {
            res.status(400).send({ message: "champs title et artist requis" })
        }

        const newSong: SongI = new Song({ title, artist, duration })

        const createdSong = await newSong.save();

        res.status(201).send({ message: "chanson créée avec succès", song: createdSong })
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }


}