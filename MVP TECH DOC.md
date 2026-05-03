# MVP Technical Documentation - CodeDoctor AI

## 1. Scope of MVP
The Minimum Viable Product (MVP) focuses on the core "Capture -> Analyze -> Fix" loop for 3 primary languages (Python, JavaScript, C++) to ensure stability before scaling to all 10+ languages.

## 2. Implementation Roadmap

### Phase 1: Frontend Foundation (Week 1)
- **Setup:** Create Next.js project with Tailwind CSS.
- **Editor:** Integrate `@monaco-editor/react`.
- **UI:** Build the Hero section, Editor layout, and Results side-panel.
- **Language Selector:** Dropdown to switch Monaco Editor syntax highlighting.

### Phase 2: Backend Core (Week 2)
- **Setup:** FastAPI server with basic routing.
- **Judge0:** Connect to Judge0 Public API (or RapidAPI) for code execution.
- **AI Integration:** Setup Google Generative AI SDK for Gemini Flash.
- **OCR:** Integrate `EasyOCR` or `pytesseract` for image extraction.

### Phase 3: Integration & Auth (Week 3)
- **Auth:** Implement JWT authentication with MongoDB.
- **Pipeline:** Connect Frontend to Backend endpoints.
- **Logic:** Implement the fallback logic (If Judge0 fails, send to AI).
- **History:** Save scan results to MongoDB for logged-in users.

### Phase 4: Polish & Deploy (Week 4)
- **Error Handling:** Add friendly error messages for API timeouts or invalid code.
- **Responsive Design:** Ensure the editor works on tablets and mobile (read-only mode if necessary).
- **Deployment:** Deploy Frontend to Vercel and Backend to Railway/Render.

## 3. Core Component: The AI Prompt
To ensure high-quality debugging, the AI prompt should be structured as follows:
```text
System: You are an expert coding mentor.
User: Analyze the following [LANGUAGE] code. 
If there are syntax or runtime errors (Error: [JUDGE0_ERROR]), explain why they occurred.
If no explicit error is provided, check for logical bugs or optimization opportunities.
Return the response in JSON:
{
  "status": "error" | "optimization",
  "line_number": integer,
  "explanation": "Simple explanation",
  "fixed_code": "Complete corrected code snippet"
}
Code: [USER_CODE]
```

## 4. Key Challenges & Solutions
- **OCR Noise:** OCR often misses semicolons or quotes. 
    - *Solution:* Pass the raw OCR text through Gemini with a "Cleanup" instruction before showing it to the user.
- **Judge0 Latency:** Compilation can be slow.
    - *Solution:* Use a loading state with "AI is thinking..." micro-animations to keep the user engaged.
- **Cost Management:** AI and Judge0 APIs cost money.
    - *Solution:* Implement strict rate limiting (e.g., 5 scans per day for guests).

## 5. Security Checklist
- [ ] Environment variables for all API keys (`.env`).
- [ ] CORS configuration in FastAPI (Allow only the frontend domain).
- [ ] Input size limits (Max 5000 characters of code).
- [ ] Image size limits (Max 5MB).
