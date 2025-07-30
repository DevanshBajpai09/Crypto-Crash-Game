import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // change to Render URL on deploy
export default socket;
