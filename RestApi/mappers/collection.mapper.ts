import type { CollectionEntity } from "../infrastructure/mongo/collection.entity";
import type { CollectionModel}  from "../models/collection.model";

export function CollectionEntityToModel(taskEntity: CollectionEntity): CollectionModel {
    return {
        id: taskEntity._id,
        title: taskEntity.title,
        description: taskEntity.description,
        tasks: taskEntity.tasks
    };
}