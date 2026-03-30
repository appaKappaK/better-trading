/* eslint-env node */
/* eslint-disable camelcase */

'use strict';

module.exports = {
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,
  parallel: 5,
  launch_in_ci: ['Firefox'],
  launch_in_dev: ['Firefox'],
  browser_args: {
    Firefox: {
      ci: [
        '-headless',
      ].filter(Boolean),
    },
  },
};
