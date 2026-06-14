export async function onRequest(context) {
    const url = new URL(context.request.url);
    const count = url.searchParams.get('count') || 6;
    const maxLength = url.searchParams.get('maxlength') || 500;

    const steamUrl = `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=3579710&count=${count}&maxlength=${maxLength}&format=json`;

    try {
        const response = await fetch(steamUrl);
        const data = await response.json();

        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=900, s-maxage=900',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch Steam news' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
