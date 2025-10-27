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

// Character profiles data (server-side only)
const characterProfiles = [
    {
        id: 'harper-1',
        character: 'harper',
        name: 'Harper',
        title: 'Meet Harper, Your Hero!',
        description: 'Harper is a spirited red panda with boundless energy and an unshakeable determination to protect his home. When the malevolent spirit Kreakli emerges from the Dark Oak Tree, Harper must master incredible abilities and explore vibrant worlds to save his friends and restore peace to the festival.',
        mainImage: '/img/harperAnim.gif',
        thumbnail: '/img/Harper.webp'
    },
    {
        id: 'lyre-1',
        character: 'lyre',
        name: 'Lyre',
        title: 'Introducing Lyre, The Blunt Companion!',
        description: 'Lyre is a quick-witted otter with lesser magical abilities and a bad attitude toward everyone but Harper. She helps navigate treacherous waters with aquatic agility, though her abrasive demeanor remains as challenging as the adventure itself.',
        mainImage: '/img/lyreAnim.gif',
        thumbnail: '/img/Lyre.webp'
    },
    {
        id: 'hugo-1',
        character: 'hugo',
        name: 'Hugo',
        title: 'Check Out Hugo!',
        description: "Hugo is a cool-riding meerkat biker who's traveled far and wide perfecting his craft. With a relaxed attitude and expert skills from his adventures, he mentors the duo by teaching them powerful new moves.",
        mainImage: '/img/hugoAnim.gif',
        thumbnail: '/img/Hugo.webp'
    },
    {
        id: 'pocus-1',
        character: 'pocus',
        name: 'Pocus',
        title: "Here's Pocus, The Mystical Wizard Frog!",
        description: "Pocus is a mystical frog wizard who uses ancient magic to transform Harper and Lyre into new forms, providing them with new abilities to solve tricky puzzles ahead.",
        mainImage: '/img/pocusAnim.gif',
        thumbnail: '/img/Pocus.webp'
    }
];

// Worlds data (server-side only - never exposed to client)
const worldsData = [
    {
        id: 1,
        name: 'Bamboo Heights',
        emoji: '🎋',
        description: 'The lush bamboo forests stretch endlessly toward the sky. The gentle rustling of leaves and distant bird calls make this a peaceful place... until Kreakli\'s minions showed up!',
        discovered: true,
        image: '/img/journal-1.webp'
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

app.get('/', (req, res) => {
    // Find first discovered world for default display
    const firstDiscoveredWorld = worldsData.find(w => w.discovered) || worldsData[0];

    // Get first character profile for default display
    const firstProfile = characterProfiles[0];

    res.render('index', {
        worlds: worldsData,
        firstWorld: firstDiscoveredWorld,
        characterProfiles: characterProfiles,
        firstProfile: firstProfile
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


//custom 500: Server not Responding
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('500 - Server error!');
});

app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});


app.listen(app.get('port'), function() {
    console.log('Started express app on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});