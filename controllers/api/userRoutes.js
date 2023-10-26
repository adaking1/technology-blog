const router = require('express').Router();
const {User} = require('../../models');

// logs user in if the user exisits in the database
router.post('/login', async (req,res) => {
    try {
        const userData = await User.findOne({
            where: {
                username: req.body.username
            }
        });
        if (!userData) {
            res.status(404).json({message: 'Not a valid username!'});
            return;
        }
        const validPass = await userData.passwordCheck(req.body.password);
        if (!validPass) {
            res.status(404).json({message: 'Incorrect password!'});
            return;
        }
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            res.status(200).json({message: 'You are logged in!'});
        });
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// creates a new user using the inputs from the sign-in fields
router.post('/', async (req,res) => {
    try {
        const newUser = await User.create(req.body);
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            res.status(200).json({message: 'You are logged in!'});
        });
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// logs user out if logged in and ends session
router.post('/logout', (req,res) => {
    if (req.session.logged_in) {
        req.session.destroy(() =>{
            res.status(200).end();
        });
    }
    else {
        res.status(404).end();
    }
});