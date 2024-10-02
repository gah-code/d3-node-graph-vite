import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NodeGraph = () => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 950;
    const height = 680;

    // Updated nodes with 'value' and 'topic'
    const nodes = [
      { id: 'HTML', value: 100, topic: 'Frontend' },
      { id: 'CSS/SCSS', value: 90, topic: 'Frontend' },
      { id: 'Styled Components', value: 75, topic: 'Frontend' },
      { id: 'Responsive Design', value: 80, topic: 'Design' },
      { id: 'JavaScript', value: 80, topic: 'Frontend' },
      { id: 'React', value: 78, topic: 'Frontend' },
      { id: 'AEM', value: 70, topic: 'CMS' },
      { id: 'SEO', value: 72, topic: 'Design' },
      { id: 'Theme UI', value: 75, topic: 'Frontend' },
      { id: 'GraphQL', value: 70, topic: 'Backend' },
      { id: 'a11y', value: 70, topic: 'Design' },
      { id: 'Progressive enhancement', value: 80, topic: 'Design' },
      { id: 'Mongo DB', value: 34, topic: 'Backend' },
      { id: 'Supabase', value: 30, topic: 'Backend' },
      { id: 'Java Content Repository', value: 28, topic: 'Backend' },
      { id: 'Photoshop', value: 24, topic: 'Design' },
      { id: 'Redux', value: 38, topic: 'Frontend' },
      { id: 'Next Js', value: 36, topic: 'Frontend' },
      { id: 'Tailwind CSS', value: 34, topic: 'Frontend' },
    ];

    const links = [
      { source: 'HTML', target: 'CSS/SCSS' },
      { source: 'CSS/SCSS', target: 'JavaScript' },
      { source: 'JavaScript', target: 'React' },
      { source: 'React', target: 'Redux' },
      { source: 'React', target: 'CSS/SCSS' },
      { source: 'Styled Components', target: 'CSS/SCSS' },
      { source: 'Next Js', target: 'Tailwind CSS' },
      { source: 'Mongo DB', target: 'Supabase' },
      { source: 'Java Content Repository', target: 'AEM' },
      { source: 'SEO', target: 'Responsive Design' },
      { source: 'Progressive enhancement', target: 'a11y' },
    ];

    // Create color scale based on topics
    const color = d3.scaleOrdinal(d3.schemeSet2); // Use an accessible color scheme

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(600)
      )
      .force('charge', d3.forceManyBody().strength(-90))
      .force('center', d3.forceCenter(width / 2, height / 2));

    svg.attr('viewBox', [0, 0, width, height]).style('font', '14px sans-serif'); // Increase base font size

    const link = svg
      .append('g')
      .attr('stroke', '#777') // Darker line color for contrast
      .attr('stroke-opacity', 0.8)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 3);

    const nodeGroup = svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 3.5) // Thicker border for better visibility
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g');

    // Append circles to each node group with varying size and color based on value and topic
    nodeGroup
      .append('circle')
      .attr('r', (d) => d.value / 4) // Adjust radius based on value
      .attr('fill', (d) => color(d.topic)) // Color based on topic
      .call(drag(simulation));

    // Append text to display the title above the nodes
    // Append text to display the title above the nodes, wrapped in foreignObject for max-width
    nodeGroup
      .append('foreignObject')
      .attr('x', -100) // Shift text to center horizontally
      .attr('y', -50) // Shift text above node
      .attr('width', '32rem') // Set max width for text
      .attr('height', 60) // Ensure enough height for text block
      .append('xhtml:div') // Use xhtml namespace for foreignObject
      // .style('text-align', 'center')
      .style('font-size', '22px')
      .style('font-weight', '600')
      .style('text-transform', 'uppercase')
      .style('letter-spacing', '0.05em') // Increased letter spacing
      .style('color', '#f4f4f4')
      .text((d) => d.id);

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      nodeGroup.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    function drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }
  }, []);

  return (
    <svg
      ref={svgRef}
      style={{ width: '65%', height: '390px', padding: '100px' }}
    />
  );
};

export default NodeGraph;
