export interface Tt {
    scope: any;
    locations: Array<string>;
    events: Array<any>;
    scopeDurationHours: any;
    prettyFormatHour(hour: any);
    getDurationHours(startHour: any, endHour: any);
}
