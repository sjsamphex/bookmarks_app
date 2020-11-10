const Sequelize = require ('sequelize');
const seqFn = require('sequelize-fn');
const {STRING} = Sequelize;
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/bookmarks_db');
const express = require('express');
const app = express();
app.use(express.urlencoded( {extended: false} ));
const Bookmark = db.define('Bookmark', {
    name: {
        type: STRING,
        allowNull: false
    },
    url: {
        type: STRING,
        allowNull: false
    },
    category: {
        type: STRING,
        allowNull: false
    }
});
const syncAndSeed = async() => {
    await db.sync({ force: true });
    await Bookmark.create({ name: 'Netflix', url: 'netflix.com', category: 'entertainment' });
    await Bookmark.create({ name: 'Hulu', url: 'hulu.com', category: 'entertainment' });
    await Bookmark.create({ name: 'Disney+', url: 'disneyplus.com', category: 'entertainment' });
    await Bookmark.create({ name: 'Seeking Alpha', url: 'seekingalpha.com', category: 'finance' });
    await Bookmark.create({ name: 'Market Watch', url: 'marketwarch.com', category: 'finance' });
    await Bookmark.create({ name: 'Investopedia', url: 'investopedia.com', category: 'finance' });
    await Bookmark.create({ name: 'Yahoo! News', url: 'yahoo.com', category: 'news' });
    await Bookmark.create({ name: 'New York Times', url: 'newyorktimes.com', category: 'news' });
    await Bookmark.create({ name: 'Forbes', url: 'forbes.com', category: 'news' });
};
app.get ('/', (req, res, next) => {
    res.redirect('bookmarks');
});
app.get('/bookmarks', async (req, res, next) => {
    try {
        const bookmarks = await Bookmark.findAll();
        const categories = await Bookmark.findAll({
            attributes:
                    [   'category',
                        [Sequelize.fn('COUNT', Sequelize.col('name')), 'n_categories']
                    ],
            group: 'category'
        });
        res.send(`
        <html>
        <head>
        </head>
        <body>
            <h1>Bookmarkers ${bookmarks.length}</h1>
            <ul>
                ${categories.map(category => `
                    <li>
                    <a href = '/bookmarks/${category.category}'>
                        ${category.category} (${category.dataValues.n_categories})
                        </a>
                    </li>
                `).join("")}
            </ul>
        </body>
        </html>
        `)
    }
    catch (err) {
        next (err);
    }
});
app.get('/bookmarks/:category', (req, res, next) => {
    try {
        console.log(req.params.id);
        const bookmarks = await Bookmark.findAll();
        const categories = await Bookmark.findAll({
            attributes:
                    [   'category',
                        [Sequelize.fn('COUNT', Sequelize.col('name')), 'n_categories']
                    ],
            group: 'category'
        });
        res.send(`
        <html>
        <head>
        </head>
        <body>
            <h1>Bookmarkers ${bookmarks.length}</h1>
            <ul>
                ${categories.map(category => `
                    <li>
                    <a href = '/bookmarks/${category.category}'>
                        ${category.category} (${category.dataValues.n_categories})
                        </a>
                    </li>
                `).join("")}
            </ul>
        </body>
        </html>
        `)
    }
    catch (err) {
        next(err);
    }
})
const init = async() => {
   // await db.authenticate();
    // await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {console.log(`listening at port ${port}`)});
};
init();
