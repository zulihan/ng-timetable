import { Scope } from './scope';


export interface Tt {
    events: Array<{}>;
    locations: Array<string>;
    newLocations: Array<string>;
    scope: Scope;
    scopeDurationHours: number;
}
