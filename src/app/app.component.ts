import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'D3.js with Angular!';

    examples = [
        {
            title: 'Line Chart',
            route: '/line-chart'
        },
        {
            title: 'Multi Series Line Chart',
            route: '/multi-series'
        },
        {
            title: 'Bar Chart',
            route: '/bar-chart'
        },
        {
            title: 'Stacked Bar Chart',
            route: '/stacked-bar-chart'
        },
        {
            title: 'Brush Zoom',
            route: '/brush-zoom'
        },
        {
            title: 'Pie Chart',
            route: '/pie-chart'
        },
        {
            title: 'Donut chart',
            route: '/donut-chart'
        },
    ];

}
