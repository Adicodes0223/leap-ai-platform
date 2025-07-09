import React, { useEffect, useRef, useId } from 'react';
import { useTheme } from '../contexts/ThemeContext';

declare global {
    interface Window {
        mermaid: any;
    }
}

interface MermaidChartProps {
  chart: string;
}

const MermaidChart: React.FC<MermaidChartProps> = ({ chart }) => {
  const { theme } = useTheme();
  const [svg, setSvg] = React.useState<string | null>(null);
  const chartId = useId();
  const sanitizedId = `mermaid-chart-${chartId.replace(/:/g, '')}`;

  useEffect(() => {
    let isMounted = true;
    
    const renderMermaid = async () => {
      if (!isMounted || !chart) {
        return;
      }
      
      if (!window.mermaid) {
        console.error("Mermaid library is not loaded.");
        if (isMounted) {
            setSvg(`<div class="text-red-500 dark:text-red-400 p-4">
              <p><strong>Flowchart Error</strong></p>
              <p>Mermaid.js library failed to load. Please check your internet connection or ad-blocker.</p>
            </div>`);
        }
        return;
      }
      
      try {
        const darkThemeVariables = {
          'primaryColor': '#0f172a',
          'primaryTextColor': '#e2e8f0',
          'primaryBorderColor': '#38bdf8',
          'lineColor': '#475569',
          'textColor': '#e2e8f0',
          'mainBkg': '#0f172a',
          'nodeBorder': '#38bdf8',
        };

        const lightThemeVariables = {
          'primaryColor': '#f1f5f9',
          'primaryTextColor': '#1e293b',
          'primaryBorderColor': '#0ea5e9',
          'lineColor': '#94a3b8',
          'textColor': '#1e293b',
          'mainBkg': '#f1f5f9',
          'nodeBorder': '#0ea5e9',
        };
        
        window.mermaid.initialize({ 
          startOnLoad: false, 
          securityLevel: 'loose',
          fontFamily: '"Poppins", sans-serif',
          theme: theme === 'dark' ? 'dark' : 'default',
          themeVariables: theme === 'dark' ? darkThemeVariables : lightThemeVariables,
        });

        const { svg: renderedSvg } = await window.mermaid.render(sanitizedId, chart);
        if (isMounted) {
          setSvg(renderedSvg);
        }
      } catch (e: any) {
        console.error("Mermaid rendering failed:", e);
        if (isMounted) {
          setSvg(`<div class="text-red-500 dark:text-red-400 p-4">
            <p><strong>Flowchart Rendering Error</strong></p>
            <pre class="mt-2 whitespace-pre-wrap text-xs">${e.message}</pre>
          </div>`);
        }
      }
    };
    
    // Reset to loading state before rendering a new chart
    setSvg(null);
    renderMermaid();
    
    return () => {
      isMounted = false;
    }
  }, [chart, theme, sanitizedId]);

  if (!svg) {
    return <div className="flex justify-center p-4 min-h-[100px] items-center text-slate-500 dark:text-slate-400">Loading flowchart...</div>;
  }

  return <div 
    className="flex justify-center p-2 rounded-lg bg-slate-100/50 dark:bg-slate-900/50 border border-slate-300/70 dark:border-slate-700/50"
    dangerouslySetInnerHTML={{ __html: svg }}
    ></div>;
};

export default MermaidChart;