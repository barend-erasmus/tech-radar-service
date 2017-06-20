// Imports
import { Express, Request, Response } from "express";
import * as express from 'express';

export class HelloRouter {

    public static world(req: Request, res: Response, next: () => void) {

        res.send('world');
    }

}
