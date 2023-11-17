// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

// eslint-disable-next-line no-undef
axe
  .run()
  .then((results) => {
    console.log('Results: ', results);

    // eslint-disable-next-line no-undef
    if (adobeDataLayer) {
      // eslint-disable-next-line no-undef
      adobeDataLayer.push(results);
    }
    if (results.violations.length) {
      throw new Error('Accessibility issues found');
    }
  })
  .catch((err) => {
    console.error('Something bad happened:', err.message);
  });
