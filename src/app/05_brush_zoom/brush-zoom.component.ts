import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Axis from 'd3-axis';
import * as d3Zoom from 'd3-zoom';
import * as d3Brush from 'd3-brush';
import * as d3Array from 'd3-array';
import * as d3TimeFormat from 'd3-time-format';

import { SP500 } from '../shared';

export interface Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface Stock {
    date: Date;
    price: number;
}

@Component({
    selector: 'app-brush-zoom',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './brush-zoom.component.html',
    styleUrls: ['./brush-zoom.component.css']
})
export class BrushZoomComponent implements OnInit {

    title = 'Brush & Zoom';

    private margin: Margin;
    private margin2: Margin;

    private width: number;
    private height: number;
    private height2: number;

    private svg: any;     // TODO replace all `any` by the right type

    private x: any;
    private x2: any;
    private y: any;
    private y2: any;

    private xAxis: any;
    private xAxis2: any;
    private yAxis: any;

    private context: any;
    private brush: any;
    private zoom: any;
    private area: any;
    private area2: any;
    private focus: any;

    private parseDate = d3TimeFormat.timeParse('%b %Y');

    constructor() {
    }

    ngOnInit() {
        this.initMargins();
        this.initSvg();
        this.drawChart(this.parseData(SP500));
    }

    private initMargins() {
        this.margin = {top: 20, right: 20, bottom: 110, left: 40};
        this.margin2 = {top: 430, right: 20, bottom: 30, left: 40};
    }

    private parseData(data: any[]): Stock[] {
        return data.map(v => <Stock>{date: this.parseDate(v.date), price: v.price});
    }

    private initSvg() {
        this.svg = d3.select('svg');

        this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
        this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
        this.height2 = +this.svg.attr('height') - this.margin2.top - this.margin2.bottom;

        this.x = d3Scale.scaleTime().range([0, this.width]);
        this.x2 = d3Scale.scaleTime().range([0, this.width]);
        this.y = d3Scale.scaleLinear().range([this.height, 0]);
        this.y2 = d3Scale.scaleLinear().range([this.height2, 0]);

        this.xAxis = d3Axis.axisBottom(this.x);
        this.xAxis2 = d3Axis.axisBottom(this.x2);
        this.yAxis = d3Axis.axisLeft(this.y);

        this.brush = d3Brush.brushX()
            .extent([[0, 0], [this.width, this.height2]])
            .on('brush end', this.brushed.bind(this));

        this.zoom = d3Zoom.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [this.width, this.height]])
            .extent([[0, 0], [this.width, this.height]])
            .on('zoom', this.zoomed.bind(this));

        this.area = d3Shape.area()
            .curve(d3Shape.curveMonotoneX)
            .x((d: any) => this.x(d.date))
            .y0(this.height)
            .y1((d: any) => this.y(d.price));

        this.area2 = d3Shape.area()
            .curve(d3Shape.curveMonotoneX)
            .x((d: any) => this.x2(d.date))
            .y0(this.height2)
            .y1((d: any) => this.y2(d.price));

        this.svg.append('defs').append('clipPath')
            .attr('id', 'clip')
            .append('rect')
            .attr('width', this.width)
            .attr('height', this.height);

        this.focus = this.svg.append('g')
            .attr('class', 'focus')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        this.context = this.svg.append('g')
            .attr('class', 'context')
            .attr('transform', 'translate(' + this.margin2.left + ',' + this.margin2.top + ')');
    }

    private brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom
        let s = d3.event.selection || this.x2.range();
        this.x.domain(s.map(this.x2.invert, this.x2));
        this.focus.select('.area').attr('d', this.area);
        this.focus.select('.axis--x').call(this.xAxis);
        this.svg.select('.zoom').call(this.zoom.transform, d3Zoom.zoomIdentity
            .scale(this.width / (s[1] - s[0]))
            .translate(-s[0], 0));
    }

    private zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return; // ignore zoom-by-brush
        let t = d3.event.transform;
        this.x.domain(t.rescaleX(this.x2).domain());
        this.focus.select('.area').attr('d', this.area);
        this.focus.select('.axis--x').call(this.xAxis);
        this.context.select('.brush').call(this.brush.move, this.x.range().map(t.invertX, t));
    }

    private drawChart(data: Stock[]) {

        this.x.domain(d3Array.extent(data, (d: Stock) => d.date));
        this.y.domain([0, d3Array.max(data, (d: Stock) => d.price)]);
        this.x2.domain(this.x.domain());
        this.y2.domain(this.y.domain());

        this.focus.append('path')
            .datum(data)
            .attr('class', 'area')
            .attr('d', this.area);

        this.focus.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(this.xAxis);

        this.focus.append('g')
            .attr('class', 'axis axis--y')
            .call(this.yAxis);

        this.context.append('path')
            .datum(data)
            .attr('class', 'area')
            .attr('d', this.area2);

        this.context.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + this.height2 + ')')
            .call(this.xAxis2);

        this.context.append('g')
            .attr('class', 'brush')
            .call(this.brush)
            .call(this.brush.move, this.x.range());

        this.svg.append('rect')
            .attr('class', 'zoom')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
            .call(this.zoom);
    }

}
