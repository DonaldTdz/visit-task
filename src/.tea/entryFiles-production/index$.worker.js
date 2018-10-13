
require('./config$');
require('./importScripts$');
function success() {
require('../..//app');
require('../../mini-ddui/es/card/index');
require('../../mini-ddui/es/list/index');
require('../../mini-ddui/es/list/list-item/index');
require('../../node_modules/dd-charts/es/f2/index');
require('../../node_modules/mini-ddui/es/card/index');
require('../../node_modules/mini-ddui/es/list/index');
require('../../node_modules/mini-ddui/es/list/list-item/index');
require('../../pages/task/index');
require('../../pages/list/index');
require('../../pages/task/task-detail/task-detail');
require('../../pages/task/visit/visit');
require('../../pages/task/go-visit/go-visit');
require('../../pages/task/visit-detail/visit-detail');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
