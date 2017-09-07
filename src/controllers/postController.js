import Post from '../models/Post';

/**
 * Get all posts
 * @param req
 * @param res
 * @returns void
 */
export function getPosts(req, res) {
    console.log(req.user);
    Post.find().sort('-dateAdded').exec((err, posts) => {
        if (err) {
            res.status(500).send(err);
        }
        res.json({ posts });
    });
}

exports.getTemp = (req, res) => {
    if (!req.user) {
        return res.redirect('/str');
    }
}

export function getCos(req, res, next) {
    if (!req.user) {
        return res.redirect('/asdf');
    }
    next();
}

// /**
//  * Get a single post
//  * @param req
//  * @param res
//  * @returns void
//  */
// export function getPost(req, res) {
//     Post.findOne({ cuid: req.params.cuid }).exec((err, post) => {
//         if (err) {
//             res.status(500).send(err);
//         }
//         res.json({ post });
//     });
// }

// /**
//  * Delete a post
//  * @param req
//  * @param res
//  * @returns void
//  */
// export function deletePost(req, res) {
//     Post.findOne({ cuid: req.params.cuid }).exec((err, post) => {
//         if (err) {
//             res.status(500).send(err);
//         }

//         post.remove(() => {
//             res.status(200).end();
//         });
//     });
// }