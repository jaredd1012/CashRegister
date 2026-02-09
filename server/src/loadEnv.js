import { config } from 'dotenv';
import { resolve } from 'path';

const root = resolve(process.cwd(), '.env');
const appEnv = resolve(process.cwd(), 'app', '.env');
config({ path: root });
config({ path: appEnv, override: true });
