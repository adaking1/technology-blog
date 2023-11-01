const router = require('express').Router();
const {Post, User, Comment} = require('../models');
const auth = require('../utils/helpers');



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
        if (!postData) {
            res.render('homepage');
            return;
        }
        const serPostData = postData.map((post) => post.get({plain:true}));
        res.render('homepage', {serPostData, loggedIn: req.session.logged_in});
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// route that renders the login page
router.get('/login', (req,res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

// route to get the user's dashboard when logged in
router.get('/dashboard', auth, async (req,res) => {
    try {
        if (!req.session.logged_in){
            res.redirect('../login');
            return;
        }
        const user = await User.findByPk(req.session.user_id);
        const userDash = await Post.findAll({
            include: [{
                model: User,
                required: true,
                where: {id: req.session.user_id}
            }],
            where: {user_id: req.session.user_id}
        });
        if (!userDash) {
            res.render('dashboard', {message: 'No posts created yet'});
            return;
        }
        const serialized = userDash.map((data) => data.get({plain:true}));
        res.render('dashboard', {serialized, user, loggedIn: req.session.logged_in});
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// route to render newPost page
router.get('/create', auth, (req,res) => {
    res.render('newPost', {loggedIn: req.session.logged_in});
});

// route to create a post while logged in
router.post('/create', auth, async (req,res) => {
    try {
        const newPost = await Post.create({...req.body, user_id: req.session.user_id, date_created: Date.now()});
        res.status(200).json(newPost);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// route to delete a logged in user's post
// router.delete('/post/:id', auth, async (req,res) => {
//     try {
//         const post = await Post.destroy({
//             where: {
//                 id: req.params.id,
//                 user_id: req.session.user_id
//             }
//         });
//         if (!post) {
//             res.status(404).json({message: 'No post found'});
//             return;
//         }
//         // document.location
//         res.status(200).json(post);
//     }
//     catch (err) {
//         res.status(500).json(err);
//     }
// });


// make dashboard route show posts in order by date

module.exports = router;