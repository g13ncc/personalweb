const express = require('express'); //importing express
const mysql = require('mysql2'); //importing mysql
const multer = require('multer'); //importing multer
const app = express(); //express is assigned to a variable called app
const session = require('express-session'); //importing express-session for login purposes

// Add session for logging in purposes
app.use(session({
    secret: 'your_secret_key', //signs the session ID cookie for security
    resave: false, //false means the sessions will not be saved if it is not modified
    saveUninitialized: true, //true means new sessions will be saved even if they are not modified
    cookie: { secure: false } // Set to true if using https to send cookies
}));

// Authentication middleware
function ensureAuthenticated(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/reguser');
    }
}

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage }); // Define multer upload middleware

// Database connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'db4free.net',
    user: process.env.DB_USER || 'glenglen',
    password: process.env.DB_PASSWORD || 'matchalatte',
    database: process.env.DB_NAME || 'c237_ca2_db',
    port: process.env.DB_PORT || 4000
});

// Create MySQL connection
//const connection = mysql.createConnection({
    //host: 'localhost',
    //user: 'root',
    //password: '',
    //database: 'c237_ca2_db'
    //host: 'sql.freedb.tech',
    //user: 'freedb_glenglen',
    //password: '%4pPGVbV3!*f*Nn',
    //database: 'freedb_c237_ca2_db'
//});

connection.connect((error) => {
    if (error) {
        console.error('Error connecting to MySQL: ', error.message);
        return;
    }
    console.log('Connected to the MySQL server.');
});

// Set view engine
app.set('view engine', 'ejs');

// Enable static files
app.use(express.static('public'));

// Enable form processing 
app.use(express.urlencoded({ extended: false }));

// Register user page
app.get('/reguser', (req, res) => {
    res.render('reguser');
});

app.post('/reguser', upload.single('profile_pic'), (req, res) => {
    const { username, password, dob, contact, biography } = req.body;
    let profile_pic = req.file ? req.file.filename : null;
    const sql = 'INSERT INTO users (username, password, dob, contact, biography, profile_pic) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql, [username, password, dob, contact, biography, profile_pic], (error) => {
        if (error) {
            console.error('Error adding user: ', error);
            return res.status(500).send('Error adding user');
        } else {
            res.redirect('/loginuser');
        }
    });
});

//login user page
app.get('/loginuser', (req, res) => {
    res.render('loginuser');
});

app.post('/loginuser', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  
    connection.query(sql, [username, password], (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        req.session.loggedIn = true;
        req.session.userId = results[0].account_id;
        res.redirect('/user/' + results[0].account_id);
      } else {
        res.send('Username or password is incorrect');
      }
    });
});

// Main page - index.ejs (list of users)
app.get('/index', ensureAuthenticated, (req, res) => {
    res.render('index');
});

  

// Main page - index.ejs (list of users)
app.get('/', ensureAuthenticated, (req, res) => {
    const sql = 'SELECT * FROM users';
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error: ', error.message);
            return res.status(500).send('Error retrieving users');
        }
        res.render('index', { users: results });
    });
});

// Specific user page 
app.get('/user/:id', ensureAuthenticated, (req, res) => {
    const account_id = req.params.id;
    const loggedInUserId = req.session.userId; // Get the logged-in user's ID from the session for editing and delete on user.ejs
    const sql = 'SELECT *, DATE_FORMAT(dob, "%b %d, %Y") AS dob_format FROM users WHERE account_id = ?';
    connection.query(sql, [account_id], (error, results) => {
        if (error) {
            console.error('Database query error: ', error.message);
            return res.status(500).send('An error occurred while fetching user by account_id');
        }
        if (results.length > 0) {
            res.render('user', {
                user: results[0],
                loggedInUserId: loggedInUserId // Pass the logged-in user's ID 
            });
        } else {
            res.status(404).send('User not found');
        }
    });
});

// Likes
app.post('/likes/:id', ensureAuthenticated, (req, res) => {
    const likedUserId = req.params.id; // The user ID of the user being liked

    const getUserSql = 'SELECT likes FROM users WHERE account_id = ?';
    const updateUserSql = 'UPDATE users SET likes = ? WHERE account_id = ?';

    // Fetch the current likes of the user being liked
    connection.query(getUserSql, [likedUserId], (error, results) => {
        if (error) {
            console.error('Error fetching user likes: ', error);
            return res.status(500).send('Error fetching user likes');
        }

        let currentLikes = results[0].likes || 0; // Default to 0 if likes is null

        // Increase the likes count by 1 for the user being liked
        const newLikes = currentLikes + 1;

        // Update the likes count in the database for the user being liked
        connection.query(updateUserSql, [newLikes, likedUserId], (error) => {
            if (error) {
                console.error('Error updating user likes: ', error);
                return res.status(500).send('Error updating user likes');
            }
            res.redirect('/user/' + likedUserId);
        });
    });
});


app.get('/likes/:id', ensureAuthenticated, (req, res) => {
    const userId = req.session.userId;
    const sql = 'SELECT likes FROM users WHERE account_id = ?';

    connection.query(sql, [userId], (error, results) => {
        if (error) {
            console.error('Error fetching user likes: ', error);
            return res.status(500).send('Error fetching user likes');
        }

        let likes = results[0].likes || '[]'; // Default to empty array if likes is null
        likes = JSON.parse(likes);

        const getUsersSql = 'SELECT * FROM users WHERE account_id IN (?)';
        connection.query(getUsersSql, [likes], (error, results) => {
            if (error) {
                console.error('Error fetching liked users: ', error);
                return res.status(500).send('Error fetching liked users');
            }
            res.render('likes', { users: results });
        });
    });
});


// Edit user page
app.get('/edituser/:id', ensureAuthenticated, (req, res) => {
    const account_id = req.params.id;
    const sql = 'SELECT * FROM users WHERE account_id = ?';
    connection.query(sql, [account_id], (error, results) => {
        if (error) {
            console.error('Error fetching user: ', error.message);
            return res.status(500).send('Error fetching user by id');
        }
        if (results.length > 0) {
            res.render('edituser', { user: results[0] });
        } else {
            res.status(404).send('User not found');
        }
    });
});

app.post('/edituser/:id', ensureAuthenticated, upload.single('profile_pic'), (req, res) => {
    const account_id = req.params.id;
    const { username, password, dob, contact, biography, points } = req.body;
    let profile_pic = req.body.currentImage;
    if (req.file) {
        profile_pic = req.file.filename;
    }
    const sql = 'UPDATE users SET username = ?, password = ?, dob = ?, contact = ?, biography = ?, profile_pic = ? WHERE account_id = ?';
    connection.query(sql, [username, password, dob, contact, biography, profile_pic, account_id], (error) => {
        if (error) {
            console.error('Error updating user: ', error);
            return res.status(500).send('Error updating user');
        } else {
            res.redirect('/');
        }
    });
});

// Delete user route
app.get('/deleteuser/:id', ensureAuthenticated, (req, res) => {
    const account_id = req.params.id;
    const sql = 'DELETE FROM users WHERE account_id = ?';
    connection.query(sql, [account_id], (error) => {
        if (error) {
            console.error('Error deleting user: ', error.message);
            return res.status(500).send('Error deleting user');
        } else {
            res.redirect('/');
        }
    });
});

//FAQ page
app.get('/faq', ensureAuthenticated, (req, res) => {
    const sql = 'SELECT * FROM faq';
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error: ', error.message);
            return res.status(500).send('Error retrieving faq');
        }
        res.render('faq', { faqs: results });
    });
});

//anyone can post -wanted to use express validator to check input for malware but didnt have time
app.get('/userqns', (req, res) => {
    res.render('userqns');
});

app.post('/userqns', (req, res) => {
    const { qns } = req.body;
    const sql = 'INSERT INTO userqn (qns) VALUES (?)';
    
    connection.query(sql, [qns], (error, results) => {
        if (error) {
            console.error('Error adding question: ', error);
            return res.status(500).send('Error adding question');
        } else {
            console.log('Question added successfully:', results);
            res.redirect('/userqns');
        }
    });
});


// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on port 4000'));

// http://localhost:3000
