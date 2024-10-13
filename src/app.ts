import { NextApiRequest, NextApiResponse } from 'next';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    await app.prepare();
    await handle(req, res);
  } catch (error) {
    console.error('Error occurred handling', req.url, error);
    res.statusCode = 500;
    res.end('Internal server error');
  }
}
