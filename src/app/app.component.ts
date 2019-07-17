import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

import {Timetable} from './_timetable/timetable';
import {Renderer} from './_timetable/renderer';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

    @ViewChild('timetable', {static: false}) element: ElementRef;
    selector;
    timetable: Timetable;
    renderer: Renderer;
    locations = [];
    events = [];

    constructor() {
        this.timetable = new Timetable();
    }

    ngAfterViewInit() {
        this.selector = this.element.nativeElement;
        this.addTimeTable();
    }

    addTimeTable() {
        this.timetable.setScope(9, 3);
        this.timetable.addLocations([
            {'id': '1', 'name': 'Rotterdam'},
            {'id': '2', 'name': 'Madrid'},
            {'id': '3', 'name': 'Los Angeles'},
            {'id': '4', 'name': 'London'},
            {'id': '5', 'name': 'New York'},
            {'id': '6', 'name': 'Jakarta'}
        ]);

        this.timetable.addLocation(
            {'id': '7', 'name': 'Tokyo'}
        );

        this.timetable.addEvent('Sightseeing', '1', new Date(2015, 7, 17, 9, 0), new Date(2015, 7, 17, 11, 30), {url: '#'});
        this.timetable.addEvent('Zumba', '2', new Date(2015, 7, 17, 12), new Date(2015, 7, 17, 13), {url: '#'});
        this.timetable.addEvent('Zumbu', '2', new Date(2015, 7, 17, 13, 30), new Date(2015, 7, 17, 15), {url: '#'});
        this.timetable.addEvent('Lasergaming', '4', new Date(2015, 7, 17, 17, 45), new Date(2015, 7, 17, 19, 30), {
            class: 'vip-only',
            data: {maxPlayers: 14, gameType: 'Capture the flag'}
        });
        this.timetable.addEvent('All-you-can-eat grill', '5', new Date(2015, 7, 17, 21), new Date(2015, 7, 18, 1, 30), {url: '#'});
        this.timetable.addEvent('Hackathon', '7',
            new Date(2015, 7, 17, 11, 30),
            new Date(2015, 7, 17, 20)
        ); // options attribute is not used for this event
        this.timetable.addEvent('Tokyo Hackathon Livestream', '3',
            new Date(2015, 7, 17, 12, 30),
            new Date(2015, 7, 17, 16, 15)
        ); // options attribute is not used for this event
        this.timetable.addEvent('Lunch', '6', new Date(2015, 7, 17, 9, 30), new Date(2015, 7, 17, 11, 45), {
            onClick: function (event) {
                window.alert(
                    'You clicked on the '
                    + event.name
                    + ' event in '
                    + event.location
                    + '. This is an example of a click handler'
                );
            }
        });
        this.timetable.addEvent('Cocktails', '1', new Date(2015, 7, 18, 0), new Date(2015, 7, 18, 2), {class: 'vip-only'});

        this.renderer = new Renderer(this.timetable);
        this.renderer.draw(this.selector);
    }
}
