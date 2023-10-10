import _ from 'lodash';

import { sendNoPasswordAuthCode } from '/libs/mailer';
import { route, HttpError } from '/libs/utils';
import { ObjectId, User, UserAuthCode } from '/libs/mongo';
import { createJWT, generateSalt, getPasswordHash, readJWT } from '/libs/security';

import Entrypoint from '/plugins/core/entrypoint';

const ITERATIONS = 2_000;

const createCode = async (email: string) => {
    const code = new Array(5).fill(0).map(() => Math.floor(Math.random() * 10)).join('');
    const entry = await UserAuthCode.insertOne({ code, email });
    const response = await sendNoPasswordAuthCode({ email, code });
};

const checkCode = async (email: string, code: string) => {
    const { deletedCount } = await UserAuthCode.deleteOne({ code, email });

    return deletedCount > 0;
};

export type User = any;

//
//
//

export default class {
    //
    //
    //
    public getUserIdFromToken = (token: string) => 
        readJWT<User>(token).then((user) => user._id)

    public getUser = (req) =>
        readJWT<User>(req.get('authorization'));

    public protect = (req, res, next) => 
        readJWT(req.get('authorization')).then(() => {
            next();
        }).catch((e) => {
            next(new HttpError(403, 'unauthorized'));
        }); 
    
    //
    //
    //
    constructor (private entrypoint: Entrypoint) {
        // First of all we let the auth consumer check
        // what authentication methods they can use
        // currently it's only code and password, but later
        // I will add oauth here
        this.entrypoint.app.post('/session', route(async (req) => {
            if (!req.body.email) {
                throw new HttpError(400, 'invalid_email');
            }

            let modes = ['code'];
            const user = await User.findOne({ email: req.body.email });

            if (user && user.hash) {
                modes.push('password');
            }

            return modes;
        }));

        // Then we implement the first method - authentication
        // by code sent to email SIC do not return code!
        this.entrypoint.app.post('/session/code/generate', route(async (req) => {
            if (!req.body.email) {
                throw new HttpError(400, 'invalid_email');
            }

            await createCode(req.body.email);
            return null;
        }));

        // Immediately after that i have a method that
        // validates the code and finds or creates user!
        this.entrypoint.app.post('/session/code', route(async (req) => {
            if (!await checkCode(req.body.email, req.body.code)) {
                throw new HttpError(400, 'invalid_code');
            }

            let user = await User.findOne({ email: req.body.email });

            if (!user) {
                await User.insertOne({ email: req.body.email });
                user = await User.findOne({ email: req.body.email });

                if (!user) {
                    throw new HttpError(500, 'cannot_create_user');
                }
            }

            return createJWT(_.pick(user, ['_id', 'email']));
        }));

        //
        // The same goes for password with one exception
        // we assume that user entry is already in database
        //
        this.entrypoint.app.post('/session/password', route(async (req) => {
            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                throw new HttpError(400, 'invalid_credentials');
            }

            const hash = await getPasswordHash(req.body.password, user.salt, ITERATIONS);

            if (user.hash !== hash) {
                throw new HttpError(400, 'invalid_credentials');
            }

            return createJWT(_.pick(user, ['_id', 'email']));
        }));

        //
        // Here we let user change their password in order not to 
        // login with email code anymore
        //
        this.entrypoint.app.put('/session', route(async (req) => {
            const token = req.get('authorization');
            const user = await readJWT(token);

            if (!user) {
                throw new HttpError(403, 'unauthorized');
            }

            if ('password' in req.body) {
                const salt = generateSalt();
                const hash = await getPasswordHash(req.body.password, salt, ITERATIONS);

                const { modifiedCount } = await User.updateOne({ _id: new ObjectId(user._id) }, { $set: { hash, salt } });

                if (modifiedCount !== 1) {
                    throw new HttpError(500, 'cannot_update_password');
                }
            }
            
            return null;
        }));

        // Here we let users retrieve
        // their information from JWT
        //
        this.entrypoint.app.get('/session', route(async (req) => {
            const token = req.get('authorization');
            const user = await readJWT(token);

            return _.pick(user, ['_id', 'email']);
        }));
    }
};
