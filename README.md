# Open Education — Frontend

Next.js app for students, tutors, and admins: dashboards, course discovery, Google sign-in, roadmap and course generation UI, Razorpay checkout (keys supplied by the API), and real-time progress over WebSockets.

**Concepts, flows, and how this connects to the backend:** [Open Education — blog](https://aniketdutta.space/blog/open-education)

## Prerequisites

- **Node.js** 20+
- Running **backend** API (see `../backend/README.md`), default `http://localhost:8081`

## Quick start

1. Copy environment file:

   ```bash
   cp .env.example .env.local
   ```

   Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to the **same** Google OAuth client ID configured on the backend (`GOOGLE_CLIENT_ID`).

2. Install and run (dev server default **3000**):

   ```bash
   npm install
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Notes |
|----------|----------|--------|
| `NEXT_PUBLIC_API_URL` | No | Default `http://localhost:8081` — REST base URL |
| `NEXT_PUBLIC_WEBSOCKET_URL` | No | Default `ws://localhost:8081/ws` — Socket.IO |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Yes for Google One Tap | Must match backend `GOOGLE_CLIENT_ID` |

Razorpay checkout uses the **key id returned by the backend** when creating orders; you do not need a Razorpay key in the frontend env.

## Production build

```bash
npm run build
npm start
```

Ensure `NEXT_PUBLIC_*` values point at your deployed API and WebSocket URL (typically `wss://` in production).

## Blog

[https://aniketdutta.space/blog/open-education](https://aniketdutta.space/blog/open-education)
