import soap from "soap";
import type { TaskRepositoryInterface } from "../interfaces/task.repository.interface";
import type { TaskModel } from "../models/task.model";

export class TaskRepository implements TaskRepositoryInterface{
  private wsdlUrl: string;

  constructor(wsdlUrl: string) {
    this.wsdlUrl = wsdlUrl;
  }

  async getByIdAsync(taskId: string): Promise<TaskModel> {
    const args = { id: taskId };
    return new Promise((resolve, reject) => {
      soap.createClient(this.wsdlUrl, {}, function(err, client) {
        if (err) {
          reject(err);
          return;
        }
        client.GetById(args, function(err: any, result: any) {
          if (err) {
            reject(err);
          } else {
            resolve(result.GetByIdResult);
          }
        });
      });
    });
  }
}
