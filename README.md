# StyleGuideApp

This repository is organized as a small monorepo with separated frontend and backend projects.

## Structure

- `frontend/` — Angular web application
- `backend/jira-api/` — Python Flask backend

## Frontend

To start the Angular frontend:

```bash
cd frontend
npm install
npm start
```

Then open `http://localhost:4200/`.

## Backend

To start the Python backend:

```bash
cd backend/jira-api
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
python api_jira.py
```

The backend writes data to `frontend/src/assets/sprint-data.json`.

## Notes

- Keep the repository root as `style-guide-app`.
- Frontend source is under `frontend/`.
- Backend source is under `backend/jira-api/`.
- Keep sensitive credentials local in `backend/jira-api/.env` only.

## Design system

The functional source of truth for the Desmonte Design System is being
consolidated under [`design-system/`](./design-system/README.md).

The existing Angular page remains an implementation and demonstration source.
Its current examples are not automatically normative until they are reconciled
and approved in the source of truth.

## VS Code Workspace

Open the project using `style-guide-app/style-guide-app.code-workspace` so VS Code loads the correct `.vscode` tasks and launch configurations.
