
require('./config$');
require('./importScripts$');
function success() {
require('../..//app');
require('../../pages/task/index');
require('../../pages/list/index');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
