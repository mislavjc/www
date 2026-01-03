import { createServer } from 'http';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = 'user-read-currently-playing user-read-recently-played';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    'Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in environment',
  );
  console.error(
    'Make sure to run with: npx tsx --env-file=.env.local scripts/get-spotify-token.ts',
  );
  process.exit(1);
}

const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;

console.log('\n1. Open this URL in your browser:\n');
console.log(authUrl);
console.log('\n2. Authorize the app, then wait for the token...\n');

const server = createServer(async (req, res) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);

  if (url.pathname === '/callback') {
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end('<h1>Authorization failed</h1><p>You can close this window.</p>');
      console.error('Authorization error:', error);
      process.exit(1);
    }

    if (code) {
      try {
        const tokenResponse = await fetch(
          'https://accounts.spotify.com/api/token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              code,
              redirect_uri: REDIRECT_URI,
              client_id: CLIENT_ID!,
              client_secret: CLIENT_SECRET!,
            }),
          },
        );

        const data = await tokenResponse.json();

        if (data.refresh_token) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(
            '<h1>Success!</h1><p>Check your terminal for the refresh token. You can close this window.</p>',
          );

          console.log('='.repeat(60));
          console.log('SUCCESS! Add this to your .env.local:\n');
          console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
          console.log('='.repeat(60));

          server.close();
          process.exit(0);
        } else {
          throw new Error(
            data.error_description || 'Failed to get refresh token',
          );
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(
          '<h1>Error exchanging code</h1><p>Check terminal for details.</p>',
        );
        console.error('Error:', err);
        process.exit(1);
      }
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
});
