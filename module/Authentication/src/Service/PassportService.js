class PassportService {
    constructor() {
        this.passport = require('passport');
        this.passport.initialize();
        this.passport.session();
        this.passport.serializeUser(function (user, done) {
            done(null, user);
        });
        this.passport.deserializeUser(function (obj, done) {
            done(null, obj);
        });
    }

    addStrategy(Strategy, config) {
        let callback = function (token, tokenSecret, profile, done) {
            process.nextTick(function () {
                return done(null, profile);
            });
        };

        this.passport.use(new Strategy(config, callback));
    }

    authenticate(id) {
        this.passport.authenticate(id);
    }

    callback(id) {
        this.passport.authenticate(id, {failureRedirect: '/login'});
    }
}