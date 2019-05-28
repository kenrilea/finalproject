import io from "socket.io-client";
import { Manager } from "socket.io-client";

//USE IP ADDRESS FOR TESTING ON MOBILE WITH NODEMON
const socket = io.connect("http://134.209.119.133:4000", {
   autoConnect: false,
});




export default socket;
