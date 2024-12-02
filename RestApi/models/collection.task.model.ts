import type { TaskModel } from "./task.model";

export interface CollectionTaskModel {
    id: string;
    title: string;
    description: string;
    tasks: TaskModel[];
}