angular
    .module('module.Authentication', [])
    .run([
        '$controller',
        function ($controller) {
            let locals = {
                $scope: {}
            };

            page('/xing', function (context, next) {
                $controller('Authentication.Controller.XingController', locals);

                next();
            });
            page({
                hashbang: true
            });
        }
    ]);