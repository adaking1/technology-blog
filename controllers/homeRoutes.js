const router = require('express').Router();
const {Post, User, Comment} = require('../models');


// this gets all posts and displays them on the homepage
router.get('/', async (req,res) => {
    try {
        const postData = await Post.findAll({
            include: [{
                model: User,
                attributes: ['username']
            }]
        });
        const serPostData = postData.map((post) => post.get({plain:true}));
        res.render('homepage', serPostData);
        console.log(serPostData);
        // need to render homepage using handlebars
    }
    catch (err) {
        res.status(500).json(err);
    }
});