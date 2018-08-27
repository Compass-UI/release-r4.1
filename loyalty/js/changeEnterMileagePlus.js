define(['jquery', 'lib/knockout', 'lib/aero', 'lib/viewModel', './pinpassword', './reverseMpLookup'],
  function ($, ko, aero, viewModel, pinpassword, reverseMpLookup) {
      var mileagePlusModalClass = aero.extendClass(viewModel, function (options) {

          var self = this;

          self.model = {
              id: 'changeEnterMileagePlusDialog',
              visible: false,
              title: null,
              options: {
                  position: { my: 'left-30 top-295', of: '#changeEnterMPlink' }
              },
              newMileagePlus: ko.observable(""),
              currentMileagePlus: "",
              isSponsorNotTraveling: ko.observable(false),
              isAwardTravel: ko.observable(false),
              visitedPNRCreate: ko.observable(false),
              errorMessage: ko.observable(""),
              alertMessage: ko.observable(""), //Prabha added for MP Alert
              previousLoyaltyIdList: ko.observable({ source: [], appendTo: "#self" }),//Ramesh for Traveller Vs Sponsor
              mpMemberList: ko.observableArray([]),
              remainingMpPaxSelList: ko.observableArray([]),
              phoneList: ko.observableArray([]),
              faxList: ko.observableArray([]),
              paxSelected: ko.observable(),
              showSubmitBtn: ko.observable("Search"),
              enableTravelListSubmitBtn: ko.observable(false),
              pinpass: new pinpassword(),

              onClickMpSearch: function () {
                  self.model.reverseMpLookup = new reverseMpLookup({ pinpassword: self.model.pinpass });
                  self.model.reverseMpLookup.init();
              },

              checkForMpChange: function (data, evt) {
                  var myDialog = self.dialogModel.myDialog,
                      currentMpNumber = myDialog.currentMileagePlus,
                      newMpNumber = myDialog.newMileagePlus();

                  self.dialogModel.alertMPChange(currentMpNumber, newMpNumber);

              },

              showAutoComplete: function () {
                  /// <summary>It will display previous Mp Numbers in auto complete modal</summary>
                  //var header = aero.bindings.appManager.applications.shopping.bindings.myHeader;
                  //self.dialogModel.myDialog.previousLoyaltyIdList({ source: header.previousLoyaltyIds, appendTo: "#self" });
              },
              closeDialog: function (data) {
                  var search = aero.bindings.appManager.applications.shopping.bindings.tabManager.activeTab.launchSearch;
                  var myDialog = self.dialogModel.myDialog;
                  self.model.isSponsorNotTraveling(false);    //vijay  29/2/2016
                  myDialog.newMileagePlus(myDialog.currentMileagePlus);
                  myDialog.paxSelected(null);
                  myDialog.enableTravelListSubmitBtn(false);
                  myDialog.errorMessage("");
                  myDialog.close();
                  if (!myDialog.currentMileagePlus && (search.isAward() || search.isMultiAward())) {
                      search.alertMessage("Without a MileagePlus account, accurate pricing may not be returned");
                  } else {
                      search.alertMessage("");
                  }
              },

              closePinpass: function () {
                  window.location.hash = "/loyalty";
              },
              // function to raise on click of Change button
              changeMP: function () {
                  
            //      var data = self.dialogModel.myDialog;
            //      var rawNewMileagePlus = data.newMileagePlus().trim();
            //;
            //      if (rawNewMileagePlus !== "") {
            //          if (!self.dialogModel.myDialog.validateLoyaltyId(rawNewMileagePlus)) {

            //              data.errorMessage("Please enter a valid MileagePlus number or click Cancel.");
            //          }
            //          else {
            //              data.pinpass.init(data.newMileagePlus());
            //              alert('test');
            //              data.errorMessage("");
            //              var oldMpProfile = aero.temp['mpProfile'];
                          
                          //var totalPaxCount = aero.bindings.appManager.applications.shopping.bindings.myHeader.getTotalPaxCount();
                          //activeTab.multiServiceErrorMsg('');

                          //if ((activeTab.launchSearch.isAward() || activeTab.launchSearch.isMultiAward()) &&
                          //       oldMpProfile && (oldMpProfile.mpNumber != rawNewMileagePlus ||
                          //       oldMpProfile.isSponsorNotTraveling != data.isSponsorNotTraveling())) {

                          //    var prevPaxCount = aero.temp['totalPaxCount'];

                          //    if (prevPaxCount != totalPaxCount) {
                          //        aero.bindings.appManager.applications.shopping.bindings.myHeader.loyaltyIdFromEzr(rawNewMileagePlus);
                          //        aero.bindings.appManager.applications.shopping.bindings.myHeader.isSponsorNotTraveling(data.isSponsorNotTraveling());
                          //        aero.bindings.appManager.applications.shopping.bindings.myHeader.bindData(true);
                          //    } else {
                          //        if (oldMpProfile.isSponsorNotTraveling != data.isSponsorNotTraveling()) {
                          //            self.dialogModel.myDialog.close();
                          //            if (activeTab.mode() == "shop") {

                          //                if (data.isSponsorNotTraveling()) {
                          //                    aero.bindings.appManager.applications.shopping.bindings.myHeader.myConfirmSponsorTravelModal.dialogModel.openDialog(rawNewMileagePlus, data.isSponsorNotTraveling(), totalPaxCount);
                          //                }
                          //                else {
                          //                    aero.bindings.appManager.applications.shopping.bindings.myHeader.loyaltyIdFromEzr(rawNewMileagePlus);
                          //                    aero.bindings.appManager.applications.shopping.bindings.myHeader.isSponsorNotTraveling(data.isSponsorNotTraveling());
                          //                    aero.bindings.appManager.applications.shopping.bindings.myHeader.bindData(true);
                          //                    activeTab.backToSearch();
                          //                    //  activeTab.callPaxMismatchAlertFn(true);   // Fix for 280944
                          //                    activeTab.isSponsorNotChanged(true);
                          //                }
                          //            }
                          //            else {
                          //                aero.bindings.appManager.applications.shopping.bindings.myHeader.loyaltyIdFromEzr(rawNewMileagePlus);
                          //                aero.bindings.appManager.applications.shopping.bindings.myHeader.isSponsorNotTraveling(data.isSponsorNotTraveling());
                          //                aero.bindings.appManager.applications.shopping.bindings.myHeader.bindData(true);
                          //            }
                          //        }
                          //        else {
                          //            aero.bindings.appManager.applications.shopping.bindings.myHeader.loyaltyIdFromEzr(rawNewMileagePlus);
                          //            aero.bindings.appManager.applications.shopping.bindings.myHeader.isSponsorNotTraveling(data.isSponsorNotTraveling());
                          //            aero.bindings.appManager.applications.shopping.bindings.myHeader.bindData(true);
                          //            self.dialogModel.myDialog.close();
                          //            activeTab.backToSearch();
                          //            activeTab.isSponsorNotChanged(false);
                          //        }
                          //    }
                          //}
                         // else {
                          //    aero.bindings.appManager.applications.shopping.bindings.myHeader.loyaltyIdFromEzr(rawNewMileagePlus);
                          //    aero.bindings.appManager.applications.shopping.bindings.myHeader.isSponsorNotTraveling(data.isSponsorNotTraveling());
                          //    aero.bindings.appManager.applications.shopping.bindings.myHeader.bindData(true);
                          //    if ((activeTab.launchSearch.isAward() || activeTab.launchSearch.isMultiAward())) {
                          //        if (!oldMpProfile && activeTab.mode() == 'shop') {
                          //            activeTab.backToSearch();
                          //            activeTab.isSponsorNotChanged(false);
                          //        }
                          //    }
                          //}
                      //}
                  //} else {
                  //    //aero.bindings.appManager.applications.shopping.bindings.myHeader.loyaltyIdFromEzr("");
                  //    //aero.bindings.appManager.applications.shopping.bindings.myHeader.isSponsorNotTraveling(false);
                  //    //aero.bindings.appManager.applications.shopping.bindings.myHeader.bindData(false);
                  //    $location.url('shopping');
                  //}
              },
              validateLoyaltyId: function (inputStr) {
                  var regex = /^[a-zA-Z0-9]{1,15}$/;
                  return regex.test(inputStr);
              },
              getActiveTab: function () {
                  var bindings = aero.bindings.appManager.applications.shopping.bindings;
                  var tabMgr = bindings.tabManager;
                  var tabs = tabMgr.tabs();
                  var activeTab = null;

                  if (tabs) {
                      tabs.forEach(function (el) {
                          if (el.isActive() == true) {
                              activeTab = el;
                          }
                      });
                  }
                  return activeTab;
              },

              changeMPSubmit: function (data) {

                  if (aero.bindings.appManager.applications.shopping.bindings.myHeader.visitedPNRCreate() &&
                                self.dialogModel.myDialog.paxSelected()) {
                      aero.bindings.appManager.applications.shopping.bindings.myHeader.loyaltyIdFromEzr(self.dialogModel.myDialog.paxSelected().fields.accountNo());
                      aero.bindings.appManager.applications.shopping.bindings.myHeader.isSponsorNotTraveling(data.isSponsorNotTraveling());
                      aero.bindings.appManager.applications.shopping.bindings.myHeader.bindData(true);
                  }
              },
              checkForSubmitBtn: function (data) {
                  self.dialogModel.myDialog.enableTravelListSubmitBtn(true);
                  self.dialogModel.myDialog.newMileagePlus(data.fields.accountNo());
                  if (data) {
                      var myDialog = self.dialogModel.myDialog,
                      currentMpNumber = myDialog.currentMileagePlus,
                      newMpNumber = data.fields.accountNo();
                      self.dialogModel.alertMPChange(currentMpNumber, newMpNumber);
                  }
                  //self.dialogModel.myDialog.showSubmitBtn("Submit");
              },

              resetOnReturnToEZR: function () {
                  self.dialogModel.myDialog.newMileagePlus("");
                  self.dialogModel.myDialog.isSponsorNotTraveling(false);
                  self.dialogModel.myDialog.visitedPNRCreate(false);
                  self.dialogModel.myDialog.errorMessage("");
                  self.dialogModel.myDialog.mpMemberList([]);
                  self.dialogModel.myDialog.remainingMpPaxSelList([]);
                  self.dialogModel.myDialog.paxSelected(null);
                  self.dialogModel.myDialog.showSubmitBtn("Search");
                  self.dialogModel.myDialog.enableTravelListSubmitBtn(false);
              }
          }

          self.newMileagePlusSubscribe = self.model.newMileagePlus.subscribe(function (newMpNumber) {
              var myDialog = self.dialogModel.myDialog,
                  currentMpNumber = myDialog.currentMileagePlus,
                  selectedMpNumber = "";//aero.bindings.appManager.applications.shopping.bindings.myHeader.loyaltyId();
              self.model.pinpass.onMpNumberChange(newMpNumber, selectedMpNumber);
          });;

          //vijay start 29/2/2016
          self.isSponsorNotTravelingSubscribe = self.model.isSponsorNotTraveling.subscribe(function () {
              if (aero.bindings.appManager) {
                  var search = aero.bindings.appManager.applications.shopping.bindings.tabManager.activeTab.launchSearch;
                  search.isAward(true);
                  search.isMultiAward(true);
              }
          });

          //vijay end 29/2/2016


          self.dialogModel = {
              openDialog: function () {
                  self.model.pinpass.init(self.model.newMileagePlus());
                  var activeTab = self.dialogModel.myDialog.getActiveTab();
                  self.dialogModel.myDialog.isAwardTravel(activeTab && activeTab.launchSearch && activeTab.launchSearch.isAward() || activeTab && activeTab.launchSearch && activeTab.launchSearch.isMultiAward());
                  if (aero.bindings.appManager.applications.shopping.bindings.myHeader && aero.bindings.appManager.applications.shopping.bindings.myHeader.visitedPNRCreate()) {

                      var changeMPBindings = aero.bindings.appManager.applications.shopping.bindings.myHeader.myChangeEnterMileagePlus.dialogModel.myDialog;

                      if (changeMPBindings) {
                          var actualMpList = changeMPBindings.remainingMpPaxSelList();

                          if (actualMpList && actualMpList.length > 0) {
                              var filteredMpList = self.getEnteredPaxData(actualMpList);
                          }
                          if (filteredMpList && filteredMpList.length > 0) {
                              self.dialogModel.myDialog.mpMemberList(filteredMpList);
                          }
                      }
                      var sponsorCustomerObj = aero.bindings.appManager.applications.shopping.bindings.myHeader.sponsorCustomer();
                      if (sponsorCustomerObj) {
                          var sponsorAccNo = sponsorCustomerObj.mpNumber;
                          var sponsorName = sponsorCustomerObj.lastName + "," + sponsorCustomerObj.firstName + sponsorCustomerObj.middleName;

                      }
                      var mpMemberList = self.dialogModel.myDialog.mpMemberList();
                      if (mpMemberList && mpMemberList.length > 0) {
                          mpMemberList.forEach(function (item) {
                              // if (item.fields.accountNo() == self.dialogModel.myDialog.newMileagePlus()) {
                              if (item.fields.accountNo() == sponsorAccNo && sponsorName == item.fields.lastName() + "," + item.fields.firstName() + item.fields.middleName()) {
                                  self.dialogModel.myDialog.paxSelected(item);
                              }
                          });
                      }
                  }
                  self.dialogModel.myDialog.open();

                  //START ADD : Change Request - Back to Search from Shop Results if NO MP given in Search but now in Shop Results
                  //Prabha Merge fix for Bindings
                  var loyaltyid = aero.bindings.appManager.applications.shopping.bindings.myHeader.loyaltyId();
                  if (loyaltyid) {
                      self.dialogModel.myDialog.newMileagePlus(loyaltyid);
                  }
                  self.dialogModel.myDialog.alertMessage("");
                  // END ADD : Change Request - Back to Search from Shop Results if NO MP given in Search but now in Shop Results
              },
              // allow header.js to launch dialog remotely
              openDialogWithError: function (data) {
                  //data.Message("The error message from the backend API will display here.");
                  self.dialogModel.myDialog.errorMessage(data);
                  self.dialogModel.myDialog.open();
              },
              // clear the error message and return control to main screen
              closeDialog: function () {
                  self.dialogModel.myDialog.paxSelected(null);
                  self.dialogModel.myDialog.errorMessage("");
                  self.dialogModel.myDialog.enableTravelListSubmitBtn(false);
                  self.dialogModel.myDialog.close();
              },
              alertMPChange: function (currentMpNumber, newMpNumber) {//Prabha Merge fix for Bindings
                  var bindings = (aero.bindings.appManager.applications.shopping.bindings.tabManager) ? aero.bindings.appManager.applications.shopping.bindings.tabManager : null;
                  var mode = (bindings && bindings.activeTab) ? bindings.activeTab.mode() : "";
                  if (mode != "search") {
                      if (newMpNumber && currentMpNumber && currentMpNumber !== newMpNumber) {
                          self.dialogModel.myDialog.alertMessage("Changing the MP# may require a re-price and/or re-shop");
                      }
                      else {
                          self.dialogModel.myDialog.alertMessage("");
                      }
                  }
              },
              // Configure modal dialog
              myDialog: new aero.lib.dialog.modalDialog(self.model)
          };

          $.extend(self, aero.bindings);

          aero.addCustomBindings();

          self.getEnteredPaxData = function (paxForm) {
              var onlyMPProfilesArray = [];
              if (paxForm && paxForm.length > 0) {
                  paxForm.forEach(function (currentPax) {
                      if ((currentPax.fields.mpProgramSelected() == self.constants.MILEAGEPLUS ||
                          currentPax.fields.mpProgramSelected() == self.constants.MP_STRING) &&
                          currentPax.fields.accountNo() && currentPax.fields.firstName() && currentPax.fields.lastName()) {
                          onlyMPProfilesArray.push(currentPax);
                      }
                  });
              }
              return onlyMPProfilesArray;
          };



          self.constants = {
              MILEAGEPLUS: 'UA',
              MP_STRING: 'United MileagePlus'
          };
      });
      return mileagePlusModalClass;
  });