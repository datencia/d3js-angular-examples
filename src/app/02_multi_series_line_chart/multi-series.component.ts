import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

import { TEMPERATURES } from '../shared';

@Component({
    selector: 'app-multi-series-line-chart',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './multi-series.component.html',
    styleUrls: ['./multi-series.component.css']
})
export class MultiSeriesComponent implements OnInit {

    title = 'Multi-Series Line Chart';

    data: any;

    svg: any;
    margin = {top: 20, right: 80, bottom: 30, left: 50};
    g: any;
    width: number;
    height: number;
    x;
    y;
    z;
    line;

    constructor() {

    }

    ngOnInit() {

        this.data = TEMPERATURES.map((v) => v.values.map((v) => v.date ))[0];
        //.reduce((a, b) => a.concat(b), []);

        this.initChart();
        this.drawAxis();
        this.drawPath();
    }

    private initChart(): void {
        this.svg = d3.select('svg');

        this.width = this.svg.attr('width') - this.margin.left - this.margin.right;
        this.height = this.svg.attr('height') - this.margin.top - this.margin.bottom;

        this.g = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        this.x = d3Scale.scaleTime().range([0, this.width]);
        this.y = d3Scale.scaleLinear().range([this.height, 0]);
        this.z = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeCategory10);

        this.line = d3Shape.line()
            .curve(d3Shape.curveBasis)
            .x( (d: any) => this.x(d.date) )
            .y( (d: any) => this.y(d.temperature) );

        this.x.domain(d3Array.extent(this.data, (d: Date) => d ));

        this.y.domain([
            d3Array.min(TEMPERATURES, function(c) { return d3Array.min(c.values, function(d) { return d.temperature; }); }),
            d3Array.max(TEMPERATURES, function(c) { return d3Array.max(c.values, function(d) { return d.temperature; }); })
        ]);

        this.z.domain(TEMPERATURES.map(function(c) { return c.id; }));
    }

    private drawAxis(): void {
        this.g.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(d3Axis.axisBottom(this.x));

        this.g.append('g')
            .attr('class', 'axis axis--y')
            .call(d3Axis.axisLeft(this.y))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '0.71em')
            .attr('fill', '#000')
            .text('Temperature, ºF');
    }

    private drawPath(): void {
        let city = this.g.selectAll('.city')
            .data(TEMPERATURES)
            .enter().append('g')
            .attr('class', 'city');

        city.append('path')
            .attr('class', 'line')
            .attr('d', (d) => this.line(d.values) )
            .style('stroke', (d) => this.z(d.id) );

        city.append('text')
            .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
            .attr('transform', (d) => 'translate(' + this.x(d.value.date) + ',' + this.y(d.value.temperature) + ')' )
            .attr('x', 3)
            .attr('dy', '0.35em')
            .style('font', '10px sans-serif')
            .text(function(d) { return d.id; });
    }

}
