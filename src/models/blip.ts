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

    public isValid(): boolean {
        return true;
    }
}