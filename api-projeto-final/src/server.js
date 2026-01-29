import dotenv from 'dotenv/config';
import app from "./app.js";

const SERVER_PORT = process.env.PORT || 3000;

app.listen(SERVER_PORT, () => {
    console.log(`server running? on port ${SERVER_PORT || 3000}`);
});