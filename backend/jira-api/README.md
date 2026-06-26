# Jira API Backend

This folder contains the Python Flask backend used by the Style Guide frontend.

## Setup

```bash
cd backend/jira-api
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

## Run

```bash
python api_jira.py
```

## Description

- `api_jira.py`: Flask API entry point
- `extrator_dashboard.py`: Jira data extraction logic
- `calculadora_sla.py`: SLA calculation and JSON persistence
- `config_sla/`: SLA configuration files

## Important

The backend writes a JSON file to:

`../frontend/src/assets/sprint-data.json`
