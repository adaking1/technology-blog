const router = require('express').Router();
const session = require('express-session');
const {Post, Comment, User} = require('../../models');
const auth = require('../../utils/helpers');

// gets specific blogpost by id
router.get('/:id', async (req,res) => {
    try{
        const postData = await Post.findByPk(req.params.id, {
            include: [{
                model: User
            }]           
        });
        const commentData = await Comment.findAll({
            where: {
                post_id: req.params.id
            },
            include: [{
                model: User
            }]
        });
        if (!commentData) {
            res.json({message: 'No comments'});
            return;
        }
        if (!postData) {
            res.status(404).json({message: 'Blogpost not found!'});
            return;
        }
        const serPostData = postData.get({plain:true});
        const serCommentData = commentData.map((post) => post.get({plain:true}));
        if (serPostData.user_id === req.session.user_id){
            const userMatch = true;
            res.render('post', {serPostData, serCommentData, userMatch, loggedIn:req.session.logged_in});
            return;
        }
        res.render('post', {serPostData, serCommentData, loggedIn:req.session.logged_in});
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// this adds a new blog post
router.post('/', auth, async (req,res) => {
    try{
        const newPost = await Post.create(req.body);
        res.status(200).json(newPost);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// route to render update page
router.get('/:id/update', auth, async (req,res) => {
    try {
        const postData = await Post.findByPk(req.params.id);
        if (!postData) {
            res.json(404).json({message: 'No post found!'});
            return;
        }
        const post = postData.get({plain:true});
        res.render('update', {post, loggedIn:req.session.logged_in});
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// route to update user's post
router.post('/:id/update', auth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id);
        if (!postData) {
            res.json(404).json({message: 'No post found!'});
            return;
        }
        postData.contents = req.body.update;
        await postData.save();
        res.status(200).json({message: 'Post updated!', postData});
    }
    catch (err) {
        res.status(500).json(err);
    }
});


// this routes lets comments be added to a post using its id
router.put('/:id', auth, async (req,res) => {
    try {
        const postData = await Post.findByPk(req.params.id);
        if (!postData) {
            res.status(404).json({message: 'No post found!'});
            return;
        }
        const newComment = await Comment.create({
            ...req.body,
            user_id: req.session.user_id,
            post_id: req.params.id,
            date_created: Date.now()
        });
        res.status(200).json(newComment);        
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// route to delete a logged in user's post
router.delete('/:id', auth, async (req,res) => {
    try {
        const post = await Post.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            }
        });
        if (!post) {
            res.status(404).json({message: 'No post found'});
            return;
        }
        res.status(200).json(post);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;