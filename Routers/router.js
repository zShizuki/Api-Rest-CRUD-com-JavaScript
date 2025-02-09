import { Router } from "express"
import videosController from "../Controllers/videosController.js"

export default function router (){
    const { listAllVideos, getVideoById, deleteVideoById, createVideo, createListOfVideos } = videosController();
    const route = Router()

    route.get("/videos", listAllVideos)
    route.get("/videos/:id", getVideoById)
    route.delete('/videos/:id', deleteVideoById)
    route.post('/videos', createVideo)
    return route;
};
