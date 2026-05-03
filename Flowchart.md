# CodeDoctor AI - Project Flowchart

This document visualizes the user journey and data processing flow within the application.

## 1. High-Level User Journey
```mermaid
graph TD
    Start((Start)) --> Landing[Landing Page]
    Landing --> Auth{User Logged In?}
    Auth -- No --> SignLog[Sign Up / Login]
    Auth -- Yes --> Dash[User Dashboard]
    
    SignLog --> Dash
    
    Dash --> InputChoice{Select Input Type}
    InputChoice -- Manual --> Editor[Monaco Editor]
    InputChoice -- Screenshot --> OCR[Upload Image]
    
    OCR --> OCRService[OCR Extraction Service]
    OCRService --> AICleanup[AI Formatting Cleanup]
    AICleanup --> Editor
    
    Editor --> Action{User Clicks 'Fix Code'}
    
    Action --> Judge0[Execute via Judge0]
    Judge0 --> ResultCheck{Result Status}
    
    ResultCheck -- Success --> AIReview[AI Optimization Review]
    ResultCheck -- Error --> AIAnalysis[AI Error Analysis]
    
    AIReview --> FinalResult[Display Fixed Code & Explanation]
    AIAnalysis --> FinalResult
    
    FinalResult --> Save[Save to History]
    Save --> End((End))
```

## 2. Detailed Technical Data Flow
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (Next.js)
    participant B as Backend (FastAPI)
    participant O as OCR Engine (EasyOCR)
    participant J as Judge0 API
    participant A as AI (Gemini API)
    participant D as Database (MongoDB)

    U->>F: Uploads Screenshot
    F->>B: POST /api/debug/ocr
    B->>O: Process Image
    O-->>B: Raw Text
    B->>A: Cleanup raw text & detect language
    A-->>B: Structured Code JSON
    B-->>F: Return Clean Code
    F->>U: Display code in Editor

    U->>F: Clicks 'Analyze & Fix'
    F->>B: POST /api/debug/analyze
    B->>J: Execute Code Snippet
    J-->>B: Runtime/Syntax Error Output
    B->>A: Send Error + Code for explanation
    A-->>B: Detailed Report (JSON)
    B->>D: Save Scan to History
    B-->>F: Return Report
    F->>U: Highlight lines & Show Fix
```

## 3. Logic Decision Tree (The "Brain")
```mermaid
flowchart TD
    A[Receive Code Snippet] --> B{Does it Compile?}
    B -- No --> C[Capture Error Message]
    C --> D[Send to AI: 'Explain & Fix this error']
    
    B -- Yes --> E{User requested Logic Check?}
    E -- Yes --> F[Send to AI: 'Find logical bugs or improve']
    E -- No --> G[Show Output Only]
    
    D --> H[Final Response Package]
    F --> H
    G --> H
    H --> I[Render Results to UI]
```
