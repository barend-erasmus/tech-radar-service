// Imports
import * as uuid from 'uuid';
import * as co from 'co';

// Imports interfaces
import { IBlipRepository } from './../repositories/blip';

// Imports models
import { Blip } from './../models/blip';
import { Vote } from './../models/vote';

export class BlipService {

    constructor(private blipRepository: IBlipRepository) {

    }

    public create(name: string, description: string, quadrant: string, creator: string): Promise<Blip> {
        const self = this;
        return co(function* () {

            const blip: Blip = new Blip(uuid.v4(), name, description, quadrant, creator, self.generateAngle(), new Date().getTime(), []);

            const result: boolean = yield self.blipRepository.create(blip);

            return blip;
        });
    }

    public upVote(id: string, user: string): Promise<Blip> {
        const self = this;
        return co(function* () {

            const blip: Blip = yield self.blipRepository.findById(id);

            if (!blip) {
                return null;
            }

            const existingVote: Vote = blip.votes.find((x) => x.user === user);

            if (existingVote) {
               existingVote.isUpVote = true; 
            }else {
                blip.votes.push(new Vote(id, user, true));
            }

            const result: boolean = yield self.blipRepository.save(blip);

            return blip;
        });
    }

    public downVote(id: string, user: string): Promise<Blip> {
        const self = this;
        return co(function* () {

            const blip: Blip = yield self.blipRepository.findById(id);

            if (!blip) {
                return null;
            }

            const existingVote: Vote = blip.votes.find((x) => x.user === user);

            if (existingVote) {
               existingVote.isUpVote = false; 
            }else {
                blip.votes.push(new Vote(id, user, false));
            }

            const result: boolean = yield self.blipRepository.save(blip);

            return blip;
        });
    }

    private generateAngle(): number {
        return Math.random() * 90
    }
}