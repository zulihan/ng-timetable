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
        this.r(this.container);
        this.a(this.container);
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

    r(e) {
        const t = e.appendChild(document.createElement('aside'));
        const n = t.appendChild(document.createElement('ul'));
        this.o(n);
    }

    o(e) {
        for (let t = 0; t < this.timetable.locations.length; t++) {
            const n = e.appendChild(document.createElement('li'));
            const r = n.appendChild(document.createElement('span'));
            r.className = 'row-heading';
            r.textContent = this.timetable.locations[t];
        }
    }

    a(e) {
        const t = e.appendChild(document.createElement('section'));
        const n = t.appendChild(document.createElement('time'));
        this.u(n), this.l(n);
    }

    u(e) {
        for (
            let
            t = e.appendChild(document.createElement('header')),
            n = t.appendChild(document.createElement('ul')),
            r = !1,
            o = !1,
            a = this.timetable.scope.hourStart; !r;) {
            const i = n.appendChild(document.createElement('li'));
            const u = i.appendChild(document.createElement('span'));
            u.className = 'time-label';
            u.textContent = this.prettyFormatHour(a);
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
            this.s(this.timetable.locations[n], r);
        }
    }

    s(e, t) {
        for (let n = 0; n < this.timetable.events.length; n++) {
            const r = this.timetable.events[n];
            if (r.location === e)  {
                this.d(r, t);
            }
        }
    }

    d(e, t) {
        const n = e.url,
            r = n ? 'a' : 'span',
            o = t.appendChild(document.createElement(r)),
            a = o.appendChild(document.createElement('small'));
        o.title = e.name;
        if (n) {
            o.href = e.url;
        }
        o.className = 'time-entry';
        o.style.width = this.h(e);
        o.style.left = this.f(e);
        a.textContent = e.name;
    }

    h(e) {
        const
            t = e.startDate,
            n = e.endDate,
            r = this.m(t, n);
        return r / this.timetable.scopeDurationHours * 100 + '%';
    }


    m(e, t) {
        return (t.getTime() - e.getTime()) / 1e3 / 60 / 60;
    }

    f(e) {
        const
            t = e.startDate,
            n = t.getHours() + (t.getMinutes() / 60);
        return (n - this.timetable.scope.hourStart) / this.timetable.scopeDurationHours * 100 + '%';
    }

}
