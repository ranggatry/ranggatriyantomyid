const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 10007;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'rangga-portfolio-secret-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// File upload configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', 'uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueName = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Data file paths
const DATA_DIR = path.join(__dirname, '..', 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper functions
function readContent() {
    try {
        const data = fs.readFileSync(CONTENT_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
}

function writeContent(content) {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf8');
}

function readUsers() {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// Auth middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.loggedIn) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

// ==================== API ROUTES ====================

// Auth routes
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    const users = readUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // If password_hash is still placeholder, set it now
    if (user.password_hash.startsWith('$2a$10$X7WZ9vY3qK5mN8pR2tU4eO')) {
        user.password_hash = bcrypt.hashSync('suzuyot@44', 10);
        writeUsers(users);
    }

    const validPassword = bcrypt.compareSync(password, user.password_hash);
    if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.loggedIn = true;
    req.session.userId = user.id;
    req.session.username = user.username;

    res.json({ success: true, message: 'Login successful' });
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: 'Logout failed' });
        res.json({ success: true });
    });
});

app.get('/api/auth/check', (req, res) => {
    res.json({ loggedIn: req.session && req.session.loggedIn || false });
});

// Content routes
app.get('/api/content', (req, res) => {
    const content = readContent();
    res.json(content);
});

app.get('/api/content/:section', (req, res) => {
    const content = readContent();
    const section = content[req.params.section];
    if (section === undefined) {
        return res.status(404).json({ error: 'Section not found' });
    }
    res.json(section);
});

app.put('/api/content/:section', requireAuth, (req, res) => {
    const content = readContent();
    content[req.params.section] = req.body;
    writeContent(content);
    res.json({ success: true, message: 'Content updated' });
});

// Media routes
app.get('/api/media', requireAuth, (req, res) => {
    const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        return res.json([]);
    }
    const files = fs.readdirSync(uploadDir).map(filename => {
        const stats = fs.statSync(path.join(uploadDir, filename));
        return {
            id: filename,
            filename: filename,
            url: '/uploads/' + filename,
            size: stats.size,
            uploadedAt: stats.mtime
        };
    });
    res.json(files);
});

app.post('/api/media/upload', requireAuth, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
        success: true,
        file: {
            id: req.file.filename,
            filename: req.file.filename,
            url: '/uploads/' + req.file.filename,
            size: req.file.size
        }
    });
});

app.delete('/api/media/:filename', requireAuth, (req, res) => {
    const filePath = path.join(__dirname, '..', 'public', 'uploads', req.params.filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

// Serve admin pages
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'login.html'));
});

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'dashboard.html'));
});

// Serve main site
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Portfolio CMS running on http://localhost:${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin`);
});
