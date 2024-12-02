import { Router } from "express";
import { CollectionController } from "../controllers/collection.controller";
import { CollectionService } from "../services/collection.service";
import { CollectionRepository } from "../repositories/collection.repository";
import { MongoClient } from "mongodb";
import { createClient, type RedisClientType } from "redis";
import { TaskRepository } from "../repositories/task.repository";

const CollectionRouter = Router();

const dbURL = process.env.DB_URL;
const dbName = process.env.DB_NAME;
const redisURL = process.env.REDIS_URL;
const taskURL = process.env.TASKS_API_URL;

if (!dbURL) {
  throw new Error("DB_URL is not provided");
}

if (!dbName) {
  throw new Error("DB_NAME is not provided");
}

if (!redisURL) {
  throw new Error("REDIS_URL is not provided");
}

if (!taskURL) {
  throw new Error("TASK_URL is not provided");
}

const mongoClient = new MongoClient(dbURL);
const redisClient: RedisClientType = createClient({ url: redisURL });
redisClient.on("error", (err) => console.log("Redis Client Error", err));

try {
  redisClient.connect();
} catch (err) {
  console.log("Redis Client Error", err);
}

const collectionRepository = new CollectionRepository(mongoClient, dbName);
const taskRepository = new TaskRepository(taskURL);
const collectionService = new CollectionService(collectionRepository, taskRepository, redisClient);
const collectionController = new CollectionController(collectionService);

CollectionRouter.get("/:id", (req, res) => collectionController.getCollectionById(req, res));
CollectionRouter.get("/", (req, res) => collectionController.getAllCollections(req, res));
CollectionRouter.post("/", (req, res) => collectionController.createCollection(req, res));
CollectionRouter.put("/:id", (req, res) => collectionController.updateCollectionById(req, res));
CollectionRouter.patch("/:id", (req, res) =>
  collectionController.updateCollectionFieldById(req, res)
);
CollectionRouter.delete("/:id", (req, res) =>
  collectionController.deleteCollectionById(req, res)
);

export { CollectionRouter };
