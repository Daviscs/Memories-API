const express = require('express')
const router = express.Router();
const auth = require('../middleware/auth')
const {getPosts, getPost,  getPostsBySearch, createPost, updatePost, deletePost, likePost, commentPost} = require('../controllers/posts')

router.route('/').get(getPosts).post(auth, createPost)
router.route('/search').get(getPostsBySearch)
router.route('/:id').patch(auth, updatePost).delete(auth, deletePost).get(getPost)
router.route('/:id/likePost').patch(auth, likePost)
router.route('/:id/commentPost').post(auth, commentPost)

module.exports = router