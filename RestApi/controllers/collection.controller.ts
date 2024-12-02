import type { Request, Response } from "express";
import type { CollectionServiceInterface } from "../interfaces/collection.service.interface";
import { CollectionAlreadyExistsException, CollectionNotFoundException } from "../exceptions/collection.exception";
import type { CollectionTaskModel } from "../models/collection.task.model";

export class CollectionController {
    private readonly collectionService: CollectionServiceInterface;

    constructor(collectionService: CollectionServiceInterface) {
        this.collectionService = collectionService;
    }

    async getCollectionById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const collection = await this.collectionService.getCollectionById(id);

            if (!collection) {
                res.status(404).json({ message: 'Collection not found' });
                return;
            }

            res.status(200).json(collection);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getAllCollections(req: Request, res: Response): Promise<void> {
        const { limit, offset, title } = req.query;
        try {
            const limitValue = parseInt(limit as string) || 10;
            const offsetValue = parseInt(offset as string) - 1 || 0;
            const titleValue = title as string;
            const count = await this.collectionService.getCollectionsCount();
            const pages = Math.ceil(count / limitValue);
            let collections: CollectionTaskModel[] | null = null;

            if (offsetValue < 0 || offsetValue > pages - 1) {
                res.status(400).json({ message: 'Invalid offset value' });
                return;
            }

            if (title) {
                titleValue.trim();
                collections = await this.collectionService.getCollectionsByTitle(titleValue, limitValue, offsetValue);
            }

            if (!title){
                collections = await this.collectionService.getAllCollections(limitValue, offsetValue);
            }

            if (collections?.length === 0) {
                res.status(200).json([]);
                return;
            }
            
            const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?').shift()}`;
            const nextPage = (offsetValue + 1) * limitValue < count ? `${baseUrl}?limit=${limitValue}&offset=${offsetValue + 2}` : null;
            const prevPage = offsetValue > 0 ? `${baseUrl}?limit=${limitValue}&offset=${offsetValue}` : null;

            res.status(200).json({
                pagination: {
                    count: count,
                    pages: Math.ceil((count) / limitValue),
                    nextPage: nextPage,
                    prevPage: prevPage,
                },
                collections: collections
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createCollection(req: Request, res: Response): Promise<void> {
        try {
            const { title, description, tasks } = req.body;

            if (!title || !description || !tasks) {
                res.status(400).json({ message: 'Missing required fields' });
                return;
            }

            const newCollection = await this.collectionService.createCollection(title, description, tasks);

            res.status(201).json(newCollection);
        } catch (error) {
            if (error instanceof CollectionAlreadyExistsException) {
                res.status(409).json({ message: "Collection Already Exists" });
                return;
            }

            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateCollectionById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const { title, description, tasks } = req.body;

            if (!title || !description || !tasks) {
                res.status(400).json({ message: 'Missing required fields' });
                return;
            }

            await this.collectionService.updateCollectionById(id, title, description, tasks);

            res.status(204).send();
        } catch (error) {
            if (error instanceof CollectionAlreadyExistsException) {
                res.status(409).json({ message: "Collection Already Exists" });
            }

            if (error instanceof CollectionNotFoundException) {
                res.status(404).json({ message: "Collection not found" });
            }

            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateCollectionFieldById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const { title, description, tasks } = req.body;
            let titleValue: string | null = null;
            let descriptionValue: string | null = null;
            let tasksValue: string[] | null = null;

            if (title) titleValue = title;

            if (description) descriptionValue = description;

            if (tasks) tasksValue = tasks;

            await this.collectionService.updateCollectionById(id, titleValue, descriptionValue, tasksValue);

            res.status(204).send();
        } catch (error) {
            if (error instanceof CollectionAlreadyExistsException) {
                res.status(409).json({ message: "Collection Already Exists" });
            }

            if (error instanceof CollectionNotFoundException) {
                res.status(404).json({ message: "Collection not found" });
            }

            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteCollectionById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;

            if (!id) {
                res.status(400).json({ message: 'Missing required fields' });
                return;
            }

            await this.collectionService.deleteCollectionById(id);

            res.status(204).send();
        } catch (error) {
            if (error instanceof CollectionNotFoundException) {
                res.status(404).json({ message: "Collection not found" });
            }

            res.status(500).json({ message: 'Internal server error' });
        }
    }
}