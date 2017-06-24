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

    public create(name: string, description: string, quadrant: string, offset: number, creator: string): Promise<Blip> {
        const self = this;
        return co(function* () {

            const blip: Blip = new Blip(uuid.v4(), name, description, quadrant, creator, self.generateAngle(), offset, new Date().getTime(), []);

            const result: boolean = yield self.blipRepository.create(blip);

            return blip;
        });
    }

    public update(id: string, name: string, description: string, quadrant: string, offset: number): Promise<Blip> {
        const self = this;
        return co(function* () {

            const blip: Blip = yield self.blipRepository.findById(id);

            blip.name = name;
            blip.description = description;
            blip.quadrant = quadrant;
            blip.offset = offset;

            const result: boolean = yield self.blipRepository.save(blip);

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
                blip.votes.push(new Vote(user, true));
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
                blip.votes.push(new Vote(user, false));
            }

            const result: boolean = yield self.blipRepository.save(blip);

            return blip;
        });
    }

    public list(): Promise<Blip[]> {
        return this.blipRepository.list();
    }

    public find(id: string): Promise<Blip> {
        return this.blipRepository.findById(id);
    }

    public remove(id: string): Promise<boolean> {
        return this.blipRepository.delete(id);
    }

    private generateAngle(): number {
        return Math.random() * 90
    }
}