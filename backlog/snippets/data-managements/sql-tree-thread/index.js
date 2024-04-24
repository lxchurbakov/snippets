import pg from 'pg';
import { config } from 'dotenv';

config();

const pool = new pg.Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

// pool.on('error', (err) => {
//   console.error(err);
// });

;(async () => {
  /* Create a tree structure */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id serial PRIMARY KEY,
      author VARCHAR (100) NOT NULL,
      message VARCHAR (100) NOT NULL,
      path VARCHAR(200) NOT NULL
    )
  `);

  /* Create message helper */
  const postMessage = (author, message, path = []) =>
    pool.query(`INSERT INTO messages (author, message, path) VALUES ($1, $2, $3) RETURNING *`, [author, message, '/' + path.join('/')]).then(({ rows }) => rows[0].id);

  /* Post root message */
  const rootMessageId = await postMessage('Alex', 'Hey everyone!');

  /* First level answers */
  const firstAnswerId = await postMessage('John', 'Hey, Alex!', [rootMessageId]);
  const secondAnswerId = await postMessage('Mike', 'Hey, Alex, whatsup?', [rootMessageId]);

  /* Now alex responds */
  const alexAnswersId = await postMessage('Alex', 'Hey, Mike, Im good and you?', [rootMessageId, secondAnswerId]);

  /* Now fetch them recursively a tree */
  const renderTree = async (path = [], tab = '') => {
    const messages = await pool.query(`SELECT * FROM messages WHERE path = $1`, ['/' + path.join('/')]).then(({ rows }) => rows);

    for (let message of messages) {
      console.log(`${tab}${message.author}: ${message.message}`);

      await renderTree([...path, message.id], tab + '> ');
    }
  };

  await renderTree();

  // Use WHERE path LIKE /% to get ALL the children at once
  // If you want to add a comment to a specific message you can go
  // INSERT INTO messages (..., path) VALUES (..., parentMessagePath + parentMessageId)

  // to delete message and all it's children you use same WHERE clause
  // and to move messages you can simply alter path
})();
