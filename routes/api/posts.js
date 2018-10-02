const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport'); 


/**
 * Load validation
 */

const validatePostInput = require('../../jobs/validation/post'); 

 /**
 * Load Post Model
 */
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');


/**
 * @route GET api/posts
 * @desc Get posts
 * @access Public 
 */

 router.get('/', (req, res) => {
     Post.find()
        .sort({ date: -1}) // sorting through mongodb allows for faster sorting
        .then(posts => res.json(posts))
         .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
 });


/**
* @route GET api/posts/:id
* @desc Get posts by id
* @access Public 
*/

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({ nopostfound: 'No post found with that id' }));
});


/**
 * @route POST api/posts
 * @desc Create a post
 * @access Private 
 */

router.post('/', passport.authenticate('jwt', { session: false}), (req, res) => {

    const { errors, isValid } = validatePostInput(req.body); 

    /**
    * Check Validation
    */

    if (!isValid) {
        /**
         * Return any erros with 400 status
         */

        return res.status(400).json(errors);
    }


    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    }); 


    newPost.save().then(post => res.json(post));
});


/**
* @route DELETE api/posts/:id
* @desc Delete post
* @access Private 
*/

router.delete('/:id', passport.authenticate('jwt', { session: false}), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {

                    /**
                     * Check for post owner 
                     * Note: post user is not original a string, so it needs to be converted over to a string
                     * to properly be matched with req.user.id
                     */

                     /**
                      * Having validation on the backend allows for protection again someone using POSTMAN or something similar 
                      * and changing your data from your database, so its good to have validation checks on the frontend and backend
                      */


                    /**
                     * This allows only the authorized user to delete the post
                     */

                     if(post.user.toString() !== req.user.id) {
                        return res.status(401).json({ noautorized: 'User not authorized' }); 
                     }

                     /**
                      * Delete Post
                      */

                      post.remove().then(() => res.json({ success: true }));

                })
                .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
        })
});


/**
* @route POST api/posts/like/:id
* @desc Like post
* @access Private 
*/

router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(() => {
            console.log('post id', req.params.id);
            Post.findById(req.params.id)
                .then(post => {
                    /**
                     *  Checks to see if this user id is already in the like array 
                     */
                    const likes = post.likes.filter(like => {
                        return like.user.toString() === req.user.id; 
                    }); 

                    /**
                     * If the likes array returns higher then 0 that means the user id already exists in the array
                     * and an error needs to be returned.
                     */

                    if(likes.length > 0) {
                        return res.status(400).json({ alreadyliked: 'User already this post' });
                    }

                    /**
                     * Add user id to the likes array
                     */

                    post.likes.push({ user: req.user.id }); 

                    post.save().then(post => res.json(post));

                })
                .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
        })
});


/**
* @route POST api/posts/unlike/:id
* @desc Unlike like 
* @access Private 
*/


router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(() => {
            Post.findById(req.params.id)
                .then(post => {
                    /**
                     *  Checks to see if this user id is already in the like array 
                     */
                    const likes = post.likes.filter(like => {
                        return like.user.toString() === req.user.id;
                    });

                    /**
                     * If the likes array returns higher then 0 that means the user id already exists in the array
                     * and an error needs to be returned.
                     */

                    if (likes.length === 0) {
                        return res.status(400).json({ notliked: 'You have not yet liked this post' });
                    }

                    /**
                     * Get the remove index
                     */

                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id); 

                    const removedlike = post.likes.map(like =>  like.user.toString() !== req.user.id );


                    post.likes = removedlike; 

                    /**
                     * Save updated post
                     */

                    post.save().then(post => res.json(post));
                    

                })
                .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
        })
});


/**
* @route POST api/posts/comment/:id
* @desc Add comment to post 
* @access Private 
*/

router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validatePostInput(req.body);

    /**
    * Check Validation
    */

    if (!isValid) {
        /**
         * Return any erros with 400 status
         */

        return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }; 


            /**
             * Add to comment array
             */

             post.comments.unshift(newComment); 

             post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found'})); 
});


/**
* @route DELETE api/posts/comment/:id/:comment_id
* @desc Remove comment from post 
* @access Private 
*/

router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {

    Post.findById(req.params.id)
        .then(post => {
            
            /**
             * Check to see if the comment exists
             */

            const comments = post.comments.filter(comment => comment._id.toString() === req.params.comment_id); 

            if(comments.length === 0) {
                return res.status(404).json({ commentnotexist: 'Comment does not exist'})
            }

            /**
             * Remove comment
             */
            const removeCommentsList = post.comments.filter(comment => comment._id.toString() !== req.params.comment_id); 

            post.comments = removeCommentsList; 

            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
})


module.exports = router;

