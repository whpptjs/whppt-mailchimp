import { join, resolve } from 'path';
const glob = require('glob');

export default function (moduleOptions) {
  const filesDir = 'whppt/mailchimp';

  const options = {
    ...moduleOptions,
  };

  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: join(filesDir, 'plugin.js'),
    options,
  });

  copyDirectory(this, filesDir, 'components', options);
}

module.exports.meta = require('../package.json');

function copyDirectory(module, filesDir, dir, options = {}) {
  const fullPath = join(__dirname, dir);
  const pattern = `${fullPath}/**/*.{js,vue,scss}`;
  const directoryOptions = {
    ignore: [],
  };

  const files = glob.sync(pattern, directoryOptions);

  for (const file of files) {
    module.addTemplate({
      src: file,
      fileName: join(filesDir, file.replace(join(__dirname, ''), '')),
      options,
    });
  }
}
