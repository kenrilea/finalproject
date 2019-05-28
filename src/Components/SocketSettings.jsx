import io from "socket.io-client";
import { Manager } from "socket.io-client";

//USE IP ADDRESS FOR TESTING ON MOBILE WITH NODEMON

//Ryan's droplet IP address
const socket = io("http://134.209.119.133:4000", {
   autoConnect: false,
});

export default socket;
