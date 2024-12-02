import type { CollectionModel } from "../models/collection.model";

export interface CollectionRepositoryInterface {
    getByIdAsync(id: string): Promise<CollectionModel | null>;
    getByTitleAsync(title: string, limit: number, offset: number): Promise<CollectionModel[] | null>;
    getByTitleExactAsync(title: string): Promise<CollectionModel | null>;
    getAllAsync(limit: number, offset: number): Promise<CollectionModel[]>;
    getCollectionsCountAsync(): Promise<number>;
    createAsync(title: string, description: string, tasks: string[]): Promise<CollectionModel>;
    updateByIdAsync(id: string, title: string | null, description: string | null, tasks: string[] | null): Promise<void>;
    deleteByIdAsync(id: string): Promise<void>;
}