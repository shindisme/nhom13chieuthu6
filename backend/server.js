import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { AppRouter } from "./routes/index.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

AppRouter(app);

app.get('/', (req, res) => {
    res.send('<h1>tét</h1>');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at port:${PORT}`);
});