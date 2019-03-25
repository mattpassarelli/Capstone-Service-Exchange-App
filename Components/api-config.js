import io from "socket.io-client"

let backendHost;


backendHost = "https://uexchange-backend.herokuapp.com/"
// backendHost = "http://10.51.128.90:3000"

const socket = io(backendHost, { transports: ["websocket"] });

export const API_ENDPOINT = socket