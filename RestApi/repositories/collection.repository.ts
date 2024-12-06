import type { Collection, MongoClient } from "mongodb";
import type { CollectionRepositoryInterface } from "../interfaces/collection.repository.interface";
import type { CollectionEntity } from "../infrastructure/mongo/collection.entity";
import { CollectionEntityToModel } from "../mappers/collection.mapper";
import type { CollectionModel } from "../models/collection.model";

export class CollectionRepository implements CollectionRepositoryInterface {
    private readonly collections: Collection<CollectionEntity>;

    constructor(mongoClient: MongoClient, dbName: string) {
        const database = mongoClient.db(dbName);
        database.createCollection("collections");
        this.collections = database.collection<CollectionEntity>("collections");
    }

    async getByIdAsync(id: string): Promise<CollectionModel | null> {
        const collection = await this.collections.findOne({ _id: id });

        if (!collection) {
            return null;
        }

        return CollectionEntityToModel(collection);
    }

    async getByTitleAsync(title: string, limit: number, offset: number): Promise<CollectionModel[] | null> {
        const collections = await this.collections.find({ title: { $regex: new RegExp(title, 'i') } }).skip(offset).limit(limit).toArray();
        return collections.map(CollectionEntityToModel);
    }

    async getByTitleExactAsync(title: string): Promise<CollectionModel | null> {
        const collection = await this.collections.findOne({ title: { $eq: title } });

        if (!collection) {
            return null;
        }

        return CollectionEntityToModel(collection);
    }

    async getAllAsync(limit: number, offset: number): Promise<CollectionModel[]> {
        const collections = await this.collections.find().skip(offset).limit(limit).toArray();
        return collections.map(CollectionEntityToModel);
    }

    async getCollectionsCountAsync(): Promise<number> {
        return await this.collections.countDocuments();
    }

    async createAsync(title: string, description: string, tasks: string[]): Promise<CollectionModel> {
        const collection: CollectionEntity = {
            _id: crypto.randomUUID(),
            title: title,
            description: description,
            tasks: tasks
        };

        await this.collections.insertOne(collection);
        return CollectionEntityToModel(collection);
    }

    async updateByIdAsync(id: string, title: string | null, description: string | null, tasks: string[] | null): Promise<void> {
        const updateCollection: {
            title?: string;
            description?: string;
            tasks?: string[];
        } = {};

        if(title !== null){
            updateCollection.title = title
        }

        if(description !== null){
            updateCollection.description = description;
        }

        if(tasks && tasks.length > 0){
            updateCollection.tasks = tasks;
        }

        await this.collections.updateOne({ _id: id }, { $set: updateCollection });
    }

    async deleteByIdAsync(id: string): Promise<void> {
        await this.collections.deleteOne({ _id: id });
    }
}