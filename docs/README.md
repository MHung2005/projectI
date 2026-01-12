# Component Diagram (PlantUML)

This folder contains a PlantUML component diagram describing the system architecture across the FastAPI backend and Next.js frontend.

- Diagram source: docs/component-diagram.puml

## View the diagram

Option A — VS Code extension (recommended):
1. Install the "PlantUML" extension by jebbs.
2. Open docs/component-diagram.puml.
3. Press Alt+D (or right-click → "Preview Current Diagram").

Option B — CLI rendering:
1. Install Java.
2. Download PlantUML jar: https://plantuml.com/download
3. Render to PNG:

```bash
java -jar plantuml.jar docs/component-diagram.puml
```

The output image will be created alongside the source file.

## Notes
- Backend endpoint streams SSE from the orchestrated LangGraph that first retrieves context via RAGFlow then generates quiz questions via Google Gemini.
- Frontend consumes SSE (via `fetch-event-source`), renders questions, and manages state and validation.

## Related Docs
- Quiz configuration and limits: [docs/quiz-configuration.md](docs/quiz-configuration.md)
