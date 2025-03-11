import { Server } from "socket.io";
import { notifyHR, sendMessage } from "./chat/index.js";
import { authSocket } from "../middlewares/auth.socket.middleware.js";
export const initSocket=(server)=>{
    const io=new Server(server,{
        cors:{
            origin:"*"
        }
    })
    //middleware
    io.use(authSocket)
    // connection
    io.on("connection",(socket)=>{
socket.on("sendMessage",sendMessage(socket,io))
socket.on("notifyHR",notifyHR(socket,io))
    })
}