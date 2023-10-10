import { route, HttpError } from '/libs/utils';
import { Board, ObjectId } from '/libs/mongo';
import { EventEmitter } from '/libs/events';

import Entrypoint from '/plugins/core/entrypoint';
import Auth from '/plugins/content/auth';

const adjectives = [
    'Gorgeous', 'Beautiful', 'Great', 'Interesting', 'Fabulous'
]; 

const nouns = [
    'Project', 'Method', 'Automation' 
];

const randomFrom = (c) => 
    c[Math.floor(Math.random() * c.length)];

const randomName = () => 
    randomFrom(adjectives) + ' ' + randomFrom(nouns);

export default class {
    public onUpdate = new EventEmitter<any>();

    constructor (private entrypoint: Entrypoint, private auth: Auth) {
        this.entrypoint.app.post('/boards', this.auth.protect, route(async (req) => {
            const user = await this.auth.getUser(req);
            const { insertedId } = await Board.insertOne({ blocks: [], buses: [], userId: user._id, name: randomName() });

            return insertedId;
        }));

        this.entrypoint.app.get('/boards', this.auth.protect, route(async (req) => {
            const user = await this.auth.getUser(req);

            // const page = req.query.page || 0;
            // const size = req.query.size || 10;

            return await Board.find({ userId: user._id }).toArray(); 
        }));

        this.entrypoint.app.get('/boards/:boardId', this.auth.protect, route(async (req) => {
            const user = await this.auth.getUser(req);
            const board = await Board.findOne({ _id: new ObjectId(req.params.boardId), userId: user._id });

            if (!board) {
                throw new HttpError(404, 'board_not_found');
            }

            return board;
        }));

        this.entrypoint.app.put('/boards/:boardId', this.auth.protect, route(async (req) => {
            const user = await this.auth.getUser(req);
            const old = await Board.findOne({ _id: new ObjectId(req.params.boardId), userId: user._id });

            if (!old) {
                throw new HttpError(404, 'board_not_found');
            }

            const { updatedCount } = await Board.updateOne({ _id: new ObjectId(req.params.boardId), userId: user._id }, {
                $set: {
                    blocks: req.body.blocks,
                    buses: req.body.buses,
                    name: req.body.name,
                }
            });

            if (updatedCount < 1) {
                throw new HttpError(404, 'board_not_found');
            }

            const updated = await Board.findOne({ _id: new ObjectId(req.params.boardId) });

            this.onUpdate.emitps({ old, updated });

            return null;
        }));

        this.entrypoint.app.delete('/boards/:boardId', this.auth.protect, route(async (req) => {
            const user = await this.auth.getUser(req);
            const { deletedCount } = await Board.deleteOne({ _id: new ObjectId(req.params.boardId), userId: user._id });

            if (deletedCount < 1) {
                throw new HttpError(404, 'board_not_found');
            }

            return null;
        }));
    }
};
