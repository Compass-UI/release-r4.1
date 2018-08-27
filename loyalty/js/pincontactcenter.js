/* eslint-disable quotes */
define(["jquery", "lib/aero", "lib/knockout"], function($, aero, ko) {
  const pincontactcenter = {};
  "use strict";

  pincontactcenter.const = {
    HTTP_GET: "GET",
    HTTP_POST: "POST",
    UNDEFINED_DATE: "1/1/0001 12:00:00 AM",
    UNDEFINED: undefined,
    PAXTYPE_CONSTANTS: {
      ADULT: {
        Start: 18,
        End: 64
      },
      SENIOR: {
        Start: 65,
        End: ""
      },
      CHILDREN: {
        C17: {
          Start: 15,
          End: 17
        },
        C15: {
          Start: 12,
          End: 14
        },
        C11: {
          Start: 5,
          End: 11
        },
        C04: {
          Start: 2,
          End: 4
        }
      }
    }
  };
  const initObservables = function() {

  };

  // START ADD : Code Added for RAS Check
  pincontactcenter.constants = {
    RAS_CHECK_AIRLINES_CODE: ["A3", "AI", "ET", "FM", "JP", "KF", "LO", "LX", "NZ", "O6", "OS", "OU", "OZ", "PZ", "SA", "SK", "SQ", "TG", "TK", "TP", "ZH"],
  };
  // END ADD : Code Added for RAS Check

  const defaults = {
    aero: aero,
    appName: "pincontactcenter",

  };

  const serviceUrl = sessionStorage.getItem("changed_host_name");


  $.extend(pincontactcenter, defaults, {});


  pincontactcenter.events = {
    switchToContactCenter: "switchToContactCenterEvent",
    contactCenterStartTransaction: "contactCenterStartTransactionEvent",

  };
  if (window.location.hostname === "localhost"
    && window.location.port === "1222") {
    pincontactcenter.services = new aero.lib.services({

      // Changes for PINpassword - 03 mar 2016
      getCustomerTokenState: {
        method: aero.const.requestType.get,
        isJsonRequest: true,
        url: "/Api/SecurityStates/GetStates/WorkStationId/{workStationId}/token/{token}"
      },
      setCustomerTokenState: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/SecurityStates/SetStates/WorkStationId/{workStationId}/token/{token}`
      },
      acquireAnonymousToken: {
        method: aero.const.requestType.get,
        isJsonRequest: true,
        url: `/Api/SecurityStates/AcquireAnonymousToken/WorkStationId/{workStationId}/token/{token}`
      },
      findSession: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/SecurityStates/FindSession/WorkStationId/{workStationId}/token/{token}`
      },
      acquireAuthenticatedToken: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/SecurityStates/AcquireAuthenticatedToken/WorkStationId/{workStationId}/token/{token}`
      },
      // Changes for PINpassword - 03 mar 2016 - End

      // Changes for PINpassword - Start - 29 July
      validatePasswordStrength: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/ProfileValidation/ValidatePasswordStrength/WorkStationId/{workStationId}/token/{token}`
      },
      validatePassword: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/ProfileValidation/ValidatePassword/WorkStationId/{workStationId}/token/{token}`
      },
      insertEmailVerification: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/MP/InsertEmailVerification/WorkStationId/{workStationId}/token/{token}`
      },
      setPrimaryChannel: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/MP/SetPrimaryChannel/WorkStationId/{workStationId}/token/{token}`
      },
      insertEmailAddressPIN: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/MP/InsertEmailAddressPIN/WorkStationId/{workStationId}/token/{token}`
      },
      getAllSecurityQuestions: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/Security/GetAllSecurityQuestions/WorkStationId/{workStationId}/token/{token}`
      },
      updateSecurityQuestions: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/Security/UpdateSecurityQuestions/WorkStationId/{workStationId}/token/{token}`
      },
      validateSecurityAnswer: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/Security/ValidateSecurityAnswer/WorkStationId/{workStationId}/token/{token}`
      },
      updateCustomerPassword: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/Security/UpdateCustomerPassword/WorkStationId/{workStationId}/token/{token}`
      },
      getSavedSecurityQuestions: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/Security/GetSavedSecurityQuestions/WorkStationId/{workStationId}/token/{token}`
      },

      sendForgotPasswordEmail: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/MP/SendForgotPasswordEmail/WorkStationId/{workStationId}/token/{token}`
      },
      sendResetAccountEmail: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/MP/SendResetAccountEmail/WorkStationId/{workStationId}/token/{token}`
      },
      shuffleSavedSecurityQuestions: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/Security/ShuffleSavedSecurityQuestions/WorkStationId/{workStationId}/token/{token}`
      },

      lockCustomerAccount: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/Security/LockCustomerAccount/WorkStationId/{workStationId}/token/{token}`
      },
      sendEmail: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/SendEmail/SendEmail/WorkStationId/{workStationId}/token/{token}/MessageUrl/{MessageUrl}/LangCode/{LangCode}`
      },
      // end PINpassword
      getMPProfile: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/MP/GetMPProfile?WorkStationId={workStationId}&token={token}`
      },
      getMPSubscriptions: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/MP/GetSubscriptions?WorkStationId={workStationId}&token={token}`,
      },
      reverseMPLookup: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/MP/ReverseMPLookup?WorkStationId={workStationId}&token={token}`
      },
      offerEligibility: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/MP/OfferEligibility?WorkStationId={workStationId}&token={token}`
      },
      updateCardOffer: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: `/Api/MP/UpdateCardOffer?WorkStationId={workStationId}&token={token}`
      },

      sendErrEmail: {
        method: aero.const.requestType.get,
        isJsonRequest: true,
        url: `/CompassSharedServices/Api/Shared/SendError?tokenAndUniqueID={tokenAndUniqueID}`
      }
    }, aero);
  } else {
    pincontactcenter.services = new aero.lib.services({
      acquireAnonymousToken: {
        method: aero.const.requestType.get,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/SecurityStates/AcquireAnonymousToken?WorkStationId={workStationId}&token={token}`
      },
      findSession: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/SecurityStates/FindSession?WorkStationId={workStationId}&token={token}`
      },
      acquireAuthenticatedToken: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/SecurityStates/AcquireAuthenticatedToken?WorkStationId={workStationId}&token={token}`
      },
      getCustomerTokenState: {
        method: aero.const.requestType.get,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/SecurityStates/GetStates?WorkStationId={workStationId}&token={token}`
      },
      setCustomerTokenState: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/SecurityStates/SetStates?WorkStationId={workStationId}&token={token}`
      },
      getAnonymousToken: {
        method: aero.const.requestType.get,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/SecurityStates/GetAnonymousToken?WorkStationId={workStationId}&token={token}`
      },
      lookUpByCustomerId: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/SecurityStates/LookUpByCustomerId?WorkStationId={workStationId}&token={token}`
      },
      questionAnswerAuthentication: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/SecurityStates/QuestionAnswerAuthentication?WorkStationId={workStationId}&token={token}`
      },
      // Changes for PINpassword - 03 mar 2016 - End

      // Changes for PINpassword - Start - 29 July
      validatePasswordStrength: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/ProfileValidation/ValidatePasswordStrength?WorkStationId={workStationId}&token={token}`
      },
      validatePassword: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/ProfileValidation/ValidatePassword?WorkStationId={workStationId}&token={token}`
      },
      insertEmailVerification: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/ShoppingServices/Api/MP/InsertEmailVerification?WorkStationId={workStationId}&token={token}`
      },
      setPrimaryChannel: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/ShoppingServices/Api/MP/SetPrimaryChannel?WorkStationId={workStationId}&token={token}`
      },
      insertEmailAddressPIN: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/ShoppingServices/Api/MP/InsertEmailAddressPIN?WorkStationId={workStationId}&token={token}`
      },
      getAllSecurityQuestions: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/Security/GetAllSecurityQuestions?WorkStationId={workStationId}&token={token}`
      },
      updateSecurityQuestions: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/Security/UpdateSecurityQuestions?WorkStationId={workStationId}&token={token}`
      },
      validateSecurityAnswer: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/Security/ValidateSecurityAnswer?WorkStationId={workStationId}&token={token}`
      },
      updateCustomerPassword: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/Security/UpdateCustomerPassword?WorkStationId={workStationId}&token={token}`
      },
      getSavedSecurityQuestions: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/Security/GetSavedSecurityQuestions?WorkStationId={workStationId}&token={token}`
      },

      sendForgotPasswordEmail: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/MP/SendForgotPasswordEmail?WorkStationId={workStationId}&token={token}`
      },
      sendResetAccountEmail: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/MP/SendResetAccountEmail?WorkStationId={workStationId}&token={token}`
      },
      sendResetQuestionsEmail: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/MP/SendResetQuestionsEmail?WorkStationId={workStationId}&token={token}`
      },
      shuffleSavedSecurityQuestions: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/Security/ShuffleSavedSecurityQuestions?WorkStationId={workStationId}&token={token}`
      },
      lockCustomerAccount: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/Security/LockCustomerAccount?WorkStationId={workStationId}&token={token}`
      },
      updateTfaWrongAnswersFlag: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/MP/UpdateTfaWrongAnswersFlag?WorkStationId={workStationId}&token={token}`
      },
      sendEmail: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/SendEmail/SendEmail?WorkStationId={workStationId}&token={token}&MessageUrl={MessageUrl}&LangCode={LangCode}`
      },
      // end PINpassword
      getMPProfile: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        headers: { "Content-Type": "application/json" },
        url: serviceUrl + `/LoyaltyServices/Api/MP/GetMPProfile?WorkStationId={workStationId}&token={token}`
      },
      getMPSubscriptions: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        headers: { "Content-Type": "application/json" },
        url: serviceUrl + `/LoyaltyServices/Api/MP/GetSubscriptions?WorkStationId={workStationId}&token={token}`
      },
      reverseMPLookup: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/MP/ReverseMPLookup?WorkStationId={workStationId}&token={token}`
      },
      offerEligibility: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/MP/OfferEligibility?WorkStationId={workStationId}&token={token}`
      },
      updateCardOffer: {
        method: aero.const.requestType.post,
        isJsonRequest: true,
        url: serviceUrl + `/LoyaltyServices/Api/MP/UpdateCardOffer?WorkStationId={workStationId}&token={token}`
      },
      sendErrEmail: {
        method: aero.const.requestType.get,
        isJsonRequest: true,
        url: serviceUrl + `/CompassSharedServices/Api/Shared/SendError?tokenAndUniqueID={tokenAndUniqueID}`
      }
    }, aero);
  }


  return pincontactcenter;
});