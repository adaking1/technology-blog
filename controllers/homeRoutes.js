const router = require('express').Router();
const {Post, User, Comment} = require('../models');


// this gets all posts and displays them on the homepage
router.get('/', async (req,res) => {
    console.log(req.session);
    try {
        const postData = await Post.findAll({
            order: [['date_created', 'DESC']],
            include: [{
                model: User,
                attributes: ['username']
            }]
        });
        const serPostData = postData.map((post) => post.get({plain:true}));
        res.render('homepage', {serPostData, loggedIn: req.session.logged_in});
        console.log(serPostData);
    //     need to render homepage using handlebars
    //     need to add an each loop in handlebars homepage to render each post
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req,res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }
    res.render('login');
});



module.exports = router;