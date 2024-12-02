import type { RedisClientType } from "redis";
import { 
    CollectionAlreadyExistsException, 
    CollectionNotFoundException 
} from "../exceptions/collection.exception";
import type { CollectionServiceInterface } from "../interfaces/collection.service.interface";
import type { CollectionModel } from "../models/collection.model";
import type { CollectionRepository } from "../repositories/collection.repository";
import type { TaskRepository } from "../repositories/task.repository";
import type { TaskModel } from "../models/task.model";
import type { CollectionTaskModel } from "../models/collection.task.model";

export class CollectionService implements CollectionServiceInterface {
    constructor(
        private readonly collectionRepository: CollectionRepository,
        private readonly taskRepository: TaskRepository,
        private readonly redisClient: RedisClientType
    ) {}

    private async clearCaches(patterns: string[]): Promise<void> {
        const keys = (await Promise.all(patterns.map(pattern => this.redisClient.keys(pattern)))).flat();
        if (keys.length > 0) {
            await this.redisClient.del(keys);
        }
    }

    private async getTasksByIds(taskIds: string[]): Promise<TaskModel[]> {
        return Promise.all(taskIds.map(taskId => this.taskRepository.getByIdAsync(taskId)));
    }

    private async cacheResult<T>(key: string, data: T): Promise<void> {
        await this.redisClient.set(key, JSON.stringify(data));
    }

    private async getFromCache<T>(key: string): Promise<T | null> {
        const cachedData = await this.redisClient.get(key);
        return cachedData ? JSON.parse(cachedData) : null;
    }

    async getCollectionById(id: string): Promise<CollectionTaskModel | null> {
        const cacheKey = `collection:${id}`;
        const cachedCollection = await this.getFromCache<CollectionTaskModel>(cacheKey);
        if (cachedCollection) return cachedCollection;

        const collection = await this.collectionRepository.getByIdAsync(id);
        if (!collection) return null;

        const tasks = await this.getTasksByIds(collection.tasks);
        const collectionTaskModel: CollectionTaskModel = {
            id: collection.id,
            title: collection.title,
            description: collection.description,
            tasks
        };

        await this.cacheResult(cacheKey, collectionTaskModel);
        return collectionTaskModel;
    }

    async getAllCollections(limit: number, offset: number): Promise<CollectionTaskModel[]> {
        const cacheKey = `collections:${limit}:${offset}`;
        const cachedCollections = await this.getFromCache<CollectionTaskModel[]>(cacheKey);
        if (cachedCollections) return cachedCollections;

        const collections = await this.collectionRepository.getAllAsync(limit, offset);
        const collectionsTasks = await Promise.all(
            collections.map(async collection => ({
                id: collection.id,
                title: collection.title,
                description: collection.description,
                tasks: await this.getTasksByIds(collection.tasks)
            }))
        );

        await this.cacheResult(cacheKey, collectionsTasks);
        return collectionsTasks;
    }

    async getCollectionsByTitle(title: string, limit: number, offset: number): Promise<CollectionTaskModel[] | null> {
        const cacheKey = `collectionsByTitle:${title}:${limit}:${offset}`;
        const cachedCollections = await this.getFromCache<CollectionTaskModel[]>(cacheKey);
        if (cachedCollections) return cachedCollections;

        const collections = await this.collectionRepository.getByTitleAsync(title, limit, offset);
        if (!collections) return null;

        const collectionsTasks = await Promise.all(
            collections.map(async collection => ({
                id: collection.id,
                title: collection.title,
                description: collection.description,
                tasks: await this.getTasksByIds(collection.tasks)
            }))
        );

        await this.cacheResult(cacheKey, collectionsTasks);
        return collectionsTasks;
    }

    async getCollectionsCount(): Promise<number> {
        return this.collectionRepository.getCollectionsCountAsync();
    }

    async createCollection(title: string, description: string, tasks: string[]): Promise<CollectionModel> {
        const existingCollection = await this.collectionRepository.getByTitleExactAsync(title);
        if (existingCollection) throw new CollectionAlreadyExistsException(title);

        const newCollection = await this.collectionRepository.createAsync(title, description, tasks);
        await this.clearCaches([`collections*`, `collectionsByTitle*`]);
        return newCollection;
    }

    async updateCollectionById(
        id: string, 
        title: string | null, 
        description: string | null, 
        tasks: string[] | null
    ): Promise<void> {
        const collection = await this.collectionRepository.getByIdAsync(id);
        if (!collection) throw new CollectionNotFoundException(id);

        if (title && title !== collection.title) {
            const collectionWithSameTitle = await this.collectionRepository.getByTitleExactAsync(title);
            if (collectionWithSameTitle && collectionWithSameTitle.id !== id) {
                throw new CollectionAlreadyExistsException(title);
            }
        }

        await this.collectionRepository.updateByIdAsync(id, title, description, tasks);
        await this.clearCaches([`collection:${id}`, `collections*`, `collectionsByTitle*`]);
    }

    async deleteCollectionById(id: string): Promise<void> {
        const collection = await this.collectionRepository.getByIdAsync(id);
        if (!collection) throw new CollectionNotFoundException(id);

        await this.collectionRepository.deleteByIdAsync(id);
        await this.clearCaches([`collection:${id}`, `collections*`, `collectionsByTitle*`]);
    }
}
