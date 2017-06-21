// Imports models
import {Vote } from './vote';

export class Blip {

    constructor(
        public id: string,
        public name: string,
        public description: string,
        public quadrant: string,
        public creator: string,
        public angle: number,
        public timestamp: number,
        public votes: Vote[]) {

    }   

    public getValue(): number {

        let value = this.votes.filter(x => x.id == this.id && x.isUpVote).length - this.votes.filter(x => x.id == this.id && !x.isUpVote).length;

        if (value < 0) {
            value = 0;
        }

        if (value > 100) {
            value = 100;
        }

        return value;
    }

    public isValid(): boolean {
        return true;
    }
}