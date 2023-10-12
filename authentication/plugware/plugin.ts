import { route, HttpError } from '/libs/utils';
import { readJWT, createJWT } from '/libs/security';
import { EventEmitter } from '/libs/events';

import Entrypoint from './entrypoint';

export default class {
    public onCollectMethods = new EventEmitter();

    public onAction = new EventEmitter();
    public onAuthenticate = new EventEmitter();

    constructor (private entrypoint: Entrypoint) {
        this.entrypoint.app.get('/session/methods', route(async (req) => {
            return this.onCollectMethods.emitps(req.params.identifier).filter(Boolean);
        }));

        this.entrypoint.app.put('/session/:method', route(async (req) => {
            const { method } = req.params;
            const payload = req.body;

            const { result } = await this.onAction.emitsa({ result: null, method, payload });

            return result;
        }));

        this.entrypoint.app.post('/session/:method', route(async (req) => {
            const { method } = req.params;
            const { identifier, ...payload } = req.body;

            const { userId } = await this.onAuthenticate.emitsa({ userId: null, method, identifier, payload });

            if (!userId) {
                throw new HttpError(403, 'invalid_credentials');
            }

            return createJWT(userId);
        }));

        this.entrypoint.app.get('/session/', route(async (req) => {
            const token = req.get('authorization');
            const userId = await readJWT(token);

            return userId;
        }));
    }
};
