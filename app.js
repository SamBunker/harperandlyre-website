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

app.get('/home', (req, res) => {
    res.render('index');
});

// Define route to render the form page
app.get('/', (req, res) => {
    res.redirect('/home');
});

// Steam News API endpoint
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
    res.status(404).redirect('/home');
});


app.listen(app.get('port'), function() {
    console.log('Started express app on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});