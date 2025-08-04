# Claude Code Configuration for Python Projects

## 🚨 CRITICAL: PYTHON PARALLEL EXECUTION PATTERNS

**MANDATORY RULE**: Python projects require virtual environment coordination with pip/conda parallel operations.

## 🚨 CRITICAL: CONCURRENT EXECUTION FOR ALL PYTHON OPERATIONS

**ABSOLUTE RULE**: ALL Python operations MUST be concurrent/parallel in a single message:

### 🔴 MANDATORY CONCURRENT PATTERNS FOR PYTHON:

1. **Virtual Environment**: ALWAYS batch ALL venv/conda setup in ONE message
2. **Package Management**: ALWAYS batch ALL pip install commands together
3. **Django/FastAPI Operations**: ALWAYS batch ALL framework commands
4. **Testing**: ALWAYS run ALL test suites in parallel (pytest, unittest)
5. **Data Science**: ALWAYS batch ALL Jupyter/pandas operations

### ⚡ PYTHON GOLDEN RULE: "1 MESSAGE = ALL PYTHON ECOSYSTEM OPERATIONS"

**Examples of CORRECT Python concurrent execution:**

```python
# ✅ CORRECT: Everything in ONE message
[Single Message]:
  - TodoWrite { todos: [10+ todos with all Python tasks] }
  - Task("You are Python architect. Coordinate via hooks for Django design...")
  - Task("You are Data scientist. Coordinate via hooks for ML pipelines...")
  - Task("You are DevOps engineer. Coordinate via hooks for deployment...")
  - Bash("python -m venv venv")
  - Bash("source venv/bin/activate && pip install django djangorestframework")
  - Bash("source venv/bin/activate && pip install pytest black flake8 poetry")
  - Write("requirements.txt", requirementsContent)
  - Write("manage.py", djangoManage)
  - Write("settings.py", djangoSettings)
  - Write("models.py", djangoModels)
  - Write("views.py", djangoViews)
  - Write("tests/test_api.py", testContent)
  - Write("pyproject.toml", poetryConfig)
```

## 🎯 PYTHON-SPECIFIC SWARM PATTERNS

### 🐍 Virtual Environment Coordination

**Environment Setup Strategy:**
```bash
# Always batch environment setup
python -m venv venv
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate     # Windows

pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
pip install -e .  # Install package in development mode
```

**Parallel Development Setup:**
```python
# ✅ CORRECT: All setup in ONE message
[BatchTool]:
  - Bash("python -m venv venv")
  - Bash("source venv/bin/activate && pip install django fastapi sqlalchemy")
  - Bash("source venv/bin/activate && pip install pytest black flake8 mypy")
  - Write("requirements.txt", productionDeps)
  - Write("requirements-dev.txt", devDependencies)
  - Write("setup.py", packageSetup)
  - Write("pyproject.toml", modernConfig)
  - Write(".env.example", envTemplate)
  - Bash("source venv/bin/activate && python manage.py migrate")
```

### 🏗️ Python Agent Specialization

**Agent Types for Python Projects:**

1. **Django/FastAPI Agent** - Web framework, REST APIs, database ORM
2. **Data Science Agent** - Pandas, NumPy, Scikit-learn, Jupyter
3. **ML/AI Agent** - TensorFlow, PyTorch, model training
4. **Testing Agent** - Pytest, unittest, integration testing
5. **DevOps Agent** - Docker, Gunicorn, deployment automation
6. **Quality Agent** - Black, Flake8, MyPy, pre-commit hooks

### 🌐 Django Framework Coordination

**Django Project Setup:**
```python
# Django swarm initialization
[BatchTool]:
  - Bash("django-admin startproject myproject")
  - Bash("cd myproject && python manage.py startapp users")
  - Bash("cd myproject && python manage.py startapp api")
  - Write("myproject/settings.py", djangoSettings)
  - Write("users/models.py", userModels)
  - Write("api/serializers.py", drf_serializers)
  - Write("api/views.py", drf_views)
  - Write("api/urls.py", apiUrls)
  - Bash("cd myproject && python manage.py makemigrations")
  - Bash("cd myproject && python manage.py migrate")
```

### ⚡ FastAPI Framework Coordination

**FastAPI Development Pattern:**
```python
# FastAPI swarm setup
[BatchTool]:
  - Write("main.py", fastapiMain)
  - Write("models.py", sqlalchemyModels)
  - Write("schemas.py", pydanticSchemas)
  - Write("database.py", databaseConfig)
  - Write("routers/users.py", userRoutes)
  - Write("routers/auth.py", authRoutes)
  - Bash("pip install fastapi uvicorn sqlalchemy alembic")
  - Bash("alembic init alembic")
  - Bash("uvicorn main:app --reload --port 8000")
```

## 🧪 PYTHON TESTING COORDINATION

### 🔬 Pytest Testing Strategy

**Parallel Testing Setup:**
```python
# Test coordination pattern
[BatchTool]:
  - Write("tests/conftest.py", pytestConfig)
  - Write("tests/test_models.py", modelTests)
  - Write("tests/test_views.py", viewTests)
  - Write("tests/test_integration.py", integrationTests)
  - Write("pytest.ini", pytestSettings)
  - Bash("pytest tests/ -v --cov=src --cov-report=html")
  - Bash("pytest tests/integration/ --tb=short")
  - Bash("pytest tests/unit/ --parallel")
```

### 📊 Data Science Testing

**Data Science Test Coordination:**
```python
[BatchTool]:
  - Write("tests/test_data_processing.py", dataTests)
  - Write("tests/test_model_training.py", mlTests)
  - Write("tests/fixtures/sample_data.csv", testData)
  - Bash("pytest tests/test_data_*.py --tb=line")
  - Bash("python -m pytest --nbval notebooks/")
```

## 📊 DATA SCIENCE SWARM PATTERNS

### 🤖 Machine Learning Coordination

**ML Pipeline Setup:**
```python
# ML development batch
[BatchTool]:
  - Write("src/data/preprocessing.py", dataPreprocessing)
  - Write("src/models/train.py", modelTraining)
  - Write("src/models/evaluate.py", modelEvaluation)
  - Write("src/utils/feature_engineering.py", featureUtils)
  - Write("notebooks/exploratory_analysis.ipynb", eda_notebook)
  - Bash("pip install pandas numpy scikit-learn matplotlib seaborn")
  - Bash("pip install jupyter ipykernel jupyterlab")
  - Bash("python src/models/train.py --config config/model_config.yaml")
```

### 📈 Data Analysis Coordination

**Data Analysis Swarm:**
```python
[BatchTool]:
  - Write("src/analysis/data_loader.py", dataLoader)
  - Write("src/analysis/statistical_analysis.py", statsAnalysis)
  - Write("src/visualization/plots.py", plotGeneration)
  - Write("requirements-data.txt", dataRequirements)
  - Bash("pip install pandas numpy scipy matplotlib plotly streamlit")
  - Bash("jupyter lab --port 8888 --no-browser")
```

## 🔧 PYTHON BUILD TOOLS COORDINATION

### 📦 Poetry Package Management

**Poetry Coordination Pattern:**
```python
# Poetry project setup
[BatchTool]:
  - Bash("poetry init --no-interaction")
  - Bash("poetry add django fastapi sqlalchemy")
  - Bash("poetry add --group dev pytest black flake8 mypy")
  - Write("pyproject.toml", poetryConfig)
  - Write("poetry.lock", lockFile)
  - Bash("poetry install")
  - Bash("poetry run python manage.py runserver")
```

### 🎯 Modern Python Packaging

**Modern Packaging Coordination:**
```python
# Modern Python project setup
[BatchTool]:
  - Write("pyproject.toml", modernPyprojectToml)
  - Write("src/mypackage/__init__.py", packageInit)
  - Write("src/mypackage/main.py", mainModule)
  - Write("README.md", packageReadme)
  - Write("CHANGELOG.md", changelog)
  - Bash("pip install build twine")
  - Bash("python -m build")
  - Bash("twine check dist/*")
```

## 🔒 PYTHON SECURITY BEST PRACTICES

### 🛡️ Security Coordination Patterns

**Security Implementation Batch:**
```python
[BatchTool]:
  - Write("src/security/authentication.py", authSecurity)
  - Write("src/security/validation.py", inputValidation)
  - Write("src/security/encryption.py", dataEncryption)
  - Bash("pip install cryptography pyjwt python-decouple")
  - Bash("pip install bandit safety")
  - Bash("bandit -r src/ && safety check")
```

**Python Security Checklist:**
- SQL injection prevention (use ORMs)
- Input validation and sanitization
- Secure secret management
- Proper authentication/authorization
- HTTPS enforcement
- Dependency vulnerability scanning
- Code security analysis (Bandit)
- Environment variable protection

## ⚡ PYTHON PERFORMANCE OPTIMIZATION

### 🚀 Performance Coordination

**Performance Optimization Batch:**
```python
[BatchTool]:
  - Write("src/performance/caching.py", cachingUtils)
  - Write("src/performance/async_operations.py", asyncioPatterns)
  - Write("src/performance/database_optimization.py", dbOptimization)
  - Bash("pip install redis celery asyncio aiohttp")
  - Bash("pip install --dev cProfile memory_profiler")
  - Bash("python -m cProfile -o profile.stats main.py")
```

### 🔄 Asynchronous Programming

**Async/Await Coordination:**
```python
[BatchTool]:
  - Write("src/async/web_client.py", asyncHttpClient)
  - Write("src/async/database.py", asyncDatabase)
  - Write("src/async/background_tasks.py", backgroundTasks)
  - Bash("pip install asyncio aiohttp asyncpg")
  - Bash("python -m asyncio src/async/main.py")
```

## 🚀 PYTHON DEPLOYMENT PATTERNS

### ⚙️ Production Deployment

**Deployment Coordination:**
```python
[BatchTool]:
  - Write("Dockerfile", dockerConfiguration)
  - Write("docker-compose.yml", dockerCompose)
  - Write("gunicorn.conf.py", gunicornConfig)
  - Write("requirements-prod.txt", prodRequirements)
  - Write("scripts/deploy.sh", deploymentScript)
  - Bash("docker build -t python-app:latest .")
  - Bash("gunicorn --config gunicorn.conf.py main:app")
```

### 🐳 Docker Coordination

**Docker Setup Batch:**
```python
[BatchTool]:
  - Write("Dockerfile", multiStageDockerfile)
  - Write(".dockerignore", dockerIgnore)
  - Write("docker-compose.yml", devDockerCompose)
  - Write("docker-compose.prod.yml", prodDockerCompose)
  - Bash("docker-compose build")
  - Bash("docker-compose up -d")
  - Bash("docker-compose exec web python manage.py migrate")
```

## 📊 PYTHON CODE QUALITY COORDINATION

### 🎨 Code Formatting and Linting

**Quality Tools Batch:**
```python
[BatchTool]:
  - Write(".pre-commit-config.yaml", preCommitConfig)
  - Write("pyproject.toml", blackConfig)
  - Write(".flake8", flake8Config)
  - Write("mypy.ini", mypyConfig)
  - Bash("pip install black flake8 mypy isort pre-commit")
  - Bash("pre-commit install")
  - Bash("black src/ tests/ && flake8 src/ tests/ && mypy src/")
```

### 📝 Documentation Coordination

**Documentation Setup:**
```python
[BatchTool]:
  - Write("docs/conf.py", sphinxConfig)
  - Write("docs/index.rst", docsIndex)
  - Write("docs/api.rst", apiDocs)
  - Bash("pip install sphinx sphinx-rtd-theme")
  - Bash("sphinx-build -b html docs/ docs/_build/")
```

## 🔄 PYTHON CI/CD COORDINATION

### 🏗️ GitHub Actions for Python

**CI/CD Pipeline Batch:**
```python
[BatchTool]:
  - Write(".github/workflows/ci.yml", pythonCI)
  - Write(".github/workflows/deploy.yml", deploymentWorkflow)
  - Write("scripts/test.sh", testScript)
  - Write("scripts/lint.sh", lintScript)
  - Bash("python -m pytest --cov=src tests/")
  - Bash("black --check src/ tests/")
  - Bash("flake8 src/ tests/")
```

## 💡 PYTHON BEST PRACTICES

### 📝 Code Quality Standards

1. **PEP 8 Compliance**: Follow Python style guide
2. **Type Hints**: Use static typing with MyPy
3. **Docstrings**: Comprehensive documentation
4. **Error Handling**: Proper exception management
5. **Testing**: High test coverage with Pytest
6. **Virtual Environments**: Isolated dependencies

### 🎯 Performance Optimization

1. **List Comprehensions**: Efficient data processing
2. **Generators**: Memory-efficient iteration
3. **Asyncio**: Asynchronous programming patterns
4. **Caching**: Redis, memory caching strategies
5. **Database Optimization**: Query optimization, connection pooling
6. **Profiling**: Regular performance analysis

## 📚 PYTHON LEARNING RESOURCES

### 🎓 Recommended Topics

1. **Core Python**: Data structures, OOP, decorators
2. **Web Frameworks**: Django, FastAPI, Flask
3. **Data Science**: Pandas, NumPy, Matplotlib, Scikit-learn
4. **Machine Learning**: TensorFlow, PyTorch, Keras
5. **Testing**: Pytest, unittest, test-driven development
6. **DevOps**: Docker, deployment, CI/CD pipelines

### 🔧 Essential Tools

1. **Package Management**: pip, Poetry, conda
2. **Code Quality**: Black, Flake8, MyPy, pre-commit
3. **Testing**: Pytest, Coverage.py, tox
4. **Documentation**: Sphinx, MkDocs
5. **IDEs**: PyCharm, VS Code, Jupyter
6. **Deployment**: Gunicorn, uWSGI, Docker

---

**Remember**: Python swarms excel with virtual environment coordination, parallel package management, and integrated testing. Always batch pip operations and leverage Python's rich ecosystem for optimal development workflow.