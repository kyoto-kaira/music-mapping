import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CONSTANTS } from '../constants';
import { filterSongsWithCoordinates } from '../data/mockData';
import { ScatterPlotProps } from '../types';

export function ScatterPlot({ 
  songs, 
  mapAxes, 
  hasCoordinates, 
  selectedSong, 
  onSongSelect, 
  isLoading,
  newlyAddedSongId = null
}: ScatterPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  
  // ズーム状態を保持するためのref
  const zoomStateRef = useRef<{
    xDomain: [number, number] | null;
    yDomain: [number, number] | null;
    isZoomed: boolean;
  }>({
    xDomain: null,
    yDomain: null,
    isZoomed: false
  });

  const data = useMemo(() => {
    return filterSongsWithCoordinates(songs);
  }, [songs]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !hasCoordinates) return;

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Set up dimensions
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const width = rect.width - margin.left - margin.right;
    const height = rect.height - margin.top - margin.bottom;

    // Clear previous content
    svg.selectAll("*").remove();

    // Filter songs with coordinates
    const data = filterSongsWithCoordinates(songs);
    if (data.length === 0) return;

    // Set up scales
    const xExtent = d3.extent(data, d => d.x!) as [number, number];
    const yExtent = d3.extent(data, d => d.y!) as [number, number];
    
    // Add padding to extents
    const xPadding = (xExtent[1] - xExtent[0]) * CONSTANTS.MAP_PADDING || 10;
    const yPadding = (yExtent[1] - yExtent[0]) * CONSTANTS.MAP_PADDING || 10;
    
    // ズーム状態を保持している場合はそれを使用、そうでなければデフォルト範囲を使用
    const initialXDomain = zoomStateRef.current.isZoomed && zoomStateRef.current.xDomain 
      ? zoomStateRef.current.xDomain 
      : [xExtent[0] - xPadding, xExtent[1] + xPadding];
    
    const initialYDomain = zoomStateRef.current.isZoomed && zoomStateRef.current.yDomain 
      ? zoomStateRef.current.yDomain 
      : [yExtent[0] - yPadding, yExtent[1] + yPadding];
    
    const xScale = d3.scaleLinear()
      .domain(initialXDomain)
      .range([0, width]);
    
    const yScale = d3.scaleLinear()
      .domain(initialYDomain)
      .range([height, 0]);

    // Create main group
    const g = svg
      .attr('width', rect.width)
      .attr('height', rect.height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add background rect for events
    const backgroundRect = g.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair')
      .style('pointer-events', 'all');

    // Create gradient definitions
    const defs = svg.append('defs');
    
    // Normal gradient - beautiful blue-purple gradient
    const normalGradient = defs.append('radialGradient')
      .attr('id', 'normalGradient')
      .attr('cx', '30%')
      .attr('cy', '30%')
      .attr('r', '70%');
    normalGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#4F46E5')
      .attr('stop-opacity', '0.9');
    normalGradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#7C3AED')
      .attr('stop-opacity', '0.8');
    normalGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#A855F7')
      .attr('stop-opacity', '0.7');

    // Selected gradient - vibrant orange-red gradient
    const selectedGradient = defs.append('radialGradient')
      .attr('id', 'selectedGradient')
      .attr('cx', '30%')
      .attr('cy', '30%')
      .attr('r', '70%');
    selectedGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#F59E0B')
      .attr('stop-opacity', '1');
    selectedGradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#EF4444')
      .attr('stop-opacity', '0.9');
    selectedGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#DC2626')
      .attr('stop-opacity', '0.8');

    // New gradient - fresh green gradient
    const newGradient = defs.append('radialGradient')
      .attr('id', 'newGradient')
      .attr('cx', '30%')
      .attr('cy', '30%')
      .attr('r', '70%');
    newGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#10B981')
      .attr('stop-opacity', '1');
    newGradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#059669')
      .attr('stop-opacity', '0.9');
    newGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#047857')
      .attr('stop-opacity', '0.8');

    // Hover gradient - bright cyan gradient
    const hoverGradient = defs.append('radialGradient')
      .attr('id', 'hoverGradient')
      .attr('cx', '30%')
      .attr('cy', '30%')
      .attr('r', '70%');
    hoverGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#06B6D4')
      .attr('stop-opacity', '1');
    hoverGradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#0891B2')
      .attr('stop-opacity', '0.9');
    hoverGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#0E7490')
      .attr('stop-opacity', '0.8');

    // Glow filter for selected/new points
    const glowFilter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    
    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Subtle glow filter for normal points
    const subtleGlowFilter = defs.append('filter')
      .attr('id', 'subtleGlow')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');
    
    subtleGlowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '1')
      .attr('result', 'coloredBlur');
    
    const subtleFeMerge = subtleGlowFilter.append('feMerge');
    subtleFeMerge.append('feMergeNode').attr('in', 'coloredBlur');
    subtleFeMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Add grid
    const xGridlines = g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .tickSize(-height)
        .tickFormat(() => '')
      );
    
    const yGridlines = g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale)
        .tickSize(-width)
        .tickFormat(() => '')
      );

    // Style grid lines with beautiful gradient
    svg.selectAll('.grid line')
      .style('stroke', 'rgba(99, 102, 241, 0.08)')
      .style('stroke-width', 1)
      .style('stroke-dasharray', '2,4');

    svg.selectAll('.grid path')
      .style('stroke', 'none');

    svg.selectAll('.grid text')
      .style('display', 'none');

    // Add axes
    const xAxisGroup = g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickSize(0));

    const yAxisGroup = g.append('g')
      .call(d3.axisLeft(yScale).tickSize(0));

    // Hide axis lines and ticks, keep only labels
    svg.selectAll('.domain').style('stroke', 'none');
    svg.selectAll('.tick line').style('stroke', 'none');
    svg.selectAll('.tick text').style('display', 'none');

    // Add axis labels
    if (mapAxes.xAxis) {
      svg.append('text')
        .attr('transform', `translate(${rect.width / 2}, ${rect.height - 10})`)
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', '#666')
        .text(mapAxes.xAxis);
    }

    if (mapAxes.yAxis) {
      svg.append('text')
        .attr('transform', `translate(15, ${rect.height / 2}) rotate(-90)`)
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', '#666')
        .text(mapAxes.yAxis);
    }

    // Brush for area selection (added early so points render on top)
    let brush: any;
    let brushGroup: any;

    const brushed = (event: any) => {
      // This handles the visual feedback during brushing
      const selection = event.selection;
      if (!selection) return;
    };

    const brushEnd = (event: any) => {
      const selection = event.selection;
      if (!selection) return;

      const [[x0, y0], [x1, y1]] = selection;
      
      // Minimum selection size check
      if (Math.abs(x1 - x0) < CONSTANTS.MIN_SELECTION_SIZE || Math.abs(y1 - y0) < CONSTANTS.MIN_SELECTION_SIZE) {
        brushGroup.call(brush.move, null);
        return;
      }
      
      // Clear the brush selection
      brushGroup.call(brush.move, null);
      
      // Convert screen coordinates to data coordinates
      const dataX0 = xScale.invert(x0);
      const dataX1 = xScale.invert(x1);
      const dataY0 = yScale.invert(y1); // y1 for y0 because SVG y is flipped
      const dataY1 = yScale.invert(y0); // y0 for y1 because SVG y is flipped

      // Update scales to zoom to selection
      xScale.domain([dataX0, dataX1]);
      yScale.domain([dataY0, dataY1]);

      // ズーム状態を保存
      zoomStateRef.current = {
        xDomain: [dataX0, dataX1],
        yDomain: [dataY0, dataY1],
        isZoomed: true
      };

      // Update visualization with animation
      updateVisualization();
    };

    brush = d3.brush()
      .extent([[0, 0], [width, height]])
      .on('brush', brushed)
      .on('end', brushEnd);

    brushGroup = g.append('g')
      .attr('class', 'brush')
      .call(brush);

    // Style brush selection
    brushGroup.selectAll('.selection')
      .style('fill', 'rgba(59, 130, 246, 0.1)')
      .style('stroke', 'rgba(59, 130, 246, 0.8)')
      .style('stroke-width', 2)
      .style('stroke-dasharray', '5,5');

    // Style brush handles
    brushGroup.selectAll('.handle')
      .style('fill', 'rgba(59, 130, 246, 0.8)');

    // Add points (after brush so they render on top)
    const circles = g.selectAll('.point')
      .data(data)
      .enter().append('circle')
      .attr('class', d => newlyAddedSongId === d.id ? 'point new-song-pulse' : 'point')
      .attr('cx', d => xScale(d.x!))
      .attr('cy', d => yScale(d.y!))
      .attr('r', d => {
        if (selectedSong?.id === d.id) return 10;
        if (newlyAddedSongId === d.id) return 10;
        return 7;
      })
      .attr('fill', d => {
        if (selectedSong?.id === d.id) return 'url(#selectedGradient)';
        if (newlyAddedSongId === d.id) return 'url(#newGradient)';
        return 'url(#normalGradient)';
      })
      .attr('stroke', d => {
        if (selectedSong?.id === d.id) return 'rgba(255, 255, 255, 0.9)';
        if (newlyAddedSongId === d.id) return 'rgba(255, 255, 255, 0.9)';
        return 'rgba(255, 255, 255, 0.6)';
      })
      .attr('stroke-width', d => {
        if (selectedSong?.id === d.id) return 2.5;
        if (newlyAddedSongId === d.id) return 2.5;
        return 1.5;
      })
      .style('cursor', 'pointer')
      .style('pointer-events', 'all')
      .style('filter', d => {
        if (selectedSong?.id === d.id || newlyAddedSongId === d.id) {
          return 'url(#glow)';
        }
        return 'url(#subtleGlow)';
      })
      .style('opacity', 0.9)
      .style('transition', 'all 0.3s ease');

    // Add hover effects
    circles
      .on('mouseenter', function(event, d) {
        if (selectedSong?.id !== d.id && newlyAddedSongId !== d.id) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r', 9)
            .attr('fill', 'url(#hoverGradient)')
            .style('opacity', 1)
            .style('filter', 'url(#glow)');
        }
      })
      .on('mouseleave', function(event, d) {
        if (selectedSong?.id !== d.id && newlyAddedSongId !== d.id) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r', 7)
            .attr('fill', 'url(#normalGradient)')
            .style('opacity', 0.9)
            .style('filter', 'url(#subtleGlow)');
        }
      });

    // Add click handlers to points
    circles.on('click', function(event, d) {
      event.stopPropagation();
      event.preventDefault();
      
      // Get the SVG element's position relative to the viewport
      const svgRect = svgRef.current!.getBoundingClientRect();
      
      // Calculate position relative to the SVG container
      const svgX = event.clientX - svgRect.left;
      const svgY = event.clientY - svgRect.top;
      
      onSongSelect(d, { 
        x: svgX, 
        y: svgY 
      });
    });



    const updateVisualization = () => {
      const t = d3.transition().duration(750);
      
      // Update grid with beautiful styling maintained
      xGridlines.transition(t)
        .call(d3.axisBottom(xScale)
          .tickSize(-height)
          .tickFormat(() => '')
        )
        .selectAll('line')
        .style('stroke', 'rgba(99, 102, 241, 0.08)')
        .style('stroke-width', 1)
        .style('stroke-dasharray', '2,4');
      
      yGridlines.transition(t)
        .call(d3.axisLeft(yScale)
          .tickSize(-width)
          .tickFormat(() => '')
        )
        .selectAll('line')
        .style('stroke', 'rgba(99, 102, 241, 0.08)')
        .style('stroke-width', 1)
        .style('stroke-dasharray', '2,4');

      // Update axes with hidden styling
      xAxisGroup.transition(t)
        .call(d3.axisBottom(xScale).tickSize(0))
        .selectAll('.domain')
        .style('stroke', 'none');
      
      yAxisGroup.transition(t)
        .call(d3.axisLeft(yScale).tickSize(0))
        .selectAll('.domain')
        .style('stroke', 'none');

      // Update points
      circles.transition(t)
        .attr('cx', d => xScale(d.x!))
        .attr('cy', d => yScale(d.y!));

      // Ensure consistent beautiful styling throughout and after transition
      svg.selectAll('.domain').style('stroke', 'none');
      svg.selectAll('.tick line').style('stroke', 'none');
      svg.selectAll('.tick text').style('display', 'none');
      svg.selectAll('.grid line')
        .style('stroke', 'rgba(99, 102, 241, 0.08)')
        .style('stroke-width', 1)
        .style('stroke-dasharray', '2,4');
      svg.selectAll('.grid path')
        .style('stroke', 'none');
      svg.selectAll('.grid text')
        .style('display', 'none');
    };

    // Double-click to reset zoom
    svg.on('dblclick', () => {
      xScale.domain([xExtent[0] - xPadding, xExtent[1] + xPadding]);
      yScale.domain([yExtent[0] - yPadding, yExtent[1] + yPadding]);
      
      // ズーム状態をリセット
      zoomStateRef.current = {
        xDomain: null,
        yDomain: null,
        isZoomed: false
      };
      
      updateVisualization();
    });

    // Prevent context menu on right click
    svg.on('contextmenu', (event) => {
      event.preventDefault();
    });

  }, [mapAxes, hasCoordinates, selectedSong, onSongSelect, newlyAddedSongId]);

  // Handle resize
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      // Trigger re-render on resize
      const event = new Event('resize');
      window.dispatchEvent(event);
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {hasCoordinates ? CONSTANTS.MESSAGES.INFO.UPDATING_MAP : CONSTANTS.MESSAGES.INFO.LOADING_DATA}
          </p>
        </div>
      </div>
    );
  }

  if (!hasCoordinates) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-muted-foreground" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
              />
            </svg>
          </div>
          <h3>{CONSTANTS.MESSAGES.INFO.ENTER_AXES}</h3>
          <p className="text-muted-foreground mt-2">
            {CONSTANTS.MESSAGES.INFO.AXES_DESCRIPTION}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full relative">
      <svg ref={svgRef} className="w-full h-full" />
      
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        ドラッグで領域選択してズーム • ダブルクリックで元のサイズに戻る • クリックで選択
      </div>
    </div>
  );
}