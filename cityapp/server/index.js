const express = require('express');
const app = express();

const session = require('express-session');
const cookieParser = require('cookie-parser');

const MongoStore = require('connect-mongo');
const mongo = require('./mongo.js');
const MongoDB = new mongo.MongoDB()

require('dotenv').config();

app.use(express.static('public'));

// Handle cookies
app.use(cookieParser());

// Add this middleware to parse JSON data
app.use(express.json());

// Sesssion with MongoDB
app.use(session({
    name: 'sessions',
    secret: 'Replace with your secret key',
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 7,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}));

// Handle URL-encoded data
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.status(200).sendFile('index.html', {root: __dirname })
})

app.get('/home', (req, res) => {
    res.status(200).sendFile('index.html', {root: __dirname })
})

app.get('/stores', (req, res) => {
    res.status(200).sendFile('index.html', {root: __dirname })
})

app.get('/stores/:id', (req, res) => {
    res.status(200).sendFile('index.html', {root: __dirname })
})

app.get('/login', (req, res) => {
    res.status(200).sendFile('index.html', {root: __dirname })
})

app.get('/contact', (req, res) => {
    res.status(200).sendFile('index.html', {root: __dirname })
})
app.get('/about', (req, res) => {
    res.status(200).sendFile('index.html', {root: __dirname })
})

app.get('/login', (req, res) => {
    res.status(200).sendFile('index.html', {root: __dirname })
})
app.get('/register', (req, res) => {res.status(200).sendFile('index.html', {root: __dirname })})

app.get('/api/stores', async (req, res)  => {
    res.setHeader('Content-Type', 'application/json');
    res.json(await MongoDB.get_stores());
})

app.get('/api/stores/:id', (req, res) => {
    const id = req.params.id;
    res.setHeader('Content-Type', 'application/json');

    res.json(MongoDB.get_store_document(id));
})

app.get('/api/stores/search/:query', async (req, res) => {
    const query = req.params.query;
    stores = await MongoDB.search_store_names(query)
    res.json({stores})
})

app.get('/api/stores/district/west', async (req, res) => {
    stores = await MongoDB.get_west_stores()
    res.json({stores})
})

app.get('/api/stores/district/east', async (req, res) => {
    try {
        const stores = await MongoDB.get_east_stores();
        res.json(stores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/api/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    console.log(email, password)
    if (!req.session.hasAuth) {
        console.log("usertest")
        const user = await MongoDB.login(email, password)
        console.log(user)
        if (user != null) {
            req.session.user_id = user.id
            req.session.hasAuth = true

            if (user.username == "admin") {
                req.session.isAdmin = true
            }
            res.json({user_id: user.id, username: user.username, success: true})
        } else {
            res.json({success: false, error: "Login failed"})
        }
    } else {
        console.log("already logged in")
        res.json({success: false, error: "You are already logged in"})
    }
})

app.post('/api/register', async (req, res) => {
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password
    console.log(email, username, password)

    if (!req.session.hasAuth) {
        const user = await MongoDB.create_user(email, username, password)
        if (user != null) {
            req.session.user_id = user.id
            req.session.hasAuth = true
            if (user.username == "admin") {
                req.session.isAdmin = true
            }
            res.json({user_id: user.id, username: user.username, success: true})
        } else {
            res.json({success: false, error: "Register failed"})
        }
    } else {
        res.json({success: false, error: "You are already authenticated"})
    }
})

app.post('/api/isAuthenticated', (req, res) => {
    if (req.session.hasAuth != null) {
        res.json({success: true})
    } else {
        res.json({success: false})
    }
})

app.post('/api/isAdmin', (req, res) => {
    if (req.session.isAdmin != null && req.session.isAdmin != "true") {
        res.json({success: true})
    } else {
        res.json({success: false})
    }
})

app.post('/api/logout', (req, res) => {
    if (req.session.hasAuth != null) {
        req.session.destroy((err) => {
            if (err) {
                res.json({success: false, error: err})
            } else {
                res.json({success: true});
            }
        })
    } else {
        res.json({success: false, error: "You are not authenticated"})
    }
})

app.post('/api/stores/edit/:store_id', async (req, res) => {
    const store_id = req.params.store_id;
    const name = req.body.name
    const description = req.body.description
    const image_url = req.body.image_url

    console.log(store_id, name, description, image_url)
    if (req.session.isAdmin != null && req.session.isAdmin != "true") {
        let success = await MongoDB.edit_store(store_id, name, description, image_url)
        
        if (success) {
            res.json({success: true})
        } else {
            res.json({success: false})
        }
    } else {
        res.json({success: false})
    }
})

const server = async () => {
    try {
        await MongoDB.connect();
        await MongoDB.insert_data();

        app.listen(process.env.PORT, () => {
            console.log(`server listening at http://localhost:${process.env.PORT}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
}


server()

