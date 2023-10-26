const router = require('express').Router();
const postRoutes = require('./post-routes');
const userRoutes = require('./user-routes');

router.use('/posts', postRoutes);
router.use('/users', userRoutes);

module.exprots = router;