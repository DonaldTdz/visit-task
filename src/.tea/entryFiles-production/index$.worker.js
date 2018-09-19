
require('./config$');
require('./importScripts$');
function success() {
require('../..//app');
require('../../mini-ddui/es/card/index');
require('../../mini-ddui/es/list/index');
require('../../mini-ddui/es/list/list-item/index');
require('../../pages/task/index');
require('../../pages/list/index');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
