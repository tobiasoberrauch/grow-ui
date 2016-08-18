/*global global*/

import globalModules from "./modules.global";
import localModules from "./modules.local";

export default {
    modules: globalModules.concat(localModules),
    module_listener_options: {
        config_glob_paths: [
            'config/autoload/{,*.}{global,local}'
        ],
        module_paths: [
            './src',
            './module',
            './node_modules'
        ],
        cache_dir: global.APPLICATION_ROOT + '/data/cache/application',
        config_cache_enabled: false,
        config_cache_key: 'module_config_cache',
        module_map_cache_enabled: false,
        module_map_cache_key: 'module_map_cache'
    }
};