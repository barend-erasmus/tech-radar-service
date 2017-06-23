// Imports
import * as co from 'co';
import * as mongo from 'mongodb';

// Imports models
import { Blip } from './../../models/blip';
import { Vote } from './../../models/vote';

export class BlipRepository {

    constructor() {
        
    }

    save(blip: Blip): Promise<boolean> {
        const self = this;
        return co(function* () {

            const db: mongo.Db = yield mongo.MongoClient.connect('mongodb://mongo:27017/techradar');

            const collection: mongo.Collection = db.collection('blips');

            yield collection.updateOne({
                id: blip.id
            }, blip);

            db.close();

            return true;
        });
    }

    create(blip: Blip): Promise<boolean> {
        const self = this;
        return co(function* () {

            const db: mongo.Db = yield mongo.MongoClient.connect('mongodb://mongo:27017/techradar');

            const collection: mongo.Collection = db.collection('blips');

            yield collection.insertOne(blip);

            db.close();

            return true;
        });
    }

    findById(id: string): Promise<Blip> {
        const self = this;
        return co(function* () {

            const db: mongo.Db = yield mongo.MongoClient.connect('mongodb://mongo:27017/techradar');

            const collection: mongo.Collection = db.collection('blips');

            const blip: Blip = yield collection.findOne({
                id: id
            });

            db.close();

            return blip? new Blip(blip.id, blip.name, blip.description, blip.quadrant, blip.creator, blip.angle, blip.timestamp, blip.votes.map((x) => new Vote(x.user, x.isUpVote))) : null;
        });
    }

    list(): Promise<Blip[]> {
        const self = this;
        return co(function* () {

            const db: mongo.Db = yield mongo.MongoClient.connect('mongodb://mongo:27017/techradar');

            const collection: mongo.Collection = db.collection('blips');

            const blips: Blip[] = yield collection.find().toArray();

            db.close();

            return blips.map((blip) => new Blip(blip.id, blip.name, blip.description, blip.quadrant, blip.creator, blip.angle, blip.timestamp, blip.votes.map((x) => new Vote(x.user, x.isUpVote))));
        });
    }
}