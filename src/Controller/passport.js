


passport.use('owner', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },   
    function(req, email, password, done) {
        console.log("req");
        console.log(req);
        Owner.findOne({ email: email }, function (err, owner) {
            if (err) { return done(err); }
            if (!owner) {
                return done(null, false, { message: 'Incorrect email.' });
            }
            owner.validPassword(password, function(err, res) {
                if (err) {
                    console.log(err);
                    done(err);
                }
                if (res) {
                    done(null, owner);
                } else {
                    done();
                }
            }); 
        });
    }
));

passport.use('driver', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },   
    function(req, email, password, done) {
        console.log("req");
        console.log(req);
        Owner.findOne({ email: email }, function (err, owner) {
            if (err) { return done(err); }
            if (!owner) {
                return done(null, false, { message: 'Incorrect email.' });
            }
            owner.validPassword(password, function(err, res) {
                if (err) {
                    console.log(err);
                    done(err);
                }
                if (res) {
                    done(null, owner);
                } else {
                    done();
                }
            }); 
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    Owner.findById(id, function(err, owner) {
        done(err, owner);
    });
});

const isAuthenticated = function(req, res, next){
    if(req.isAuthenticated())
       return next();
    else
        return res.status(401).json({
            error: 'User not authenticated'
        })
}

route.get('/checkauth', isAuthenticated, function(req, res){
    res.status(200).json({
        status: 'Login successful!'
    });
});