# YrestAPI Demo

A static web demo showing how heterogeneous primary accounting documents can be visualized on top of the `Document -> DocumentNode -> DocType` model.

## Features

- document registry with search and type filter
- detailed view for the selected document
- `nodes` tree with nested `children`
- node attribute rendering

## Run

Open [index.html](/home/serge/Projects/YrestAPI_Demo/index.html) in a browser or start a simple static server, for example:

```bash
python3 -m http.server 4173
```

The app will then be available at `http://localhost:4173`.

## Next step

The data is currently embedded in [app.js](/home/serge/Projects/YrestAPI_Demo/app.js). The next logical extension is:

1. Define `Document`, `DocumentNode`, `DocType`, and `DocTypeNode` models in `../YrestAPI`.
2. Add one preset for the document list and another preset for the content tree.
3. Replace the local array with loading through `POST /api/index`.
