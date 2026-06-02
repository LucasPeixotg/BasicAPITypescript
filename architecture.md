# Architecture

Minimal Express 5 API in TypeScript. Requests flow through a global middleware chain, then to feature routers, each with their own validation and optional auth middleware. Business logic lives in service modules; data access is isolated in repositories backed by Drizzle ORM over PostgreSQL.

```mermaid
flowchart TD
    Client(["HTTP Client"])

    subgraph App["Express App · port 8080"]
        direction TB

        subgraph GMW["Global Middleware"]
            direction LR
            helmet --> cors --> json["express.json"] --> requestLogger
        end

        subgraph Routes["Routes"]
            AUTH["/auth\nPOST /register\nPOST /login"]
            FRIENDS["/friends\nPOST /requests\nPOST /requests/accept"]
            HEALTHZ["/healthz\nGET /"]
            DOCS["/api-docs\nSwagger UI"]
        end

        EH["errorHandler"]
    end

    subgraph AuthFeature["Auth"]
        AC["auth.controller"]
        AS["auth.service"]
    end

    subgraph FriendsFeature["Friends"]
        FC["friends.controller"]
        FS["friends.service"]
    end

    subgraph Repos["Repositories"]
        UR["user.repository"]
        FR["friendship.repository"]
    end

    subgraph DB["PostgreSQL · Drizzle ORM"]
        TU[("users")]
        TF[("friendships")]
        TP[("posts")]
    end

    Client --> GMW
    GMW --> Routes
    Routes -.->|uncaught errors| EH

    AUTH -->|"withBodyValidation"| AC
    FRIENDS -->|"requireAuth\nwithBodyValidation"| FC
    HEALTHZ -->|inline| healthResp["{status: 'ok'}"]

    AC --> AS
    FC --> FS

    AS --> UR
    FS --> UR
    FS --> FR

    UR --> TU
    FR --> TF
```
