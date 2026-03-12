import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/usersRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at port:${PORT}`);
});