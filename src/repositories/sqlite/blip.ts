// Imports
import * as sqlite3 from 'sqlite3';
import * as co from 'co';

// Imports models
import { Blip } from './../../models/blip';

export class BlipRepository {

    private db: any;

    constructor() {
        const db = new sqlite3.Database('./tech-radar.db');

        this.db = db;
    }

    save(blip: Blip): Promise<boolean> {
        return null;
    }

    create(blip: Blip): Promise<boolean> {
        const self = this;
        return co(function* () {

            yield self.executeCommand(self.db, 'INSERT INTO `blip` (`id`, `name`, `description`, `quadrant`, `creator`, `angle`, `timestamp`) VALUES ((?), (?), (?), (?), (?), (?), (?))', [
                blip.id, 
                blip.name,
                blip.description,
                blip.quadrant,
                blip.creator,
                blip.angle,
                blip.timestamp / 1000
            ]);

            return true;
        });
    }

    findById(id: string): Promise<Blip> {
        return null;
    }

    list(): Promise<Blip[]> {
        return null;
    }

    private executeCommand(db: any, command: string, parameters: any[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(command, parameters, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        });
    }

    private executeQuery(db: any, query: string, parameters: any[]): Promise<any[]> {
        return new Promise((resolve, reject) => {
            db.all(query, parameters, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        });
    }
}