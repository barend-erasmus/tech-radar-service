// Imports
import { Express, Request, Response } from "express";
import * as express from 'express';
import * as co from 'co';

// Imports repositories
import { BlipRepository } from './../repositories/sqlite/blip';

// Import services
import { BlipService } from './../services/blip';

export class BlipRouter {

    public static create(req: Request, res: Response, next: () => void) {

        co(function* () {
            const blipRepository: BlipRepository = new BlipRepository();
            const blipService: BlipService = new BlipService(blipRepository);

            yield blipService.create(req.body.name, req.body.description, req.body.quadrant, req.body.creator);

            res.json(true);
        });
    }

}
