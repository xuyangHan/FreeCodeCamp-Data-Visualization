const req = new XMLHttpRequest();
req.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
req.send();
req.onload = function() {
    const json = JSON.parse(req.responseText).data;

    const w = 1000;
    const h = 500;

    const padding = 60;

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(json, (d, i) => i)])
        .range([padding, w - padding]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(json, (d) => d[1])])
        .range([h - padding, padding]);

    const svg = d3.select("div.chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    svg.selectAll("rect")
        .data(json)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(i))
        .attr("y", (d, i) => yScale(d[1]))
        .attr("width", 3)
        .attr("height", (d, i) => h - yScale(d[1]) - padding)
        .attr("fill", "#29B6F6")
        .attr("class", "bar")
        .append("title")
        .text(d => d);

    const xAxis = d3.axisBottom(xScale);

    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    // Add your code below this line

    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    // Add your code above this line


};