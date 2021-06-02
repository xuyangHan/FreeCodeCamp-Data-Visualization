// get gdp json data
const req = new XMLHttpRequest();
req.open("GET", 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json', true);
req.send();
req.onload = function() {
    // get date and gdp pair
    const data = JSON.parse(req.responseText);

    // set size of the chart
    const margin = { top: 10, right: 30, bottom: 20, left: 50 },
        w = 1500 - margin.left - margin.right,
        h = 1000 - margin.top - margin.bottom;

    // create chart in svg
    const svg = d3.select("div.chart")
        .append("svg")
        .attr("class", "center")
        .attr("width", w)
        .attr("height", h);

    // Give the data to this cluster layout:
    var root = d3.hierarchy(data).sum(function(d) { return d.value }) // Here the size of each leave is given in the 'value' field in input data
        // Then d3.treemap computes the position of each element of the hierarchy
    d3.treemap()
        .size([w, h])
        .paddingTop(27)
        .paddingRight(5)
        .paddingInner(3) // Padding between each rectangle
        //.paddingOuter(6)
        //.padding(20)
        (root)

    let names = [];
    for (let i = 0; i < data.children.length; i++) {
        names.push(data.children[i].name);
    }

    // prepare a color scale
    var color = d3.scaleOrdinal()
        .domain(names)
        .range(["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5",
            "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50",
            "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800",
            "#FF5722", "#795548", "#9E9E9E"
        ].reverse())

    // And a opacity scale
    var opacity = d3.scaleLinear()
        .domain([10, 30])
        .range([.5, 1])

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
            .html("name: " + d.data.name + "<br>" + "value: " + d.value)
            .style("opacity", 1)
            .attr("data-name", d.data.name)
            .attr("data-value", d.data.value)
    }

    const mousemove = function(event, d) {
        tooltip.style("transform", "translateY(-55%)")
            .style('left', d3.event.pageX + 10 + 'px')
            .style('top', d3.event.pageY - 28 + 'px')
    }
    const mouseleave = function(event, d) {
        tooltip
            .style("opacity", 0)
    }

    // use this information to add rectangles:
    var cell = svg
        .selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr('class', 'group')
        .attr('width', function(d) { return d.x1 - d.x0; })
        .attr('height', function(d) { return d.y1 - d.y0; })

    // use this information to add rectangles:
    cell.append("rect")
        .attr('class', 'tile')
        .attr('x', function(d) { return d.x0; })
        .attr('y', function(d) { return d.y0; })
        .attr('width', function(d) { return d.x1 - d.x0; })
        .attr('height', function(d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", function(d) { return color(d.parent.data.name) })
        .style("opacity", function(d) { return opacity(d.data.value) })
        .attr('data-name', function(d) { return d.data.name })
        .attr('data-category', function(d) { return d.data.category })
        .attr('data-value', function(d) { return d.data.value })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    // and to add the text labels
    cell.append("text")
        .attr('class', 'tile-text')
        .attr("x", (d) => {
            return d.x0 + 10;
        }) // +5 to adjust position (more right)
        .attr("y", (d) => {
            return d.y0 + 15;
        }) // +10 to adjust position (lower)
        .selectAll('tspan')
        .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .enter()
        .append('tspan')
        .text((d) => d)
        .attr("font-size", "12px")
        .attr("fill", "black")

    // Add title for the 3 groups
    svg
        .selectAll("titles")
        .data(root.descendants().filter(function(d) { return d.depth == 1 }))
        .enter()
        .append("text")
        .attr("x", function(d) { return d.x0 })
        .attr("y", function(d) { return d.y0 + 21 })
        .text(function(d) { return d.data.name })
        .attr("font-size", "19px")
        .attr("font-weight", "600")
        .attr("fill", function(d) { return color(d.data.name) })
};