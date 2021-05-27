// get gdp json data
const req = new XMLHttpRequest();
req.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
req.send();
req.onload = function() {
    // get date and gdp pair
    const json = JSON.parse(req.responseText).data;

    // set size of the chart
    const margin = { top: 10, right: 30, bottom: 20, left: 50 },
        w = 1000 - margin.left - margin.right,
        h = 500 - margin.top - margin.bottom;
    const barWidth = w / 275;
    const padding = 60;

    // set scale
    const xScale = d3.scaleLinear()
        .domain([d3.min(json, (d, i) => parseInt(d[0].slice(0, 4))), d3.max(json, (d, i) => parseInt(d[0].slice(0, 4))) + 1])
        .range([padding, w - padding]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(json, (d) => d[1])])
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
            .html("Date: " + d[0] + "<br>" + "GDP: " + d[1])
            .style("opacity", 1)
            .attr("data-date", d[0])
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
    svg.selectAll("rect")
        .data(json)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(parseFloat(d[0].slice(0, 4)) + parseFloat(d[0].slice(5, 7) / 12)))
        .attr("y", (d, i) => yScale(d[1]))
        .attr("data-date", (d, i) => d[0])
        .attr("data-gdp", (d, i) => d[1])
        .attr("width", barWidth)
        .attr("height", (d, i) => h - yScale(d[1]) - padding)
        .attr("fill", "#29B6F6")
        .attr("class", "bar")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
};