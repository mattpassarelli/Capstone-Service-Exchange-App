import io from "socket.io-client"

let backendHost;


//backendHost = https://uexchange-backend.herokuapp.com/", { transports: ['websocket'] })
backendHost = "http://137.155.193.5:3000"

const socket = io(backendHost, { transports: ["websocket"] });

export const API_ENDPOINT = socket