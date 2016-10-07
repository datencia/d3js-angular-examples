import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";

@Component({
  selector: 'app-root',
  template: `
  <h1>{{title}}</h1>
  <h2>{{subtitle}}</h2>
  <svg width="600" height="400"></svg>
`
})
export class AppComponent implements OnInit {
  title: string = 'D3.js with Angular 2!';
  subtitle: string = 'Multi-Series Line Chart';


    private htmlElement: HTMLElement;
    private host: any;
    private svg: any;
    private container: any;

    data = [    {"date": new Date("2016-09-01")},
                {"date": new Date("2016-09-02")},
                {"date": new Date("2016-09-03")},
                {"date": new Date("2016-09-04")},
                {"date": new Date("2016-09-05")},
                {"date": new Date("2016-09-06")},
                {"date": new Date("2016-09-07")},
                {"date": new Date("2016-09-08")},
                {"date": new Date("2016-09-09")},
                {"date": new Date("2016-09-10")}];

    cities = [
      {
        "id": "New York",
        "values": [
          {"date": new Date("2016-09-01"), "temperature": 63.4},
          {"date": new Date("2016-09-02"), "temperature": 58.0},
          {"date": new Date("2016-09-03"), "temperature": 53.3},
          {"date": new Date("2016-09-04"), "temperature": 55.7},
          {"date": new Date("2016-09-05"), "temperature": 64.2},
          {"date": new Date("2016-09-06"), "temperature": 58.8},
          {"date": new Date("2016-09-07"), "temperature": 57.9},
          {"date": new Date("2016-09-08"), "temperature": 61.8},
          {"date": new Date("2016-09-09"), "temperature": 69.3},
          {"date": new Date("2016-09-10"), "temperature": 71.2}
        ]
      },
      {
        "id": "San Francisco",
        "values": [
          {"date": new Date("2016-09-01"), "temperature": 62.7},
          {"date": new Date("2016-09-02"), "temperature": 59.9},
          {"date": new Date("2016-09-03"), "temperature": 59.1},
          {"date": new Date("2016-09-04"), "temperature": 58.8},
          {"date": new Date("2016-09-05"), "temperature": 58.7},
          {"date": new Date("2016-09-06"), "temperature": 57.0},
          {"date": new Date("2016-09-07"), "temperature": 56.7},
          {"date": new Date("2016-09-08"), "temperature": 56.8},
          {"date": new Date("2016-09-09"), "temperature": 56.7},
          {"date": new Date("2016-09-10"), "temperature": 60.1}
        ]
      }
    ];

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

      this.svg = d3.select("svg");

      this.width = this.svg.attr("width") - this.margin.left - this.margin.right;
      this.height = this.svg.attr("height") - this.margin.top - this.margin.bottom;

      this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

      this.x = d3Scale.scaleTime().range([0, this.width]);
      this.y = d3Scale.scaleLinear().range([this.height, 0]);
      this.z = d3Scale.scaleOrdinal(d3Scale.schemeCategory10);

      this.line = d3Shape.line()
                         .curve(d3Shape.curveBasis)
                         .x( (d) => this.x(d.date) )
                         .y( (d) => this.y(d.temperature) );


      this.x.domain(d3Array.extent(this.data, function(d) { return d.date; }));

      this.y.domain([
        d3Array.min(this.cities, function(c) { return d3Array.min(c.values, function(d) { return d.temperature; }); }),
        d3Array.max(this.cities, function(c) { return d3Array.max(c.values, function(d) { return d.temperature; }); })
      ]);

      this.z.domain(this.cities.map(function(c) { return c.id; }));

      this.g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3Axis.axisBottom(this.x));

      this.g.append("g")
        .attr("class", "axis axis--y")
        .call(d3Axis.axisLeft(this.y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Temperature, ºF");

      let city = this.g.selectAll(".city")
        .data(this.cities)
        .enter().append("g")
        .attr("class", "city");

      city.append("path")
        .attr("class", "line")
        .attr("d", (d) => this.line(d.values) )
        .style("stroke", (d) => this.z(d.id) );

      city.append("text")
        .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        .attr("transform", (d) => "translate(" + this.x(d.value.date) + "," + this.y(d.value.temperature) + ")" )
        .attr("x", 3)
        .attr("dy", "0.35em")
        .style("font", "10px sans-serif")
        .text(function(d) { return d.id; });

    }

}
