# Claude Code Configuration for Data Science Projects

## 🚨 CRITICAL: PARALLEL DATA PROCESSING EXECUTION

**MANDATORY RULE**: In data science projects, ALL data operations MUST be parallel:

1. **Data ingestion** → Parallel data source connections
2. **Data preprocessing** → Concurrent transformation pipelines
3. **Statistical analysis** → Parallel hypothesis testing
4. **Visualization generation** → Concurrent plot creation
5. **Report compilation** → Parallel insights aggregation

## 📊 DATA SCIENCE AGENT SPECIALIZATION

### Required Agent Types for Data Science Projects:

1. **Data Analyst** - Statistical analysis, hypothesis testing, insights
2. **Data Engineer** - ETL, data pipelines, infrastructure
3. **Visualization Specialist** - Charts, dashboards, interactive plots
4. **Statistical Modeler** - Regression, time series, statistical models
5. **Business Intelligence** - KPIs, metrics, business insights
6. **Data Quality Engineer** - Validation, cleaning, profiling
7. **Reporting Specialist** - Documentation, presentations, findings

## 🚀 DATA SCIENCE SWARM INITIALIZATION PATTERN

### Standard Data Science Project Setup:

```javascript
// ✅ CORRECT: Parallel data science swarm initialization
[BatchTool - Message 1]:
  // Initialize data-focused swarm
  mcp__claude-flow__swarm_init { 
    topology: "mesh", 
    maxAgents: 8, 
    strategy: "data_analysis" 
  }

  // Spawn ALL data science agents in parallel
  mcp__claude-flow__agent_spawn { type: "analyst", name: "Data Analyst", capabilities: ["statistics", "hypothesis_testing", "correlation_analysis"] }
  mcp__claude-flow__agent_spawn { type: "coder", name: "Data Engineer", capabilities: ["etl", "pipelines", "data_modeling"] }
  mcp__claude-flow__agent_spawn { type: "specialist", name: "Viz Specialist", capabilities: ["matplotlib", "plotly", "seaborn", "tableau"] }
  mcp__claude-flow__agent_spawn { type: "analyst", name: "Statistical Modeler", capabilities: ["regression", "time_series", "bayesian"] }
  mcp__claude-flow__agent_spawn { type: "analyst", name: "BI Analyst", capabilities: ["kpis", "dashboards", "business_metrics"] }
  mcp__claude-flow__agent_spawn { type: "tester", name: "Data Quality Engineer", capabilities: ["validation", "profiling", "cleaning"] }
  mcp__claude-flow__agent_spawn { type: "documenter", name: "Report Specialist", capabilities: ["jupyter", "presentations", "documentation"] }
  mcp__claude-flow__agent_spawn { type: "coordinator", name: "Data Science Lead", capabilities: ["coordination", "strategy", "insights"] }

  // Orchestrate data science workflow
  mcp__claude-flow__task_orchestrate { 
    task: "End-to-end data analysis and insights generation", 
    strategy: "parallel",
    dependencies: ["data_quality", "analysis", "visualization", "reporting"]
  }

  // Store data science project context
  mcp__claude-flow__memory_usage { 
    action: "store", 
    key: "ds_project/context", 
    value: { 
      "project_type": "data_analysis",
      "tools": ["pandas", "numpy", "scipy", "matplotlib", "plotly"],
      "data_sources": ["csv", "database", "api", "excel"],
      "analysis_types": ["descriptive", "inferential", "predictive"]
    }
  }
```

## 📈 DATA SCIENCE TODOWRITE PATTERN

### Data Science-Specific Todo Categories:

```javascript
// ✅ MANDATORY: All data science todos in ONE call
TodoWrite { todos: [
  // Data Collection & Ingestion Phase
  { id: "data_collection", content: "Collect data from multiple sources", status: "in_progress", priority: "high" },
  { id: "data_profiling", content: "Profile data quality and structure", status: "pending", priority: "high" },
  { id: "data_cleaning", content: "Clean and preprocess raw data", status: "pending", priority: "high" },
  { id: "data_integration", content: "Integrate data from different sources", status: "pending", priority: "medium" },
  
  // Exploratory Data Analysis Phase
  { id: "descriptive_stats", content: "Calculate descriptive statistics", status: "pending", priority: "high" },
  { id: "correlation_analysis", content: "Perform correlation analysis", status: "pending", priority: "high" },
  { id: "outlier_detection", content: "Identify and handle outliers", status: "pending", priority: "medium" },
  { id: "distribution_analysis", content: "Analyze data distributions", status: "pending", priority: "medium" },
  
  // Statistical Analysis Phase
  { id: "hypothesis_testing", content: "Conduct hypothesis tests", status: "pending", priority: "high" },
  { id: "regression_analysis", content: "Build regression models", status: "pending", priority: "high" },
  { id: "time_series_analysis", content: "Analyze temporal patterns", status: "pending", priority: "medium" },
  { id: "clustering_analysis", content: "Perform clustering analysis", status: "pending", priority: "medium" },
  
  // Visualization Phase
  { id: "exploratory_plots", content: "Create exploratory visualizations", status: "pending", priority: "high" },
  { id: "statistical_plots", content: "Generate statistical plots", status: "pending", priority: "medium" },
  { id: "interactive_dashboard", content: "Build interactive dashboard", status: "pending", priority: "medium" },
  { id: "presentation_charts", content: "Create presentation-ready charts", status: "pending", priority: "medium" },
  
  // Reporting Phase
  { id: "jupyter_notebook", content: "Compile analysis notebook", status: "pending", priority: "high" },
  { id: "executive_summary", content: "Write executive summary", status: "pending", priority: "high" },
  { id: "technical_report", content: "Create detailed technical report", status: "pending", priority: "medium" },
  { id: "presentation_deck", content: "Build presentation deck", status: "pending", priority: "low" }
]}
```

## 🛠️ DATA PROCESSING FRAMEWORK INTEGRATION

### Pandas/NumPy Projects:

```python
# Data Processing Agent Coordination Hook
import claude_flow_hooks as cf
import pandas as pd
import numpy as np

@cf.pre_task("data_processing")
def setup_data_environment():
    """Setup data processing environment with coordination"""
    cf.memory.store("pandas_config", {
        "display_max_columns": None,
        "display_width": None,
        "memory_usage": "deep",
        "compute_parallel": True
    })

@cf.post_edit("*.py")
def validate_data_operations():
    """Validate data operations after each edit"""
    cf.hooks.notify("Data processing code updated - validating operations")
    # Run data validation checks
```

### Statistical Analysis with SciPy/Statsmodels:

```python
# Statistical Analysis Agent Coordination
import claude_flow_hooks as cf
import scipy.stats as stats
import statsmodels.api as sm

@cf.pre_task("statistical_analysis")
def setup_statistical_tests():
    """Setup statistical testing environment"""
    cf.memory.store("stats_config", {
        "significance_level": 0.05,
        "multiple_comparison_correction": "bonferroni",
        "effect_size_reporting": True
    })

@cf.post_task("hypothesis_test")
def log_statistical_results():
    """Log statistical test results"""
    results = cf.memory.retrieve("test_results")
    cf.hooks.notify(f"Statistical test completed - p-value: {results['p_value']}")
```

## 🔄 DATA SCIENCE WORKFLOW ORCHESTRATION

### End-to-End Data Analysis Pipeline:

```javascript
// ✅ PARALLEL DATA SCIENCE WORKFLOW EXECUTION
[BatchTool - Data Science Pipeline]:
  // Data ingestion and quality phase
  Task("You are Data Engineer. COORDINATE: Run cf.hooks.pre_task('data_ingestion'). Setup data pipelines with Pandas, validate data quality with Great Expectations")
  Task("You are Data Quality Engineer. COORDINATE: Run cf.hooks.pre_task('quality_check'). Profile data with pandas-profiling, implement validation rules")
  
  // Exploratory analysis phase
  Task("You are Data Analyst. COORDINATE: Run cf.hooks.pre_task('eda'). Perform EDA with Pandas/NumPy, statistical summaries, correlation analysis")
  Task("You are Statistical Modeler. COORDINATE: Run cf.hooks.pre_task('modeling'). Build statistical models with SciPy/Statsmodels, hypothesis testing")
  
  // Visualization phase
  Task("You are Viz Specialist. COORDINATE: Run cf.hooks.pre_task('visualization'). Create plots with Matplotlib/Plotly/Seaborn, interactive dashboards")
  Task("You are BI Analyst. COORDINATE: Run cf.hooks.pre_task('business_analysis'). Calculate KPIs, business metrics, trend analysis")
  
  // Reporting phase
  Task("You are Report Specialist. COORDINATE: Run cf.hooks.pre_task('reporting'). Compile Jupyter notebooks, create presentations, document findings")
  Task("You are Coordinator. COORDINATE: Run cf.hooks.pre_task('coordination'). Synthesize insights, validate conclusions, coordinate final deliverables")

  // File operations for data science project structure
  Bash("mkdir -p ds_project/{data,notebooks,src,reports,visualizations,models}")
  Bash("mkdir -p ds_project/src/{data,analysis,visualization,utils}")
  Bash("mkdir -p ds_project/reports/{html,pdf,presentations}")

  // Create data science project files
  Write("ds_project/requirements.txt", ds_requirements)
  Write("ds_project/src/data_processing.py", data_processing_script)
  Write("ds_project/src/analysis.py", analysis_script)
  Write("ds_project/src/visualization.py", viz_script)
  Write("ds_project/notebooks/exploratory_analysis.ipynb", notebook_template)
```

## 📊 DATA ANALYSIS COORDINATION

### Parallel Statistical Analysis Pattern:

```python
# statistical_coordinator.py
import claude_flow_hooks as cf
import pandas as pd
import numpy as np
from scipy import stats

@cf.coordination_required
class StatisticalAnalysisCoordinator:
    def __init__(self):
        self.config = cf.memory.retrieve("analysis_config")
        
    @cf.pre_task("statistical_analysis")
    def setup_analysis(self):
        """Coordinate statistical analysis setup"""
        cf.memory.store("analysis_status", "initializing")
        cf.hooks.notify("Starting statistical analysis coordination")
        
    @cf.parallel_task("hypothesis_testing")
    def conduct_hypothesis_tests(self, data_groups):
        """Conduct multiple hypothesis tests in parallel"""
        results = {}
        
        for test_name, (group1, group2) in data_groups.items():
            # Perform t-test
            statistic, p_value = stats.ttest_ind(group1, group2)
            
            results[test_name] = {
                "statistic": statistic,
                "p_value": p_value,
                "significant": p_value < 0.05,
                "effect_size": self.calculate_cohens_d(group1, group2)
            }
            
        cf.memory.store("hypothesis_test_results", results)
        cf.hooks.notify(f"Hypothesis testing complete - {len(results)} tests conducted")
        
    @cf.post_task("analysis_complete")
    def finalize_analysis(self):
        """Finalize statistical analysis and store results"""
        cf.memory.store("analysis_status", "completed")
        cf.hooks.notify("Statistical analysis completed successfully")
```

## 📈 DATA VISUALIZATION COORDINATION

### Comprehensive Visualization Pipeline:

```python
# visualization_coordinator.py
import claude_flow_hooks as cf
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
import plotly.graph_objects as go

@cf.coordination_required
class VisualizationCoordinator:
    
    @cf.pre_task("visualization_setup")
    def setup_visualization_environment(self):
        """Setup visualization environment"""
        viz_config = {
            "style": "seaborn-whitegrid",
            "color_palette": "husl",
            "figure_size": (12, 8),
            "dpi": 300,
            "interactive": True
        }
        
        # Configure matplotlib
        plt.style.use(viz_config["style"])
        sns.set_palette(viz_config["color_palette"])
        
        cf.memory.store("viz_config", viz_config)
        cf.hooks.notify("Visualization environment configured")
        
    @cf.parallel_task("create_visualizations")
    def create_analysis_plots(self, data, plot_types):
        """Create multiple visualizations in parallel"""
        plots_created = {}
        
        for plot_type in plot_types:
            if plot_type == "distribution":
                fig = self.create_distribution_plots(data)
            elif plot_type == "correlation":
                fig = self.create_correlation_heatmap(data)
            elif plot_type == "time_series":
                fig = self.create_time_series_plots(data)
            elif plot_type == "statistical":
                fig = self.create_statistical_plots(data)
            elif plot_type == "interactive":
                fig = self.create_interactive_dashboard(data)
                
            plots_created[plot_type] = fig
            
        cf.memory.store("generated_plots", plots_created)
        cf.hooks.notify(f"Created {len(plots_created)} visualization types")
        
    @cf.post_task("visualization_complete")
    def finalize_visualizations(self):
        """Finalize and export visualizations"""
        plots = cf.memory.retrieve("generated_plots")
        export_paths = {}
        
        for plot_type, fig in plots.items():
            export_path = f"visualizations/{plot_type}_analysis.png"
            fig.savefig(export_path, dpi=300, bbox_inches='tight')
            export_paths[plot_type] = export_path
            
        cf.memory.store("exported_visualizations", export_paths)
        cf.hooks.notify("All visualizations exported successfully")
```

## 🔍 DATA QUALITY COORDINATION

### Automated Data Quality Assessment:

```python
# data_quality_coordinator.py
import claude_flow_hooks as cf
import pandas as pd
import great_expectations as ge
from pandas_profiling import ProfileReport

@cf.coordination_required
class DataQualityCoordinator:
    
    @cf.pre_task("data_quality_assessment")
    def setup_quality_checks(self):
        """Setup comprehensive data quality assessment"""
        quality_config = {
            "completeness_threshold": 0.95,
            "uniqueness_threshold": 0.99,
            "validity_checks": True,
            "outlier_detection": True,
            "profiling_enabled": True
        }
        
        cf.memory.store("quality_config", quality_config)
        cf.hooks.notify("Data quality assessment configured")
        
    @cf.parallel_task("quality_profiling")
    def profile_data_quality(self, datasets):
        """Profile multiple datasets in parallel"""
        quality_reports = {}
        
        for dataset_name, df in datasets.items():
            # Generate pandas profiling report
            profile = ProfileReport(df, title=f"{dataset_name} Data Profile")
            
            # Basic quality metrics
            quality_metrics = {
                "shape": df.shape,
                "missing_percentage": (df.isnull().sum() / len(df) * 100).to_dict(),
                "duplicate_rows": df.duplicated().sum(),
                "memory_usage": df.memory_usage(deep=True).sum(),
                "data_types": df.dtypes.to_dict()
            }
            
            quality_reports[dataset_name] = {
                "profile": profile,
                "metrics": quality_metrics
            }
            
        cf.memory.store("quality_reports", quality_reports)
        cf.hooks.notify(f"Quality profiling complete for {len(datasets)} datasets")
        
    @cf.post_task("quality_validation")
    def validate_data_expectations(self, df):
        """Validate data against expectations"""
        # Convert to Great Expectations dataset
        ge_df = ge.from_pandas(df)
        
        # Define expectations
        expectations = [
            ge_df.expect_table_row_count_to_be_between(min_value=100),
            ge_df.expect_table_column_count_to_be_between(min_value=5),
            ge_df.expect_column_values_to_not_be_null('id'),
        ]
        
        # Run validation
        validation_results = []
        for expectation in expectations:
            result = expectation.result
            validation_results.append({
                "expectation": str(expectation),
                "success": result["success"],
                "result": result
            })
            
        cf.memory.store("validation_results", validation_results)
        cf.hooks.notify("Data validation completed")
```

## 📊 BUSINESS INTELLIGENCE COORDINATION

### KPI and Metrics Calculation:

```python
# business_intelligence_coordinator.py
import claude_flow_hooks as cf
import pandas as pd
import numpy as np

@cf.coordination_required
class BusinessIntelligenceCoordinator:
    
    @cf.pre_task("kpi_calculation")
    def setup_business_metrics(self):
        """Setup business intelligence metrics calculation"""
        bi_config = {
            "kpis": [
                "revenue_growth",
                "customer_acquisition_cost",
                "customer_lifetime_value",
                "churn_rate",
                "conversion_rate"
            ],
            "reporting_frequency": "monthly",
            "benchmarking_enabled": True
        }
        
        cf.memory.store("bi_config", bi_config)
        cf.hooks.notify("Business intelligence metrics configured")
        
    @cf.parallel_task("kpi_computation")
    def calculate_kpis(self, business_data):
        """Calculate multiple KPIs in parallel"""
        kpi_results = {}
        config = cf.memory.retrieve("bi_config")
        
        for kpi in config["kpis"]:
            if kpi == "revenue_growth":
                kpi_results[kpi] = self.calculate_revenue_growth(business_data)
            elif kpi == "customer_acquisition_cost":
                kpi_results[kpi] = self.calculate_cac(business_data)
            elif kpi == "customer_lifetime_value":
                kpi_results[kpi] = self.calculate_clv(business_data)
            elif kpi == "churn_rate":
                kpi_results[kpi] = self.calculate_churn_rate(business_data)
            elif kpi == "conversion_rate":
                kpi_results[kpi] = self.calculate_conversion_rate(business_data)
                
        cf.memory.store("kpi_results", kpi_results)
        cf.hooks.notify(f"Calculated {len(kpi_results)} KPIs")
        
    @cf.post_task("business_insights")
    def generate_business_insights(self):
        """Generate actionable business insights"""
        kpis = cf.memory.retrieve("kpi_results")
        
        insights = {
            "revenue_trend": self.analyze_revenue_trend(kpis),
            "customer_health": self.analyze_customer_metrics(kpis),
            "operational_efficiency": self.analyze_operational_metrics(kpis),
            "recommendations": self.generate_recommendations(kpis)
        }
        
        cf.memory.store("business_insights", insights)
        cf.hooks.notify("Business insights generated")
```

## 🔄 TIME SERIES ANALYSIS COORDINATION

### Advanced Time Series Processing:

```python
# time_series_coordinator.py
import claude_flow_hooks as cf
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.seasonal import seasonal_decompose

@cf.coordination_required
class TimeSeriesCoordinator:
    
    @cf.pre_task("time_series_setup")
    def setup_time_series_analysis(self):
        """Setup time series analysis environment"""
        ts_config = {
            "frequency": "D",  # Daily data
            "seasonality_detection": True,
            "trend_analysis": True,
            "forecasting_horizon": 30,
            "models": ["arima", "seasonal_decompose", "exponential_smoothing"]
        }
        
        cf.memory.store("ts_config", ts_config)
        cf.hooks.notify("Time series analysis configured")
        
    @cf.parallel_task("decomposition_analysis")
    def perform_seasonal_decomposition(self, time_series_data):
        """Perform seasonal decomposition on multiple series"""
        decomposition_results = {}
        
        for series_name, series in time_series_data.items():
            # Perform seasonal decomposition
            decomposition = seasonal_decompose(
                series, 
                model='additive',
                period=7  # Weekly seasonality
            )
            
            decomposition_results[series_name] = {
                "trend": decomposition.trend,
                "seasonal": decomposition.seasonal,
                "residual": decomposition.resid,
                "original": series
            }
            
        cf.memory.store("decomposition_results", decomposition_results)
        cf.hooks.notify(f"Seasonal decomposition complete for {len(time_series_data)} series")
        
    @cf.post_task("forecasting")
    def generate_forecasts(self):
        """Generate forecasts using multiple models"""
        config = cf.memory.retrieve("ts_config")
        forecasts = {}
        
        for model_type in config["models"]:
            if model_type == "arima":
                forecasts[model_type] = self.arima_forecast()
            elif model_type == "exponential_smoothing":
                forecasts[model_type] = self.exponential_smoothing_forecast()
                
        cf.memory.store("forecast_results", forecasts)
        cf.hooks.notify("Time series forecasting completed")
```

## 📝 JUPYTER NOTEBOOK COORDINATION

### Coordinated Notebook Development:

```python
# notebook_coordinator.py
import claude_flow_hooks as cf
import nbformat
from nbconvert import HTMLExporter, PDFExporter

@cf.coordination_required
class NotebookCoordinator:
    
    @cf.pre_task("notebook_creation")
    def setup_notebook_environment(self):
        """Setup coordinated notebook environment"""
        notebook_config = {
            "kernel": "python3",
            "template": "data_science",
            "sections": [
                "data_loading",
                "data_exploration", 
                "data_cleaning",
                "analysis",
                "visualization",
                "conclusions"
            ],
            "auto_save": True,
            "export_formats": ["html", "pdf"]
        }
        
        cf.memory.store("notebook_config", notebook_config)
        cf.hooks.notify("Notebook environment configured")
        
    @cf.during_task("notebook_compilation")
    def compile_analysis_notebook(self):
        """Compile comprehensive analysis notebook"""
        config = cf.memory.retrieve("notebook_config")
        
        # Create notebook structure
        nb = nbformat.v4.new_notebook()
        
        # Add sections based on analysis results
        for section in config["sections"]:
            section_content = self.generate_section_content(section)
            
            # Add markdown cell for section header
            header_cell = nbformat.v4.new_markdown_cell(f"# {section.replace('_', ' ').title()}")
            nb.cells.append(header_cell)
            
            # Add code cells for section
            for cell_content in section_content:
                code_cell = nbformat.v4.new_code_cell(cell_content)
                nb.cells.append(code_cell)
                
        cf.memory.store("compiled_notebook", nb)
        cf.hooks.notify("Analysis notebook compiled")
        
    @cf.post_task("notebook_export")
    def export_notebook(self):
        """Export notebook to multiple formats"""
        notebook = cf.memory.retrieve("compiled_notebook")
        config = cf.memory.retrieve("notebook_config")
        
        export_paths = {}
        
        for format_type in config["export_formats"]:
            if format_type == "html":
                exporter = HTMLExporter()
                output, resources = exporter.from_notebook_node(notebook)
                export_path = "reports/analysis_report.html"
                with open(export_path, 'w') as f:
                    f.write(output)
                    
            elif format_type == "pdf":
                exporter = PDFExporter()
                output, resources = exporter.from_notebook_node(notebook)
                export_path = "reports/analysis_report.pdf"
                with open(export_path, 'wb') as f:
                    f.write(output)
                    
            export_paths[format_type] = export_path
            
        cf.memory.store("notebook_exports", export_paths)
        cf.hooks.notify(f"Notebook exported to {len(export_paths)} formats")
```

## 🎯 SPECIALIZED DATA SCIENCE WORKFLOWS

### Survey Data Analysis:

```python
# survey_analysis_coordinator.py
import claude_flow_hooks as cf
import pandas as pd
from scipy.stats import chi2_contingency

@cf.coordination_required
class SurveyAnalysisCoordinator:
    
    @cf.pre_task("survey_setup")
    def setup_survey_analysis(self):
        """Setup survey data analysis"""
        survey_config = {
            "response_types": ["likert", "multiple_choice", "open_ended"],
            "statistical_tests": ["chi_square", "anova", "correlation"],
            "visualization_types": ["bar_charts", "heatmaps", "word_clouds"],
            "significance_level": 0.05
        }
        
        cf.memory.store("survey_config", survey_config)
        cf.hooks.notify("Survey analysis configured")
        
    @cf.parallel_task("survey_analysis")
    def analyze_survey_responses(self, survey_data):
        """Analyze survey responses in parallel"""
        analysis_results = {}
        
        # Demographic analysis
        analysis_results["demographics"] = self.analyze_demographics(survey_data)
        
        # Response distribution analysis
        analysis_results["distributions"] = self.analyze_response_distributions(survey_data)
        
        # Cross-tabulation analysis
        analysis_results["crosstabs"] = self.perform_crosstab_analysis(survey_data)
        
        # Sentiment analysis for open-ended responses
        analysis_results["sentiment"] = self.analyze_open_ended_responses(survey_data)
        
        cf.memory.store("survey_analysis_results", analysis_results)
        cf.hooks.notify("Survey analysis completed")
```

### Financial Data Analysis:

```python
# financial_analysis_coordinator.py
import claude_flow_hooks as cf
import pandas as pd
import numpy as np

@cf.coordination_required
class FinancialAnalysisCoordinator:
    
    @cf.pre_task("financial_setup")
    def setup_financial_analysis(self):
        """Setup financial data analysis"""
        financial_config = {
            "metrics": ["returns", "volatility", "sharpe_ratio", "beta"],
            "risk_measures": ["var", "cvar", "maximum_drawdown"],
            "time_periods": ["daily", "monthly", "quarterly", "yearly"],
            "benchmarks": ["sp500", "nasdaq", "bonds"]
        }
        
        cf.memory.store("financial_config", financial_config)
        cf.hooks.notify("Financial analysis configured")
        
    @cf.parallel_task("risk_analysis")
    def perform_risk_analysis(self, financial_data):
        """Perform comprehensive risk analysis"""
        risk_results = {}
        config = cf.memory.retrieve("financial_config")
        
        for metric in config["risk_measures"]:
            if metric == "var":
                risk_results[metric] = self.calculate_var(financial_data)
            elif metric == "cvar":
                risk_results[metric] = self.calculate_cvar(financial_data)
            elif metric == "maximum_drawdown":
                risk_results[metric] = self.calculate_max_drawdown(financial_data)
                
        cf.memory.store("risk_analysis_results", risk_results)
        cf.hooks.notify("Risk analysis completed")
```

## 🏗️ DATA SCIENCE PROJECT STRUCTURE

### Standard Data Science Project Template:

```
ds_project/
├── data/
│   ├── raw/                 # Raw, immutable data
│   ├── interim/            # Intermediate data transformations
│   ├── processed/          # Final, analysis-ready datasets
│   └── external/           # Third-party reference data
├── notebooks/
│   ├── 01-data-exploration/     # Initial data exploration
│   ├── 02-data-cleaning/        # Data cleaning and preprocessing
│   ├── 03-analysis/             # Core analysis notebooks
│   ├── 04-modeling/             # Statistical/ML modeling
│   └── 05-reporting/            # Final reports and presentations
├── src/
│   ├── data/               # Data processing utilities
│   ├── analysis/           # Analysis functions
│   ├── visualization/      # Plotting and visualization
│   └── utils/              # General utilities
├── reports/
│   ├── figures/            # Generated graphics and figures
│   ├── html/               # HTML reports
│   ├── pdf/                # PDF reports
│   └── presentations/      # Presentation files
├── tests/
│   ├── unit/               # Unit tests for functions
│   ├── integration/        # Integration tests
│   └── data/               # Data validation tests
├── configs/
│   ├── analysis/           # Analysis configurations
│   ├── visualization/      # Plotting configurations
│   └── data/               # Data source configurations
└── docs/
    ├── methodology/        # Analysis methodology
    ├── data_dictionary/    # Data documentation
    └── api/                # API documentation
```

## 📊 DASHBOARD COORDINATION

### Interactive Dashboard Development:

```python
# dashboard_coordinator.py
import claude_flow_hooks as cf
import dash
from dash import dcc, html
import plotly.express as px

@cf.coordination_required
class DashboardCoordinator:
    
    @cf.pre_task("dashboard_setup")
    def setup_dashboard_environment(self):
        """Setup interactive dashboard environment"""
        dashboard_config = {
            "framework": "dash",
            "components": ["filters", "charts", "tables", "kpis"],
            "update_frequency": "real_time",
            "responsive_design": True,
            "theme": "bootstrap"
        }
        
        cf.memory.store("dashboard_config", dashboard_config)
        cf.hooks.notify("Dashboard environment configured")
        
    @cf.parallel_task("component_creation")
    def create_dashboard_components(self, data):
        """Create dashboard components in parallel"""
        components = {}
        config = cf.memory.retrieve("dashboard_config")
        
        for component_type in config["components"]:
            if component_type == "filters":
                components[component_type] = self.create_filter_components(data)
            elif component_type == "charts":
                components[component_type] = self.create_chart_components(data)
            elif component_type == "tables":
                components[component_type] = self.create_table_components(data)
            elif component_type == "kpis":
                components[component_type] = self.create_kpi_components(data)
                
        cf.memory.store("dashboard_components", components)
        cf.hooks.notify(f"Created {len(components)} dashboard component types")
        
    @cf.post_task("dashboard_deployment")
    def deploy_dashboard(self):
        """Deploy interactive dashboard"""
        components = cf.memory.retrieve("dashboard_components")
        
        # Create Dash app
        app = dash.Dash(__name__)
        
        # Build layout from components
        app.layout = self.build_dashboard_layout(components)
        
        # Add callbacks for interactivity
        self.setup_dashboard_callbacks(app)
        
        cf.memory.store("dashboard_app", app)
        cf.hooks.notify("Interactive dashboard deployed")
```

## 🚀 GETTING STARTED

### Quick Data Science Project Setup:

```bash
# Initialize data science project with swarm coordination
npx claude-flow@alpha init --template data_science --agents 8

# Or with specific analysis focus
npx claude-flow@alpha init --template statistical_analysis --agents 6
npx claude-flow@alpha init --template business_intelligence --agents 7
npx claude-flow@alpha init --template time_series --agents 5
```

### Environment Setup:

```bash
# Install data science dependencies
pip install pandas numpy scipy scikit-learn matplotlib seaborn plotly
pip install jupyter notebook jupyterlab
pip install great-expectations pandas-profiling
pip install dash streamlit

# Setup coordination hooks
claude-flow hooks install --data-science-mode
```

## 📋 DATA SCIENCE PROJECT CHECKLIST

### Pre-Analysis:
- [ ] Data source identification and access
- [ ] Data quality assessment
- [ ] Business requirements gathering
- [ ] Success metrics definition
- [ ] Timeline and resource estimation

### Data Preparation:
- [ ] Data collection and ingestion
- [ ] Data profiling and quality checks
- [ ] Data cleaning and preprocessing
- [ ] Data transformation and feature engineering
- [ ] Data validation and testing

### Analysis Phase:
- [ ] Exploratory data analysis (EDA)
- [ ] Descriptive statistics calculation
- [ ] Hypothesis formulation and testing
- [ ] Statistical modeling
- [ ] Results validation

### Visualization Phase:
- [ ] Exploratory visualizations
- [ ] Statistical plots and charts
- [ ] Interactive dashboards
- [ ] Presentation-ready graphics
- [ ] Export to multiple formats

### Reporting Phase:
- [ ] Jupyter notebook compilation
- [ ] Executive summary creation
- [ ] Technical documentation
- [ ] Presentation development
- [ ] Stakeholder communication

### Post-Analysis:
- [ ] Results validation
- [ ] Recommendation formulation
- [ ] Implementation planning
- [ ] Monitoring setup
- [ ] Knowledge transfer

---

**Remember**: Claude Flow coordinates data science workflows, Claude Code implements the analysis. Use parallel execution for all data processing operations to maximize efficiency and insight generation speed.