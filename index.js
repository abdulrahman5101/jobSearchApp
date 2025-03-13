import express from "express";
import bootStrap from "./src/app.controller.js";
import morgan from "morgan";
import chalk from "chalk";
import "./src/utils/cron-job/otp.cron.js"
import { initSocket } from "./src/socketio/index.js";
const app = express();
app.use(morgan("dev"))
const port = process.env.PORT || 3000;
bootStrap(app, express);
app.get("/", (req, res) => res.send("Hello World!"));
const server=app.listen(port, () => console.log(chalk.green(`Example app listening on port ${port}!`)));
initSocket(server)
