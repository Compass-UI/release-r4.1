define(['jquery', 'lib/aero', 'lib/knockout', 'lib/application', 'lib/utils'], function ($, aero, ko, application, utils) {
    var pinpasswordApp = {};

    pinpasswordApp.spinner = ko.observable(false);

    pinpasswordApp.setupStartUpData = function (token) {
        pinpasswordApp.startUpData = { "EZRFlightSearchDetails": { "token": "" + token + "", "app": "shopping", "ArrayOfFlightInfo": { "FlightInfo": { "strOrgnCtyNm": "None", "dtmDeptDteTm": "2017-04-30T00:00:00", "strDestCtyNm": "None", "dtmReturnDteTm": "1899-12-30T00:00:00", "intNumPax": "1", "bInAwrdTrvl": "false" } } } };
    };
    pinpasswordApp.returnToEzr = function (data) {
        utils.destroyObject(pinpasswordApp);
        utils.removeElement($("#aeroApp")[0]);
        $('.ui-widget').remove();
        pinpasswordApp.callEZR(data);
    };
    pinpasswordApp.callEZR = function (data) {
        if (window.client) {
            if (data) {
                container.call('return', data);
            } else {
                container.call('IgnoreChanges');
            }
        } else {
            window.location.hash = "globalNav"; //If browser flow return to global nav
        };
    };
    //Show spinner on ajax start and hide it on ajax end
    $(document).ajaxStop(function () {
        if (pinpasswordApp.spinner) {
            pinpasswordApp.spinner(false);
        }
    });

    $(document).ajaxStart(function (event) {
        if (pinpasswordApp.spinner) {
            pinpasswordApp.spinner(true);
        }
    });
    return pinpasswordApp;
});