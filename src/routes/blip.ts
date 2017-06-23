// Imports
import { Express, Request, Response } from "express";
import * as express from 'express';
import * as co from 'co';

// Imports models
import { Blip } from './../models/blip';

// Imports interfaces
import { IBlipRepository } from './../repositories/blip';

// Imports repositories
// import { BlipRepository as DevBlipRepository } from './../repositories/sqlite/blip';
import { BlipRepository as ProdBlipRepository } from './../repositories/mongo/blip';

// Import services
import { BlipService } from './../services/blip';

// Import configurations
let config = require('./../config').config;

const argv = require('yargs').argv;

if (argv.prod) {
  config = require('./../config.prod').config;
}

export class BlipRouter {

    public static create(req: Request, res: Response, next: () => void) {

        co(function* () {
            const blipRepository: IBlipRepository = argv.prod? new ProdBlipRepository() : new ProdBlipRepository();
            const blipService: BlipService = new BlipService(blipRepository);

            yield blipService.create(req.body.name, req.body.description, req.body.quadrant, req.body.creator);

            res.json(true);
        });
    }

    public static list(req: Request, res: Response, next: () => void) {

        co(function* () {
            const blipRepository: IBlipRepository = argv.prod? new ProdBlipRepository() : new ProdBlipRepository();
            const blipService: BlipService = new BlipService(blipRepository);

            const results: Blip[] = yield blipService.list();

            results.forEach((x) => {
                x.calculateValue();
            });

            res.json(results);
        });
    }

    public static get(req: Request, res: Response, next: () => void) {

        co(function* () {
            const blipRepository: IBlipRepository = argv.prod? new ProdBlipRepository() : new ProdBlipRepository();
            const blipService: BlipService = new BlipService(blipRepository);

            const result: Blip = yield blipService.find(req.query.id);

            result.calculateValue();

            res.json(result);
        });
    }

    public static update(req: Request, res: Response, next: () => void) {

        co(function* () {
            const blipRepository: IBlipRepository = argv.prod? new ProdBlipRepository() : new ProdBlipRepository();
            const blipService: BlipService = new BlipService(blipRepository);

            yield blipService.update(req.body.id, req.body.name, req.body.description, req.body.quadrant);

            res.json(true);
        });
    }

    public static upVote(req: Request, res: Response, next: () => void) {

        co(function* () {
            const blipRepository: IBlipRepository = argv.prod? new ProdBlipRepository() : new ProdBlipRepository();
            const blipService: BlipService = new BlipService(blipRepository);

            yield blipService.upVote(req.body.id, req.body.user);

            res.json(true);
        });
    }

    public static downVote(req: Request, res: Response, next: () => void) {

        co(function* () {
            const blipRepository: IBlipRepository = argv.prod? new ProdBlipRepository() : new ProdBlipRepository();
            const blipService: BlipService = new BlipService(blipRepository);

            yield blipService.downVote(req.body.id, req.body.user);

            res.json(true);
        });
    }

}
