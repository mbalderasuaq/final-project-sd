import type { TaskModel } from "../models/task.model";

export interface TaskRepositoryInterface {
    getByIdAsync(id: string): Promise<TaskModel | null>;
}