const express = require('express');
const router = express.Router();
const bscrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User');

// login page
router.get('/login',(req, res)=>{
    res.render('login');
});

// register page
router.get('/register',(req, res)=>{
    res.render('register');
});

// Register Handle
router.post('/register',(req, res)=>{
    const { name, email, password, password2 }= req.body;
    let errors =[];

    //check required fields
    if(!name || !email || !password || !password2 ){
        errors.push({
            msg:'please fill in all fields'
        });
    }

    // check password match
    if(password !== password2 ){
        errors.push({
           msg:'Password do not match'
        });
    } 

    // check pass length
    if(password.length <6){
        errors.push({
            msg:'password should be at least 6 characters'
        })
    }

    if(errors.length>0){
        res.render('register',{
           errors,
           name,
           email,
           password,
           password2 
        })
    }else{
        //res.send('pass');
        // validate password
        User.findOne({email: email})
        .then(user=>{
            if(user){
                // user exists
                errors.push({msg:'Email is already registered'})
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else{
                const newUser = new User({
                    name,
                    email,
                    password

                });

                // hash password
                bscrypt.genSalt(10, (err, salt)=>{
                    bscrypt.hash(newUser.password, salt, (err, hash)=>{
                        if(err) throw err;
                        // set password to hashed
                        newUser.password=hash;
                        // save user
                        newUser.save()
                        .then(user=>{
                            req.flash('success_msg','You are now regtisted and can log in')
                            res.redirect('/users/login')
                        })
                        .catch(err=>console.log(err));
                    })
                } )

            }
        });


    }

});

// login handle
router.post('/login', (req, res, next)=>{
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect:'/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout handle 
router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg','you are logged out');
    res.redirect('/users/login');
});

module.exports = router;