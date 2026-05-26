import { Server } from "socket.io";
// import { createServer } from "node:http";
import ApiError from "../utility/ApiError.js";
import { verifyAccessToken } from "../utility/tokens.js";
import {Server as HttpServer} from "node:http";
// this Server is a utility class

let io : Server;
// HttpServer is blueprint of what createServer creates / returns. 
const initSocket = (server : HttpServer) => {
    io = new Server(server, {
        cors : {
            origin : "*",
            methods : ["GET", "POST"],
            credentials : true
        }
    });


    io.use((socket, next) => {
        try {

            const accessToken = socket.handshake.auth.accessToken;

            if(accessToken) {
                const payload = verifyAccessToken(accessToken);
                socket.userId = payload?._id!;
                console.log(`Authenticated User Recognized - ${socket.id}`);
            }
            else {
                console.log(`Guest User Connected`);
            }

        } catch (error) {
            console.log(error);
            next(new ApiError(400, "Invalid Token"));
        }
    })


    io.on("connection", (socket) => {
        console.log(`Client Connected as Socket - ${socket.id}`);

        if(socket.userId) {
            socket.join(`user${socket.userId.toString()}`);
        }

        socket.on("disconnect", () => {
            console.log(`Socket Disconnected ${socket.id}`);
        })
    })
}


export default initSocket;


export const getIo = () => {
    if(!io) throw Error("Socket Server is not being Initialized");

    return io;
}