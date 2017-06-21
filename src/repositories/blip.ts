// Imports models
import { Blip } from './../models/blip';

export interface IBlipRepository {

    save(blip: Blip): Promise<boolean>;
    create(blip: Blip): Promise<boolean>;
    findById(id: string): Promise<Blip>;
    list(): Promise<Blip[]>
}