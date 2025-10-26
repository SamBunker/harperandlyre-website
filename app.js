// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
const bodyParser = require('body-parser');
const https = require('https');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3004);

app.get('/', (req, res) => {
    res.render('loading', { hideLayout: true });
});

// Worlds data (server-side only - never exposed to client)
const worldsData = [
    {
        id: 1,
        name: 'Bamboo Heights',
        emoji: '🎋',
        description: 'The lush bamboo forests stretch endlessly toward the sky. The gentle rustling of leaves and distant bird calls make this a peaceful place... until Kreakli\'s minions showed up!',
        discovered: true,
        image: '/img/journal-1.jpg'
    },
    {
        id: 2,
        name: 'Mist-side Castle',
        emoji: '👻',
        description: '???',
        discovered: false,
        image: '/img/question-mark.jpg'
    },
    {
        id: 3,
        name: 'Triptrap Tomb',
        emoji: '🏜️',
        description: '???',
        discovered: false,
        image: '/img/question-mark.jpg'
    },
    {
        id: 4,
        name: 'Firestone Mountain',
        emoji: '🔥',
        description: '???',
        discovered: false,
        image: '/img/question-mark.jpg'
    },
    {
        id: 5,
        name: 'Western Cliffs',
        emoji: '🏔️',
        description: '???',
        discovered: false,
        image: '/img/question-mark.jpg'
    },
    {
        id: 6,
        name: 'Kreakli\'s Bog',
        emoji: '🐸',
        description: '???',
        discovered: false,
        image: '/img/question-mark.jpg'
    },
    {
        id: 7,
        name: 'Muncher\'s Mine',
        emoji: '⛏️',
        description: '???',
        discovered: false,
        image: '/img/question-mark.jpg'
    },
    {
        id: 8,
        name: 'Twin Daisy Farms',
        emoji: '🌾',
        description: '???',
        discovered: false,
        image: '/img/question-mark.jpg'
    },
    {
        id: 9,
        name: 'Trick Eek\'s Park',
        emoji: '🐿️',
        description: '???',
        discovered: false,
        image: '/img/question-mark.jpg'
    },
    {
        id: 10,
        name: 'Bramblebrush Beach',
        emoji: '🦀',
        description: '???',
        discovered: false,
        image: '/img/question-mark.jpg'
    },
    {
        id: 11,
        name: 'Snowshow City',
        emoji: '⛄',
        description: '???',
        discovered: false,
        image: '/img/question-mark.jpg'
    },
    {
        id: 12,
        name: 'Toxack Tower',
        emoji: '☣️',
        description: '???',
        discovered: false,
        image: '/img/question-mark.jpg'
    },
    {
        id: 13,
        name: 'Dinohattan',
        emoji: '🦴',
        description: '???',
        discovered: false,
        image: '/img/question-mark.jpg'
    },
    {
        id: 14,
        name: 'Deep Dank Waters',
        emoji: '🌊',
        description: '???',
        discovered: false,
        image: '/img/question-mark.jpg'
    },
    {
        id: 15,
        name: 'Ripaz City',
        emoji: '🌃',
        description: '???',
        discovered: false,
        image: '/img/question-mark.jpg'
    },
    {
        id: 16,
        name: 'Project Orion',
        emoji: '👽',
        description: '???',
        discovered: false,
        image: '/img/question-mark.jpg'
    },
    {
        id: 17,
        name: 'Bumble Breeze Kingdom',
        emoji: '🏰',
        description: '???',
        discovered: false,
        image: '/img/question-mark.jpg'
    }
];

app.get('/home', (req, res) => {
    // Find first discovered world for default display
    const firstDiscoveredWorld = worldsData.find(w => w.discovered) || worldsData[0];

    res.render('index', {
        worlds: worldsData,
        firstWorld: firstDiscoveredWorld
    });
});

// Steam News API endpoint - MUST BE BEFORE catch-all routes
app.get('/api/steam-news', (req, res) => {
    const appId = '3579710'; // Harper and Lyre Steam App ID
    const count = req.query.count || 6; // Number of news items to fetch
    const maxLength = req.query.maxlength || 500; // Max length of content

    const url = `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${appId}&count=${count}&maxlength=${maxLength}&format=json`;

    https.get(url, (steamRes) => {
        let data = '';

        steamRes.on('data', (chunk) => {
            data += chunk;
        });

        steamRes.on('end', () => {
            try {
                const parsedData = JSON.parse(data);
                res.json(parsedData);
            } catch (error) {
                console.error('Error parsing Steam API response:', error);
                res.status(500).json({ error: 'Failed to parse Steam news' });
            }
        });
    }).on('error', (error) => {
        console.error('Error fetching Steam news:', error);
        res.status(500).json({ error: 'Failed to fetch Steam news' });
    });
});

// Define route to render the form page
app.get('/', (req, res) => {
    res.redirect('/home');
});

//custom 500: Server not Responding
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('500 - Server error!');
});

app.use((req, res) => {
    res.status(404).redirect('/home');
});


app.listen(app.get('port'), function() {
    console.log('Started express app on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});