// --- Chart 1: Crashes Per 10,000 People from city_scaled.csv ---
d3.csv("city_scaled.csv").then(data => {
  // Convert CrashRate strings to numbers
  data.forEach(d => {
    d.CrashRate = +d.CrashRate;
  });

  // Set dimensions and margins for the chart
  const margin = { top: 40, right: 30, bottom: 50, left: 60 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  // Create SVG container and move it into position
  const svg = d3.select("#chart1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Set up x and y scales
  const x = d3.scaleBand()
    .domain(data.map(d => d.City))
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.CrashRate)])
    .nice()
    .range([height, 0]);

  // Add X and Y axes
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .call(d3.axisLeft(y));

  // Draw bars
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

  // Add numeric labels above bars
  svg.selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", d => x(d.City) + x.bandwidth() / 2)
    .attr("y", d => y(d.CrashRate) - 5)
    .attr("text-anchor", "middle")
    .text(d => d.CrashRate.toFixed(1));

  // Add title to the chart
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "22px")
    .style("font-weight", "bold")
    .text("Crashes Per 10,000 People");
});


// --- Chart 2: Total Crash Count from Combined_crash.csv ---
d3.csv("Combined_crash.csv").then(data => {
  // Count how many crashes occurred in each city
  const crashCounts = d3.rollups(
    data,
    v => v.length,
    d => d.City_Town_Name
  ).map(([city, count]) => ({ city, count }));

  // Slightly larger top margin to accommodate the higher title
  const margin = { top: 80, right: 30, bottom: 50, left: 60 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  // Create second SVG container and shift it into view
  const svg = d3.select("#chart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Set up x and y scales for raw crash counts
  const x = d3.scaleBand()
    .domain(crashCounts.map(d => d.city))
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(crashCounts, d => d.count)])
    .nice()
    .range([height, 0]);

  // Add X and Y axes
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .call(d3.axisLeft(y));

  // Draw bars for total crash counts
  svg.selectAll(".bar")
    .data(crashCounts)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.city))
    .attr("y", d => y(d.count))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.count))
    .attr("fill", "tomato");

  // Add labels above each bar
  svg.selectAll(".label")
    .data(crashCounts)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", d => x(d.city) + x.bandwidth() / 2)
    .attr("y", d => y(d.count) - 5)
    .attr("text-anchor", "middle")
    .text(d => d.count);

  // Add chart title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .style("font-size", "22px")
    .style("font-weight", "bold")
    .text("Total Crash Count");
});
