# YrestAPI Demo

A static web demo showing how heterogeneous primary accounting documents can be visualized on top of the `Document -> DocumentNode -> DocType` model.

## Features

- document registry with search and type filter
- detailed view for the selected document
- `nodes` tree with nested `children`
- node attribute rendering

## Frontend Run

Open [index.html](/home/serge/Projects/YrestAPI_Demo/index.html) in a browser or start a simple static server, for example:

```bash
python3 -m http.server 4173
```

The app will then be available at `http://localhost:4173`.

Frontend API targeting:

- if the page is opened via `file://.../index.html`, the frontend will target `http://localhost:8080`
- if the page is served from `http://localhost:<other-port>`, the frontend will also target `http://localhost:8080`
- if the page is served from the same origin as the API, the frontend uses same-origin `/api/...`
- you can override this explicitly with `?apiBaseUrl=http://localhost:8080`

## Backend Stack

This repository now includes a Compose stack in [compose.yaml](/home/serge/Projects/YrestAPI_Demo/compose.yaml):

- `db`: PostgreSQL 16
- `db-migrate`: explicit SQL migration runner for files in [db/migrations](/home/serge/Projects/YrestAPI_Demo/db/migrations)
- `db-seed`: explicit SQL seed runner for files in [db/seeds](/home/serge/Projects/YrestAPI_Demo/db/seeds)
- `yrestapi`: built from the local sibling repository `../YrestAPI`

The mounted directories are:

- [db/migrations](/home/serge/Projects/YrestAPI_Demo/db/migrations): SQL schema migrations
- [db/seeds](/home/serge/Projects/YrestAPI_Demo/db/seeds): SQL seed files
- [models](/home/serge/Projects/YrestAPI_Demo/models): YrestAPI `.yml` model files

Optional environment defaults are provided in [.env.example](/home/serge/Projects/YrestAPI_Demo/.env.example).

For local frontend development on `http://127.0.0.1:5500`, CORS is exposed through:

- `CORS_ALLOW_ORIGIN=http://127.0.0.1:5500`
- `CORS_ALLOW_CREDENTIALS=false`

To start the backend stack:

```bash
cp .env.example .env
docker compose --profile setup up --build
```

To start the backend without rerunning migrations and seed:

```bash
cp .env.example .env
docker compose up --build
```

The API will be available at `http://localhost:8080`.

Current schema draft:

- [db/migrations/001_schema.sql](/home/serge/Projects/YrestAPI_Demo/db/migrations/001_schema.sql) creates the first-pass PostgreSQL schema for `counterparties`, `doc_types`, `doc_type_nodes`, `documents`, `document_nodes`, and both attribute tables.
- [db/seeds/001_demo_seed.sql](/home/serge/Projects/YrestAPI_Demo/db/seeds/001_demo_seed.sql) rebuilds a large deterministic fake dataset for lazy-load testing.
- both attribute tables now include typed value columns: `value_date`, `value_int`, `value_double`, `value_boolean`

Migration behavior:

- `db` starts first
- `db-migrate` applies every `*.sql` file from [db/migrations](/home/serge/Projects/YrestAPI_Demo/db/migrations) in filename order
- `db-seed` applies every `*.sql` file from [db/seeds](/home/serge/Projects/YrestAPI_Demo/db/seeds) in filename order
- `yrestapi` always waits for PostgreSQL health
- use `--profile setup` when you want migrations and seed to run before the API startup

## Next Step

The next logical extension is:

1. Define `Document`, `DocumentNode`, `DocType`, and `DocTypeNode` models in [models](/home/serge/Projects/YrestAPI_Demo/models).
2. Add YrestAPI presets for the document list and document detail tree.
3. Replace the local array in [app.js](/home/serge/Projects/YrestAPI_Demo/app.js) with loading through `POST /api/index`.
