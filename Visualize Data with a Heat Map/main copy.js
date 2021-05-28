// get gdp json data
const req = new XMLHttpRequest();
req.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json', true);
req.send();
req.onload = function() {
    // get point data
    const json = JSON.parse(req.responseText).monthlyVariance;
    const baseTemperature = JSON.parse(req.responseText).baseTemperature;

    // set size of the chart
    const margin = { top: 10, right: 30, bottom: 20, left: 50 },
        w = 1000 - margin.left - margin.right,
        h = 500 - margin.top - margin.bottom;
    const padding = 60;

    const maxT = d3.max(json, (d, i) => parseInt(d.variance)) + baseTemperature;
    const minT = d3.min(json, (d, i) => parseInt(d.variance)) + baseTemperature;
    // Build color scale
    var myColor = d3.scaleLinear()
        .range(['#2c7bb6', '#d7191c']) // (['#2c7bb6', '#abd9e9', '#ffffbf', '#fdae61', '#d7191c'])
        .domain([minT, maxT])

    // set scale
    const xScale = d3.scaleLinear()
        .domain([d3.min(json, (d, i) => parseInt(d.year)), d3.max(json, (d, i) => parseInt(d.year))])
        .range([padding, w - padding]);

    var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    // Build Y scales and axis:
    var yScale = d3.scaleBand()
        .range([h - padding, padding])
        .domain([d3.min(json, (d, i) => parseInt(d.month)), d3.max(json, (d, i) => parseInt(d.month))])
        .padding(0.01);

    // create chart in svg
    const svg = d3.select("div.chart")
        .append("svg")
        .attr("class", "center")
        .attr("width", w)
        .attr("height", h);

    // Create a tooltip
    const tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("id", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("position", "absolute")

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(d) {
        tooltip
            .html("Year: " + d.year + "<br>" + "T: " + (baseTemperature + d.variance))
            .style("opacity", 1)
            .attr("data-year", d.year);
    }

    const mousemove = function(event, d) {
        tooltip.style("transform", "translateY(-55%)")
            .style("left", (d3.mouse(this)[0] + 180) + "px")
            .style("top", (d3.mouse(this)[1] + 90) + "px")
    }
    const mouseleave = function(event, d) {
        tooltip
            .style("opacity", 0)
    }

    // create axis  
    const xAxis = d3.axisLeft(xScale);
    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .attr("id", "x-axis")
        .call(xAxis);

    const yAxis = d3.axisLeft(yScale);
    svg.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .attr("id", "y-axis")
        .call(yAxis);

    // append each data in chart
    svg.selectAll()
        .data(json)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(d.year))
        .attr("y", (d, i) => yScale(d.month))
        .attr("width", 3)
        .attr("height", 10)
        .attr("fill", (d, i) => myColor(baseTemperature + d.variance))
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
};