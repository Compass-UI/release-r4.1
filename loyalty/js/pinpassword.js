define(['jquery', 'lib/aero', 'lib/knockout', 'lib/viewModel', './pincontactcenter', './pinpasswordApp'],
    function ($, aero, ko, viewModel, cc, pinpasswordApp) {
        var pinpasswordClass = function (options) {
            "use strict";
            viewModel.apply(this, arguments);
            var pinpassword = this;
            var app = aero.shopping,

                /*Taking the initial status of sponsor traveling when launching MP modal*/
                isSponsorNotTraveling = sessionStorage.getItem('isSponsorNotTraveling'),
                initialSponsorTravelStatus = '';
            if (isSponsorNotTraveling === 'false') initialSponsorTravelStatus = true;
            else if (isSponsorNotTraveling === 'true') initialSponsorTravelStatus = false;

            pinpassword.anonymousToken = ko.observable();
            pinpassword.authToken = ko.observable().extend({
                notify: 'always'
            });
            pinpassword.correctAnswerCount = ko.observable(0);
            pinpassword.customerId = ko.observable();
            pinpassword.displayQuestion = ko.observable();
            pinpassword.errorMessage = ko.observable();
            pinpassword.alertMsg = ko.observable('');
            pinpassword.reshopWarnMsg = ko.observable('');
            pinpassword.incorrectAnswerCount = ko.observable(0);
            pinpassword.isAccountClosed = ko.observable(false);
            pinpassword.isAccountLocked = ko.observable(false);
            pinpassword.isAuthenticateClicked = ko.observable(false);
            pinpassword.isAuthenticated = ko.observable(false);
            pinpassword.isAuthenticationNeeded = ko.observable(false);
            pinpassword.isAuthenticationVerified = ko.observable(false);
            pinpassword.isAuthenticationVerified = ko.observable(false);
            pinpassword.isChangeMp = ko.observable(false);
            pinpassword.isMpNumberChangeMessageVisible = ko.observable(false);
            pinpassword.isOn = ko.observable(true);
            pinpassword.hasInitMpValueFlag = ko.observable(false);
            pinpassword.isSponsorNotTraveling = sessionStorage.getItem('isSponsorNotTraveling') === 'true' ? ko.observable(true) : ko.observable(false);
            pinpassword.isSubmitClicked = ko.observable(false);
            pinpassword.mode = ko.observable('mpNumberEntry');
            pinpassword.mpNumber = ko.observable();
            pinpassword.mpprofile = ko.observableArray([]);
            pinpassword.respondedQuestionAnswerKeys = ko.observableArray([]);
            pinpassword.securityQuestions = ko.observableArray([]);
            pinpassword.selectedAnswerKey = ko.observable();
            pinpassword.showEmailFailedMessage = ko.observable(false);
            pinpassword.showEmailSentMessage = ko.observable(false);
            pinpassword.showForgotSecurityQuestionsMessage = ko.observable(false);
            pinpassword.showInvalidMpNumberMessage = ko.observable(false);
            pinpassword.showSuspendConfirmation = ko.observable(false);
            pinpassword.spinner = ko.observable(false);
            pinpassword.profileOwnerName = ko.observable();

            pinpassword.abortSpinner = function () {
                shoppingApp.spinner(false);
            };

            pinpassword.authToken.subscribe(function (authToken) {
                aero.setOutboundEzrData(pinpassword.mpNumber(), authToken);
                sessionStorage.setItem('mpToken', authToken);
            });

            pinpassword.isAuthenticationVerified.subscribe(function (isAuthenticationVerified) {
                if (isAuthenticationVerified) {
                    pinpassword.isAuthenticationNeeded(false);
                    pinpassword.isAccountLocked(false);
                    pinpassword.isAccountClosed(false);
                }
            });

            pinpassword.isAuthenticationNeeded.subscribe(function (isAuthenticationNeeded) {
                if (isAuthenticationNeeded) {
                    pinpassword.isAuthenticationVerified(false);
                    pinpassword.isAccountLocked(false);
                    pinpassword.isAccountClosed(false);
                }
            });

            pinpassword.isAccountLocked.subscribe(function (isAccountLocked) {
                if (isAccountLocked) {
                    pinpassword.isAuthenticationVerified(false);
                    pinpassword.isAuthenticationNeeded(false);
                    pinpassword.isAccountClosed(false);
                }
            });

            pinpassword.isAccountClosed.subscribe(function (isAccountClosed) {
                if (isAccountClosed) {
                    pinpassword.isAuthenticationVerified(false);
                    pinpassword.isAuthenticationNeeded(false);
                    pinpassword.isAccountLocked(false);
                }
            });

            pinpassword.isSecurityQuestionsSetup = ko.computed(function () {
                return pinpassword.securityQuestions().length > 0;
            }, pinpassword, {
                    pure: true
                });

            pinpassword.isLastChance = ko.computed(function () {
                //return pinpassword.incorrectAnswerCount() > 0;
                return false;
            }, pinpassword, {
                    pure: true
                });

            pinpassword.showSuccess = ko.computed(function () {
                return !pinpassword.isMpNumberChangeMessageVisible() && pinpassword.isAuthenticationVerified();
            }, pinpassword, {
                    pure: true
                });

            pinpassword.isNotAuthenticatedMessageVisible = ko.computed(function () {
                return !pinpassword.isMpNumberChangeMessageVisible() &&
                    (!(pinpassword.isAccountClosed() ||
                        pinpassword.isAccountLocked() ||
                        pinpassword.isAuthenticationVerified()) ||
                        pinpassword.isAuthenticationNeeded());
            }, pinpassword, {
                    pure: true
                });

            pinpassword.isAccountLockedMessageVisible = ko.computed(function () {
                return !pinpassword.isMpNumberChangeMessageVisible() && pinpassword.isAccountLocked();
            }, pinpassword, {
                    pure: true
                });

            pinpassword.isAccountClosedMessageVisible = ko.computed(function () {
                return !pinpassword.isMpNumberChangeMessageVisible() && pinpassword.isAccountClosed();
            }, pinpassword, {
                    pure: true
                });

            pinpassword.isAuthenticateButtonDisabled = ko.computed(function () {
                return !pinpassword.isMpNumberChangeMessageVisible() && (pinpassword.isAccountClosed() || pinpassword.isAccountLocked() || pinpassword.isAuthenticationVerified());
            }, pinpassword, {
                    pure: true
                });

            pinpassword.isSubmitDisabled = ko.computed(function () {
                return false; //pinpassword.isAuthenticateClicked() ? !pinpassword.isAuthenticationVerified() : false;
            }, pinpassword, {
                    pure: true
                });

            pinpassword.showErrorMessage = ko.computed(function () {
                return !!pinpassword.errorMessage();
            });

            pinpassword.onMpNumberChange = function (newMpNumber, selectedMpNumber) {
                if (newMpNumber !== selectedMpNumber) {
                    if (!pinpassword.isNotAuthenticatedMessageVisible()) {
                        pinpassword.isMpNumberChangeMessageVisible(true);
                    }
                } else {
                    pinpassword.isMpNumberChangeMessageVisible(false);
                }
            };

            pinpassword.checkMpChangeAlert = function (data) {
                if (sessionStorage.applicationMode !== 'search' && sessionStorage.getItem('loyaltyId') && pinpassword.alertMsg() === '' &&
                    data.newMileagePlus() !== sessionStorage.getItem('loyaltyId')) {
                    var activeTabId = sessionStorage.getItem('activeTab');
                    if (appStorage.getItemFromTab('overbookFlightSelected') && sessionStorage.getItem(activeTabId + "-cartSeatObj") != undefined && sessionStorage.getItem(activeTabId + "-cartSeatObj") != '' && sessionStorage.getItem(sessionStorage.getItem('activeTab') + '-selectedPackage')) {
                        pinpassword.alertMsg('Changing the MP# may require a re-price and/or re-shop,<b> including selected overbooked flight(s),bundle(s) and seat assignment(s).</b>');
                    }
                    else if (appStorage.getItemFromTab('overbookFlightSelected') && sessionStorage.getItem(activeTabId + "-cartSeatObj") != undefined && sessionStorage.getItem(activeTabId + "-cartSeatObj") != '' && sessionStorage.getItem(activeTabId + "-cartSeatObj") != '[]') {
                        pinpassword.alertMsg('Changing the MP# may require a re-price and/or re-shop,<b> including selected overbooked flight(s) and seat assignment(s).</b>');
                    }
                    else if (appStorage.getItemFromTab('overbookFlightSelected') && sessionStorage.getItem(sessionStorage.getItem('activeTab') + '-selectedPackage')) {
                        pinpassword.alertMsg('Changing the MP# may require a re-price and/or re-shop<b>  including selected overbooked flight(s) and bundle(s)</b> ');
                    }
                    else {
                        pinpassword.alertMsg(appStorage.error_obj.SHOP_CHANGE_MP_REQ_RESHP);
                    }
                    return false;
                } else {
                    pinpassword.alertMsg('');
                    return true;
                };
            };

            pinpassword.checkForMpDelete = function (data) {
                if (!data.newMileagePlus()) {
                    if (sessionStorage.getItem('MPProfile')) {
                        var oldMpProfile = sessionStorage.getItem('loyaltyId');
                        if (oldMpProfile && data.newMileagePlus() !== oldMpProfile) {
                            return true;
                        }
                    }
                }
                return false;
            };

            pinpassword.checkForMpChange = function (data) {
                pinpassword.checkMpChangeAlert(data);
                if (sessionStorage.mpNumberAuthentication != undefined && (sessionStorage.mpNumberAuthentication == 'new MileagePlus number' || sessionStorage.mpNumberAuthentication != '')) {
                    if (data.newMileagePlus().trim() !== "") {
                        var authenticatedMpArray = JSON.parse(sessionStorage.getItem('AuthenticatedMpNumbers'));
                        if (authenticatedMpArray != null && authenticatedMpArray != '') {
                            var flag = false;
                            for (var k = 0; k < authenticatedMpArray.length; k++) {
                                var isAuthMp = authenticatedMpArray[k];
                                if (isAuthMp && isAuthMp.LoyaltyId == data.newMileagePlus().trim()) {
                                    flag = true;
                                    break;
                                }
                            }
                            if (flag) {
                                $("#authenticateBtnId").prop("disabled", true);
                                $("#authenticateBtnId").attr("disabled", true);
                            } else {
                                $("#authenticateBtnId").prop("disabled", false);
                                $("#authenticateBtnId").removeAttr("disabled", true);
                            }
                        }
                    }
                } else {
                    if (data.newMileagePlus().trim() !== "") {
                        pinpassword.showInvalidMpNumberMessage(false);
                        var selectedMpNumber = "";
                        if (sessionStorage.getItem('MPProfile')) {
                            var oldMpProfile = JSON.parse(sessionStorage.getItem('MPProfile'));
                            var oldMPOwner = oldMpProfile.Travelers.find(t=>t.IsProfileOwner);
                            if(oldMPOwner && oldMPOwner.MileagePlusId!= undefined)
                            {   
 	                          selectedMpNumber = oldMPOwner.MileagePlusId;
 	                        }
                        }
                        pinpassword.onMpNumberChange(selectedMpNumber, data.newMileagePlus());
                        pinpassword.isAuthenticateClicked(false);
                    }
                }
            };

            pinpassword.onChangeMP = function (data) {
                if (data.newMileagePlus().trim() !== "") {
                    if (!validateLoyaltyId(data.newMileagePlus())) {
                        pinpassword.showInvalidMpNumberMessage(true);
                    } else {
                        pinpassword.showInvalidMpNumberMessage(false);
                        var selectedMpNumber = "";
                        if (sessionStorage.getItem('MPProfile')) {
                            var oldMpProfile = JSON.parse(sessionStorage.getItem('MPProfile'));
                            selectedMpNumber = oldMpProfile.loyaltyId;
                        }
                        pinpassword.onMpNumberChange(selectedMpNumber, data.newMileagePlus());
                    }
                }
            };

            pinpassword.onAuthenticateClick = function (data) {
                pinpassword.isAuthenticateClicked(true);
                pinpassword.showInvalidMpNumberMessage(false);
                pinpassword.showForgotSecurityQuestionsMessage(false);
                if (data.newMileagePlus() !== "") {
                    if (!validateLoyaltyId(data.newMileagePlus())) {
                        pinpassword.showInvalidMpNumberMessage(true);
                    }
                }
                pinpassword.respondedQuestionAnswerKeys([]);
                if (!pinpassword.showInvalidMpNumberMessage())
                    beginAuthenticationProcess(data.newMileagePlus());
            };

            pinpassword.onSubmitAnswerClick = function () {
                var questionKey = pinpassword.displayQuestion().key;
                var answerKey = pinpassword.selectedAnswerKey();
                callValidateSecurityAnswerService(questionKey, answerKey);
            };

            pinpassword.onClickMpSearch = function () {
                pinpassword.mode("mpSearch");
            };


            pinpassword.onClickUnlockAccount = function (mpNumber) {
                pinpassword.mpNumber(mpNumber);
                determineLockReasonCodeThenSendEmail();
            };

            pinpassword.onClickForgotPassword = function (mpNumber) {
                pinpassword.mpNumber(mpNumber);
                getEmailIdAndSendEmail(sendForgotPasswordEmail);
            };

            pinpassword.onClickForgotSecurityQuestions = function (mpNumber) {
                pinpassword.mpNumber(mpNumber);
                getEmailIdAndSendEmail(sendResetQuestionsEmail);
                pinpassword.mode("mpNumberEntry");
            };

            pinpassword.onCancelSuspendConfimrationClick = function () {
                pinpassword.showSuspendConfirmation(false);
            };

            pinpassword.onCancelQuestionsClick = function () {
                if (pinpassword.isSecurityQuestionsSetup()) {
                    pinpassword.showSuspendConfirmation(true);
                } else {
                    pinpassword.mode('mpNumberEntry');
                }
            };

            pinpassword.onContinueClick = function () {
                pinpassword.isSubmitClicked(true);
                pinpassword.showInvalidMpNumberMessage(false);
                var loyaltyId = "";
                if (sessionStorage.mpNumberAuthentication != undefined && (sessionStorage.mpNumberAuthentication == 'new MileagePlus number' || sessionStorage.mpNumberAuthentication != '')) {
                    if (sessionStorage.mpNumberAuthentication != 'new MileagePlus number') {
                        loyaltyId = sessionStorage.mpNumberAuthentication;
                    } else {
                        var mpData = JSON.parse(sessionStorage.getItem('isMPAuthenticated'));
                        if (mpData && mpData.LoyaltyId && mpData.isAuth) {
                            loyaltyId = mpData.LoyaltyId;
                        }
                    }

                }
                else if (pinpassword.mpNumber()) {
                    loyaltyId = pinpassword.mpNumber();
                }
                getCustomerInfo(loyaltyId, 'mpAuth');
                getOfferEligibility(loyaltyId);
                if (!pinpassword.showInvalidMpNumberMessage()) {
                    //$('#MPClose')[0].click();
                    //$('.ui-widget-overlay').trigger('click');
                }
                //Fix for EQA Defect TFS ID 347029
                if (pinpassword.isAccountLocked()) {
                    if (angular.element('#disableCheckOut').scope()) {
                        angular.element('#disableCheckOut').scope().disable_check_out();
                    }
                }
                //Fix ends here
                /*if (loyaltyId != sessionStorage.getItem('loyaltyId')) {
                    sessionStorage.setItem('loyaltyId', loyaltyId);
                    sessionStorage.setItem('MPChangeWithAuth', true);
                    $('#MPClose')[0].click();
                }*/
            };

            var checkPostTravelerPage = function () {
                var fsm = window.getShoppingFlowFSM(sessionStorage.getItem("activeTab"));// Replacing static navigation logic with FSM
                if(fsm.states.travelerInformation.valid == true  || fsm.currentState === fsm.states.travelerInformation){
                    return true;
                }
                return false;
            };

            var checkSponsorTravelingStatus = function (data) {

                var mode = sessionStorage.applicationMode,
                    sponsorTraveling = !(pinpassword.isSponsorNotTraveling());

                if (mode === 'search') return true;
                //Sponsor's traveling staus has not changed
                if (initialSponsorTravelStatus === '' || sponsorTraveling === initialSponsorTravelStatus) {
                    return true;
                }
                var isPostTravelPage = checkPostTravelerPage();
                if (isPostTravelPage) { //Post traveler page any change to traveling/non traveling will redirect to search
                    if (pinpassword.reshopWarnMsg() === '' && !sponsorTraveling) {
                        pinpassword.reshopWarnMsg(appStorage.error_obj.LYLTY_CHG_TRVL_OPTION_RESHOP); //'Changing the Traveling/Not Traveling may require a re-price and/or re-shop');
                    } else {
                        pinpassword.reshopWarnMsg('');
                        appStorage.setItemToTab('sponsorTravelAction', 'postTravelerChange-' + pinpassword.isSponsorNotTraveling());
                        //sessionStorage.setItem('sponsorTravelAction', 'postTravelerChange-' + pinpassword.isSponsorNotTraveling());
                        $('.ui-widget-overlay').click();
                        $('#sponsorTravel')[0].click();
                        //sessionStorage.setItem('isSponsorNotTraveling', pinpassword.isSponsorNotTraveling());
                    }
                } else {
                    if (!sponsorTraveling) { //Sponsor's traveling staus has changed from traveling to not traveling
                        appStorage.setItemToTab('sponsorTravelAction', 'confirmModal-' + pinpassword.isSponsorNotTraveling());
                    } else { //Sponsor's traveling staus has changed from not traveling to traveling
                        appStorage.setItemToTab('sponsorTravelAction', 'redirectToSearch-' + pinpassword.isSponsorNotTraveling());
                    };
                    $('.ui-widget-overlay').click();
                    $('#sponsorTravel')[0].click();
                }
                return false;
            };

            pinpassword.onSubmitClick = function (data) {
                //removing extra spaces for the MP if any 
                data.newMileagePlus(data.newMileagePlus().trim());
                //end
                if (pinpassword.checkMpChangeAlert(data) && checkSponsorTravelingStatus(data)) { //This function checks if MP number is changed after search page and warns user for reshop
                    pinpassword.isSubmitClicked(true);
                    pinpassword.showInvalidMpNumberMessage(false);
                    if (data.newMileagePlus() !== "") {
                        if (!validateLoyaltyId(data.newMileagePlus())) {
                            pinpassword.showInvalidMpNumberMessage(true);
                        }
                    } else {
                        sessionStorage.setItem('loyaltyId', data.newMileagePlus());
                        window.shoppingFlowFSMs[sessionStorage.activeTab].data.loyaltyId(data.newMileagePlus());
                        window.shoppingFlowFSMs[sessionStorage.activeTab].data.ptcListUpdated(true);
                        $('#MPDelete')[0].click();
                        return;
                    }
                    getCustomerInfo(data.newMileagePlus(), "submit");
                    sessionStorage.removeItem("updateCardOfferRequest");
                    sessionStorage.removeItem("mpOfferCard");
                    getOfferEligibility(data.newMileagePlus());
                    if (!pinpassword.showInvalidMpNumberMessage()) {
                        sessionStorage.setItem('loyaltyId', data.newMileagePlus());
                        window.shoppingFlowFSMs[sessionStorage.activeTab].data.loyaltyId(data.newMileagePlus());
                        window.shoppingFlowFSMs[sessionStorage.activeTab].data.ptcListUpdated(true);
                    }
                }

                //Deleting Timatic data when we change an MP
                sessionStorage.setItem(sessionStorage.activeTab + "-timaticDataReset", true);

                //Reset Etc Data
                window.shoppingFlowFSMs[sessionStorage.activeTab].data.resetRetrievedEtc();

                //assigning a variable to see if the Mp is changed on payment page
                var currentState = window.shoppingFlowFSMs[sessionStorage.activeTab].currentState.name;
                if (currentState === "Payment") {
                    sessionStorage.setItem(sessionStorage.activeTab + "-MpChangedOnPaymentPage", true);
                }
                sessionStorage.setItem("mpOfferCard", '');
            };

            pinpassword.storeMPForTicketing = function (mpNumber, holderName) {
                sessionStorage.getItem('MPNumbers') ? (function () {
                    var localMPnumbers = JSON.parse(sessionStorage.getItem('MPNumbers'));
                    localMPnumbers && localMPnumbers.length > 0 ? (function () {
                        var isExist = false;
                        for (var index = 0; index < localMPnumbers.length; index++) {
                            if (localMPnumbers[0].loyaltyID === mpNumber) {
                                isExist = true;
                            }
                        }
                        if (!isExist) {
                            localMPnumbers.push({
                                "loyaltyID": mpNumber,
                                "holderName": holderName
                            });
                            sessionStorage.setItem("MPNumbers", JSON.stringify(localMPnumbers));
                        }

                    })() : (function () {
                        localMPnumbers = [{
                            "loyaltyID": mpNumber,
                            "holderName": holderName
                        }];
                        sessionStorage.setItem('MPNumbers', JSON.stringify(localMPnumbers));
                    })();
                })() : (function () {
                    console.log("setting Data");
                    sessionStorage.setItem('MPNumbers', JSON.stringify([{
                        "loyaltyID": mpNumber,
                        "holderName": holderName
                    }]));
                })();
                var ticketCtrl = angular.element('#mpList').scope();
                if (ticketCtrl)
                    ticketCtrl.$parent.updateMpList();
            };

            pinpassword.isAlreadyAuthenticated = function () {
                var isAlreadyAuthenticated = false;
                var mpData = JSON.parse(sessionStorage.getItem('MPProfile'));
                if (mpData) {
                    isAlreadyAuthenticated = true;
                }
                return isAlreadyAuthenticated;
            };

            pinpassword.getMode = function () {
                var mode = sessionStorage.getItem('applicationMode');
                return mode;
            };

            pinpassword.changeMpYes = function (data) {
                var mpNumber = data.newMileagePlus();
                pinpassword.showInvalidMpNumberMessage(false);
                pinpassword.isChangeMp(true);
                sessionStorage.setItem('isChangeMp', true)
                pinpassword.init(mpNumber);
            };

            pinpassword.cancelMpModal = function () {
                if (pinpassword.reshopWarnMsg() !== '') {
                    pinpassword.reshopWarnMsg('');
                    return;
                }
                $('#MPCancel')[0].click();
                $('.ui-widget-overlay').trigger('click');
            };

            pinpassword.init = function (mpNumber) {
                pinpassword.mode('mpNumberEntry');
                pinpassword.spinner = ko.observable(false);
                pinpassword.isAuthenticateClicked(false);
                pinpassword.isAuthenticated(false);
                pinpassword.isAccountClosed(false);
                pinpassword.isAccountLocked(false);
                pinpassword.isAuthenticationVerified(false);
                pinpassword.isMpNumberChangeMessageVisible(false);
                pinpassword.showSuspendConfirmation(false);
                pinpassword.showEmailSentMessage(false);
                pinpassword.showEmailFailedMessage(false);
                pinpassword.selectedAnswerKey(null);
                pinpassword.securityQuestions([]);
                pinpassword.displayQuestion(null);
                pinpassword.incorrectAnswerCount(0);
                pinpassword.correctAnswerCount(0);
                pinpassword.showForgotSecurityQuestionsMessage(false);
                pinpassword.showInvalidMpNumberMessage(false);
                clearErrorMessage();
                if (sessionStorage.mpNumberAuthentication != undefined && (sessionStorage.mpNumberAuthentication == 'new MileagePlus number' || sessionStorage.mpNumberAuthentication != '')) {
                    pinpassword.hasInitMpValueFlag(true);
                    window.setTimeout(function () {
                        if (sessionStorage.mpNumberAuthentication == 'new MileagePlus number') {
                            $("#mpNumberId").val("");
                        } else {
                            $("#mpNumberId").val(sessionStorage.mpNumberAuthentication);
                        }
                    }, 500)
                    //sessionStorage.travelBankSelectedMpNumber = '';
                } else {
                    var loyaltyId = sessionStorage.getItem('loyaltyId');
                    var isAwardEnabled = sessionStorage.getItem('isAwardEnabled') != null? JSON.parse(sessionStorage.getItem('isAwardEnabled')):false;
                    if( loyaltyId  ||  isAwardEnabled){
                        pinpassword.hasInitMpValueFlag(true);
                    }else{
                        pinpassword.hasInitMpValueFlag(false);
                    }
                    sessionStorage.setItem('isAwardEnabled',false);
                    if (sessionStorage.getItem('isMPAuthenticated')) {
                        var mpAuthverified = JSON.parse(sessionStorage.getItem('isMPAuthenticated'));
                        if (mpAuthverified.LoyaltyId == loyaltyId) {
                            pinpassword.isAuthenticationVerified(mpAuthverified.isAuth);
                        }
                    }
                    var loyalty = JSON.parse(sessionStorage.getItem('loyalty'));
                    if (loyalty) {
                        if (loyalty.id === loyaltyId) {
                            if (loyalty.code === 'LK') {
                                pinpassword.isAccountLocked(true);
                            } else if (loyalty.code === 'CC') {
                                pinpassword.isAccountClosed(true);
                            }
                        }
                    }
                }
                if (sessionStorage.getItem('fromEZR') === 'true') {
                    pinpassword.onSubmitClick(pinpasswordApp.myHeader.model);
                }
                pinpassword.mpprofile([]);
                if (mpNumber && pinpassword.isOn()) {
                    beginAuthenticationProcess(mpNumber);
                }
            };

            //PRIVATE METHODS - START
            function beginAuthenticationProcess(mpNumber) {
                pinpassword.mpNumber(mpNumber);
                pinpassword.isMpNumberChangeMessageVisible(false);
                pinpassword.isAuthenticationVerified(false);
                pinpassword.isAuthenticationNeeded(false);
                pinpassword.isAccountLocked(false);
                pinpassword.isAccountClosed(false);
                getCustomerIdThenFindSession();
            }

            function validateLoyaltyId(inputStr) {
                var regex = /^[a-zA-Z0-9]{1,15}$/;
                return regex.test(inputStr);
            }

            function getLoginData() {
                var loginData = sessionStorage.getItem("loginDetails");
                loginData = angular.fromJson(loginData);
                return loginData;
            };


            function getOfferEligibility(mpNumber) {
                var tsTrackerId = appStorage.getTSForTrackingID(true);
                var loginDetails = JSON.parse(sessionStorage.getItem("loginDetails"));
                var request = {
                    AAA: loginDetails.aaa.toUpperCase(),
                    LoyaltyId: mpNumber,
                    TrackingId: tsTrackerId// sessionStorage.trackerId
                };
                cc.services.offerEligibility.request(request,
                    function (response) {
                        window.shoppingFlowFSMs[sessionStorage.activeTab].data.offerEligibility({
                            isEligibleforCardOffers: response.isEligibleforCardOffers,
                            isChaseCustomer: response.isChaseCustomer
                        });
                    },
                    function (response) {
                        var x = response;
                    }
                );
            }

            function getCustomerInfo(mpNumber, source) {
                var tsTrackerId = appStorage.getTSForTrackingID(true);
                pinpassword.mpNumber(mpNumber.toUpperCase());
                var request = {
                    "LoyaltyId": mpNumber,
                    "DataToLoad": ["AllTravelerData"],
                    "TrackingId": tsTrackerId// sessionStorage.trackerId
                };
                cc.services.getMPProfile.request(
                    request,
                    function (response) {
                        var errors = response.Errors;
                        if (typeof (errors) != 'undefined' && errors.length == 0) {
                            pinpassword.showInvalidMpNumberMessage(false);
                            pinpassword.isAuthenticationVerified(false);
                            getCustomerSubscriptions(mpNumber, response, source);
                        } 
                    },
                    function (message, errors) {
                        var msg = '';
                        if (errors && errors.MajorDescription) {
                            msg = errors.MajorDescription;
                        };
                        if (!msg || msg == '') msg = message;
                        setErrorMessage(retrunErrMsgWithTrackingID(tsTrackerId, msg));
                    }
                );
            }

            function getCustomerSubscriptions(mpNumber, getMPProfileResponse, source) {
                var tsTrackerId = appStorage.getTSForTrackingID(true);
                var loginparams = getLocalLoginParams();
                var request = {
                    "CountryCode": "US",
                    "CurrencyCode": "USD",
                    "Filter": {
                        "Statuses": [1]
                    },
                    "LoyaltyProgramMemberID": mpNumber,
                    "Requester": {
                        "Requestor": {
                            "ChannelID": "801",
                            "ChannelName": "CPS",
                            "LanguageCode": "enUS"
                        }
                    },
                    "TicketingCountryCode": "US",
                    "Token":loginparams.token,
                    "TrackingId": tsTrackerId,
                    "workStationId": loginparams.workstationId,
                };

                var MPSubscription = {
                    'Subscriptions' : []
                };
    
                cc.services.getMPSubscriptions.request(
                    request,
                    function (response) {
                        var errors = response.ErrorMessage;
                        var errorResponse = response.isErrorResponse;
                        if (!errorResponse) {
                            MPSubscription.Subscriptions = response.Subscriptions.length > 0 ? response.Subscriptions : [];
                            console.log(response, "Subscription API");
                            var profileData = getMPProfileResponse.Profiles[0];
                            var profileOwner;
                            if(profileData.Travelers.length > 0) {
                                profileOwner = profileData.Travelers.filter(function(traveler) {
                                    return traveler.IsProfileOwner;
                                });
                            }
                            
                            profileOwner[0].MPSubscription = MPSubscription;                            
                        }
                        setMpProfileData(mpNumber, getMPProfileResponse, source);
                    },
                    function (message, errors) {
                        setMpProfileData(mpNumber, getMPProfileResponse, source);                        
                        var msg = '';
                        if (errors) {
                            msg = errors;
                        };
                        if (!msg || msg == '') msg = message;
                        setErrorMessage(retrunErrMsgWithTrackingID(tsTrackerId, msg));
                    }
                );
            }

            function setMpProfileData(mpNumber, response, source) {
                var profileData = response.Profiles[0];
                var updatedOVB = { oldGSmember: '', isUpdated: false, isGSMember: false };
                pinpassword.customerId(response.Profiles[0].CustomerId);
                if (sessionStorage.mpNumberAuthentication != undefined && sessionStorage.mpNumberAuthentication !== 'new MileagePlus number') {
                    sessionStorage.setItem('MPProfileForInfo', JSON.stringify(profileData));
                }
                sessionStorage.setItem('MPProfile', JSON.stringify(profileData));
                window.shoppingFlowFSMs[sessionStorage.activeTab].data.sponsorProfile(profileData);
                //var mpProfileDetails = JSON.parse(sessionStorage.MPProfile);
                var ownerProfileLevel = profileData.Travelers.find(function (traveler) {
                    return traveler.IsProfileOwner
                });
                var savedProfileDataLS = appStorage.getItemFromTab('profileDataForInsuff'); 
                if (!savedProfileDataLS) {
                    var savedProfileData = { id: '', profileData: '' };
                    savedProfileData.id = mpNumber;
                    savedProfileData.profileData = JSON.stringify(profileData);
                    appStorage.setItemToTab('profileDataForInsuff', savedProfileData);
                }
                var updatedOVBLS = appStorage.getItemFromTab('updatedOVB');// sessionStorage.updatedOVB;
                if (ownerProfileLevel && ownerProfileLevel.MileagePlus && ownerProfileLevel.MileagePlus.CurrentEliteLevel === 5) {
                    if (updatedOVBLS && updatedOVBLS.oldGSmember !== mpNumber) {
                        updatedOVB.isUpdated = true;
                    }
                    updatedOVB.isGSMember = true;
                    updatedOVB.oldGSmember = !updatedOVB.isUpdated ? mpNumber : updatedOVBLS.oldGSmember;
                }
                //sessionStorage.updatedOVB = JSON.stringify(updatedOVB);
                appStorage.setItemToTab("updatedOVB", updatedOVB);
                appStorage.setItemToTab("mpCurrentEliteLevel", ownerProfileLevel.MileagePlus.CurrentEliteLevel);
                findSessionOnly();
                if (pinpassword.isAuthenticationVerified()) {
                    var isAuth = {
                        "LoyaltyId": mpNumber,
                        "isAuth": pinpassword.isAuthenticationVerified()
                    };
                    sessionStorage.setItem('isMPAuthenticated', JSON.stringify(isAuth));
                    window.shoppingFlowFSMs[sessionStorage.activeTab].data.isMPAuthenticated(isAuth);
                    if (sessionStorage.getItem('AuthenticatedMpNumbers') != undefined) {
                        var authenticatedMpArray = JSON.parse(sessionStorage.getItem('AuthenticatedMpNumbers'));
                        authenticatedMpArray.push(isAuth);
                        sessionStorage.setItem('AuthenticatedMpNumbers', JSON.stringify(authenticatedMpArray));
                    } else {
                        var authenticatedMpArray = [];
                        authenticatedMpArray.push(isAuth);
                        sessionStorage.setItem('AuthenticatedMpNumbers', JSON.stringify(authenticatedMpArray));
                    }
                } else {
                    var isAuth = {
                        "LoyaltyId": mpNumber,
                        "isAuth": pinpassword.isAuthenticationVerified()
                    };
                    sessionStorage.setItem('isMPAuthenticated', JSON.stringify(isAuth));
                    window.shoppingFlowFSMs[sessionStorage.activeTab].data.isMPAuthenticated(isAuth);
                }
                console.log("moProfile", profileData);
                pinpassword.storeMPForTicketing(profileData.Travelers[0].MileagePlusId, profileData.Travelers[0].CustomerName);
                sessionStorage.setItem('isSponsorNotTraveling', pinpassword.isSponsorNotTraveling());
                window.shoppingFlowFSMs[sessionStorage.activeTab].data.isSponsorNotTraveling(pinpassword.isSponsorNotTraveling());
                if (sessionStorage.mpNumberAuthentication != undefined && (sessionStorage.mpNumberAuthentication == 'new MileagePlus number' || sessionStorage.mpNumberAuthentication != '')) {
                    $('.ui-widget-overlay').trigger('click');
                } else {
                    if (source === 'mpAuth' && mpNumber != sessionStorage.getItem('loyaltyId')) {
                        sessionStorage.setItem('loyaltyId', mpNumber);
                        sessionStorage.setItem('MPChangeWithAuth', true);
                        window.shoppingFlowFSMs[sessionStorage.activeTab].data.loyaltyId(mpNumber);
                        $('#MPClose')[0].click();
                    } else {
                        $('#MPClose')[0].click();
                    }
                }
            
            }

            var getLocalLoginParams = function () {
                var loginParams = {};
                loginParams.token = sessionStorage.getItem('token');
                loginParams.workstationId = sessionStorage.getItem('workStationId');
                loginParams.trackingId = sessionStorage.getItem('trackerId');
                loginParams.cartId = appStorage.getItemFromTab('cartId');
                return loginParams
            };

            function findSessionOnly() {
                var tsTrackerId = appStorage.getTSForTrackingID(true);
                var request = {
                    "CustomerId": pinpassword.customerId(),
                    "TrackingId": tsTrackerId//sessionStorage.trackerId
                };
                cc.services.findSession.request(
                    request,
                    function (response) {
                        var tokenInfoSet = response.TokenInfoSet;

                        if (tokenInfoSet && tokenInfoSet.length > 0) {
                            //var filteredTokens = getFilteredTokens()
                            var tokenId = tokenInfoSet[0].TokenId;
                            pinpassword.authToken(tokenId);
                            getStates(tokenId);
                            if (pinpassword.isAuthenticationVerified()) {
                                var isAuth = {
                                    "LoyaltyId": pinpassword.mpNumber(),
                                    "isAuth": pinpassword.isAuthenticationVerified()
                                };
                                sessionStorage.setItem('isMPAuthenticated', JSON.stringify(isAuth));
                                if (sessionStorage.getItem('AuthenticatedMpNumbers') != undefined) {
                                    var authenticatedMpArray = JSON.parse(sessionStorage.getItem('AuthenticatedMpNumbers'));
                                    authenticatedMpArray.push(isAuth);
                                    sessionStorage.setItem('AuthenticatedMpNumbers', JSON.stringify(authenticatedMpArray));
                                } else {
                                    var authenticatedMpArray = [];
                                    authenticatedMpArray.push(isAuth);
                                    sessionStorage.setItem('AuthenticatedMpNumbers', JSON.stringify(authenticatedMpArray));
                                }
                            }
                        } else {
                            pinpassword.authToken('');
                            pinpassword.isAuthenticationNeeded(true);
                            createAnonymousTokenAndAskQuestions();
                        }
                    },
                    function (response) {
                        pinpassword.authToken('');
                    }
                );
            }

            function getCustomerIdThenFindSession() {
                var tsTrackerId = appStorage.getTSForTrackingID(true);
                var request = {
                    "LoyaltyId": pinpassword.mpNumber(),
                    "DataToLoad": ["AllTravelerData"],
                    "TrackingId": tsTrackerId// sessionStorage.trackerId
                };
                cc.services.getMPProfile.request(
                    request,
                    function (response) {
                        var errors = response.Errors;
                        if (typeof (errors) != 'undefined' && errors.length == 0) {
                            pinpassword.showInvalidMpNumberMessage(false);
                            pinpassword.customerId(response.Profiles[0].CustomerId);
                            var profileData = response.Profiles[0];
                            var profileOwnerData = profileData.Travelers.filter(function (data) {
                                return data.IsProfileOwner == true;
                            });
                            if (profileOwnerData && profileOwnerData.length > 0) {
                                pinpassword.profileOwnerName(profileOwnerData[0].CustomerName);
                            }
                            findSession();
                            if (pinpassword.isAuthenticationVerified()) {
                                if (sessionStorage.mpNumberAuthentication != undefined && sessionStorage.mpNumberAuthentication !== 'new MileagePlus number') {
                                    sessionStorage.setItem('MPProfileForInfo', JSON.stringify(profileData));
                                }
                                sessionStorage.setItem('MPProfile', JSON.stringify(profileData));
                                var isAuth = {
                                    "LoyaltyId": pinpassword.mpNumber(),
                                    "isAuth": pinpassword.isAuthenticationVerified()
                                };
                                sessionStorage.setItem('isMPAuthenticated', JSON.stringify(isAuth));
                                if (sessionStorage.getItem('AuthenticatedMpNumbers') != undefined) {
                                    var authenticatedMpArray = JSON.parse(sessionStorage.getItem('AuthenticatedMpNumbers'));
                                    authenticatedMpArray.push(isAuth);
                                    sessionStorage.setItem('AuthenticatedMpNumbers', JSON.stringify(authenticatedMpArray));
                                } else {
                                    var authenticatedMpArray = [];
                                    authenticatedMpArray.push(isAuth);
                                    sessionStorage.setItem('AuthenticatedMpNumbers', JSON.stringify(authenticatedMpArray));
                                }
                                //$('#MPClose')[0].click();                               
                            }
                        } else {
                            var errMsg = appStorage.error_obj.UN_EXP_SYS_ERR;;
                            if (errors[0]) {
                                errMsg = errors[0].MajorDescription ? errors[0].MajorDescription : response.Message;
                            };
                            //callSendErrorEmail(tsTrackerId);//sessionStorage.getItem('trackerId'));//addServiceNameAndTrackingId('GetMPProfile-', 'TEST'));
                            setErrorMessage(retrunErrMsgWithTrackingID(tsTrackerId, msg));
                        }
                    },
                    function (message, errors) {
                        var msg = '';
                        if (errors && errors.MajorDescription) {
                            msg = errors.MajorDescription;
                        };
                        if (!msg || msg == '') msg = message;
                        //callSendErrorEmail(tsTrackerId); //sessionStorage.getItem('trackerId'));//addServiceNameAndTrackingId('GetMPProfile-', 'TEST'));
                        // setErrorMessage(msg + '. Tracking id : ' + sessionStorage.getItem('trackerId'));
                        setErrorMessage(retrunErrMsgWithTrackingID(tsTrackerId, msg));
                    }
                );
            }

            function getEmailIdAndSendEmail(emailService) {
                var tsTrackerId = appStorage.getTSForTrackingID(true);
                var request = {
                    "LoyaltyId": pinpassword.mpNumber(),
                    "DataToLoad": ["AllTravelerData"],
                    "TrackingId": tsTrackerId//sessionStorage.trackerId
                };
                cc.services.getMPProfile.request(
                    request,
                    function (response) {
                        var owner = response.Profiles[0].Travelers.find(function (traveler) {
                            return !!traveler.IsProfileOwner;
                        });
                        var emailAddressObject = owner ? owner.EmailAddresses.find(function (emailAddress) {
                            return !!emailAddress.IsPrimary && emailAddress.EmailAddress;
                        }) || owner.EmailAddresses.find(function (emailAddress) {
                            return !!emailAddress.EmailAddress;
                        }) : null;

                        var emailId = emailAddressObject ? emailAddressObject.EmailAddress : null;
                        if (emailId) {
                            emailService(emailId);
                        }
                    },
                    function (message, errors) {
                        var msg = '';
                        if (errors && errors.Message) {
                            msg = errors.Message;
                        };
                        if (!msg || msg == '') msg = message;
                        //callSendErrorEmail(tsTrackerId); //sessionStorage.getItem('trackerId'));//addServiceNameAndTrackingId('GetMPProfile-', 'TEST'));
                        //setErrorMessage(msg + '. Tracking id : ' + sessionStorage.getItem('trackerId'));
                        //setErrorMessage(addTrackingIDToErrMsg('ShopSelect-', 'TEST', msg));
                        setErrorMessage(retrunErrMsgWithTrackingID(tsTrackerId, msg));
                    }
                );
            }

            var callSendErrorEmail = function (key) {
                /* var reqObj = {};
                 reqObj.tokenAndUniqueID = key;
                 cc.services.sendErrEmail.request(reqObj, function (resp) { console.log("Email sent successfully"); },
                    function (message, data, errors, resp) { console.log("Email sent failed"); });
                    */
            };

            var addServiceNameAndTrackingId = function (serviceName, trackingID) {
                var outputStr;
                if (serviceName && trackingID) {
                    outputStr = serviceName + "-" + trackingID;
                }
                return outputStr;
            };

            var addTrackingIDToErrMsg = function (serviceName, trackingID, errMsg) {
                if (trackingID) {
                    errMsg = errMsg + ": Tracking ID :" + addServiceNameAndTrackingId(serviceName, trackingID);
                }
                return errMsg;
            };

            var retrunErrMsgWithTrackingID = function (trackingIdwithTS, errMsg) {
                errMsg = errMsg + "- Tracking ID :" + trackingIdwithTS; // sessionStorage.trackerId;
                return errMsg;
            };

            function findSession() {
                var tsTrackerId = appStorage.getTSForTrackingID(true);
                var request = {
                    "CustomerId": pinpassword.customerId(),
                    "TrackingId": tsTrackerId // sessionStorage.trackerId
                };
                cc.services.findSession.request(
                    request,
                    function (response) {
                        clearErrorMessage();
                        var tokenInfoSet = response.TokenInfoSet;
                        if (tokenInfoSet && tokenInfoSet.length > 0) {
                            var tokenId = tokenInfoSet[0].TokenId;
                            pinpassword.authToken(tokenId);
                            getStates(tokenId);
                            if (pinpassword.isAuthenticationVerified()) {
                                var isAuth = {
                                    "LoyaltyId": pinpassword.mpNumber(),
                                    "isAuth": pinpassword.isAuthenticationVerified()
                                };
                                sessionStorage.setItem('isMPAuthenticated', JSON.stringify(isAuth));
                                if (sessionStorage.getItem('AuthenticatedMpNumbers') != undefined) {
                                    var authenticatedMpArray = JSON.parse(sessionStorage.getItem('AuthenticatedMpNumbers'));
                                    authenticatedMpArray.push(isAuth);
                                    sessionStorage.setItem('AuthenticatedMpNumbers', JSON.stringify(authenticatedMpArray));
                                } else {
                                    var authenticatedMpArray = [];
                                    authenticatedMpArray.push(isAuth);
                                    sessionStorage.setItem('AuthenticatedMpNumbers', JSON.stringify(authenticatedMpArray));
                                }
                                //$('#MPClose')[0].click();
                            }
                        } else {
                            pinpassword.authToken('');
                            pinpassword.isAuthenticationNeeded(true);
                            createAnonymousTokenAndAskQuestions();
                        }
                    },
                    function (response) {
                        //setErrorMessage("Unable to find sessions");                       
                        setErrorMessage(retrunErrMsgWithTrackingID(tsTrackerId, appStorage.error_obj.LYLTY_UNABLE_FND_SESSION));
                        pinpassword.authToken('');
                        // callSendErrorEmail(tsTrackerId);;//sessionStorage.getItem('trackerId'));
                    }
                );
            }

            function createAnonymousTokenAndAskQuestions() {
                var request = {};
                //Note :- No Tracking ID passed in the request as this is a GET request with NO palceholder to consider Tracking ID
                cc.services.acquireAnonymousToken.request(
                    request,
                    function (response) {
                        clearErrorMessage();
                        pinpassword.anonymousToken(response.Token);
                        getSavedSecurityQuestions();
                    },
                    function (response) {
                        //setErrorMessage("Unable to acquire anonymous token. Please try again later");
                        //setErrorMessage(retrunErrMsgWithTrackingID(appStorage.error_obj.LYLTY_UNABLE_ACQ_TOKEN));
                        setErrorMessage(addTrackingIDToErrMsg('AcquireAnonymousToken', (sessionStorage.workStationId + "-" + sessionStorage.token), appStorage.error_obj.LYLTY_UNABLE_ACQ_TOKEN));
                        //callSendErrorEmail(tsTrackerId);//sessionStorage.getItem('trackerId'));
                    }
                );
            }

            function getStates(tokenId) {
                //Note :- No Tracking ID passed in the request as this is a GET request with NO palceholder to consider Tracking ID

                var request = {
                    "token": tokenId
                };
                cc.services.getCustomerTokenState.request(
                    request,
                    function (response) {
                        clearErrorMessage();
                        var tokenState = response.Items.find(function (item) {
                            return item.Code === 'TOKEN_CODE' && item.Value !== '';
                        });
                        var loyaltyState = response.Items.find(function (item) {
                            return item.Code === 'LOYALTY_CODE' && item.Value !== '';
                        });
                        var tokenCode = tokenState ? tokenState.Value : '';
                        var loyaltyCode = loyaltyState ? loyaltyState.Value : '';

                        if (isAccountLocked(loyaltyCode)) {
                            pinpassword.isAccountLocked(true);
                        } else if (isAccountClosed(loyaltyCode)) {
                            pinpassword.isAccountClosed(true);
                        }
                        if (isAuthenticationVerified(tokenCode, loyaltyCode)) {
                            pinpassword.isAuthenticationVerified(true);
                            if (sessionStorage.getItem('loyaltyId')) {
                                var loyaltyId = sessionStorage.getItem('loyaltyId');
                                var isAuth = {
                                    "LoyaltyId": pinpassword.mpNumber(),
                                    "isAuth": true
                                };
                                sessionStorage.setItem('isMPAuthenticated', JSON.stringify(isAuth));
                                if (sessionStorage.getItem('AuthenticatedMpNumbers') != undefined) {
                                    var authenticatedMpArray = JSON.parse(sessionStorage.getItem('AuthenticatedMpNumbers'));
                                    authenticatedMpArray.push(isAuth);
                                    sessionStorage.setItem('AuthenticatedMpNumbers', JSON.stringify(authenticatedMpArray));
                                } else {
                                    var authenticatedMpArray = [];
                                    authenticatedMpArray.push(isAuth);
                                    sessionStorage.setItem('AuthenticatedMpNumbers', JSON.stringify(authenticatedMpArray));
                                }
                            }
                            if (pinpassword.isSubmitClicked()) {
                                if (sessionStorage.mpNumberAuthentication != undefined && (sessionStorage.mpNumberAuthentication == 'new MileagePlus number' || sessionStorage.mpNumberAuthentication != '')) {
                                    $('.ui-widget-overlay').trigger('click');
                                } else {
                                    $('#MpAuthStatus')[0].click();

                                }
                            }
                        } else if (isAuthenticationNeeded(tokenCode, loyaltyCode)) {
                            pinpassword.isAuthenticationNeeded(true);
                            createAnonymousTokenAndAskQuestions();
                        }
                        setMpLoyaltyCodeInsessionStorage(loyaltyCode);
                    },
                    function (response) {
                        //setErrorMessage("Unable to get token state. Please try again later");
                        setErrorMessage(addTrackingIDToErrMsg('GetStates', (sessionStorage.workStationId + "-" + sessionStorage.token), appStorage.error_obj.LYLTY_UNABLE_GET_TOKEN));
                        // callSendErrorEmail(addServiceNameAndTrackingId('GetStates-', (sessionStorage.workStationId + "-" + sessionStorage.token)));
                    }
                );
            }

            function isAccountLocked(loyaltyCode) {
                return loyaltyCode === 'LK';
            }

            function isAccountClosed(loyaltyCode) {
                return loyaltyCode === 'CT' || loyaltyCode === 'CC' || loyaltyCode === 'CF';
            }

            function isAuthenticationVerified(tokenCode, loyaltyCode) {
                return (tokenCode === 'PA' || tokenCode === 'PM' || tokenCode === 'QA' || tokenCode === 'QM') &&
                    (loyaltyCode === 'VA' || loyaltyCode === 'VS' || loyaltyCode === 'VI' || loyaltyCode === 'VL');

            }

            function isAuthenticationNeeded(tokenCode, loyaltyCode) {
                return (tokenCode === 'PF' || tokenCode === 'PS' || tokenCode === 'QF' || tokenCode === 'TT' || tokenCode === '') &&
                    (loyaltyCode === 'VS' || loyaltyCode === 'VL' || loyaltyCode === 'VI' || loyaltyCode === 'VA' || loyaltyCode === '');
            }

            function setState(tokenState) {
                var tsTrackerId = appStorage.getTSForTrackingID(true);
                var request = {
                    "TrackingId": tsTrackerId, //sessionStorage.trackerId,
                    "token": pinpassword.authToken(),
                    "Items": [{
                        "Code": "customerid",
                        "Genre": {
                            "Key": "STATE_TYPE",
                            "Value": "CLAIM"
                        },
                        "Value": pinpassword.customerId()
                    }, {
                        "Code": "TOKEN_CODE",
                        "Genre": {
                            "Key": "STATE_TYPE",
                            "Value": "TOKEN"
                        },
                        "Value": tokenState
                    }]
                };
                cc.services.setCustomerTokenState.request(
                    request,
                    function (response) {
                        clearErrorMessage();
                        var tokenState = response.Items.find(function (item) {
                            return item.Code === 'TOKEN_CODE';
                        });
                        if (tokenState && tokenState.Value === 'QA') {
                            pinpassword.isAuthenticationVerified(true);
                        } else if (tokenState && tokenState.Value === 'QF') {
                            lockAccountAndUpdateTfaFlag();
                        }
                    },
                    function (response) {
                        //setErrorMessage("Unable to set token state. Please try again later");
                        setErrorMessage(retrunErrMsgWithTrackingID(tsTrackerId, appStorage.error_obj.LYLTY_UNABLE_SET_TOKEN));
                        //callSendErrorEmail(tsTrackerId);//sessionStorage.trackerId);
                    }
                );
            }

            function convertAnonymousTokenIntoAuthTokenAndSetStates(tokenState) {
                var tsTrackerId = appStorage.getTSForTrackingID(true);
                var request = {
                    "TrackingId": tsTrackerId,// sessionStorage.trackerId,
                    "AnonToken": pinpassword.anonymousToken(),
                    "MileagePlusId": pinpassword.mpNumber(),
                    "QACount": pinpassword.respondedQuestionAnswerKeys().length,
                    "QAKeys": pinpassword.respondedQuestionAnswerKeys().map(function (qa) {
                        return {
                            QuestionKey: qa.questionKey,
                            AnswerKey: qa.answerKey
                        };
                    })
                };
                cc.services.acquireAuthenticatedToken.request(
                    request,
                    function (response) {
                        clearErrorMessage();
                        pinpassword.authToken(response.Status ? response.AuthToken : pinpassword.anonymousToken());
                        setState(tokenState);
                    },
                    function (response) {
                        //setErrorMessage("Unable to acquire auth token. Please try again later");
                        setErrorMessage(retrunErrMsgWithTrackingID(tsTrackerId, appStorage.error_obj.LYLTY_UNABLE_AUTH_TOKEN));
                        //callSendErrorEmail(tsTrackerId);//sessionStorage.trackerId);
                    }
                );
            }

            function callValidateSecurityAnswerService(questionKey, answerKey) {
                var tsTrackerId = appStorage.getTSForTrackingID(true);
                var request = {
                    "TrackingId": tsTrackerId, //sessionStorage.trackerId,
                    "AnswerKey": answerKey,
                    "MileagePlusId": pinpassword.mpNumber(),
                    "QuestionKey": questionKey,
                    "IsFirstAnswer": pinpassword.displayQuestion().sequenceNumber === 1
                };
                cc.services.validateSecurityAnswer.request(
                    request,
                    function (response) {
                        if (!!response.ExceptionMessage) {
                            //setErrorMessage("Unable to validate security answer. Please try again later");
                            setErrorMessage(retrunErrMsgWithTrackingID(tsTrackerId, appStorage.error_obj.LYLTY_UNABLE_VALIDATE_SECQA));
                            //callSendErrorEmail(tsTrackerId);//sessionStorage.trackerId);
                            return;
                        } else {
                            clearErrorMessage();
                        }

                        if (response.CorrectAnswer) {
                            pinpassword.correctAnswerCount(pinpassword.correctAnswerCount() + 1);
                            pinpassword.respondedQuestionAnswerKeys().push({
                                questionKey: questionKey,
                                answerKey: answerKey
                            });
                        } else {
                            pinpassword.incorrectAnswerCount(pinpassword.incorrectAnswerCount() + 1);
                            pinpassword.respondedQuestionAnswerKeys().push({
                                questionKey: questionKey,
                                answerKey: answerKey
                            });
                        }

                        if (pinpassword.correctAnswerCount() >= 2 || pinpassword.incorrectAnswerCount() >= 2) {
                            setObservablesAfterAuthenticationProcess(pinpassword.correctAnswerCount() >= 2)
                        } else if (pinpassword.displayQuestion().sequenceNumber < 3) {
                            displayNextQuestion();
                            pinpassword.selectedAnswerKey(null);
                        }
                    },
                    function (response) {
                        //setErrorMessage("Unable to validate security answer. Please try again later");
                        setErrorMessage(retrunErrMsgWithTrackingID(tsTrackerId, appStorage.error_obj.LYLTY_UNABLE_VALIDATE_SECQA));
                        //callSendErrorEmail(tsTrackerId); //sessionStorage.trackerId);
                    });
            }

            function setObservablesAfterAuthenticationProcess(isAuthenticationPassed) {
                if (isAuthenticationPassed) {
                    var isAuth = {
                        "LoyaltyId": pinpassword.mpNumber(),
                        "isAuth": isAuthenticationPassed
                    };
                    sessionStorage.setItem('isMPAuthenticated', JSON.stringify(isAuth));
                    if (sessionStorage.getItem('AuthenticatedMpNumbers') != undefined) {
                        var authenticatedMpArray = JSON.parse(sessionStorage.getItem('AuthenticatedMpNumbers'));
                        authenticatedMpArray.push(isAuth);
                        sessionStorage.setItem('AuthenticatedMpNumbers', JSON.stringify(authenticatedMpArray));
                    } else {
                        var authenticatedMpArray = [];
                        authenticatedMpArray.push(isAuth);
                        sessionStorage.setItem('AuthenticatedMpNumbers', JSON.stringify(authenticatedMpArray));
                    }
                    //$('#MPClose')[0].click();
                }
                callShuffleSavedSecurityQuestionsService();
                if (isAuthenticationPassed) {
                    convertAnonymousTokenIntoAuthTokenAndSetStates('QA');
                } else {
                    pinpassword.authToken(pinpassword.anonymousToken());
                    convertAnonymousTokenIntoAuthTokenAndSetStates('QF');
                }
            }

            function determineLockReasonCodeThenSendEmail() {
                var tsTrackerId = appStorage.getTSForTrackingID(true);
                var request = {
                    TrackingId: tsTrackerId, //sessionStorage.trackerId,
                    MileagePlusId: pinpassword.mpNumber()
                };
                if (pinpassword.anonymousToken()) {
                    request.token = pinpassword.anonymousToken();
                }
                cc.services.getSavedSecurityQuestions.request(
                    request,
                    function (response) {
                        clearErrorMessage();
                        var loyaltyCode = response.LoyaltyCode;
                        if (isAccountLocked(loyaltyCode)) {
                            if (response.CustomerInfo) {
                                var shouldSendResetAccountEmail = response.CustomerInfo.find(function (customerInfo) {
                                    return customerInfo.Key === "ReasonCode" && customerInfo.Value === "QF";
                                });
                                getEmailIdAndSendEmail(shouldSendResetAccountEmail ? sendResetAccountEmail : sendForgotPasswordEmail);
                            } else {
                                getEmailIdAndSendEmail(sendResetAccountEmail);
                            }
                        }
                    },
                    function (response) {
                        //setErrorMessage("Unable to retrieve security questions. Please try again later");
                        setErrorMessage(retrunErrMsgWithTrackingID(tsTrackerId, appStorage.error_obj.LYLTY_UNABLE_RETRIEVE_SECQA));
                        //callSendErrorEmail(tsTrackerId);//sessionStorage.trackerId);
                    },
                    true
                );
            }

            function getSavedSecurityQuestions() {
                var tsTrackerId = appStorage.getTSForTrackingID(true);
                var request = {
                    "TrackingId": tsTrackerId, //sessionStorage.trackerId,
                    "token": pinpassword.anonymousToken(),
                    "MileagePlusId": pinpassword.mpNumber()
                };
                cc.services.getSavedSecurityQuestions.request(
                    request,
                    function (response) {
                        if (!!response.ExceptionMessage) {
                            //setErrorMessage("Unable to retrieve security questions. Please try again later");
                            setErrorMessage(retrunErrMsgWithTrackingID(tsTrackerId, appStorage.error_obj.LYLTY_UNABLE_RETRIEVE_SECQA));
                            //callSendErrorEmail(tsTrackerId); //sessionStorage.trackerId);
                            return;
                        } else {
                            clearErrorMessage();
                        }
                        var loyaltyCode = response.LoyaltyCode;
                        //loyaltyCode = 'VA';
                        if (isAccountClosed(loyaltyCode)) {
                            pinpassword.isAccountClosed(true);
                            setMpLoyaltyCodeInsessionStorage(loyaltyCode);
                        } else if (isAccountLocked(loyaltyCode)) {
                            var isFromCheckout = sessionStorage.getItem('isFromCheckout');
                            if (isFromCheckout) {
                                //var ticketCtrl = angular.element('#mpList').scope();
                                //if (ticketCtrl)
                                //    ticketCtrl.$parent.updateMpList();
                                if (angular.element('#disableCheckOut').scope()) {
                                    angular.element('#disableCheckOut').scope().disable_check_out();
                                }
                                if (angular.element('#notAuthenticated').scope()) {
                                    angular.element('#notAuthenticated').scope().not_authenticated();
                                }

                            }
                            sessionStorage.removeItem('isFromCheckout');
                            pinpassword.isAccountLocked(true);
                            setMpLoyaltyCodeInsessionStorage(loyaltyCode);
                        } else if (pinpassword.isAuthenticateClicked()) {
                            if (response.Questions && response.Questions.length > 0) {
                                var securityQuestions = response.Questions.map(function (question) {
                                    return {
                                        key: question.QuestionKey,
                                        text: question.QuestionText,
                                        unknownKey: question.Answers.last().AnswerKey,
                                        answers: question.Answers.map(function (answer) {
                                            return {
                                                key: answer.AnswerKey,
                                                text: answer.AnswerText
                                            };
                                        })
                                    };
                                });

                                //pinpassword.securityQuestions(securityQuestions.randomize());
                                pinpassword.securityQuestions(securityQuestions);
                                var firstQuestion = $.extend({
                                    sequenceNumber: 1
                                }, pinpassword.securityQuestions()[0]);

                                pinpassword.displayQuestion(firstQuestion);
                            }
                            pinpassword.mode('authentication');
                        }
                    },
                    function (response) {
                        //setErrorMessage("Unable to retrieve security questions. Please try again later");
                        setErrorMessage(retrunErrMsgWithTrackingID(tsTrackerId, appStorage.error_obj.LYLTY_UNABLE_RETRIEVE_SECQA));
                        //callSendErrorEmail(tsTrackerId); //sessionStorage.trackerId);
                    });
            }

            function sendResetAccountEmail(emailId) {
                var tsTrackerId = appStorage.getTSForTrackingID(true);
                var request = {
                    "TrackingId": tsTrackerId, //sessionStorage.trackerId,
                    "LangCode": "en-US",
                    "EmailAddress": emailId,
                    "MileagePlusId": pinpassword.mpNumber()
                };

                cc.services.sendResetAccountEmail.request(
                    request,
                    function (response) {
                        clearErrorMessage()
                        pinpassword.showEmailSentMessage(true);
                    },
                    function (response) {
                        //setErrorMessage("Unable to send reset account email. Please try again later");
                        setErrorMessage(retrunErrMsgWithTrackingID(tsTrackerId, appStorage.error_obj.LYLTY_UNABLE_EMAIL_RESET_ACC));
                        //callSendErrorEmail(tsTrackerId); //sessionStorage.trackerId);
                    });
            }

            function sendResetQuestionsEmail(emailId) {
                var tsTrackerId = appStorage.getTSForTrackingID(true);
                var request = {
                    "TrackingId": tsTrackerId, //sessionStorage.trackerId,
                    "LangCode": "en-US",
                    "EmailAddress": emailId,
                    "MileagePlusId": pinpassword.mpNumber()
                };
                cc.services.sendResetQuestionsEmail.request(
                    request,
                    function (response) {
                        clearErrorMessage();
                        pinpassword.showEmailSentMessage(true);
                    },
                    function (response) {
                        //setErrorMessage("Unable to send reset questions email. Please try again later");
                        setErrorMessage(retrunErrMsgWithTrackingID(tsTrackerId, appStorage.error_obj.LYLTY_UNABLE_EMAIL_RESET_QA));
                        //callSendErrorEmail(tsTrackerId); //sessionStorage.trackerId);
                    });
            }

            function sendForgotPasswordEmail(emailId) {
                var tsTrackerId = appStorage.getTSForTrackingID(true);
                var request = {
                    "TrackingId": tsTrackerId,// sessionStorage.trackerId,
                    "LangCode": "en-US",
                    "EmailAddress": emailId,
                    "MileagePlusId": pinpassword.mpNumber()
                };

                cc.services.sendForgotPasswordEmail.request(
                    request,
                    function (response) {
                        clearErrorMessage();
                        pinpassword.showEmailSentMessage(true);
                    },
                    function (response) {
                        //setErrorMessage("Unable to send forgot password email. Please try again later");
                        setErrorMessage(retrunErrMsgWithTrackingID(tsTrackerId, appStorage.error_obj.LYLTY_UNABLE_EMAIL_FORGOT_PWD));
                        //callSendErrorEmail(tsTrackerId); //sessionStorage.trackerId);
                    });
            }

            function callShuffleSavedSecurityQuestionsService() {
                var tsTrackerId = appStorage.getTSForTrackingID(true);
                var request = {
                    "TrackingId": tsTrackerId, //sessionStorage.trackerId,
                    "MileagePlusId": pinpassword.mpNumber()
                };
                cc.services.shuffleSavedSecurityQuestions.request(
                    request,
                    function (response) {
                        clearErrorMessage();
                    },
                    function (response) {
                        //setErrorMessage("Unable to shuffle security questions.");
                        setErrorMessage(retrunErrMsgWithTrackingID(tsTrackerId, appStorage.error_obj.LYLTY_UNABLE_SHUFFLE_SECQA));
                        //callSendErrorEmail(tsTrackerId); //sessionStorage.trackerId);
                    }, true);
            }

            function lockAccountAndUpdateTfaFlag() {
                var tsTrackerId = appStorage.getTSForTrackingID(true);
                var request = {
                    TrackingId: tsTrackerId,// sessionStorage.trackerId,
                    MileagePlusId: pinpassword.mpNumber(),
                    UpdateId: pinpassword.mpNumber(),
                    SendEmail: true
                };
                cc.services.lockCustomerAccount.request(
                    request,
                    function (response) {
                        if (!!response.ExceptionMessage) {
                            //setErrorMessage("Unable to lock customer account. Please try again later");
                            setErrorMessage(retrunErrMsgWithTrackingID(tsTrackerId, appStorage.error_obj.LYLTY_UNABLE_LOCK_ACC));
                            //callSendErrorEmail(tsTrackerId);//sessionStorage.trackerId);
                            return;
                        } else {
                            clearErrorMessage();
                        }
                        pinpassword.isAccountLocked(true);
                        setMpLoyaltyCodeInsessionStorage('LK');
                        updateTfaWrongAnswersFlag(true);
                        callShuffleSavedSecurityQuestionsService();
                    },
                    function (response) {
                        // setErrorMessage("Unable to lock customer account. Please try again later");
                        setErrorMessage(retrunErrMsgWithTrackingID(tsTrackerId, appStorage.error_obj.LYLTY_UNABLE_LOCK_ACC));
                        //callSendErrorEmail(tsTrackerId); //sessionStorage.trackerId);
                    },
                    true
                );
            }

            function updateTfaWrongAnswersFlag(flag) {
                var tsTrackerId = appStorage.getTSForTrackingID(true);
                var request = {
                    TrackingId: tsTrackerId,// sessionStorage.trackerId,
                    LoyaltyId: pinpassword.mpNumber(),
                    AnsweredQuestionsIncorrectly: flag,
                    LangCode: "en-US"
                };
                cc.services.updateTfaWrongAnswersFlag.request(
                    request,
                    function (response) {
                        clearErrorMessage();
                    },
                    function (response) {
                        //setErrorMessage("Unable to update TFA wrong answer flag");
                        setErrorMessage(retrunErrMsgWithTrackingID(tsTrackerId, appStorage.error_obj.LYLTY_UNABLE_UPDATE_TFA));
                        //callSendErrorEmail(tsTrackerId); //sessionStorage.trackerId);
                    },
                    true
                );
            }

            function displayNextQuestion() {
                var index = pinpassword.displayQuestion().sequenceNumber;
                var nextQuestion = $.extend({
                    sequenceNumber: index + 1
                }, pinpassword.securityQuestions()[index]);
                pinpassword.displayQuestion(nextQuestion);
            }

            function clearErrorMessage() {
                pinpassword.errorMessage(null);
            }

            function setErrorMessage(errorMessage) {
                pinpassword.errorMessage(errorMessage);
            }

            function setMpLoyaltyCodeInsessionStorage(loyaltyCode) {
                if (pinpassword.isSubmitClicked()) {
                    sessionStorage.setItem('loyalty', JSON.stringify({
                        id: pinpassword.mpNumber(),
                        code: loyaltyCode
                    }));
                }
            }
        };
        return pinpasswordClass;
    });