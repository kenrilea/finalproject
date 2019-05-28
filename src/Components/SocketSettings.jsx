import io from "socket.io-client";
import { Manager } from "socket.io-client";

//USE IP ADDRESS FOR TESTING ON MOBILE WITH NODEMON
const socket = io("http://134.209.119.133:4000", {
   autoConnect: false,
});

socket.connect("http://134.209.119.133:4000")


export default socket;
