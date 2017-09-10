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
exports.getUser = (req, res) => {
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

/**
 * GET /login
 * Login page.
 * Jeśli użytkownik jest już zalogowany, zostaje przekierowany z /login to /
 */
exports.getLogin = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
};

/**
 * GET /signup
 * Signup page.
 * Jeśli użytkownik jest już zalogowany, zostaje przekierowany z /login to /
 */
exports.getSignup = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
};


/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/login');
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            req.flash('errors', info);
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            req.flash('success', { msg: 'Success! You are logged in.' });
            res.redirect(req.session.returnTo || '/');
        });
    })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/signup');
    }

    const user = new User({
        email: req.body.email,
        password: req.body.password
    });

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
            req.flash('errors', { msg: 'Account with that email address already exists.' });
            return res.redirect('/signup');
        }
        user.save((err) => {
            if (err) { return next(err); }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
};




// /**
//  * POST /account/profile
//  * Update profile information.
//  */
// exports.postUpdateProfile = (req, res, next) => {
//     req.assert('email', 'Please enter a valid email address.').isEmail();
//     req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

//     const errors = req.validationErrors();

//     if (errors) {
//         req.flash('errors', errors);
//         return res.redirect('/account');
//     }

//     User.findById(req.user.id, (err, user) => {
//         if (err) { return next(err); }
//         user.email = req.body.email || '';
//         user.profile.name = req.body.name || '';
//         user.profile.gender = req.body.gender || '';
//         user.profile.location = req.body.location || '';
//         user.profile.website = req.body.website || '';
//         user.save((err) => {
//             if (err) {
//                 if (err.code === 11000) {
//                     req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
//                     return res.redirect('/account');
//                 }
//                 return next(err);
//             }
//             req.flash('success', { msg: 'Profile information has been updated.' });
//             res.redirect('/account');
//         });
//     });
// };


// /**
//  * POST /account/password
//  * Update current password.
//  */
// exports.postUpdatePassword = (req, res, next) => {
//     req.assert('password', 'Password must be at least 4 characters long').len(4);
//     req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

//     const errors = req.validationErrors();

//     if (errors) {
//         req.flash('errors', errors);
//         return res.redirect('/account');
//     }

//     User.findById(req.user.id, (err, user) => {
//         if (err) { return next(err); }
//         user.password = req.body.password;
//         user.save((err) => {
//             if (err) { return next(err); }
//             req.flash('success', { msg: 'Password has been changed.' });
//             res.redirect('/account');
//         });
//     });
// };

// /**
//  * POST /account/delete
//  * Delete user account.
//  */
// exports.postDeleteAccount = (req, res, next) => {
//     User.remove({ _id: req.user.id }, (err) => {
//         if (err) { return next(err); }
//         req.logout();
//         req.flash('info', { msg: 'Your account has been deleted.' });
//         res.redirect('/');
//     });
// };