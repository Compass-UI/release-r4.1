require(['jquery', 'lib/knockout', 'lib/aero', './pinpasswordApp'],
    function ($, ko, aero, pinpasswordApp) {
        //window.ko = ko;
        var pinpasswordInit = function () {
            //Set up the path and extension for templates
            aero.templateEngine.defaults.templateSuffix = ".tmpl.html";
            //If we come from gateway, shopping context is set in local storage
            if (window.location.hostname === 'localhost'
                && window.location.port === '1222') {
                aero.templateEngine.defaults.templateUrl = "templates";
            } else {
                aero.templateEngine.defaults.templateUrl = "./app/loyalty/templates";
            }

            aero.token = sessionStorage.getItem('token');
            aero.workStationId = sessionStorage.getItem('workStationId');

            var containerData = {};

            if (sessionStorage.getItem('appEzrData')) {
                containerData.ezrdata = JSON.parse(sessionStorage.getItem('appEzrData'));
            } else {
                pinpasswordApp.setupStartUpData(aero.token);
                containerData.ezrdata = JSON.stringify(pinpasswordApp.startUpData);
            }

            aero.temp["ezrdata"] = containerData;
            var loyaltyId = "";
            if (sessionStorage.mpNumberAuthentication != undefined && (sessionStorage.mpNumberAuthentication != 'new MileagePlus number' && sessionStorage.mpNumberAuthentication != '')) {
                loyaltyId = sessionStorage.mpNumberAuthentication;
            }
            else if (sessionStorage.getItem('loyaltyId')) {
                loyaltyId = sessionStorage.getItem('loyaltyId');
            }

            require(['./changeEnterMileagePlus'], function (changeEnterMileagePlus) {
                pinpasswordApp.myHeader = new changeEnterMileagePlus();
                pinpasswordApp.myHeader.model.newMileagePlus(loyaltyId);
                var pinpassElem = document.getElementById('pinpassApp');
                ko.applyBindings(pinpasswordApp.myHeader.model, pinpassElem);
                pinpasswordApp.myHeader.model.pinpass.init();
                if (sessionStorage.mpNumberAuthentication == 'new MileagePlus number') {
                    pinpasswordApp.myHeader.model.newMileagePlus("");
                }
                $(document).ajaxStop(function () {
                    if (pinpasswordApp.myHeader.model.pinpass.spinner) {
                        pinpasswordApp.myHeader.model.pinpass.spinner(false);
                    }
                    if (pinpasswordApp.myHeader.model.reverseMpLookup) {
                        pinpasswordApp.myHeader.model.reverseMpLookup.spinner(false);
                    }
                    var isMPAuthenticationVerified = false;
                    if (sessionStorage.getItem('isMPAuthenticated')) {
                        var mpAuthverified = JSON.parse(sessionStorage.getItem('isMPAuthenticated'));
                        if (mpAuthverified.LoyaltyId == loyaltyId) {
                            isMPAuthenticationVerified = mpAuthverified.isAuth;
                        }
                    }
                    // $('#MPClose')[0].click();
                });

                $(document).ajaxStart(function (event) {
                    if (pinpasswordApp.myHeader.model.pinpass.spinner) {
                        pinpasswordApp.myHeader.model.pinpass.spinner(true);
                    }
                    if (pinpasswordApp.myHeader.model.reverseMpLookup) {
                        pinpasswordApp.myHeader.model.reverseMpLookup.spinner(true);
                    }
                });
            });
        }
        //When coming from EZR or from gateway token will be already set in sessionStorage.
        if (sessionStorage.getItem('token')) {
            pinpasswordInit();
        } else {
            aero.generateToken(pinpasswordInit);
        }

    });
