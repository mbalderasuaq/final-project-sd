import express from "express";
import { CollectionRouter } from "./routes/collection.route";
import swaggerUi  from "swagger-ui-express";
import swaggerSpec from "./swagger.json";

const app = express();

app.use(express.json());

app.use("/collections", CollectionRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});