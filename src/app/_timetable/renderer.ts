import { Tt } from 'src/app/_timetable/_models/tt';


export class Renderer {

    timetable;
    selector;
    container;

    constructor(tt) {
        if (!(this.isOfTypeITimetable(tt))) {
            throw new Error('Initialize renderer using a Timetable');
         }
         this.timetable = tt;
    }

    isOfTypeITimetable(object: any): object is Tt {
        return (<Tt>object) !== null;
    }

    prettyFormatHour(e) {
        const t = 10 > e ? '0' : '';
        return t + e + ':00';
    }

    draw(selector) {
        this.container = selector;
        this.checkContainerPrecondition(this.container);
        this.emptyNode(this.container);
        this.appendTimetableAside(this.container);
        this.appendTimetableSection(this.container);
        // syncscroll.reset();
    }

    emptyNode(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    checkContainerPrecondition(container) {
        if (container === null) {
            throw new Error('Timetable container not found');
        }
    }

    appendTimetableAside(container) {
        const asideNode = container.appendChild(document.createElement('aside'));
        const asideULNode = asideNode.appendChild(document.createElement('ul'));
        this.appendRowHeaders(asideULNode);
    }

    appendRowHeaders(ulNode) {
        for (let t = 0; t < this.timetable.locations.length; t++) {
            const liNode = ulNode.appendChild(document.createElement('li'));
            const spanNode = liNode.appendChild(document.createElement('span'));
            spanNode.className = 'row-heading';
            spanNode.textContent = this.timetable.locations[t];
        }
    }

    appendTimetableSection(container) {
        const sectionNode = container.appendChild(document.createElement('section'));
        const timeNode = sectionNode.appendChild(document.createElement('time'));
        this.appendColumnHeaders(timeNode), this.l(timeNode);
    }

    appendColumnHeaders(node) {
        for (
            let
            headerNode = node.appendChild(document.createElement('header')),
            headerULNode = headerNode.appendChild(document.createElement('ul')),
            r = !1,
            o = !1,
            a = this.timetable.scope.hourStart; !r;) {
            const liNode = headerULNode.appendChild(document.createElement('li'));
            const spanNode = liNode.appendChild(document.createElement('span'));
            spanNode.className = 'time-label';
            spanNode.textContent = this.prettyFormatHour(a);
            if (a !== this.timetable.scope.hourEnd
                || this.timetable.scope.hourStart === this.timetable.scope.hourEnd
                && !o || (r = !0), 24 === ++a ) {
                    a = 0, o = !0;
            }
        }
    }

    l(e) {
        const t = e.appendChild(document.createElement('ul'));
        t.className = 'room-timeline';
        for (let n = 0; n < this.timetable.locations.length; n++) {
            const r = t.appendChild(document.createElement('li'));
            this.appendLocationEvents(this.timetable.locations[n], r);
        }
    }

    appendLocationEvents(location, node) {
        for (let n = 0; n < this.timetable.events.length; n++) {
            const event = this.timetable.events[n];
            if (event.location === location)  {
                this.appendEvent(event, node);
            }
        }
    }

    appendEvent(event, node) {
        const url = event.url,
            elementType = url ? 'a' : 'span',
            eventNode = node.appendChild(document.createElement(elementType)),
            smallNode = eventNode.appendChild(document.createElement('small'));
            eventNode.title = event.name;
        if (url) {
            eventNode.href = event.url;
        }
        eventNode.className = 'time-entry';
        eventNode.style.width = this.computeEventBlockWidth(event);
        eventNode.style.left = this.computeEventBlockOffset(event);
        eventNode.textContent = event.name;
    }

    computeEventBlockWidth(event) {
        const
        start = event.startDate,
        end = event.endDate,
        durationHours = this.computeDurationInHours(start, end);
        return durationHours / this.timetable.scopeDurationHours * 100 + '%';
    }

    computeDurationInHours(start, end) {
        return (end.getTime() - start.getTime()) / 1e3 / 60 / 60;
    }

    computeEventBlockOffset(event) {
        const
            scopeStartHours = this.timetable.scope.hourStart,
            eventStart = event.startDate,
            eventStartHours = eventStart.getHours() + (eventStart.getMinutes() / 60);
        return (eventStartHours - this.timetable.scope.hourStart) / this.timetable.scopeDurationHours * 100 + '%';
    }

    // computeEventBlockOffset(event) {
    //     const
    //         scopeStartHours = this.timetable.scope.hourStart,
    //         scopeDurationHours = this.getDurationHours(this.timetable.scope.hourStart, this.timetable.scope.hourEnd),
    //         eventStart = event.startDate,
    //         eventStartHours = eventStart.getHours() + (eventStart.getMinutes() / 60),
    //         hoursBeforeEvent =  this.getDurationHours(scopeStartHours, eventStartHours);
    //     return hoursBeforeEvent / scopeDurationHours * 100 + '%';
    // }

    // getDurationHours(startHour, endHour) {
    //     return endHour >= startHour ? endHour - startHour : 24 + endHour - startHour;
    // }
}
