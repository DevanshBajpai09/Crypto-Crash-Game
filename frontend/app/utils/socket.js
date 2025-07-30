import { io } from "socket.io-client";

const socket = io("https://crypto-crash-game-12-backend.onrender.com");
export default socket;
