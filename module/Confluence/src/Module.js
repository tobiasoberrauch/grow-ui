angular
    .module('module.Confluence', [])
    .run([
        '$controller',
        function ($controller) {
            let locals = {
                $scope: {}
            };

            page('/confluence', function (context, next) {
                $controller('Confluence.Controller.IndexController', locals);

                next();
            });
            page({
                hashbang: true
            });
        }
    ]);