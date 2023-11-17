// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
const getFailuresFromResults = (rawResults) => {
  const violations = rawResults.violations.flatMap((data) => data.nodes.map((node) => `violation:${data.id}:${node.impact}:${node.target[0]}`));
  const incompletes = rawResults.incomplete.flatMap((data) => data.nodes.map((node) => `incomplete:${data.id}:${node.impact}:${node.target[0]}`));
  return violations.concat(incompletes).join(',');
};

// eslint-disable-next-line no-undef
axe
  .run()
  .then((rawResults) => {
    const violationsCount = rawResults.violations.flatMap((data) => data.nodes).length;
    const incompleteCount = rawResults.incomplete.flatMap((data) => data.nodes).length;
    const passesCount = rawResults.passes.flatMap((data) => data.nodes).length;
    const failures = getFailuresFromResults(rawResults);

    // eslint-disable-next-line no-undef
    if (adobeDataLayer) {
      // eslint-disable-next-line no-undef
      adobeDataLayer.push({
        a11y: {
          violationsCount: violationsCount,
          incompleteCount: incompleteCount,
          passesCount: passesCount,
          failures: failures
        },
        axeResult: rawResults,
      });
    }
    if (rawResults.violations.length) {
      throw new Error('Accessibility issues found');
    }
  })
  .catch((err) => {
    console.error('Something bad happened:', err.message);
  });
