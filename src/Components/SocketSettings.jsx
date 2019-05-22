import io from "socket.io-client";
import { Manager } from "socket.io-client";

//USE IP ADDRESS FOR TESTING ON MOBILE WITH NODEMON 
const socket = io("http://192.168.2.127:4000", {
   autoConnect: false
});

export default socket;
