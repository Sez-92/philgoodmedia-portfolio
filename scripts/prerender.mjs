import {build} from 'esbuild';
import {createRequire} from 'node:module';
const outfile='node_modules/.cache/philgood-render-sports.cjs';
await build({entryPoints:['scripts/render-sports.jsx'],outfile,bundle:true,platform:'node',format:'cjs',jsx:'automatic',loader:{'.css':'empty'},logLevel:'warning'});
createRequire(import.meta.url)('../'+outfile);
