# Claude Code Configuration for AI/ML Projects

## 🚨 CRITICAL: PARALLEL ML PIPELINE EXECUTION

**MANDATORY RULE**: In ML projects, ALL pipeline operations MUST be parallel:

1. **Data preprocessing** → Parallel feature engineering across datasets
2. **Model training** → Concurrent training of multiple architectures
3. **Hyperparameter tuning** → Distributed grid/random search
4. **Model evaluation** → Parallel validation across metrics
5. **MLOps deployment** → Concurrent staging and production updates

## 🧠 AI/ML AGENT SPECIALIZATION

### Required Agent Types for ML Projects:

1. **Data Engineer** - ETL pipelines, feature stores, data validation
2. **ML Researcher** - Model architecture, research paper analysis
3. **Model Trainer** - Training loops, hyperparameter optimization
4. **MLOps Engineer** - Deployment, monitoring, CI/CD for models
5. **Data Scientist** - Statistical analysis, feature engineering
6. **Model Validator** - Testing, validation, A/B testing
7. **Performance Monitor** - Model drift, performance tracking

## 🚀 ML SWARM INITIALIZATION PATTERN

### Standard ML Project Setup:

```javascript
// ✅ CORRECT: Parallel ML swarm initialization
[BatchTool - Message 1]:
  // Initialize ML-focused swarm
  mcp__claude-flow__swarm_init { 
    topology: "hierarchical", 
    maxAgents: 8, 
    strategy: "ml_pipeline" 
  }

  // Spawn ALL ML agents in parallel
  mcp__claude-flow__agent_spawn { type: "researcher", name: "ML Researcher", capabilities: ["paper_analysis", "architecture_design"] }
  mcp__claude-flow__agent_spawn { type: "coder", name: "Data Engineer", capabilities: ["etl", "feature_engineering", "data_validation"] }
  mcp__claude-flow__agent_spawn { type: "specialist", name: "Model Trainer", capabilities: ["pytorch", "tensorflow", "hyperparameter_tuning"] }
  mcp__claude-flow__agent_spawn { type: "analyst", name: "Data Scientist", capabilities: ["statistics", "visualization", "feature_selection"] }
  mcp__claude-flow__agent_spawn { type: "coder", name: "MLOps Engineer", capabilities: ["deployment", "monitoring", "ci_cd"] }
  mcp__claude-flow__agent_spawn { type: "tester", name: "Model Validator", capabilities: ["testing", "validation", "ab_testing"] }
  mcp__claude-flow__agent_spawn { type: "monitor", name: "Performance Monitor", capabilities: ["drift_detection", "metrics"] }
  mcp__claude-flow__agent_spawn { type: "coordinator", name: "ML Lead", capabilities: ["coordination", "strategy"] }

  // Orchestrate ML pipeline
  mcp__claude-flow__task_orchestrate { 
    task: "End-to-end ML pipeline development", 
    strategy: "parallel",
    dependencies: ["data_validation", "model_training", "deployment"]
  }

  // Store ML project context
  mcp__claude-flow__memory_usage { 
    action: "store", 
    key: "ml_project/context", 
    value: { 
      "project_type": "ml_pipeline",
      "frameworks": ["pytorch", "tensorflow", "scikit-learn"],
      "deployment_target": "cloud",
      "data_sources": ["s3", "databases", "apis"]
    }
  }
```

## 📊 ML PIPELINE TODOWRITE PATTERN

### ML-Specific Todo Categories:

```javascript
// ✅ MANDATORY: All ML todos in ONE call
TodoWrite { todos: [
  // Data Engineering Phase
  { id: "data_ingestion", content: "Setup data ingestion pipelines", status: "in_progress", priority: "high" },
  { id: "data_validation", content: "Implement data quality checks", status: "pending", priority: "high" },
  { id: "feature_engineering", content: "Build feature transformation pipeline", status: "pending", priority: "high" },
  { id: "data_versioning", content: "Setup DVC for data versioning", status: "pending", priority: "medium" },
  
  // Model Development Phase
  { id: "baseline_model", content: "Train baseline model", status: "pending", priority: "high" },
  { id: "hyperparameter_tuning", content: "Optimize hyperparameters", status: "pending", priority: "high" },
  { id: "model_selection", content: "Compare model architectures", status: "pending", priority: "high" },
  { id: "cross_validation", content: "Implement k-fold validation", status: "pending", priority: "medium" },
  
  // MLOps Phase
  { id: "model_registry", content: "Setup model registry", status: "pending", priority: "medium" },
  { id: "ci_cd_pipeline", content: "Build ML CI/CD pipeline", status: "pending", priority: "high" },
  { id: "monitoring_setup", content: "Implement model monitoring", status: "pending", priority: "high" },
  { id: "ab_testing", content: "Setup A/B testing framework", status: "pending", priority: "medium" },
  
  // Deployment Phase
  { id: "containerization", content: "Containerize model inference", status: "pending", priority: "high" },
  { id: "api_endpoints", content: "Build prediction API", status: "pending", priority: "high" },
  { id: "load_testing", content: "Perform inference load testing", status: "pending", priority: "medium" },
  { id: "documentation", content: "Create model documentation", status: "pending", priority: "low" }
]}
```

## 🛠️ ML FRAMEWORK INTEGRATION

### TensorFlow/Keras Projects:

```python
# Data Agent Coordination Hook
import claude_flow_hooks as cf

@cf.pre_task("tensorflow_training")
def setup_tensorflow_environment():
    """Setup TensorFlow training environment with coordination"""
    cf.memory.store("tf_config", {
        "strategy": "MirroredStrategy",
        "mixed_precision": True,
        "gpu_memory_growth": True
    })

@cf.post_edit("*.py")
def validate_tensorflow_code():
    """Validate TensorFlow code after each edit"""
    cf.hooks.notify("TensorFlow model updated - validating architecture")
    # Run model validation
```

### PyTorch Projects:

```python
# Model Training Agent Coordination
import claude_flow_hooks as cf
import torch
import torch.distributed as dist

@cf.pre_task("pytorch_training")
def setup_distributed_training():
    """Setup PyTorch distributed training"""
    cf.memory.store("pytorch_config", {
        "backend": "nccl",
        "world_size": 4,
        "distributed": True
    })

@cf.post_task("training_epoch")
def log_training_metrics():
    """Log training metrics after each epoch"""
    metrics = cf.memory.retrieve("training_metrics")
    cf.hooks.notify(f"Epoch completed - Loss: {metrics['loss']}")
```

## 🔄 ML WORKFLOW ORCHESTRATION

### End-to-End ML Pipeline:

```javascript
// ✅ PARALLEL ML WORKFLOW EXECUTION
[BatchTool - ML Pipeline]:
  // Data preparation phase
  Task("You are Data Engineer. COORDINATE: Run cf.hooks.pre_task('data_prep'). Build ETL pipeline with Pandas, validate data quality with Great Expectations")
  Task("You are Feature Engineer. COORDINATE: Run cf.hooks.pre_task('feature_eng'). Create feature transformation pipeline with sklearn, store features in feature store")
  
  // Model development phase
  Task("You are ML Researcher. COORDINATE: Run cf.hooks.pre_task('research'). Research state-of-art models, implement baseline with TensorFlow/PyTorch")
  Task("You are Model Trainer. COORDINATE: Run cf.hooks.pre_task('training'). Setup distributed training, hyperparameter tuning with Optuna")
  
  // Validation and testing phase
  Task("You are Model Validator. COORDINATE: Run cf.hooks.pre_task('validation'). Implement cross-validation, statistical tests, bias detection")
  Task("You are Performance Tester. COORDINATE: Run cf.hooks.pre_task('perf_test'). Load test inference API, measure latency/throughput")
  
  // Deployment phase
  Task("You are MLOps Engineer. COORDINATE: Run cf.hooks.pre_task('deployment'). Setup MLflow, containerize with Docker, deploy to Kubernetes")
  Task("You are Monitor Agent. COORDINATE: Run cf.hooks.pre_task('monitoring'). Implement model drift detection, performance monitoring with Prometheus")

  // File operations for ML project structure
  Bash("mkdir -p ml_project/{data,models,notebooks,src,tests,configs,deployment}")
  Bash("mkdir -p ml_project/src/{data,features,models,visualization}")
  Bash("mkdir -p ml_project/deployment/{docker,kubernetes,monitoring}")

  // Create ML project files
  Write("ml_project/requirements.txt", ml_requirements)
  Write("ml_project/Dockerfile", dockerfile_content)
  Write("ml_project/src/train.py", training_script)
  Write("ml_project/src/inference.py", inference_script)
  Write("ml_project/configs/model_config.yaml", model_config)
```

## 📈 MODEL TRAINING COORDINATION

### Distributed Training Pattern:

```python
# training_coordinator.py
import claude_flow_hooks as cf

@cf.coordination_required
class DistributedTrainingCoordinator:
    def __init__(self):
        self.config = cf.memory.retrieve("training_config")
        
    @cf.pre_task("distributed_training")
    def setup_training(self):
        """Coordinate distributed training setup"""
        cf.memory.store("training_status", "initializing")
        cf.hooks.notify("Starting distributed training coordination")
        
    @cf.during_task("training_step")
    def monitor_training(self, step, metrics):
        """Monitor training progress across workers"""
        cf.memory.store(f"step_{step}_metrics", metrics)
        if step % 100 == 0:
            cf.hooks.notify(f"Training step {step} - Loss: {metrics['loss']}")
            
    @cf.post_task("training_complete")
    def finalize_training(self):
        """Finalize and store trained model"""
        cf.memory.store("training_status", "completed")
        cf.hooks.notify("Training completed - model saved to registry")
```

## 🔍 MODEL EVALUATION & VALIDATION

### Comprehensive Model Testing:

```python
# model_validation_agent.py
import claude_flow_hooks as cf

@cf.coordination_required
class ModelValidationAgent:
    
    @cf.pre_task("model_validation")
    def setup_validation(self):
        """Setup comprehensive model validation"""
        cf.memory.store("validation_config", {
            "cross_validation_folds": 5,
            "test_split": 0.2,
            "metrics": ["accuracy", "precision", "recall", "f1", "auc"]
        })
        
    @cf.parallel_task("validation_metrics")
    def compute_metrics(self):
        """Compute validation metrics in parallel"""
        config = cf.memory.retrieve("validation_config")
        results = {}
        
        # Parallel metric computation
        for metric in config["metrics"]:
            results[metric] = self.compute_metric(metric)
            
        cf.memory.store("validation_results", results)
        cf.hooks.notify(f"Validation complete - Results: {results}")
        
    @cf.post_task("bias_detection")
    def detect_bias(self):
        """Detect model bias across different groups"""
        bias_results = self.analyze_fairness()
        cf.memory.store("bias_analysis", bias_results)
        cf.hooks.notify(f"Bias analysis complete: {bias_results}")
```

## 🚀 MLOPS DEPLOYMENT COORDINATION

### Kubernetes Deployment Pipeline:

```yaml
# deployment_coordination.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ml-coordination-config
data:
  coordination_hooks: |
    pre_deployment:
      - validate_model_metrics
      - run_integration_tests
      - check_resource_requirements
    during_deployment:
      - monitor_deployment_health
      - validate_inference_endpoints
      - run_smoke_tests
    post_deployment:
      - setup_monitoring_alerts
      - log_deployment_success
      - notify_stakeholders
```

```python
# mlops_coordinator.py
import claude_flow_hooks as cf

@cf.coordination_required
class MLOpsCoordinator:
    
    @cf.pre_task("model_deployment")
    def validate_deployment_readiness(self):
        """Validate model is ready for deployment"""
        model_metrics = cf.memory.retrieve("validation_results")
        if model_metrics["accuracy"] > 0.85:
            cf.memory.store("deployment_approved", True)
            cf.hooks.notify("Model approved for deployment")
        else:
            cf.hooks.notify("Model failed validation threshold")
            
    @cf.during_task("kubernetes_deployment")
    def monitor_deployment(self):
        """Monitor Kubernetes deployment progress"""
        deployment_status = self.check_k8s_status()
        cf.memory.store("k8s_deployment_status", deployment_status)
        cf.hooks.notify(f"K8s deployment status: {deployment_status}")
        
    @cf.post_task("deployment_complete")
    def setup_monitoring(self):
        """Setup model monitoring and alerting"""
        monitoring_config = {
            "drift_detection": True,
            "performance_monitoring": True,
            "alert_thresholds": {"latency": 100, "accuracy": 0.8}
        }
        cf.memory.store("monitoring_config", monitoring_config)
        cf.hooks.notify("Monitoring setup complete")
```

## 📊 DATA SCIENCE EXPERIMENT TRACKING

### MLflow Integration:

```python
# experiment_tracking.py
import claude_flow_hooks as cf
import mlflow

@cf.coordination_required
class ExperimentTracker:
    
    @cf.pre_task("experiment_start")
    def start_experiment(self, experiment_name):
        """Start MLflow experiment with coordination"""
        mlflow.set_experiment(experiment_name)
        run = mlflow.start_run()
        cf.memory.store("mlflow_run_id", run.info.run_id)
        cf.hooks.notify(f"Started experiment: {experiment_name}")
        
    @cf.during_task("log_metrics")
    def log_experiment_metrics(self, metrics, step=None):
        """Log metrics to MLflow and coordination memory"""
        for metric_name, value in metrics.items():
            mlflow.log_metric(metric_name, value, step)
            
        cf.memory.store(f"metrics_step_{step}", metrics)
        cf.hooks.notify(f"Logged metrics: {metrics}")
        
    @cf.post_task("experiment_complete")
    def finalize_experiment(self):
        """Finalize experiment and store artifacts"""
        run_id = cf.memory.retrieve("mlflow_run_id")
        mlflow.log_artifacts("models/")
        mlflow.end_run()
        
        cf.memory.store("experiment_complete", {
            "run_id": run_id,
            "status": "completed",
            "artifacts_logged": True
        })
        cf.hooks.notify("Experiment completed successfully")
```

## 🔐 ML SECURITY & PRIVACY

### Privacy-Preserving ML Coordination:

```python
# privacy_coordinator.py
import claude_flow_hooks as cf

@cf.coordination_required
class PrivacyCoordinator:
    
    @cf.pre_task("data_privacy_check")
    def validate_data_privacy(self):
        """Validate data privacy compliance"""
        privacy_config = {
            "pii_detection": True,
            "anonymization": True,
            "differential_privacy": True,
            "consent_tracking": True
        }
        
        cf.memory.store("privacy_config", privacy_config)
        cf.hooks.notify("Privacy validation initiated")
        
    @cf.during_task("differential_privacy")
    def apply_differential_privacy(self, epsilon=1.0):
        """Apply differential privacy to model training"""
        dp_config = {
            "epsilon": epsilon,
            "delta": 1e-5,
            "noise_multiplier": 1.1
        }
        
        cf.memory.store("dp_config", dp_config)
        cf.hooks.notify(f"Differential privacy applied: ε={epsilon}")
        
    @cf.post_task("privacy_audit")
    def conduct_privacy_audit(self):
        """Conduct privacy compliance audit"""
        audit_results = {
            "pii_removed": True,
            "consent_verified": True,
            "differential_privacy": True,
            "audit_timestamp": "2024-01-01T00:00:00Z"
        }
        
        cf.memory.store("privacy_audit", audit_results)
        cf.hooks.notify("Privacy audit completed")
```

## 📈 PERFORMANCE MONITORING

### Real-time Model Performance Tracking:

```python
# performance_monitor.py
import claude_flow_hooks as cf
from prometheus_client import Gauge, Counter

@cf.coordination_required
class ModelPerformanceMonitor:
    
    def __init__(self):
        # Prometheus metrics
        self.accuracy_gauge = Gauge('model_accuracy', 'Current model accuracy')
        self.prediction_counter = Counter('predictions_total', 'Total predictions made')
        self.drift_gauge = Gauge('model_drift_score', 'Model drift detection score')
        
    @cf.pre_task("monitoring_setup")
    def setup_monitoring(self):
        """Setup monitoring infrastructure"""
        monitoring_config = {
            "drift_detection_window": 1000,
            "performance_check_interval": 3600,
            "alert_thresholds": {
                "accuracy_drop": 0.05,
                "drift_score": 0.3,
                "latency_increase": 0.2
            }
        }
        
        cf.memory.store("monitoring_config", monitoring_config)
        cf.hooks.notify("Performance monitoring initialized")
        
    @cf.during_task("drift_detection")
    def detect_model_drift(self, new_data):
        """Detect model drift from new data"""
        baseline_stats = cf.memory.retrieve("baseline_statistics")
        drift_score = self.calculate_drift(baseline_stats, new_data)
        
        self.drift_gauge.set(drift_score)
        cf.memory.store("current_drift_score", drift_score)
        
        if drift_score > 0.3:
            cf.hooks.notify(f"ALERT: Model drift detected! Score: {drift_score}")
        
    @cf.post_task("performance_report")
    def generate_performance_report(self):
        """Generate comprehensive performance report"""
        metrics = cf.memory.retrieve("performance_metrics")
        report = {
            "accuracy": metrics.get("accuracy", 0),
            "latency_p95": metrics.get("latency_p95", 0),
            "throughput": metrics.get("throughput", 0),
            "drift_score": cf.memory.retrieve("current_drift_score"),
            "uptime": metrics.get("uptime", 0)
        }
        
        cf.memory.store("performance_report", report)
        cf.hooks.notify(f"Performance report generated: {report}")
```

## 🧪 A/B TESTING FRAMEWORK

### Coordinated A/B Testing for ML Models:

```python
# ab_testing_coordinator.py
import claude_flow_hooks as cf
import random

@cf.coordination_required
class ABTestingCoordinator:
    
    @cf.pre_task("ab_test_setup")
    def setup_ab_test(self, test_config):
        """Setup A/B test configuration"""
        ab_config = {
            "test_name": test_config["name"],
            "control_model": test_config["control_model"],
            "treatment_model": test_config["treatment_model"],
            "traffic_split": test_config.get("traffic_split", 0.5),
            "success_metrics": test_config["success_metrics"],
            "test_duration": test_config.get("duration", 7)  # days
        }
        
        cf.memory.store("ab_test_config", ab_config)
        cf.hooks.notify(f"A/B test setup: {test_config['name']}")
        
    @cf.during_task("traffic_routing")
    def route_traffic(self, user_id):
        """Route traffic between control and treatment models"""
        config = cf.memory.retrieve("ab_test_config")
        
        # Consistent routing based on user_id
        if hash(user_id) % 100 < config["traffic_split"] * 100:
            model_version = config["treatment_model"]
            variant = "treatment"
        else:
            model_version = config["control_model"]
            variant = "control"
            
        # Log routing decision
        cf.memory.store(f"user_{user_id}_variant", variant)
        return model_version, variant
        
    @cf.post_task("ab_test_analysis")
    def analyze_ab_test_results(self):
        """Analyze A/B test results and determine winner"""
        config = cf.memory.retrieve("ab_test_config")
        
        # Statistical analysis
        results = self.perform_statistical_test()
        
        analysis = {
            "test_name": config["test_name"],
            "statistical_significance": results["p_value"] < 0.05,
            "confidence_interval": results["confidence_interval"],
            "winner": results["winner"],
            "lift": results["lift"]
        }
        
        cf.memory.store("ab_test_results", analysis)
        cf.hooks.notify(f"A/B test analysis complete: {analysis}")
```

## 🏗️ ML PROJECT STRUCTURE

### Standard ML Project Template:

```
ml_project/
├── data/
│   ├── raw/                 # Raw, immutable data
│   ├── interim/            # Intermediate data
│   ├── processed/          # Final, canonical datasets
│   └── external/           # Third-party data
├── models/
│   ├── trained/            # Trained model artifacts
│   ├── experiments/        # Experiment tracking
│   └── registry/           # Model registry
├── notebooks/
│   ├── exploratory/        # EDA notebooks
│   ├── modeling/           # Model development
│   └── evaluation/         # Model evaluation
├── src/
│   ├── data/               # Data processing scripts
│   ├── features/           # Feature engineering
│   ├── models/             # Model training/prediction
│   ├── visualization/      # Visualization utilities
│   └── utils/              # Utility functions
├── tests/
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── model/              # Model-specific tests
├── deployment/
│   ├── docker/             # Container definitions
│   ├── kubernetes/         # K8s manifests
│   ├── terraform/          # Infrastructure as code
│   └── monitoring/         # Monitoring configs
├── configs/
│   ├── model/              # Model configurations
│   ├── training/           # Training configurations
│   └── deployment/         # Deployment configurations
└── docs/
    ├── api/                # API documentation
    ├── models/             # Model documentation
    └── deployment/         # Deployment guides
```

## 📚 JUPYTER NOTEBOOK COORDINATION

### Coordinated Notebook Development:

```python
# notebook_coordinator.py
import claude_flow_hooks as cf

@cf.coordination_required
class NotebookCoordinator:
    
    @cf.pre_task("notebook_analysis")
    def setup_notebook_environment(self):
        """Setup coordinated notebook environment"""
        notebook_config = {
            "kernel": "python3",
            "extensions": ["nbextensions", "jupyter_contrib_nbextensions"],
            "coordination_enabled": True,
            "auto_save": True
        }
        
        cf.memory.store("notebook_config", notebook_config)
        cf.hooks.notify("Notebook environment configured")
        
    @cf.during_task("cell_execution")
    def coordinate_cell_execution(self, cell_content, cell_type):
        """Coordinate notebook cell execution"""
        if cell_type == "code":
            # Store cell execution context
            cf.memory.store(f"cell_execution_{hash(cell_content)}", {
                "content": cell_content,
                "timestamp": "2024-01-01T00:00:00Z",
                "status": "executed"
            })
            
            cf.hooks.notify(f"Cell executed: {cell_content[:50]}...")
            
    @cf.post_task("notebook_complete")
    def finalize_notebook(self, notebook_path):
        """Finalize notebook and extract key findings"""
        findings = {
            "key_insights": [],
            "model_performance": {},
            "next_steps": [],
            "notebook_path": notebook_path
        }
        
        cf.memory.store("notebook_findings", findings)
        cf.hooks.notify(f"Notebook analysis complete: {notebook_path}")
```

## 🎯 SPECIALIZED ML WORKFLOWS

### Computer Vision Pipeline:

```python
# cv_pipeline_coordinator.py
import claude_flow_hooks as cf

@cf.coordination_required
class ComputerVisionCoordinator:
    
    @cf.pre_task("cv_pipeline_setup")
    def setup_cv_pipeline(self):
        """Setup computer vision pipeline"""
        cv_config = {
            "frameworks": ["torch", "torchvision", "opencv"],
            "data_augmentation": True,
            "pretrained_models": ["resnet50", "efficientnet"],
            "batch_size": 32,
            "image_size": 224
        }
        
        cf.memory.store("cv_config", cv_config)
        cf.hooks.notify("Computer vision pipeline configured")
        
    @cf.parallel_task("image_preprocessing")
    def preprocess_images(self, image_batch):
        """Preprocess images in parallel"""
        config = cf.memory.retrieve("cv_config")
        
        # Parallel image processing
        processed_images = []
        for image in image_batch:
            processed = self.apply_transforms(image, config)
            processed_images.append(processed)
            
        cf.memory.store("processed_batch", processed_images)
        cf.hooks.notify(f"Processed {len(processed_images)} images")
```

### Natural Language Processing Pipeline:

```python
# nlp_pipeline_coordinator.py
import claude_flow_hooks as cf

@cf.coordination_required
class NLPCoordinator:
    
    @cf.pre_task("nlp_pipeline_setup")
    def setup_nlp_pipeline(self):
        """Setup NLP processing pipeline"""
        nlp_config = {
            "frameworks": ["transformers", "spacy", "nltk"],
            "models": ["bert-base-uncased", "gpt-2"],
            "tokenization": "wordpiece",
            "max_length": 512,
            "batch_size": 16
        }
        
        cf.memory.store("nlp_config", nlp_config)
        cf.hooks.notify("NLP pipeline configured")
        
    @cf.parallel_task("text_preprocessing")
    def preprocess_text(self, text_batch):
        """Preprocess text data in parallel"""
        config = cf.memory.retrieve("nlp_config")
        
        # Parallel text processing
        processed_texts = []
        for text in text_batch:
            processed = self.apply_nlp_transforms(text, config)
            processed_texts.append(processed)
            
        cf.memory.store("processed_text_batch", processed_texts)
        cf.hooks.notify(f"Processed {len(processed_texts)} texts")
```

## 🚀 GETTING STARTED

### Quick ML Project Setup:

```bash
# Initialize ML project with swarm coordination
npx claude-flow@alpha init --template ml_project --agents 8

# Or with specific ML focus
npx claude-flow@alpha init --template deep_learning --agents 6
npx claude-flow@alpha init --template computer_vision --agents 7
npx claude-flow@alpha init --template nlp_project --agents 8
```

### Environment Setup:

```bash
# Install ML dependencies
pip install torch torchvision tensorflow scikit-learn pandas numpy
pip install mlflow wandb optuna great-expectations
pip install prometheus-client grafana-api

# Setup coordination hooks
claude-flow hooks install --ml-mode
```

## 📋 ML PROJECT CHECKLIST

### Pre-Development:
- [ ] Data availability and quality assessment
- [ ] Privacy and compliance requirements
- [ ] Model performance requirements
- [ ] Deployment target identification
- [ ] Resource requirements estimation

### Development Phase:
- [ ] Data pipeline implementation
- [ ] Feature engineering automation
- [ ] Model architecture selection
- [ ] Hyperparameter optimization
- [ ] Cross-validation implementation

### Validation Phase:
- [ ] Model performance evaluation
- [ ] Bias and fairness testing
- [ ] Robustness testing
- [ ] A/B testing setup
- [ ] Statistical significance validation

### Deployment Phase:
- [ ] Model containerization
- [ ] API endpoint development
- [ ] Load testing completion
- [ ] Monitoring setup
- [ ] Rollback procedures

### Post-Deployment:
- [ ] Performance monitoring
- [ ] Model drift detection
- [ ] Retraining pipeline
- [ ] Documentation updates
- [ ] Stakeholder reporting

---

**Remember**: Claude Flow coordinates ML workflows, Claude Code implements them. Use parallel execution for all ML pipeline operations to maximize efficiency and coordination effectiveness.