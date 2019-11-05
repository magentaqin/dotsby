import { transform } from './transform';
import { bootstrap } from '../bootstrap';

transform().then((resp) => {
  if (resp.status < 300 && resp.status >= 200) {
    console.log('Successfully transformed files and stored document.')
    bootstrap()
  }
}).catch(err => console.log(err));