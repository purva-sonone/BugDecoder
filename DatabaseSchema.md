# CodeDoctor AI - Database Schema (ER Diagram)

This document describes the data structure and relationships between entities in the system.

## Entity Relationship Diagram
```mermaid
erDiagram
    USER ||--o{ SCAN_HISTORY : "performs"
    USER ||--o{ SUBSCRIPTION : "has"
    SCAN_HISTORY ||--o{ ERROR_DETAIL : "contains"
    
    USER {
        string id PK
        string email UK
        string password_hash
        string full_name
        datetime created_at
        string oauth_provider "google/email"
    }

    SCAN_HISTORY {
        string id PK
        string user_id FK
        string language
        string raw_code
        string fixed_code
        string input_source "manual/ocr"
        datetime timestamp
    }

    ERROR_DETAIL {
        string id PK
        string scan_id FK
        int line_number
        string error_type
        string explanation
        string suggested_fix
    }

    SUBSCRIPTION {
        string id PK
        string user_id FK
        string plan_type "free/premium"
        datetime expiry_date
        int daily_scan_limit
        int scans_used_today
    }
```

## Data Definitions

### Users
Stores account information and authentication metadata.

### Scan History
Records every interaction where a user submitted code for analysis. This allows for the "History" feature in the dashboard.

### Error Details
A granular breakdown of the issues found in a specific scan. This allows the UI to highlight multiple errors if they exist.

### Subscriptions
Manages the monetization aspect, tracking usage limits and plan status.
