const sequelize = require('../config/connection');
const {Post, User, Comment} = require('../models');
const postSeeds = require('./blogPost.json');
const commentSeeds = require('./comment.json');
const userSeeds = require('./user.json');

const seedDb = async ()=> {
    await sequelize.sync({force: true});
    for (const user of userSeeds) {
        await User.create({...user});
    }
    for(const post of postSeeds) {
        await Post.create({...post});
    }
    for(const comment of commentSeeds) {
        await Comment.create({...comment});
    }
    process.exit(0);
};

seedDb();