import {Tt} from 'src/app/_timetable/_models/tt';

export class Renderer {
    timetable;
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
            spanNode.textContent = this.timetable.locations[t].name;
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
            && !o || (r = !0), 24 === ++a) {
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
            if (event.location === location.id) {
                this.appendEvent(event, node);
            }
        }
    }

    appendEvent(event, node) {
        const hasOptions = event.options !== undefined;
        let hasURL, hasAdditionalClass, hasDataAttributes, hasClickHandler = false;

        if (hasOptions) {
            hasURL = event.options.url !== undefined;
            hasAdditionalClass = event.options.class !== undefined;
            hasDataAttributes = event.options.data !== undefined;
            hasClickHandler = event.options.onClick !== undefined;
        }

        const elementType = hasURL ? 'a' : 'span';
        const eventNode = node.appendChild(document.createElement(elementType));
        const nameNode = eventNode.appendChild(document.createElement('small'));
        nameNode.classList.add('name');
        const hourNode = eventNode.appendChild(document.createElement('small'));
        hourNode.classList.add('hours');
        eventNode.title = event.name;

        if (hasURL) {
            eventNode.href = event.options.url;
        }

        if (hasDataAttributes) {
            for (const key of event.options.data) {
                eventNode.setAttribute('data-' + key, event.options.data[key]);
            }
        }

        if (hasClickHandler) {
            eventNode.addEventListener('click', function () {
                event.options.onClick(event);
            });
        }

        eventNode.className = hasAdditionalClass ? 'time-entry ' + event.options.class : 'time-entry';
        eventNode.style.width = this.computeEventBlockWidth(event);
        eventNode.style.left = this.computeEventBlockOffset(event);
        nameNode.textContent = event.name;
        hourNode.textContent = this.timetable.prettyFormatHour(
            event.startDate.getHours(),
            (event.startDate.getMinutes() < 10 ? '0' : '') + event.startDate.getMinutes(),
            this.timetable.usingTwelveHour
            )
            + ' - ' +
            this.timetable.prettyFormatHour(
                event.endDate.getHours(),
                (event.endDate.getMinutes() < 10 ? '0' : '') + event.endDate.getMinutes(),
                this.timetable.usingTwelveHour
            );
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
            eventStartHours = event.startDate.getHours() + (event.startDate.getMinutes() / 60),
            hoursBeforeEvent = this.timetable.getEventDurationHours(scopeStartHours, eventStartHours);
        return hoursBeforeEvent / this.timetable.scopeDurationHours * 100 + '%';
    }
}
