import {Scope} from './_models/scope';

export class Timetable {

    scope: Scope;
    locations = [];
    events = [];
    newLocations = [];
    scopeDurationHours: number;
    usingTwelveHour = false;

    constructor() {
        this.scope = {
            hourStart: 9,
            hourEnd: 17
        };
        this.locations = [];
        this.events = [];
        this.scopeDurationHours = this.getDurationHours(this.scope.hourStart, this.scope.hourEnd);
    }

    setScope(start, end) {
        if (this.isValidHourRange(start, end)) {
            this.scope.hourStart = start;
            this.scope.hourEnd = end;
            this.scopeDurationHours = this.getDurationHours(this.scope.hourStart, this.scope.hourEnd);
        } else {
            throw new RangeError('Timetable scope should consist of (start, end) in whole hours from 0 to 23');
        }
        return this.scope;
    }

    hasProperFormat() {
        return this.newLocations instanceof Array;
    }

    addLocations(newLocations) {
        this.hasProperFormat();
        const existingLocations = this.locations;

        if (this.hasProperFormat()) {
            newLocations.forEach(loc => {
                if (!this.locationExistsIn(loc, existingLocations)) {
                    existingLocations.push(loc);
                } else {
                    throw new Error('Location already exists');
                }
            });

        } else {
            throw new Error('Tried to add locations in wrong format');
        }
        return this;
    }

    addLocation(newLocation) {
        function hasProperFormat() {
            return newLocation instanceof Object;
        }

        const existingLocations = this.locations;

        if (hasProperFormat()) {
            if (!this.locationExistsIn(newLocation, existingLocations)) {
                existingLocations.push(newLocation);
            } else {
                throw new Error('Location already exists');
            }
        } else {
            throw new Error('Tried to add locations in wrong format');
        }

        return this;
    }

    addEvent(name, location, start, end, options = null) {
        if (!this.locationExistsIn(location, this.locations)) {
            throw new Error('Unknown location');
        }
        if (!this.isValidTimeRange(start, end)) {
            throw new Error('Invalid time range: ' + JSON.stringify([start, end]));
        }

        const optionsHasValidType = Object.prototype.toString.call(options) === '[object Object]';

        this.events.push({
            name: name,
            location: location,
            startDate: start,
            endDate: end,
            options: optionsHasValidType ? options : undefined
        });

        return this;
    }

    isValidHourRange(start, end) {
        return this.isValidHour(start) && this.isValidHour(end);
    }

    isValidHour(number) {
        return this.isInt(number) && this.isInHourRange(number);
    }

    isInt(number) {
        return number === parseInt(number, 10);
    }

    isInHourRange(number) {
        return number >= 0 && number < 24;
    }

    locationExistsIn(loc, locs) {
        return locs.findIndex(function (l) {
            return l.id === loc;
        }) !== -1;
    }

    isValidTimeRange(start, end) {
        const correctTypes = start instanceof Date && end instanceof Date;
        const correctOrder = start < end;
        return correctTypes && correctOrder;
    }

    getEventDurationHours(startHour, endHour) {
        return endHour >= startHour ? endHour - startHour : 24 + endHour - startHour;
    }

    getDurationHours(startHour, endHour) {
        let duration = 0;
        if (endHour > startHour) {
            duration = endHour - startHour;
        } else if (startHour === endHour) {
            duration = 24;
        } else {
            duration = 24 + endHour - startHour;
        }
        return duration;
    }

    prettyFormatHour(hour, minute, usingTwelveHour) {
        let prettyHour;
        if (usingTwelveHour) {
            const period = hour >= 12 ? 'PM' : 'AM';
            prettyHour = ((hour + 11) % 12 + 1) + ':' + minute + period;
        } else {
            const prefix = hour < 10 ? '0' : '';
            prettyHour = prefix + hour + ':' + minute;
        }
        return prettyHour;
    }

}
