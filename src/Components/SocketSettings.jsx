import io from "socket.io-client";
import { Manager } from "socket.io-client";

const socket = io("http://10.65.110.65:4000", {
   autoConnect: false
});

export default socket;
