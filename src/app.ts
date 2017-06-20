// Imports
import express = require("express");
import * as exphbs from 'express-handlebars';
import * as path from 'path';

// Imports middleware
import * as cors from 'cors';
import bodyParser = require('body-parser');
import expressWinston = require('express-winston');

// Imports routes
import { HelloRouter } from './routes/hello';

// Imports logger
import { logger } from './logger';

// Import configurations
let config = require('./config').config;

const argv = require('yargs').argv;

if (argv.prod) {
  config = require('./config.prod').config;
}

export class TechRadarServiceApi {

    constructor(private app: express.Express, private port: number) {
        this.configureMiddleware(app);
        this.configureRoutes(app);
        this.configureErrorHandling(app);
    }

    public getApp() {
        return this.app;
    }

    public run() {
        this.app.listen(this.port);
    }

    private configureMiddleware(app: express.Express) {

        // Configure body-parser
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));

        // Configure CORS
        app.use(cors());

        // Configure express-winston
        app.use(expressWinston.logger({
            meta: false,
            msg: 'HTTP Request: {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}} {{req.ip}}',
            winstonInstance: logger,
        }));

        // Configure express handlebars
        app.engine('handlebars', exphbs());
        app.set('view engine', 'handlebars');
        app.set('views', path.join(__dirname, 'views'));
    }

    private configureRoutes(app: express.Express) {
        app.use(`/api/hello`, HelloRouter.world);
    }

    private configureErrorHandling(app: express.Express) {
        app.use((err: Error, req: express.Request, res: express.Response, next: () => void) => {
            logger.error(err.message, err);
            res.status(500).send(err.message);
        });
    }
}

const port = 3000;
const api = new TechRadarServiceApi(express(), port);
api.run();

logger.info(`listening on ${port}`);
