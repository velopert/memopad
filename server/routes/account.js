import express from 'express';
import Account from '../models/account';

const router = express.Router();

router.post('/signup', (req, res) => {
    // CHECK USERNAME FORMAT
    let usernameRegex = /^[a-zA-Z0-9]+$/;

    if(!usernameRegex.test(req.body.username)) {
        return res.status(400).json({
            error: "BAD USERNAME",
            code: 1
        });
    }
    // CHECK PASS LENGTH
    if(req.body.password.length < 4) {
        return res.status(400).json({
            error: "PASSWORD TOO SHORT",
            code: 2
        });
    }

    // CHECK USER EXISTANCE
    Account.findOne({ username: req.body.username }, (err, exists) => {
        if (err) throw err;
        if(exists){
            return res.status(409).json({
                error: "USERNAME EXISTS",
                code: 3
            });
        }

        // CREATE ACCOUNT
        let account = new Account({
            username: req.body.username,
            password: req.body.password
        });
        account.password = account.generateHash(account.password);

        // SAVE IN THE DATABASE
        account.save( err => {
            if(err) throw err;
            return res.json({ success: true });
        });

    });
});

router.post('/signin', (req, res) => {

    if(typeof req.body.password === "undefined") {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    } else if (req.body.password === null) {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    }

    /* to be implemented */
    Account.findOne({ username: req.body.username}, (err, account) => {
        if(err) throw err;

        // CHECK ACCOUNT EXISTANCY
        if(!account) {
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }

        if(!account.validateHash(req.body.password)) {
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }

        let session = req.session;
        session.loginInfo = {
            _id: account._id,
            username: account.username
        };

        return res.json({
            success: true
        });
    });
});

router.get('/getinfo', (req, res) => {
    if(typeof req.session.loginInfo === "undefined") {
        return res.status(401).json({
            error: 1
        });
    }

    res.json({ info: req.session.loginInfo });
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => { if(err) throw err; });
    return res.json({ sucess: true });
});

router.get('/search/:username', (req, res) => {
    var re = new RegExp('^' + req.params.username);
    Account.find({username: {$regex: re}}, {_id: false, username: true})
    .limit(5)
    .sort({username: 1})
    .exec((err, accounts) => {
        if(err) throw err;
        res.json(accounts);
    });
});


export default router;
