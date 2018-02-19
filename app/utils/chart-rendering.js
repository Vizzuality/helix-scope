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
