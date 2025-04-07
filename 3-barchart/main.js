// main.js
d3.csv("city_scaled.csv").then(data => {
  data.forEach(d => {
    d.CrashRate = +d.CrashRate;
  });

  const margin = { top: 40, right: 30, bottom: 50, left: 60 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  const svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
    .domain(data.map(d => d.City))
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.CrashRate)])
    .nice()
    .range([height, 0]);

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .call(d3.axisLeft(y));

  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.City))
    .attr("y", d => y(d.CrashRate))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.CrashRate))
    .attr("fill", "steelblue");

  // Add text labels on top of each bar
svg.selectAll(".label")
.data(data)
.enter()
.append("text")
.attr("class", "label")
.attr("x", d => x(d.City) + x.bandwidth() / 2)
.attr("y", d => y(d.CrashRate) - 5)
.attr("text-anchor", "middle")
.text(d => d.CrashRate.toFixed(1)); // Rounds to 1 decimal

});
