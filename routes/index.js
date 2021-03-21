const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require("../models/User")
const { ensureAuthenticated } = require('../config/auth');


// Page de connection
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard')
    } else {
        res.render('index');
    }
});

router.get('/login', (req, res) => {
    res.redirect('/');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            return res.render('index', {
                error: 'Vos identifiants semblent incorrect 😟'
            });
        }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/dashboard');
        });
    })(req, res, next);
});

// Page d'inscription
router.get('/register', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard')
    } else {
        res.render('register');
    }
});

router.post('/register', (req, res) => {
    const { email, password, password2 } = req.body;

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                res.render('register', {
                    error: 'Cette addresse email est déjà enregistré 📧',
                    email
                });
                return;
            }

            if (!email.endsWith('@epitech.eu')) {
                res.render('register', {
                    error: 'Vous devez mettre une addresse mail Epitech 📩',
                    email
                });
                return;
            }
            if (password !== password2) {
                res.render('register', {
                    error: 'Les mots de passe ne correspondent pas 🙈',
                    email
                });
                return;
            }

            if (password.length < 6) {
                res.render('register', {
                    error: 'Votre mot de passe doit au minimum contenir 6 caractères',
                    email
                });
                return;
            }

            const newUser = new User({
                email: email,
                password: password,
                start: new Date(),
                level: 1,
            });

            bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            res.redirect('/')
                        })
                        .catch(err => { console.log(err) });
                }))
        })
});


// Déconnection
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})


//DASHBOARD

router.get('/quizz', ensureAuthenticated, (req, res) => {
    if (req.user.level >= 4)
        res.render('page5');
    else
        res.redirect('/dashboard');
})

router.get('/messages', ensureAuthenticated, (req, res) => {
    if (req.user.level >= 5)
        res.render('ph-message');
    else
        res.redirect('/phone');
})

router.get('/contacts', ensureAuthenticated, (req, res) => {
    if (req.user.level >= 5)
        res.render('ph-contacts');
    else
        res.redirect('/phone');
})

router.get('/gallery', ensureAuthenticated, (req, res) => {
    if (req.user.level == 5)
        res.render('ph-gallerylock');
    else if (req.user.level >= 6)
        res.render('ph-gallery');
    else
        res.redirect('/dashboard');
})


router.get('/notes', ensureAuthenticated, (req, res) => {
    if (req.user.level <= 6)
        res.render('ph-noteslock');
    else if (req.user.level >= 7)
        res.render('ph-notes');
    else
        res.redirect('/dashboard');
})

router.get('/music', ensureAuthenticated, (req, res) => {
    if (req.user.level >= 5)
        res.render('ph-music');
    else
        res.redirect('/dashboard');
})

router.get('/maps', ensureAuthenticated, (req, res) => {
    if (req.user.level >= 5)
        res.render('ph-maps');
    else
        res.redirect('/dashboard');
})

router.get('/chen', ensureAuthenticated, (req, res) => {
    if (req.user.level >= 8)
        res.render('chen');
    else
        res.redirect('/dashboard');
})

router.get('/phone', ensureAuthenticated, (req, res) => {
    if (req.user.level == 4)
        res.render('phonelock')
    else if (req.user.level >= 5)
        res.render('page6');
    else
        res.redirect('/dashboard');
})

router.get('/forgetpassword', ensureAuthenticated, (req, res) => {
    if (req.user.level == 4)
        res.render('forgetpassword')
    else if (req.user.level >= 5)
        res.render('page6');
    else
        res.redirect('/dashboard');
})

//
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    var page = req.user.level;
    if (req.user.level > 4)
        page = 4;
    res.render('page' + page);
})


//CHECKPOINT
router.post('/gotopage2', ensureAuthenticated, (req, res) => {
    User.findOne({ email: req.user.email })
        .then(user => {
            if (user) {
                if (user.level == 1)
                    user.level = 2;
                user.save()
                    .then(user => {
                        res.redirect('/dashboard')
                    })
                    .catch(err => { console.log(err) });
            }
        })
})

router.post('/gotopage3', ensureAuthenticated, (req, res) => {
    User.findOne({ email: req.user.email })
        .then(user => {
            if (user) {
                if (!req.body.professorname.toLowerCase().includes('platane')) {
                    res.render('page2', { error: "Ce n'est malheuresement pas la bonne réponse 👀" });
                    return;
                }
                if (user.level == 2)
                    user.level = 3;
                user.save()
                    .then(user => {
                        res.redirect('/dashboard')
                    })
                    .catch(err => { console.log(err) });
            }
        })
})

router.post('/gotopage4', ensureAuthenticated, (req, res) => {
    User.findOne({ email: req.user.email })
        .then(user => {
            if (user) {
                if (user.level == 3)
                    user.level = 4;
                user.save()
                    .then(user => {
                        res.redirect('/dashboard')
                    })
                    .catch(err => { console.log(err) });
            }
        })
})

router.post('/forgetpassword', ensureAuthenticated, (req, res) => {
    User.findOne({ email: req.user.email })
        .then(user => {
            if (user) {
                if (req.body.one.toLowerCase() == 'dracaufeu' && req.body.two.toLowerCase() == "zorua" && req.body.three.toLowerCase() == "apireine") {
                    if (user.level == 4)
                        user.level = 5;
                    req.user = user
                    user.save()
                        .then(user => {
                            res.redirect('/phone')
                        })
                        .catch(err => { console.log(err) });
                    return;
                } else {
                    res.render('forgetpassword', { error: "Ce n'est malheuresement pas la bonne réponse 👀" } );
                    return;
                }
            } else {
                res.render('forgetpassword');
                return;
            }

        })
})

router.post('/gallery', ensureAuthenticated, (req, res) => {
    User.findOne({ email: req.user.email })
        .then(user => {
            if (user) {
                if (req.body.one.toLowerCase() == 'dodoala') {
                    if (user.level == 5)
                        user.level = 6;
                    req.user = user
                    user.save()
                        .then(user => {
                            res.redirect('/gallery')
                        })
                        .catch(err => { console.log(err) });
                    return;
                } else {
                    res.render('page6', { error: "Ce n'est pas le mot de passe de l'application Gallerie" } );

                    return;
                }
            } else {
                res.render('dashboard');
                return;
            }

        })
})

router.post('/notes', ensureAuthenticated, (req, res) => {
    User.findOne({ email: req.user.email })
        .then(user => {
            if (user) {
                if (req.body.one.toLowerCase() == '1500') {
                    if (user.level == 6)
                        user.level = 7;
                    req.user = user
                    user.save()
                        .then(user => {
                            res.redirect('/notes')
                        })
                        .catch(err => { console.log(err) });
                    return;
                } else {
                    res.render('page6', { error: "Ce n'est pas le mot de passe de l'application Notes" } );
                    return;
                }
            } else {
                res.render('dashboard');
                return;
            }
        })
})

router.post('/maps', ensureAuthenticated, (req, res) => {
    User.findOne({ email: req.user.email })
        .then(user => {
            if (user) {
                if (req.body.one.toLowerCase() == 'algatia') {
                    if (user.level == 7)
                        user.level = 8;
                    var now = new Date();
                    if (user.finish == undefined)
                        user.finish = (now - user.start) / 10000;
                    req.user = user
                    user.save()
                        .then(user => {
                            res.redirect('/chen')
                        })
                        .catch(err => { console.log(err) });
                    return;
                } else {
                    res.render('page6', { error: "Ce n'est pas le mot de passe de l'application Plans" } );
                    return;
                }
            } else {
                res.render('dashboard');
                return;
            }
        })
})

module.exports = router
