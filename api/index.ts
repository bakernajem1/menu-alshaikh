import app, { routesPromise } from '../server/index';

export default async function handler(req: any, res: any) {
  await routesPromise;
  return app(req, res);
}
