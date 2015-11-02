'use strict';

/**
 * The root annonceApp module.
 *
 * @type {annonceApp|*|{}}
 */
var annonceApp = annonceApp || {};

/**
 * @ngdoc module
 * @name annonceControllers
 *
 * @description
 * Angular module for controllers.
 *
 */
annonceApp.controllers = angular.module('annonceControllers', ['ui.bootstrap']);



annonceApp.controllers.controller('MyProfileCtrl', 
		function ($scope, $log, oauth2Provider, HTTP_ERRORS) {
	alert("charge controlleur");
});

///**
// * @ngdoc controller
// * @name MyProfileCtrl
// *
// * @description
// * A controller used for the My Profile page.
// */
//annonceApp.controllers.controller('MyProfileCtrl',
//    function ($scope, $log, oauth2Provider, HTTP_ERRORS) {
//        $scope.submitted = false;
//        $scope.loading = false;
//
//        console.log("PROFILE CONTROLLER");
//        /**
//         * The initial profile retrieved from the server to know the dirty state.
//         * @type {{}}
//         */
//        $scope.initialProfile = {};
//
//        /**
//         * Initializes the My profile page.
//         * Update the profile if the user's profile has been stored.
//         */
//        $scope.init = function () {
//            var retrieveProfileCallback = function () {
//                $scope.profile = {};
//                $scope.loading = true;
//                gapi.client.annonce.getProfile().
//                    execute(function (resp) {
//                        $scope.$apply(function () {
//                            $scope.loading = false;
//                            if (resp.error) {
//                                // Failed to get a user profile.
//                            } else {
//                                // Succeeded to get the user profile.
//                                $scope.profile.name = resp.result.name;
//                                $scope.profile.city = resp.result.city;
//                                $scope.initialProfile = resp.result;
//                            }
//                        });
//                    }
//                );
//            };
//            if (!oauth2Provider.signedIn) {
//                var modalInstance = oauth2Provider.showLoginModal();
//                modalInstance.result.then(retrieveProfileCallback);
//            } else {
//                retrieveProfileCallback();
//            }
//        };
//
//        /**
//         * Invokes the annonce.saveProfile API.
//         *
//         */
//        $scope.saveProfile = function () {
//            $scope.submitted = true;
//            $scope.loading = true;
//            gapi.client.annonce.saveProfile($scope.profile).
//                execute(function (resp) {
//                    $scope.$apply(function () {
//                        $scope.loading = false;
//                        if (resp.error) {
//                            // The request has failed.
//                            var errorMessage = resp.error.message || '';
//                            $scope.messages = 'Failed to update a profile : ' + errorMessage;
//                            $scope.alertStatus = 'warning';
//                            $log.error($scope.messages + 'Profile : ' + JSON.stringify($scope.profile));
//
//                            if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
//                                oauth2Provider.showLoginModal();
//                                return;
//                            }
//                        } else {
//                            // The request has succeeded.
//                            $scope.messages = 'The profile has been updated';
//                            $scope.alertStatus = 'success';
//                            $scope.submitted = false;
//                            $scope.initialProfile = {
//                                displayName: $scope.profile.name,
//                                teeShirtSize: $scope.profile.city
//                            };
//
//                            $log.info($scope.messages + JSON.stringify(resp.result));
//                        }
//                    });
//                });
//        };
//    })
//;



/**
 * @ngdoc controller
 * @name RootCtrl
 *
 * @description
 * The root controller having a scope of the body element and methods used in the application wide
 * such as user authentications.
 *
 */
annonceApp.controllers.controller('RootCtrl', function ($scope, $location, oauth2Provider) {

    /**
     * Returns if the viewLocation is the currently viewed page.
     *
     * @param viewLocation
     * @returns {boolean} true if viewLocation is the currently viewed page. Returns false otherwise.
     */
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    /**
     * Returns the OAuth2 signedIn state.
     *
     * @returns {oauth2Provider.signedIn|*} true if siendIn, false otherwise.
     */
    $scope.getSignedInState = function () {
        return oauth2Provider.signedIn;
    };

    /**
     * Calls the OAuth2 authentication method.
     */
    $scope.signIn = function () {
        oauth2Provider.signIn(function () {
            gapi.client.oauth2.userinfo.get().execute(function (resp) {
                $scope.$apply(function () {
                    if (resp.email) {
                        oauth2Provider.signedIn = true;
                        $scope.alertStatus = 'success';
                        $scope.rootMessages = 'Logged in with ' + resp.email;
                    }
                });
            });
        });
    };

    /**
     * Render the signInButton and restore the credential if it's stored in the cookie.
     * (Just calling this to restore the credential from the stored cookie. So hiding the signInButton immediately
     *  after the rendering)
     */
    $scope.initSignInButton = function () {
        gapi.signin.render('signInButton', {
            'callback': function () {
                jQuery('#signInButton button').attr('disabled', 'true').css('cursor', 'default');
                if (gapi.auth.getToken() && gapi.auth.getToken().access_token) {
                    $scope.$apply(function () {
                        oauth2Provider.signedIn = true;
                    });
                }
            },
            'clientid': oauth2Provider.CLIENT_ID,
            'cookiepolicy': 'single_host_origin',
            'scope': oauth2Provider.SCOPES
        });
    };

    /**
     * Logs out the user.
     */
    $scope.signOut = function () {
        oauth2Provider.signOut();
        $scope.alertStatus = 'success';
        $scope.rootMessages = 'Logged out';
    };

    /**
     * Collapses the navbar on mobile devices.
     */
    $scope.collapseNavbar = function () {
        angular.element(document.querySelector('.navbar-collapse')).removeClass('in');
    };

});


/**
 * @ngdoc controller
 * @name OAuth2LoginModalCtrl
 *
 * @description
 * The controller for the modal dialog that is shown when an user needs to login to achive some functions.
 *
 */
annonceApp.controllers.controller('OAuth2LoginModalCtrl',
    function ($scope, $modalInstance, $rootScope, oauth2Provider) {
        $scope.singInViaModal = function () {
            oauth2Provider.signIn(function () {
                gapi.client.oauth2.userinfo.get().execute(function (resp) {
                    $scope.$root.$apply(function () {
                        oauth2Provider.signedIn = true;
                        $scope.$root.alertStatus = 'success';
                        $scope.$root.rootMessages = 'Logged in with ' + resp.email;
                    });

                    $modalInstance.close();
                });
            });
        };
    });
