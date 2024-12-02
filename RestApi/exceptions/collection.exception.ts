export class CollectionNotFoundException extends Error {
    constructor(id: string) {
        super(`Collection with id ${id} not found`);
    }
}

export class CollectionAlreadyExistsException extends Error {
    constructor(title: string) {
        super(`Collection with title ${title} already exists`);
    }
}

export class CollectionInvalidRequestException extends Error {
    constructor() {
        super('Invalid request');
    }
}