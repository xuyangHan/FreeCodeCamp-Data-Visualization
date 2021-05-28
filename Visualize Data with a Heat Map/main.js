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

    // create chart in svg
    const svg = d3.select("div.chart")
        .append("svg")
        .attr("class", "center")
        .attr("width", w)
        .attr("height", h);

    // Build color scale
    const maxT = d3.max(json, (d, i) => parseInt(d.variance)) + baseTemperature;
    const minT = d3.min(json, (d, i) => parseInt(d.variance)) + baseTemperature;
    const myColor = d3.scaleLinear()
        .range(['#abd9e9', '#fdae61'])
        .domain([minT, maxT])

    // set scale and create axis 
    const xScale = d3.scaleLinear()
        .domain([d3.min(json, (d, i) => parseInt(d.year)), d3.max(json, (d, i) => parseInt(d.year))])
        .range([padding, w - padding]);

    const xAxis = d3.axisBottom(xScale);
    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .attr("id", "x-axis")
        .call(xAxis);

    // Build Y scales and axis:
    const months = [
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
    const yScale = d3.scaleBand()
        .range([h - padding, padding])
        .domain(months);

    const yAxis = d3.axisLeft(yScale);
    svg.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .attr("id", "y-axis")
        .call(yAxis);

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
            .attr("data-year", d.year)
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

    // append each data in chart
    svg.selectAll()
        .data(json)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(d.year))
        .attr("y", (d, i) => {
            if (d.month == 1) {
                return yScale('January')
            } else if (d.month == 2) {
                return yScale('February')
            } else if (d.month == 3) {
                return yScale('March')
            } else if (d.month == 4) {
                return yScale('April')
            } else if (d.month == 5) {
                return yScale('May')
            } else if (d.month == 6) {
                return yScale('June')
            } else if (d.month == 7) {
                return yScale('July')
            } else if (d.month == 8) {
                return yScale('August')
            } else if (d.month == 9) {
                return yScale('September')
            } else if (d.month == 10) {
                return yScale('October')
            } else if (d.month == 11) {
                return yScale('November')
            } else if (d.month == 12) {
                return yScale('December')
            }
        })
        .attr("width", 2)
        .attr("height", yScale.bandwidth())
        .attr("fill", (d, i) => myColor(baseTemperature + d.variance))
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
};