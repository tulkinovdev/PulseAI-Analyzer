export interface MetricDetail {
  id: string;
  name: string;
  value: string;
  score: number; // 0 to 100
  description: string;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export interface ResourceUsage {
  label: string;
  size: string; // e.g. "1.2 MB"
  percentage: number; // e.g. 45
  color: string;
}

export interface Opportunities {
  id: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  savings: string; // e.g. "240 ms" or "450 KB"
  category: 'performance' | 'accessibility' | 'best_practices' | 'seo';
  codeSnippet?: string; // High-end actionable code snippet
  whyItMatters: string;
}

export interface PerformanceReport {
  url: string;
  analyzedAt: string;
  performanceScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  seoScore: number;
  metrics: {
    fcp: MetricDetail; // First Contentful Paint
    lcp: MetricDetail; // Largest Contentful Paint
    cls: MetricDetail; // Cumulative Layout Shift
    tbt: MetricDetail; // Total Blocking Time
    speedIndex: MetricDetail;
    interactive: MetricDetail;
  };
  resources: ResourceUsage[];
  opportunities: Opportunities[];
  aiExecutiveSummary: string;
}

export interface DualDeviceReport {
  url: string;
  analyzedAt: string;
  mobile: PerformanceReport;
  desktop: PerformanceReport;
}

