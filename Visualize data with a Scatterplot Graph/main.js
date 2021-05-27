// get gdp json data
const req = new XMLHttpRequest();
req.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);
req.send();
req.onload = function() {
    // get point data
    const json = JSON.parse(req.responseText);

    // set size of the chart
    const margin = { top: 10, right: 30, bottom: 20, left: 50 },
        w = 1000 - margin.left - margin.right,
        h = 500 - margin.top - margin.bottom;
    const barWidth = w / 275;
    const padding = 60;

    // set scale
    const xScale = d3.scaleLinear()
        .domain([d3.min(json, (d, i) => parseInt(d.Year)), d3.max(json, (d, i) => parseInt(d.Year))])
        .range([padding, w - padding]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(json, (d) => d.Seconds), d3.max(json, (d) => d.Seconds)])
        .range([h - padding, padding]);

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

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(d) {
        tooltip
            .html("Year: " + d.Year + "<br>" + "Seconds: " + d.Seconds)
            .style("opacity", 1)
            .attr("data-date", d.Year)
    }

    const mousemove = function(event, d) {
        tooltip.style("transform", "translateY(-55%)")
            .style("left", (event.x) / 2 + "px")
            .style("top", (event.y) / 2 - 30 + "px")
    }
    const mouseleave = function(event, d) {
        tooltip
            .style("opacity", 0)
    }

    // create axis
    const xAxis = d3.axisBottom(xScale);
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
    svg.selectAll("dot")
        .data(json)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => xScale(d.Year))
        .attr("cy", (d, i) => yScale(d.Seconds))
        .attr("year", (d, i) => d.Year)
        .attr("second", (d, i) => d.Seconds)
        .attr("r", 3)
        .attr("fill", "#29B6F6")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
};