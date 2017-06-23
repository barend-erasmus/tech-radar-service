// Imports models
import {Vote } from './vote';

export class Blip {

    public value: number = 0;

    constructor(
        public id: string,
        public name: string,
        public description: string,
        public quadrant: string,
        public creator: string,
        public angle: number,
        public timestamp: number,
        public votes: Vote[]) {

            this.value = this.getValue();

    }   

    public calculateValue(): void {
        this.value = this.getValue();
    }

    public isValid(): boolean {
        return true;
    }

    private getValue(): number {

        let value = this.votes.filter(x => x.isUpVote).length - this.votes.filter(x => !x.isUpVote).length;

        if (value < 0) {
            value = 0;
        }

        if (value > 100) {
            value = 100;
        }

        return value;
    }
}