// Imports
import { Express, Request, Response } from "express";
import * as express from 'express';
import * as co from 'co';

// Imports models
import { Blip } from './../models/blip';

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

    public static list(req: Request, res: Response, next: () => void) {

        co(function* () {
            const blipRepository: BlipRepository = new BlipRepository();
            const blipService: BlipService = new BlipService(blipRepository);

            const results: Blip[] = yield blipService.list();

            res.json(results);
        });
    }

    public static update(req: Request, res: Response, next: () => void) {

        co(function* () {
            const blipRepository: BlipRepository = new BlipRepository();
            const blipService: BlipService = new BlipService(blipRepository);

            yield blipService.update(req.body.id, req.body.name, req.body.description, req.body.quadrant);

            res.json(true);
        });
    }

    public static upVote(req: Request, res: Response, next: () => void) {

        co(function* () {
            const blipRepository: BlipRepository = new BlipRepository();
            const blipService: BlipService = new BlipService(blipRepository);

            yield blipService.upVote(req.body.id, req.body.user);

            res.json(true);
        });
    }

    public static downVote(req: Request, res: Response, next: () => void) {

        co(function* () {
            const blipRepository: BlipRepository = new BlipRepository();
            const blipService: BlipService = new BlipService(blipRepository);

            yield blipService.downVote(req.body.id, req.body.user);

            res.json(true);
        });
    }

}
