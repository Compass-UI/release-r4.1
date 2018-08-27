define(['jquery', 'lib/knockout'], function ($, ko) {
    // Add event handler
    
    // Call container method
    this.call = function () {
        if (!window.client) {
            if (arguments.length > 2) {
                arguments[2]();
            }
            return;
        }

        if (arguments.length == 0) {
            alert("no arguments");
            return;
        }
        var method = arguments[0];
        if (method == 'getParams' && typeof arguments[1] == 'function') {
            arguments[1](window.client);
        } else if (method == 'return' && arguments[1]) {
            window.client.callAeroGeneric('aeroDone', arguments[1]);
        } else if (method == 'IgnoreChanges') {
            window.client.callAeroGeneric('aeroDone');
        }
        else if (method == 'close') {
            window.close();
        }
        else {
            window.client.callAeroGeneric.apply(window, arguments);
        }
    };

    // Test container
    this.test1 = function (message) {
        if (!window.client) {
            return;
        }

        var returnVal2 = client.callAeroClientWithReturn(message);
        alert("Aero Wrapper : " + returnVal2);
    };
    return this;
});
