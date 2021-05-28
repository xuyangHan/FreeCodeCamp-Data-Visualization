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
    const padding = 60;

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // set scale
    const xScale = d3.scaleLinear()
        .domain([d3.min(json, (d, i) => parseInt(d.Year)) - 1, d3.max(json, (d, i) => parseInt(d.Year)) + 1])
        .range([padding, w - padding]);

    json.forEach(function(d) {
        d.Place = +d.Place;
        var parsedTime = d.Time.split(':');
        d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
    });
    const yScale = d3.scaleLinear()
        .domain(d3.extent(json, function(d) {
            return d.Time;
        }))
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
        .style("position", "absolute")

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(d) {
        tooltip
            .html("Year: " + d.Year + "<br>" + "Seconds: " + d.Seconds)
            .style("opacity", 1)
            .attr("data-year", d.Year)
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
    var timeFormat = d3.timeFormat('%M:%S');
    var xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    var yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .attr("id", "x-axis")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .attr("id", "y-axis")
        .call(yAxis);


    // append each data in chart
    svg.selectAll("dot")
        .data(json)
        .enter()
        .append("circle")
        .attr('class', 'dot')
        .attr("cx", (d, i) => xScale(d.Year))
        .attr("cy", (d, i) => yScale(d.Time))
        .attr("data-xvalue", (d, i) => d.Year)
        .attr("data-yvalue", (d, i) => d.Time)
        .attr("r", 6)
        .attr("fill", (d, i) => color(d.Doping !== ''))
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)


    // create legend in svg
    const legend = svg.append("g")
        .attr('id', 'legend')

    legend.selectAll('#legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend-label')
        .attr('transform', function(d, i) {
            return 'translate(0,' + (h / 2 - i * 20) + ')';
        })

    legend.selectAll('g')
        .append('rect')
        .attr('x', w - 18)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', color)

    legend.selectAll('g').append('text')
        .attr('x', w - 24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text(function(d) {
            if (d) {
                return 'Riders with doping allegations';
            } else {
                return 'No doping allegations';
            }
        });
};