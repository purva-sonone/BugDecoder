# System Design - CodeDoctor AI

## 1. Component Breakdown

### 1.1 Frontend (React/Next.js)
- **Monaco Editor Integration:** Custom hook to handle language switching and content synchronization.
- **Result Panel:** A reactive UI that shows error markers on specific lines in the editor when a report is received.
- **OCR Preview:** A drag-and-drop zone that shows the uploaded image and the extracted text side-by-side for verification.

### 1.2 Backend (FastAPI)
- **AI Service Layer:**
    - Prompts Gemini with: `Code snippet`, `Language`, and `Error (if any)`.
    - Request JSON-formatted response for easy parsing: `{ error: string, line: int, explanation: string, fix: string }`.
- **OCR Service:**
    - Uses `EasyOCR` to detect text boxes.
    - Post-processing logic to fix indentation and common OCR character misidentifications (e.g., `1` vs `l`, `0` vs `O`).
- **Judge0 Integration:**
    - Sends code to Judge0 `submissions` endpoint.
    - Polls for result or uses callback URL.
    - Captures `stdout`, `stderr`, and `compile_output`.

## 2. Data Models (MongoDB)

### User Collection
```json
{
  "_id": "uuid",
  "email": "user@example.com",
  "password_hash": "...",
  "full_name": "John Doe",
  "created_at": "timestamp",
  "plan": "free/premium"
}
```

### Scan History Collection
```json
{
  "_id": "uuid",
  "user_id": "uuid",
  "language": "python",
  "input_type": "text/image",
  "original_code": "...",
  "detected_errors": [
    {
      "line": 12,
      "message": "IndentationError",
      "explanation": "...",
      "suggested_fix": "..."
    }
  ],
  "timestamp": "timestamp"
}
```

## 3. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Authenticate and return JWT |
| POST | `/api/debug/analyze` | Analyze code snippet (AI only) |
| POST | `/api/debug/execute` | Run code via Judge0 |
| POST | `/api/debug/ocr` | Extract code from image |
| GET | `/api/user/history` | Get user's past debug reports |

## 4. Key Workflows

### 4.1 The Debugging Pipeline
1. **User Action:** User clicks "Fix Code".
2. **Frontend:** Sends Code + Language to `/api/debug/execute`.
3. **Backend:** Calls Judge0. If Judge0 returns an error:
    - Backend calls AI Service with the code + Judge0 error message.
    - AI generates explanation and fix.
4. **Backend:** If Judge0 succeeds but logic is wrong (User manually triggered AI):
    - Backend calls AI Service for logical analysis.
5. **Frontend:** Displays result in a split-screen view.

### 4.2 The OCR Pipeline
1. **User Action:** Uploads screenshot.
2. **Backend:** `EasyOCR` processes image.
3. **AI Layer:** Cleans the extracted text (Fixes formatting, detects language automatically).
4. **Frontend:** populates Monaco Editor with the cleaned code.

## 5. Scalability & Availability
- **Stateless Backend:** FastAPI allows running multiple workers behind a Load Balancer.
- **Asynchronous Processing:** Use Python's `asyncio` for non-blocking I/O when calling external APIs (Gemini, Judge0).
- **Rate Limiting:** Implement `slowapi` in FastAPI to prevent abuse of the Free Tier.
