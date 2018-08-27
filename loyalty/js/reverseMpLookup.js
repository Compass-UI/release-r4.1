define(['jquery', 'lib/aero', 'lib/knockout', 'lib/viewModel', './pincontactcenter'],
    function ($, aero, ko, viewModel, cc) {
        var reverseMpLookupClass = function (options) {
            "use strict";
            viewModel.apply(this, arguments);
            var reverseMpLookup = this;
            var app = aero.shopping;
            var pinpassword = options.pinpassword;

            reverseMpLookup.errorMessage = ko.observable();
            reverseMpLookup.firstName = ko.observable();
            reverseMpLookup.lastName = ko.observable();
            reverseMpLookup.zipCode = ko.observable();
            reverseMpLookup.phoneNumber = ko.observable();
            reverseMpLookup.searchResults = ko.observableArray([]);
            reverseMpLookup.isFirstNameInvalid = ko.observable(false);
            reverseMpLookup.isLastNameInvalid = ko.observable(false);
            reverseMpLookup.spinner = ko.observable(false);

            reverseMpLookup.showSearchResults = ko.computed(function () {
                return reverseMpLookup.searchResults().length > 0;
            });

            reverseMpLookup.init = function () {
                pinpassword.mode('reverseMpLookup');
                clearObservables();
            }

            reverseMpLookup.onClickCancel = function () {
                pinpassword.mode('mpNumberEntry');
            }

            reverseMpLookup.onClickSearch = function () {
                if(isModalValid()) {
                    callReverserMpLookupService();
                }   
            }

            reverseMpLookup.onClickSearchResult = function (parents, selectedItem) {
                var changeEnterMileagePlus = parents[1];
                parents[1].pinpass.hasInitMpValueFlag(true);
                if (selectedItem && selectedItem.mpNumber && changeEnterMileagePlus) {
                    changeEnterMileagePlus.newMileagePlus(selectedItem.mpNumber);
                    pinpassword.mode('mpNumberEntry');
                }
            }

            function isModalValid() {
                var isValid = false;
                if (!reverseMpLookup.firstName() || reverseMpLookup.firstName().length == 0) {
                    reverseMpLookup.isFirstNameInvalid(true);
                    // return false;
                } else  if (!reverseMpLookup.lastName() &&reverseMpLookup.lastName().length == 0) {
                    reverseMpLookup.isLastNameInvalid(true);
                    // return false;
                }  else {
                    reverseMpLookup.isFirstNameInvalid(false);
                    reverseMpLookup.isLastNameInvalid(false);
                    // return true;
                    isValid = true;
                }
                return isValid;
            }

            function callReverserMpLookupService() {
                $(".global-overlay-loading").show();
                var request = {
                    firstname: reverseMpLookup.firstName(),
                    lastname: reverseMpLookup.lastName(),
                    postalCode: reverseMpLookup.zipCode(),
                    phoneNumber: reverseMpLookup.phoneNumber()
                };
                cc.services.reverseMPLookup.request(
                    request,
                    function (response) {
                        $(".global-overlay-loading").hide();
                        var results = response.map(function (item) {
                            var result = {
                                fullName: item.FirstName + ' ' + item.LastName,
                                mpNumber: item.MileagePlusAccountNumber,
                                address: item.Address,
                                zipCode: item.PostalCode
                            }
                            return result;
                        });
                        reverseMpLookup.searchResults(results);
                        showHideErrorMsg();
                    },
                    function (response) {
                        $(".global-overlay-loading").hide();
                        reverseMpLookup.searchResults([]);
                        showHideErrorMsg();
                    }
                );
            }

            function showHideErrorMsg() {
                if (reverseMpLookup.searchResults() && reverseMpLookup.searchResults().length > 0) {
                    reverseMpLookup.errorMessage('');
                } else {
                    reverseMpLookup.errorMessage('No records returned. Verify spelling of first/last name. Expand search by using only first letter of the first name');
                }
            }

            function clearObservables() {
                reverseMpLookup.firstName('');
                reverseMpLookup.lastName('');
                reverseMpLookup.zipCode('');
                reverseMpLookup.phoneNumber('');
                reverseMpLookup.searchResults([]);
            }
        };
        return reverseMpLookupClass;
    });