import type { CollectionModel } from "../models/collection.model";
import type { CollectionTaskModel } from "../models/collection.task.model";

export interface CollectionServiceInterface {
    getCollectionById(id: string): Promise<CollectionTaskModel | null>;
    getAllCollections(limit: number, offset: number): Promise<CollectionTaskModel[]>;
    getCollectionsByTitle(title: string, limit: number, offset: number): Promise<CollectionTaskModel[] | null>;
    getCollectionsCount(): Promise<number>;
    createCollection(title: string, description: string, tasks: string[]): Promise<CollectionModel>;
    updateCollectionById(id: string, title: string | null, description: string | null, tasks: string[] | null): Promise<void>;
    deleteCollectionById(id: string): Promise<void>;
}