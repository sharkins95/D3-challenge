// define SVG area dimensions
let svgWidth = 960;
let svgHeight = 500;

// define the chart's margins as an object
let margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100,
};

// define dimensions of the chart area
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// create an SVG wrapper
let svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// append an SVG group & shift by left and top margins
let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)

// Import data
d3.csv("assets/data/data.csv").then(function(data) {
  console.log(data)
  // Parse data/cast as numbers
  data.forEach(item => {
    item.poverty = +item.poverty
    item.healthcare = +item.healthcare
  })

  // Create scale functions
  let xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(data, d => d.poverty)])
    .range([0, width]);

  let yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([height, 0])

  // create axis functions
  let xAxis = d3.axisBottom(xLinearScale)
  let yAxis = d3.axisLeft(yLinearScale)

  // append axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis)

  chartGroup.append("g")
    .call(yAxis)

//create circles
let circlesGroup = chartGroup.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", 15)
  .attr("opacity", .8)
  .attr("fill", "steelblue")

  // create axis labels
  chartGroup.append("g")
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("font-size", 12)
    .attr("text-anchor", "middle")

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 1.5))
    .attr("dy", "1em")
    .attr("class", "aText")
    .text("% Lacks Healthcare");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "aText")
    .text("% In Poverty");
})