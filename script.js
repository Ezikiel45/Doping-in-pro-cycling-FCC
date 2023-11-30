let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
let req = new XMLHttpRequest();

let width = 800;
let height = 600;
let padding = 40;

let xScale;
let yScale;


let values = [];

let svg = d3.select('svg');
let tooltip = d3.select('#tooltip');

let drawCanvas = () => {
  svg.attr('height', height);
  svg.attr('width', width);
};

let generateScales = () => {

  xScale = d3.scaleLinear().
  range([padding, width - padding]).
  domain([d3.min(values, item => {
    return item['Year'];
  }) - 1,
  d3.max(values, item => {
    return item['Year'];
  }) + 1]);

  yScale = d3.scaleTime().
  range([padding, height - padding]).
  domain([d3.min(values, item => {
    return new Date(item['Seconds'] * 1000);
  }),
  d3.max(values, item => {
    return new Date(item['Seconds'] * 1000);
  })]);
};

let drawCircles = () => {

  svg.selectAll('circle').
  data(values).
  enter().
  append('circle').
  attr('class', 'dot').
  attr('r', 5).
  attr('data-xvalue', item => {
    return item['Year'];
  }).
  attr('data-yvalue', item => {
    return new Date(item['Seconds'] * 1000);
  }).
  attr('cx', item => {
    return xScale(item['Year']);
  }).
  attr('cy', item => {
    return yScale(new Date(item['Seconds'] * 1000));
  }).
  attr('fill', item => {
    if (item['Doping'] === '') {
      return 'Green';
    } else {
      return 'orange';
    }
  }).
  on('mouseover', (event, item) => {
    tooltip.transition().duration(0).
    style('visibility', 'visible').
    style('left', event.pageX + 'px').
    style('top', event.pageY + 'px');

    if (item['Doping'] === '') {
      tooltip.html(
      'Year: ' + item['Year'] + '<br />' +
      'Name: ' + item['Name'] + '<br />' +
      'Time: ' + item['Time'] + '<br />' +
      "No Allegations.");
    } else {
      tooltip.html(
      'Year: ' + item['Year'] + '<br />' +
      'Name: ' + item['Name'] + '<br />' +
      'Time: ' + item['Time'] + '<br />' +
      item['Doping']);

    }
    tooltip.attr('data-year', item['Year']);
  }).
  on('mouseout', item => {
    tooltip.transition().style('visibility', 'hidden');
  });


};

let generateAxes = () => {

  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

  svg.append('g').
  call(xAxis).
  attr('id', 'x-axis').
  attr('transform', 'translate(0,' + (height - padding) + ')');

  svg.append('g').
  call(yAxis).
  attr('id', 'y-axis').
  attr('transform', 'translate(' + padding + ', 0)');

};



req.open('GET', url, true);
req.onload = () => {
  values = JSON.parse(req.responseText);
  drawCanvas();
  generateScales();
  drawCircles();
  generateAxes();
};
req.send();