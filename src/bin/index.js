import { transform } from './transform';
import { bootstrap } from '../bootstrap';

transform().then(() => {
  console.log('success transform')
  bootstrap();
})