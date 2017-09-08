import User from '../models/User';

/**
 * Get all users
 * @param req
 * @param res
 * @returns void
 */
export function getUsers(req, res) {
    User.find().sort('-dateAdded').exec((err, users) => {
        if (err) {
            res.status(500).send(err);
        }
        res.json({ users });
    });
}


/**
 * Get a single user
 * @param req
 * @param res
 * @returns void
 */
export function getUser(req, res) {
    User
    .findOne({ email: req.params.email })
    .populate('profile.posts')
    .exec((err, user) => {
        if (err) {
            res.status(500).send(err);
        }
        res.json({ user });
    });
}