const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bscypt = require('bcryptjs');

//load user model
const User = require('../models/User');

module.exports=function(passport){
    passport.use(
        new LocalStrategy({
            usernameField : 'email'
        },
        (email, password, done)=>{
            // match user
            User.findOne({
                email: email
            })
            .then(user=>{
                if(!user){
                    return done(null, false, {message: 'That email is not registered'});
                }
                // match password
                bscypt.compare(password, user.password , (err, isMatch)=>{
                    if(err) throw err;

                    if(isMatch){
                        return done(null, user);
                    }else{
                        return done(null, false, {message: 'Password incorrect'});
                    }

                } );

            })
            .catch(err=>{
                console.log(err);
            })
        }
        
        )
    );

    passport.serializeUser((user, done)=>{
        done(null, user.id);
    
    });

    passport.deserializeUser((id, done)=>{
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

}