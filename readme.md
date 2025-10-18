Story Writing Tool (Dev Branch)

This repository contains a prototype writing assistant built around a simple chat interface. A Vue 2 frontend talks to a small Node/Express server which proxies requests to Google Gemini. On top of the basic chat, it adds story‑specific features such as character extraction, timeline construction and an editable draft. The intent is to help authors plan and iterate multi‑chapter narratives while using an LLM to generate prose.

Contents

client/story‑chat‑frontend‑vue2/ – a Vue 2 project with Vuex store modules for chat, character/timeline analysis and a draft editor. Each module exposes mutations and actions so components remain simple. Components include the chat window, character panel, timeline view and a draft editor.

server/ – a Node/Express service that wraps the Google Gemini API. It implements /api/chat for general text completion, /api/analyze/characters to extract/update a character roster and /api/analyze/timeline to generate a chronological outline of events.

Getting started

Install dependencies. The server uses Express, dotenv and the official @google/genai SDK. The frontend uses Vue 2, Vuex and Axios.

Set your API key. Copy server/.env/google.ini.example to server/.env/google.ini (or create the file) and set GOOGLE_API_KEY to your Google AI Studio key. Without a key the backend cannot call Gemini.

Run the server. From the server directory:

npm install
npm run dev # uses nodemon to auto‑reload

# The server defaults to port 8787.

Run the client. From the client/story‑chat‑frontend‑vue2 directory:

npm install
npm run serve

# Visit http://localhost:8080 in your browser.

# Ensure VUE_APP_API_BASE in .env points to the server port.

The frontend will display a chat box seeded with a greeting. Type your prompt (e.g. “Write the opening of a mystery story set in Delhi”) and click Write Chapter. The application sends all previous messages to /api/chat, receives a response from Gemini and displays it.

Current features
📚 Story‑aware chat

Messages are stored in Vuex with an auto‑incrementing ID. When you send a prompt, the client pushes a user message, calls sendChat via Axios and adds the model’s response when it arrives. The server ensures the last message is from the user, extracts the conversation history and calls genAI.models.generateContent with a system instruction so Gemini remains in a story‑writing mode

. Errors are caught and surfaced in the UI.

👤 Character extraction

The frontend keeps a characters module with state for lastMessageIdAnalyzed and an array of character objects. When you click Refresh in the Character panel, it gathers only the new messages (IDs greater than the last analyzed one) and dispatches refereshCharacters. This action posts the current roster and new messages to /api/analyze/characters

, and updates the Vuex state with the returned list. The server builds a natural‑language prompt instructing Gemini to return strict JSON with fields such as name, aliases, traits, role and notes

. Any existing characters that are missing from the LLM’s result are added back to avoid loss of information

.

🗓️ Timeline construction

Similarly, the timeline module keeps lastMessageIdAnalyzed and a timeline array of chapters and events. Clicking Refresh in the Timeline view dispatches refereshTimeline, which sends new messages and the current timeline to the backend

. The server asks Gemini to group events by chapter (inferring chapter numbers if missing) and return strict JSON with event fields like id, when, who, what, where and notes

. Existing events not returned by the LLM are merged back in

. The timeline is displayed as collapsible chapters, allowing authors to review plot progression.

🗃 Editable draft

A draft Vuex module holds a markdown text buffer and remembers the last message ID used for seeding. The Seed from Chat button in the draft editor loops over all chat messages after the last seed and creates a markdown outline, prefixing each new model message with a chapter heading

. Users can edit this draft freely; the updateText action commits changes immediately, and autosave runs after a 300 ms debounce. The draft will not be overwritten by character or timeline analysis.

🚪 Simple UI components

ChatWindow displays messages via MessageList, collects prompts via ChatInput and shows a typing indicator.

CharacterPanel lists characters and allows manual refresh.

TimelineVIew displays the hierarchical timeline and allows manual refresh.

DraftEditor provides a textarea with autosave and seed functionality.

HeaderBar (not shown here) provides a top bar; the App.vue lays out these panels in a responsive grid.

Planned improvements

This project is an early prototype. Several major enhancements are planned:

✏️ Editing prompts & regenerating responses

Currently a prompt cannot be edited once sent. A future version will allow:

Inline editing of the last user message, with a Regenerate button that resends the modified prompt and replaces or appends the response.

Message actions (copy, delete, retry) in each chat bubble to improve control over the conversation.

System prompt controls such as temperature and story style, exposed in a settings dialog.

📄 Selectively seeding draft

Picking and choosing which messages should be seeded to the draft

📄 Markdown rendering

Model outputs and drafts are plain text. To improve readability:

Integrate a markdown parser (marked or markdown‑it) with HTML sanitization (e.g., DOMPurify) so lists, headings and emphasis render properly.

Add optional code‑block highlighting (via highlight.js) while ensuring no unsafe content is executed.

Provide a split‑pane preview for the draft editor.

🔮 Analysis & brainstorming tools

Beyond character and timeline extraction, authors need help brainstorming:

Idea boards for themes, arcs, conflicts and world‑building. Users can ask the assistant to suggest plot twists or settings.

Cross‑linking between characters, timeline events and ideas, so clicking a character filters timeline events involving them.

💡 Gen‑AI assisted web search

LLMs excel when combined with facts. Future versions may integrate server‑side web search and summarization:

A /api/search endpoint would fetch web results (e.g. via Google Custom Search API) and send them to Gemini for summarization with citations. This keeps API keys on the server and avoids CORS issues.

The UI would include a research panel where the user can type a query, receive a synthesized summary and optionally insert facts into the draft.

Users could toggle external web access on or off to maintain creative focus.

🚀 Additional polish

Streaming responses via server‑sent events (SSE) so users see partial output as it arrives.

Persistent storage using Firebase Auth + Firestore to save messages, characters, timelines and drafts per user.

Unit tests and linting to catch typos (e.g. referesh spelling) and ensure robust merging logic.

Markdown safety by validating the JSON returned from the LLM and protecting against injection.

Contributing

Contributions and suggestions are welcome! Please open an issue or pull request describing the use case or improvement. This project is licensed under the MIT License.
