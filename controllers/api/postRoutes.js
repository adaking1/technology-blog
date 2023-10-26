const router = require('express').Router();
const {Post, Comment} = require('../../models');

// gets all blogposts
router.get('/', async (req,res) => {
    try{
        const blogData = await Post.findAll();
        res.status(200).json(blogData);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// gets specific blogpost by id
router.get('/:id', async (req,res) => {
    try{
        const postData = await Post.findByPk(req.params.id);
        if (!postData) {
            res.status(404).json({message: 'Blogpost not found!'});
            return;
        }
        req.status(200).json(postData);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// deletes a blogpost using its id
router.delete('/:id', async (req,res) => {
    try{
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            }
        });
        if (!postData) {
            res.status(404).json({message: 'Blogpost not found!'});
            return;
        }
        res.status(200).json(postData);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// this adds a new blog post
router.post('/', async (req,res) => {
    try{
        const newPost = await Post.create(req.body);
        res.status(200).json(newPost);
    }
    catch (err) {
        res.status(500).json(err);
    }
});


// this routes lets comments be added to a post using its id
// posiibly needs editing 
router.put('/:id', async (req,res) => {
    try {
        const postData = await Post.findByPk(req.params.id);
        if (!postData) {
            res.status(404).json({message: 'No post found!'});
            return;
        }
        const newComment = await Comment.create(req.body);
        res.status(200).json(newComment);        
    }
    catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;