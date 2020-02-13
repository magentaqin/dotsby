
import { transform } from './transform';
import { render } from '../server/render';

transform().then((resp) => {
  if (resp.status < 300 && resp.status >= 200) {
    console.log('Successfully transformed files and stored document.')
    render()
  }
}).catch(err => console.log(err));
