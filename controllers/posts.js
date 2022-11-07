const { default: mongoose } = require('mongoose');
const PostMessage = require('../models/postMessage')
 
const getPost = async (req, res) =>{
    const {id} = req.params

    try {
        const post = await PostMessage.findById(id)
        res.status(200).json(post)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

const getPosts = async (req, res) =>{
    const {page} = req.query

    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
        const total = await PostMessage.countDocuments({})

        //Sort by oldest to newest, and skip all the documents to the startIndex
       const posts = await PostMessage.find().sort({_id: -1}).limit(LIMIT).skip(startIndex)
       
       res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total/LIMIT) })
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

const getPostsBySearch = async (req, res) =>{
    const {searchQuery, tags} = req.query

    try {
       const title = new RegExp(searchQuery, 'i')
       //5:32. Find me all the post that matches one of these two critierias (aka first one is the title and is one of the tags in the array of tags equal to our tag)
       const posts = await PostMessage.find({ $or: [{ title }, {tags: {$in: tags.split(',')}} ] })
       res.status(200).json({data: posts})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

const createPost = async (req, res) =>{
    const post = req.body;
    const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toLocaleString('en-US')})
    try {
        await newPost.save();
        res.status(201).json(newPost)
   } catch (error) {
    console.log(error)
        res.status(409).json({message: error})
   }
}

const updatePost = async (req, res) =>{
    const {id: _id} = req.params
    const post = req.body

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id')

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, {new: true} )

    res.json(updatedPost)
}

const deletePost = async(req, res) =>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id')

    await PostMessage.findByIdAndRemove(id);
    res.json({message: 'Postr deleted successfully'})

}

const likePost = async(req, res)=>{
    const {id} = req.params

    //Remember req.userId is passed by the middleware
    if(!req.userId) return res.json({message: Unauthenticated})

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id')

    const post = await PostMessage.findById(id)

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if(index === -1){
        post.likes.push(req.userId)
    }
    else{
        post.likes = post.likes.filter((id) => id !== String(req.userId))
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true})
    
    res.json(updatedPost)
}

const commentPost = async(req, res) =>{
    const {id} = req.params
    const {value} = req.body

    const post = await PostMessage.findById(id)

    post.comments.push(value);
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true})
    res.json(updatedPost)
}

module.exports = {getPosts, getPost, createPost, updatePost, deletePost, likePost, getPostsBySearch, commentPost}