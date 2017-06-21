// Imports
import * as sqlite3 from 'sqlite3';
import * as co from 'co';

// Imports models
import { Blip } from './../../models/blip';
import { Vote } from './../../models/vote';

export class BlipRepository {

    private db: any;

    constructor() {
        const db = new sqlite3.Database('./tech-radar.db');

        this.db = db;
    }

    save(blip: Blip): Promise<boolean> {
        const self = this;
        return co(function* () {

            yield self.executeCommand(self.db, 'UPDATE `blip` SET `name` = (?), `description` = (?), `quadrant` = (?) WHERE `id` = (?)', [
                blip.name,
                blip.description,
                blip.quadrant,
                blip.id
            ]);

            yield self.executeCommand(self.db, 'DELETE FROM `vote` WHERE `id` = (?)', [blip.id]);

            for (const vote of blip.votes) {
                yield self.executeCommand(self.db, 'INSERT INTO `vote` (`id`, `user`, `isUpVote`) VALUES ((?), (?), (?))', [blip.id, vote.user, vote.isUpVote ])
            }

            return true;
        });
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

            for (const vote of blip.votes) {
                yield self.executeCommand(self.db, 'INSERT INTO `vote` (`id`, `user`, `isUpVote`) VALUES ((?), (?), (?))', [blip.id, vote.user, vote.isUpVote ])
            }

            return true;
        });
    }

    findById(id: string): Promise<Blip> {
        const self = this;
        return co(function* () {

            const results: any[] = yield self.executeQuery(self.db, 'SELECT * FROM `blip` WHERE `id` = (?)', [id]);

            if (results.length === 0) {
                return null;
            }

            let blip: Blip = new Blip(results[0].id, results[0].name, results[0].description, results[0].quadrant, results[0].creator, results[0].angle, results[0].timestamp, []);

            blip = yield self.loadVotesForBlip(blip);

            return blip;
        });
    }

    list(): Promise<Blip[]> {
        const self = this;
        return co(function* () {

            const results: any[] = yield self.executeQuery(self.db, 'SELECT * FROM `blip`', []);

            let blips: Blip[] = results.map((x) => new Blip(x.id, x.name, x.description, x.quadrant, x.creator, x.angle, x.timestamp, []));

            blips = yield blips.map((x) => self.loadVotesForBlip(x));

            return blips;
        });
    }

    private loadVotesForBlip(blip: Blip): Promise<Blip> {
        const self = this;
        return co(function* () {

            const results: any[] = yield self.executeQuery(self.db, 'SELECT * FROM `vote` WHERE `id` = (?)', [blip.id]);

            blip.votes = results.map((x) => new Vote(x.user, x.isUpVote));

            return blip;
        });
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