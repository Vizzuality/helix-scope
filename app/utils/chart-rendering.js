import { select } from 'd3-selection';
import tippy from 'tippy.js';
import uuid from 'uuid/v4';

export function renderTooltip(chartElement, data, hoverBox) {
  const {
    appendTo,
    getTooltipHtml,
    getHoverColor,
    getX,
    width,
    height
  } = hoverBox;

  const chart = select(chartElement);

  chart.selectAll('.hover-template').remove();

  const chartHoverTemplateId = uuid();
  const getHoverTemplateId = (d, index) => `id${chartHoverTemplateId}_${index}`.replace('.', '');

  appendTo.append('rect')
    .attr('fill', getHoverColor)
    .attr('x', (d) => getX(d) - (width / 2))
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'hover-box')
    .attr('data-tippy-html', (d, index) => `#${getHoverTemplateId(d, index)}`);

  chart.selectAll('.hover-tooltip')
    .data(data)
    .enter()
    .append('div')
    .attr('class', '.hover-tooltip')
    .style('display', 'none')
    .attr('id', getHoverTemplateId)
    .html(getTooltipHtml);

  tippy(chartElement.querySelectorAll('.hover-box'), {
    arrow: true,
    theme: 'light'
  });
}

export function renderLegend({ appendTo, width, height = 20, position = { x: 0, y: 0 }, series }) {
  const legend = appendTo.append('g')
    .attr('class', 'legend')
    .attr('width', width)
    .attr('height', height)
    .attr('transform', 'translate(0, 0)');

  legend.selectAll('circle')
    .data(series)
    .enter()
    .append('circle')
    .attr('r', 5)
    .attr('cx', (d, i) => position.x + i * 60)
    .attr('cy', position.y)
    .attr('fill', (d) => d.color);

  legend.selectAll('text')
    .data(series)
    .enter()
    .append('text')
    .attr('x', (d, i) => position.x + (i * 60) + 8)
    .attr('y', position.y + 5)
    .text((s) => s.label);
}