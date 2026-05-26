import dotenv from "dotenv";
dotenv.config({path : "./.env"});

import connectWithDB from "./configs/connectDB.js";
import app from "./app.js";

// cron job 
import { initCronJobs } from "./configs/cron_job.js";
import initSocket from "./configs/initializingSocketIoServer.js";
import { createServer } from "node:http";


const port = process.env.PORT || 8080;

app.get("/home", (req, res) => {
    return res.send("Server Working Successfully");
})

const httpServer = createServer(app);

initSocket(httpServer);

connectWithDB()
.then( () => {
    httpServer.listen(port, () => console.log(`Server is running on Port ${port}`));
} )
.catch( (error) => console.log(error) )

initCronJobs();

