# d3js-angular2-example

This project shows how to integrate D3.js with Angular 2.

We'll implement an example that uses the article [Multi-Series Line Chart](http://bl.ocks.org/mbostock/3884955)
by Mike Bostock as the starting point to then migrate it to Angular2.

![Multi-Series Line Chart](../99_readme_resources/02_multi_series_line_chart/screenshot.png "Multi-Series Line Chart")

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) if they are not already installed on your computer.

> Verify that you are running at least node v6.x.x and npm 3.x.x by running node -v and npm -v in a terminal / console window. Older versions may produce errors.

## Steps

- Clone this repo into a new project folder.

 ```bash
 $ git clone https://github.com/datencia/d3js-angular2-example.git
 $ cd d3js-angular2-example
 ```

- Install the npm packages described in the `package.json` and verify that it works:

 ```bash
 $ npm install
 ```
- Execute the example:

 ```bash
 $ npm start
 ```

- Then, load http://localhost:8080/ in a browser to see the output.

 ![Multi-Series Line Chart](../99_readme_resources/02_multi_series_line_chart/browser_output.png "Multi-Series Line Chart")
