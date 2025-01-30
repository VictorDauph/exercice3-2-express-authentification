import express from "express";
import { addSongToPlaylist, createPlaylist, deletePlaylist, deleteSongOfPlaylist, getSongsFromPlaylist } from "../controllers/playlistController";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";

const router = express.Router();


router.post('/', verifyTokenMiddleware, createPlaylist)
router.put('/new', verifyTokenMiddleware, addSongToPlaylist)
router.put('/removeLast', verifyTokenMiddleware, deleteSongOfPlaylist)
router.get('/:playlistId', verifyTokenMiddleware, getSongsFromPlaylist)
router.delete('/:playlistId', verifyTokenMiddleware, deletePlaylist)


export default router;