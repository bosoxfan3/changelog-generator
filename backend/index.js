const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

const allowedOrigins = [
    'http://localhost:3000',
    'https://changelog-generator-pi.vercel.app',
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true, // allows cookies to be sent
    })
);

app.options('*', cors());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', (req, res) => {
    res.send('Backend is working!');
});

app.get('/changelogs', async (req, res) => {
    const entries = await prisma.changelog.findMany({
        orderBy: { createdAt: 'desc' },
    });
    res.json(entries);
});

app.post('/generate-changelog', async (req, res) => {
    const { owner, name, dateStart, dateEnd } = req.body;
    try {
        const query = `?since=${dateStart}T00:00:00Z&until=${dateEnd}T23:59:59Z`;
        const commitsResponse = await fetch(
            `https://api.github.com/repos/${owner}/${name}/commits${query}`
        );
        const commitsArray = await commitsResponse.json();
        const commitMessagesArray = commitsArray.map(
            (commit) => commit.commit.message
        );
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are a helpful developer assistant that generates user-facing changelogs from git commit messages. Focus only on changes that affect the end user: new features, bug fixes, UI changes, and performance improvements. Ignore internal refactors or minor code cleanups. Format the result as a markdown-style bullet list.',
                    },
                    {
                        role: 'user',
                        content: `Here are some commit messages:\n${commitMessagesArray.join(
                            '\n'
                        )}`,
                    },
                ],
            });

            const content = response.choices[0].message.content;
            res.json({ content });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: 'Something went wrong generating the changelog.',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to fetch commit list' });
    }
});

app.post('/submit-changelog', async (req, res) => {
    const { owner, name, dateStart, dateEnd, title, description } = req.body;

    // shouldn't hit this due to FE validation, but just extra validation
    if (!owner || !name || !dateStart || !dateEnd || !title || !description) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const savedData = await prisma.changelog.create({
            data: {
                repoOwner: owner,
                project: name,
                from: dateStart,
                to: dateEnd,
                title,
                content: description,
            },
        });

        res.status(201).json(savedData);
    } catch (err) {
        console.error('Prisma error:', err);
        res.status(500).json({ error: err.message || 'Unknown error' });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
