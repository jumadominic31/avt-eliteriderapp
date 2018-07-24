angular.module('starter.controllers', ['signature', 'ngStorage'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicHistory, courier) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.cour  = courier;

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.service('courier',function(){
    //user details
    this.userid      = "";
    this.username      = "";
    this.password      = "";
    this.fullname      = "";
    //company details
    this.company_id = "";
    this.companyname   = "";
    this.companyaddr   = "";
    this.companycity   = "";
    this.companyphone = "";
    this.companyemail = "";
    //txn details
    this.txn_id = "";
    this.awb_num = "";
    this.clerk_id = "";
    this.clerk_name = "";
    this.origin_id = "";
    this.origin_name = "";
    this.dest_id = "";
    this.dest_name = "";
    this.parcel_status_id = "";
    this.parcel_status_name = "";
    this.parcel_type_id = "";
    this.parcel_type_name = "";
    this.parcel_desc = "";
    this.bkmode = "";
    this.roundtrip = "";
    this.bkmode_name = "";
    this.roundtrip_name = "";
    this.price = "";
    this.vat = "";
    this.sender_name = "";
    this.sender_company_id = "";
    this.sender_company_name = "";
    this.sender_id_num = "";
    this.sender_phone = "";
    this.receiver_name = "";
    this.receiver_company_name = "";
    this.receiver_id_num = "";
    this.receiver_phone = "";
    this.receiver_code = "";
    this.driver_id = "";
    this.driver_name = "";
    this.driver_code = "";
    this.vehicle_id = "";
    this.vehicle_name = "";
    this.updated_by = "";
    this.statusdetails = "";
    this.selected = [];
    // this.url           = "https://avanettech.co.ke/elite/api";
    // this.sign_url      = "https://avanettech.co.ke/elite/"
    //this.url           = "http://10.0.2.2:8000/api";
    // this.url           = "http://192.168.0.106:8000/api";
    // this.sign_url           = "http://192.168.0.106:8000/";
    this.url           = "http://127.0.0.1:8000/api";
    this.sign_url      = "http://127.0.0.1:8000/"
    this.token         = "";
})


//Login
.controller('BrowseCtrl',function($scope,$window,$http,$ionicSideMenuDelegate,$ionicHistory,$ionicLoading,$ionicPopup,$localStorage,courier){

        $scope.cour = courier;

        $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
        });

        $scope.cour.token = "";
        $window.localStorage.clear();

        $ionicSideMenuDelegate.canDragContent(false);

        $scope.doLogin = function() {
            $scope.isDisabled = true;
            $scope.username = this.username;
            $scope.cour.username = this.username;

            $scope.login_url = $scope.cour.url+'/user/rider/signin';
            var user = {
                username:   this.username,
                password:   this.password,
            }
            var config = {
                headers : {
                'Content-Type': 'application/json;'
                }
            }
            $http.post($scope.login_url, user, config).
            then(function successCallback(response) {
                
                console.log(JSON.stringify(response));
                if (response.data.error == "Invalid Credentials!"){
                    $scope.isDisabled = false;
                    var alertPopup = $ionicPopup.alert({
                        title: 'Login Failure',
                        template: '<center>Please enter correct username/password</center>'
                    });
                }
                else {
                    $ionicLoading.show({template: 'Logging-in'});
                    $scope.token = response.data.token;
                    $scope.cour.token = $scope.token;
                    $ionicLoading.hide();
                    $window.location.href="#/app/dashboard";
                }
             }, function errorCallback(response) {
                console.log(JSON.stringify(response));
                $scope.isDisabled = false;
                var alertPopup = $ionicPopup.alert({
                    title: 'Login Failure',
                    template: '<center>Please enter correct username/password</center>'
                    });
                });
        }
})

//Dashboard
.controller('DashboardCtrl',['$rootScope','$timeout','$scope','$http','$filter','$location','$window','courier', '$ionicHistory','$ionicSideMenuDelegate','$ionicLoading','$ionicPopup','$timeout','$state','$localStorage', function($rootScope,$timeout,$scope,$http,$filter,$location,$window,courier,$ionicHistory,$ionicSideMenuDelegate,$ionicLoading,$ionicPopup,$timeout,$state,$localStorage) {

    $scope.cour         = courier;
    $scope.token        = $scope.cour.token;
    $scope.username     = $scope.cour.username;
    $scope.numpickups   = 0;
    $scope.numdrops     = 0;
    $scope.completedpickups = 0;
    $scope.completeddrops   = 0;

    ///get userid and companydetails
    $scope.userdetails_url = $scope.cour.url+'/user/rider/'+$scope.username+'?token='+$scope.token;
    var username = {
        username:   $scope.username
    }
    var config = {
        headers : {
            'Content-Type': 'application/json;'
        }
    }

    if (localStorage.getItem("userdetails") === null)  {
        $http.get($scope.userdetails_url, username, config).
        then(function successCallback(response) {
            console.log(JSON.stringify(response));

            localStorage.setItem("userdetails", JSON.stringify(response.data));
            $scope.userdetails = localStorage.getItem("userdetails");
            console.log($scope.userdetails);

            $scope.userid = response.data[0].id;
            $scope.fullname = response.data[0].fullname;
            $scope.companyname = response.data[0].name;
            $scope.companyaddr = response.data[0].address;
            $scope.companycity = response.data[0].city;
            $scope.companyphone = response.data[0].phone;
            $scope.companyemail = response.data[0].email;
            $scope.cour.userid       = $scope.userid;
            $scope.cour.fullname = $scope.fullname;
            $scope.cour.companyname = $scope.companyname;
            $scope.cour.companyaddr = $scope.companyaddr;
            $scope.cour.companycity = $scope.companycity;
            $scope.cour.companyphone = $scope.companyphone;
            $scope.cour.companyemail = $scope.companyemail;
        }, function errorCallback(response) {
               console.log(JSON.stringify(response));
        });
    }
    else {
        $scope.userid = JSON.parse(localStorage.getItem("userdetails"))[0].id;
        $scope.fullname = JSON.parse(localStorage.getItem("userdetails"))[0].fullname;
        $scope.companyname = JSON.parse(localStorage.getItem("userdetails"))[0].name;
        $scope.companyaddr = JSON.parse(localStorage.getItem("userdetails"))[0].address;
        $scope.companycity = JSON.parse(localStorage.getItem("userdetails"))[0].city;
        $scope.companyphone = JSON.parse(localStorage.getItem("userdetails"))[0].phone;
        $scope.companyemail = JSON.parse(localStorage.getItem("userdetails"))[0].email;
    }

    //no of pending pickups
    $scope.numpickups_url = $scope.cour.url+'/rider/txn/numberpickups?token='+$scope.token;
    $http.get($scope.numpickups_url).
    then(function successCallback(response) {
        // console.log(JSON.stringify(response));
        $scope.numpickups = response.data.txn;
        // $scope.loading = false;
        // $scope.dataLoaded = true;
        if (response.data.txn.length == 0){
            $scope.numpickups = 0;
        }
    }, function errorCallback(response) {
           // console.log(JSON.stringify(response));
           // $scope.loading = false;
           // $scope.dataLoaded = false;
    });

    //no of pending drops
    $scope.numdrops_url = $scope.cour.url+'/rider/txn/numberdrops?token='+$scope.token;
    $http.get($scope.numdrops_url).
    then(function successCallback(response) {
        // console.log(JSON.stringify(response));
        $scope.numdrops = response.data.txn;
        // $scope.loading =false;
        // $scope.dataLoaded = true;
        if (response.data.txn.length == 0){
            $scope.$scope.numdrops = 0;
        }
    }, function errorCallback(response) {
           console.log(JSON.stringify(response));
           // $scope.loading =false;
           // $scope.dataLoaded = false;
    });

    //no of pending pickups
    $scope.completedpickups_url = $scope.cour.url+'/rider/txn/completedpickups?token='+$scope.token;
    $http.get($scope.completedpickups_url).
    then(function successCallback(response) {
        $scope.completedpickups = response.data.txn;
        if (response.data.txn.length == 0){
            $scope.completedpickups = 0;
        }
    }, function errorCallback(response) {
           console.log(JSON.stringify(response));
    });

    //no of pending drops
    $scope.completeddrops_url = $scope.cour.url+'/rider/txn/completeddrops?token='+$scope.token;
    $http.get($scope.completeddrops_url).
    then(function successCallback(response) {
        $scope.completeddrops = response.data.txn;
        if (response.data.txn.length == 0){
            $scope.$scope.completeddrops = 0;
        }
    }, function errorCallback(response) {
           console.log(JSON.stringify(response));
    });
    
    $scope.cancel = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $window.location.href="#/app/dashboard";
    }
}])

//list parcels booked and assigned to rider awaiting pickup
.controller('ListPickupsCtrl',['$rootScope','$timeout','$scope','$http','$filter','$location','$window','courier', '$ionicHistory','$ionicSideMenuDelegate','$ionicLoading','$ionicPopup','$timeout','$state','$ionicModal','$localStorage', function($rootScope,$timeout,$scope,$http,$filter,$location,$window,courier,$ionicHistory,$ionicSideMenuDelegate,$ionicLoading,$ionicPopup,$timeout,$state,$ionicModal,$localStorage) {
    $scope.cour = courier;
    $scope.notfound = false;
    $scope.dataLoaded = false;
    $scope.loading = false;
    $scope.token = $scope.cour.token;
    $scope.spinner1 = true;
    $scope.spinner2 = true;

    $scope.loading = true;
    $scope.notfound = false;
    $scope.listpickups_url = $scope.cour.url+'/rider/txn/listpickups?token='+$scope.token;
    $http.get($scope.listpickups_url).
    then(function successCallback(response) {
        // console.log(JSON.stringify(response));
        $scope.listbooked = response.data.txn;
        $scope.loading = false;
        $scope.dataLoaded = true;
        if (response.data.txn.length == 0){
            $scope.notfound = true;
        }
    }, function errorCallback(response) {
           // console.log(JSON.stringify(response));
           $scope.loading = false;
           $scope.dataLoaded = false;
           $scope.notfound = true;
    });


    $scope.cancel = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $window.location.href="#/app/dashboard";
        // $window.history.back();
    }
}])

//list parcels that has been assigned to a rider for dispatching to the receiver
.controller('ListDropsCtrl',['$rootScope','$timeout','$scope','$http','$filter','$location','$window','courier', '$ionicHistory','$ionicSideMenuDelegate','$ionicLoading','$ionicPopup','$timeout','$state','$ionicModal','$localStorage', function($rootScope,$timeout,$scope,$http,$filter,$location,$window,courier,$ionicHistory,$ionicSideMenuDelegate,$ionicLoading,$ionicPopup,$timeout,$state,$ionicModal,$localStorage) {
    $scope.cour = courier;
    $scope.notfound = false;
    $scope.dataLoaded = false;
    $scope.loading = false;
    $scope.token = $scope.cour.token;
    $scope.isDisabled = false;
    $scope.spinner1 = true;
    $scope.spinner2 = true;
    //start test
    $scope.selected = [];

    $scope.selectItem = function(item) {
        $scope.selected.length = 0;
        $scope.selected.push(item);
    };

    $scope.cancel = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $window.location.href="#/app/dashboard";
        // $window.history.back();
    }

    $scope.loading = true;
    $scope.notfound = false;
    $scope.selected.length = 0;
    //get list of created parcels
    $scope.listdrops_url = $scope.cour.url+'/rider/txn/listdrops?token='+$scope.token;
    $http.get($scope.listdrops_url).
    then(function successCallback(response) {
        // console.log(JSON.stringify(response));
        $scope.listpicked = response.data.txn;
        $scope.loading =false;
        $scope.dataLoaded = true;
        if (response.data.txn.length == 0){
            $scope.notfound = true;
        }
    }, function errorCallback(response) {
           console.log(JSON.stringify(response));
           $scope.loading =false;
           $scope.dataLoaded = false;
           $scope.notfound = true;
    });

    $scope.receive = function(){
        $scope.isDisabled = true;
        $scope.cour.selected = $scope.selected;
        var selectedLength = $scope.selected.length;
        if (selectedLength == 0){
            $scope.isDisabled = false;
            var alertPopup = $ionicPopup.alert({
                title: 'No AWB Selected',
                template: '<center> Please select AWB to receive </center>'
            });
        } else {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm Receipt',
                template: 'Are you sure you want to receive the parcels?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    $window.location.href="#/app/confirmreceipt";
                } else {
                    $scope.isDisabled = false;
                    console.log('You are not sure');
                    $window.location.href="#/app/listpicked";
                }
            });
        }
    };


}])

//Create AWB
.controller('CreateCtrl',['$rootScope','$timeout','$scope','$http','$filter','$location','$window','courier', '$ionicHistory','$ionicSideMenuDelegate','$ionicLoading','$ionicPopup','$timeout','$state','$localStorage', function($rootScope,$timeout,$scope,$http,$filter,$location,$window,courier,$ionicHistory,$ionicSideMenuDelegate,$ionicLoading,$ionicPopup,$timeout,$state,$localStorage) {

        $scope.cour         = courier;
        $scope.token        = $scope.cour.token;
        $scope.username     = $scope.cour.username;
        $scope.bkmodes      = [{ 'id' : '0', 'name' : 'Normal'}, {'id' : '1', 'name' : 'Express'}];
        $scope.roundtrips   = [{ 'id' : '0', 'name' : 'One way'}, {'id' : '1', 'name' : 'Round'}];
        $scope.spinner1     = true;
        $scope.spinner2     = true;
        $scope.spinner3     = true;

        $scope.phone_check = /7[0-9]{8}$/;

        ///get userid and companydetails
        $scope.userdetails_url = $scope.cour.url+'/user/rider/'+$scope.username+'?token='+$scope.token;
        var username = {
            username:   $scope.username
        }
        var config = {
            headers : {
                'Content-Type': 'application/json;'
            }
        }

        if (localStorage.getItem("userdetails") === null)  {
            $http.get($scope.userdetails_url, username, config).
            then(function successCallback(response) {
                console.log(JSON.stringify(response));

                localStorage.setItem("userdetails", JSON.stringify(response.data));
                $scope.userdetails = localStorage.getItem("userdetails");
                console.log($scope.userdetails);

                $scope.userid = response.data[0].id;
                $scope.fullname = response.data[0].fullname;
                $scope.companyname = response.data[0].name;
                $scope.companyaddr = response.data[0].address;
                $scope.companycity = response.data[0].city;
                $scope.companyphone = response.data[0].phone;
                $scope.companyemail = response.data[0].email;
                $scope.cour.userid       = $scope.userid;
                $scope.cour.fullname = $scope.fullname;
                $scope.cour.companyname = $scope.companyname;
                $scope.cour.companyaddr = $scope.companyaddr;
                $scope.cour.companycity = $scope.companycity;
                $scope.cour.companyphone = $scope.companyphone;
                $scope.cour.companyemail = $scope.companyemail;
            }, function errorCallback(response) {
                   console.log(JSON.stringify(response));
            });
        }
        else {
            $scope.userid = JSON.parse(localStorage.getItem("userdetails"))[0].id;
            $scope.fullname = JSON.parse(localStorage.getItem("userdetails"))[0].fullname;
            $scope.companyname = JSON.parse(localStorage.getItem("userdetails"))[0].name;
            $scope.companyaddr = JSON.parse(localStorage.getItem("userdetails"))[0].address;
            $scope.companycity = JSON.parse(localStorage.getItem("userdetails"))[0].city;
            $scope.companyphone = JSON.parse(localStorage.getItem("userdetails"))[0].phone;
            $scope.companyemail = JSON.parse(localStorage.getItem("userdetails"))[0].email;
        }

        if (localStorage.getItem("stations") === null) {
            //Get stations

            $timeout( function () {
                $scope.stations_url = $scope.cour.url+'/riderstations?token='+$scope.token;
                $http.get($scope.stations_url, config).
                then(function successCallback(response) {
                    console.log(JSON.stringify(response));
                    $scope.spinner1  = false;
                    $scope.stations = response.data;
                    $scope.cour.stations = response.data;
                    console.log(JSON.stringify(response.data));

                    localStorage.setItem("stations", JSON.stringify(response.data));
                }, function errorCallback(response) {
                    console.log(JSON.stringify(response));
                });
            }, 2000);
        }
        else {
            $scope.spinner1  = false;
            $scope.stations = JSON.parse(localStorage.getItem("stations"));
        }


        if (localStorage.getItem("customers") === null) {
            //Get customers
            //$scope.customers = [{id: 0, name: "Others"},{id: 7, name: "Kileton Limited"}, {id: 8, name: "Josue Enterprise"}, {id: 9, name: "AfriNet Ltd"}];
            $timeout( function () {
                $scope.stations_url = $scope.cour.url+'/ridercustomers?token='+$scope.token;
                $http.get($scope.stations_url, config).
                then(function successCallback(response) {
                    console.log(JSON.stringify(response));
                    $scope.spinner3  = false;
                    $scope.customers = response.data;
                    $scope.cour.customers = response.data;
                    console.log(JSON.stringify(response.data));
                    localStorage.setItem("customers", JSON.stringify(response.data));
                }, function errorCallback(response) {
                    console.log(JSON.stringify(response));
                });
            }, 3000);
        }
        else {
            $scope.spinner3  = false;
            $scope.customers = JSON.parse(localStorage.getItem("customers"));
        }
        if (localStorage.getItem("parceltypes") === null) {
            ///get parceltype and rate
            $scope.parceldetails_url = $scope.cour.url+'/riderparceltypes?token='+$scope.token;
            $timeout( function () {
                $http.get($scope.parceldetails_url, config).
                then(function successCallback(response) {
                    console.log(JSON.stringify(response));
                    $scope.spinner2  = false;
                    $scope.parceltypes = response.data.parceltype;

                    localStorage.setItem("parceltypes", JSON.stringify(response.data.parceltype));
                }, function errorCallback(response) {
                    console.log(JSON.stringify(response));
                });
            }, 4000);
        }
        else {
            $scope.spinner2  = false;
            $scope.parceltypes = JSON.parse(localStorage.getItem("parceltypes"));
        }

        //time
        $scope.time = 0;
        //timer callback
        var timer = function() {
          if( $scope.time < 1000 ) {
             $scope.time += 1000;
             $timeout(timer, 1000);
          }
        }
        //run!!
        $timeout(timer, 1000);


        $scope.createtxn = function(isValid){
            if (isValid){
                //if (this.dest.id && this.parcel_type.id && this.price && this.sender_name && this.sender_phone && this.receiver_name && this.receiver_phone) {
                    $scope.isDisabled = true;
                    //$scope.submitted    = true;
                    $scope.dest_addr = this.dest_addr;
                    // $scope.dest_name = this.dest.name;
                    $scope.origin_addr = this.origin_addr;
                    // $scope.origin_name = this.origin.name;
                    $scope.parcel_type_id = this.parcel_type.id;
                    $scope.parcel_type_name = this.parcel_type.name;
                    $scope.parcel_desc = this.parcel_desc;
                    $scope.bkmode = this.bkmode.id;
                    $scope.roundtrip = this.roundtrip.id; 
                    $scope.price = this.price;
                    $scope.sender_name = this.sender_name;
                    if (this.myVar == true){
                        $scope.sender_company_id = 0;
                        $scope.cour.sender_company_id = 0;
                        $scope.sender_company_name = this.sender_company_name_wr;
                        $scope.cour.sender_company_name = this.sender_company_name_wr;
                    } 
                    else {
                        $scope.sender_company_id = this.sender_company.id;
                        $scope.cour.sender_company_id = this.sender_company.id;
                        $scope.sender_company_name = this.sender_company.name;
                        $scope.cour.sender_company_name = this.sender_company.name;    
                    }
                    
                    $scope.sender_phone = this.sender_phone;
                    $scope.sender_sign = this.sender_sign;
                    $scope.receiver_name = this.receiver_name;
                    $scope.receiver_company_name = this.receiver_company_name;
                    $scope.receiver_phone = this.receiver_phone;
                    if (this.sender_id_num == null){
                        $scope.sender_id_num = '-';
                        $scope.cour.sender_id_num = '-';
                    } else {
                        $scope.sender_id_num = this.sender_id_num;
                        $scope.cour.sender_id_num = this.sender_id_num;
                    }
                    $scope.cour.dest_addr = this.dest_addr;
                    // $scope.cour.dest_name = this.dest.name;
                    $scope.cour.origin_addr = this.origin_addr;
                    // $scope.cour.origin_name = this.origin.name;
                    $scope.cour.parcel_type_id = this.parcel_type.id;
                    $scope.cour.parcel_type_name = this.parcel_type.name;
                    $scope.cour.parcel_desc = this.parcel_desc;
                    $scope.cour.bkmode = this.bkmode.id;
                    $scope.cour.roundtrip = this.roundtrip.id;
                    $scope.cour.price = this.price;
                    $scope.cour.sender_name = this.sender_name;
                    // $scope.cour.sender_company_id = this.sender_company.id;
                    // $scope.cour.sender_company_name = this.sender_company_name
                    $scope.cour.sender_phone = this.sender_phone;
                    $scope.cour.sender_sign = this.sender_sign;
                    $scope.cour.receiver_name = this.receiver_name;
                    $scope.cour.receiver_phone = this.receiver_phone;
                    $scope.cour.receiver_company_name = this.receiver_company_name;

                    $window.location.href="#/app/confirmcreate";

            }
            else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Creating AWB',
                    template: '<center> Please fill all the fields </center>'
                  });
            }

        }

}])

//confirm create
.controller('ConfirmCreateCtrl',['$rootScope','$timeout','$scope','$http','$filter','$location','$window','courier', '$ionicHistory','$ionicSideMenuDelegate','$ionicLoading','$ionicPopup','$timeout','$state','$localStorage', function($rootScope,$timeout,$scope,$http,$filter,$location,$window,courier,$ionicHistory,$ionicSideMenuDelegate,$ionicLoading,$ionicPopup,$timeout,$state,$localStorage) {

    $scope.cour         = courier;
    $scope.token        = $scope.cour.token;
    $scope.username     = $scope.cour.username;

    $scope.dest_addr      = $scope.cour.dest_addr;
    $scope.origin_addr      = $scope.cour.origin_addr;
    $scope.parcel_type_id = $scope.cour.parcel_type_id;
    $scope.parcel_desc  = $scope.cour.parcel_desc;
    $scope.bkmode       = $scope.cour.bkmode;
    $scope.roundtrip    = $scope.cour.roundtrip;
    $scope.price        = $scope.cour.price;
    $scope.sender_name  = $scope.cour.sender_name;
    $scope.sender_company_id  = $scope.cour.sender_company_id;
    $scope.sender_company_name  = $scope.cour.sender_company_name;
    $scope.sender_id_num  = $scope.cour.sender_id_num;
    $scope.sender_sign  = $scope.cour.sender_sign;
    $scope.sender_phone = $scope.cour.sender_phone;
    $scope.receiver_name = $scope.cour.receiver_name;
    $scope.receiver_company_name  = $scope.cour.receiver_company_name;
    $scope.receiver_phone = $scope.cour.receiver_phone;

    $scope.isDisabled = false;

    var canvas = document.querySelector("canvas");
    var signaturePad = new SignaturePad(canvas);
    signaturePad.backgroundColor = "rgb(255,255,240)";

    //Book ticket
    $scope.txn_url = $scope.cour.url+'/rider/txn?token='+$scope.token;

    $scope.clearsign = function() {
        signaturePad.clear();
    }

    $scope.confirmcreate = function() {
        $scope.isDisabled = true;
        if (signaturePad.isEmpty() == false){
            $scope.sender_sign = signaturePad.toDataURL();
//            $timeout( function () {
            var txn = {
                dest_addr : $scope.dest_addr,
                origin_addr : $scope.origin_addr,
                parcel_type_id : $scope.parcel_type_id,
                parcel_desc : $scope.parcel_desc,
                mode : $scope.bkmode,
                round : $scope.roundtrip,
                price : $scope.price,
                sender_name : $scope.sender_name,
                sender_company_id : $scope.sender_company_id,
                sender_company_name : $scope.sender_company_name,
                sender_phone : $scope.sender_phone,
                sender_id_num : $scope.sender_id_num,
                receiver_name : $scope.receiver_name,
                receiver_company_name : $scope.receiver_company_name,
                receiver_phone : $scope.receiver_phone,
                sender_sign : $scope.sender_sign
            }

            var config = {
                headers : {
                    'Content-Type': 'application/json;'
                }
            }

             $http.post($scope.txn_url, txn, config).
             then(function successCallback(response) {
                console.log(JSON.stringify(response));
                $scope.errormsg = response.data.errormsg;
                if ($scope.errormsg == "full"){
                    // $scope.isDisabled   = false;
                    // var alertPopup = $ionicPopup.alert({
                    //     title: 'Vehicle full',
                    //     template: 'Create delivery then try again'
                    // });
                }
                else {
                    $scope.awb_num = response.data.txn.awb_num;
                    $scope.vat = response.data.txn.vat;
                    $scope.cour.awb_num = $scope.awb_num;
                    $scope.cour.vat = $scope.vat;
                    var alertPopup = $ionicPopup.alert({
                        title: 'Parcel booked',
                        template: 'AWB Num   :'+$scope.awb_num
                    });

                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $window.location.href="#/app/printawb";
                }
              }, function errorCallback(response) {
              $scope.isDisabled   = false;
              console.log(JSON.stringify(response));
               var alertPopup = $ionicPopup.alert({
                    title: 'Parcel booking failed',
                    template: '<center> You cannot book a parcel now</center>'
                });
              });
         }
         else {
            $scope.isDisabled = false;
            var alertPopup = $ionicPopup.alert({
                title: 'Please Sign',
                template: '<center> Please sign first</center>'
            });
         }
    }

    $scope.cancel = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $window.location.href="#/app/dashboard";
    }

}])

//Print awb
.controller('PrintAwbCtrl',['$rootScope','$scope','$http','$location','$window','courier','$ionicHistory','$ionicSideMenuDelegate','$ionicLoading','$ionicPopup','$timeout','$state','$localStorage', function($rootScope,$scope,$http,$location,$window,courier,$ionicHistory,$ionicSideMenuDelegate,$ionicLoading,$ionicPopup,$timeout,$state,$localStorage) {

        $scope.cour           = courier;
        $scope.printer      = "Print";
        $scope.companyname  = $scope.cour.companyname;
        $scope.companyaddr  = $scope.cour.companyaddr;
        $scope.companyaddr2  = $scope.cour.companyaddr+" "+$scope.cour.companycity;
        $scope.companycity = $scope.cour.companycity;
        $scope.companyphone = $scope.cour.companyphone;
        $scope.companyemail = $scope.cour.companyemail;
        $scope.origin_name = $scope.cour.origin_name;
        $scope.username = $scope.cour.username;
        $scope.fullname = $scope.cour.fullname;
        $scope.token    = $scope.cour.token;
        $scope.printer  = "Print";

        $scope.awb_num          = $scope.cour.awb_num;
        $scope.origin_addr        = $scope.cour.origin_addr;
        // $scope.origin_name      = $scope.cour.origin_name;
        $scope.dest_addr          = $scope.cour.dest_addr;
        // $scope.dest_name        = $scope.cour.dest_name;
        $scope.parcel_type_id   = $scope.cour.parcel_type_id;
        $scope.parcel_type_name = $scope.cour.parcel_type_name;
        $scope.parcel_desc      = $scope.cour.parcel_desc;
        $scope.bkmode       = $scope.cour.bkmode;
        $scope.roundtrip    = $scope.cour.roundtrip;
        $scope.price            = $scope.cour.price;
        $scope.vat              = $scope.cour.vat;
        $scope.sender_name      = $scope.cour.sender_name;
        $scope.sender_company_name    = $scope.cour.sender_company_name;
        $scope.sender_phone     = $scope.cour.sender_phone;
        $scope.sender_sign      = $scope.cour.sign_url + $scope.cour.sender_sign;
        $scope.sender_id_num    = $scope.cour.sender_id_num;
        $scope.receiver_company_name    = $scope.cour.receiver_company_name;
        $scope.receiver_name    = $scope.cour.receiver_name;
        $scope.receiver_phone   = $scope.cour.receiver_phone;
        
        if ($scope.bkmode == 0){
            $scope.bkmode_name = 'Normal';
        }
        else if ($scope.bkmode == 1){
            $scope.bkmode_name = 'Express';
        }

        if ($scope.roundtrip == 0){
            $scope.roundtrip_name = 'One way';
        }
        else if ($scope.roundtrip == 1){
            $scope.roundtrip_name = 'Round';
        }

        $scope.cour.bkmode_name = $scope.bkmode_name;
        $scope.cour.roundtrip_name = $scope.roundtrip_name;

        $scope.cancel = function(){
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $window.location.href="#/app/dashboard";
        }

        $scope.print = function(){
            $scope.isDisabled = true;
            $scope.printer="Printing...";
            var jsonn = {func:"rider_awb", companyname:$scope.companyname, companyaddr:$scope.companyaddr,
              companycity:$scope.companycity, companyphone:$scope.companyphone, companyemail:$scope.companyemail,
              fullname:$scope.fullname, awb_num:$scope.awb_num, origin_name:$scope.origin_name,
              dest_name:$scope.dest_name, parcel_type_name:$scope.parcel_type_name, parcel_desc:$scope.parcel_desc,
              bkmode: $scope.bkmode_name, roundtrip:$scope.roundtrip_name,
              price:$scope.price, vat:$scope.vat, sender_name:$scope.sender_name, 
              sender_company_name:$scope.sender_company_name, sender_phone:$scope.sender_phone, sender_id_num:$scope.sender_id_num,
              receiver_name:$scope.receiver_name, receiver_company_name:$scope.receiver_company_name, receiver_phone:$scope.receiver_phone
              };
            console.log(jsonn);
            cordova.plugins.Keyboard.justprint(jsonn);
            $scope.printer="Printed";
        }
}])

//parcel menu
.controller('ParcelMenuCtrl',['$rootScope','$timeout','$scope','$http','$filter','$location','$window','courier', '$ionicHistory','$ionicSideMenuDelegate','$ionicLoading','$ionicPopup','$timeout','$state','$localStorage', function($rootScope,$timeout,$scope,$http,$filter,$location,$window,courier,$ionicHistory,$ionicSideMenuDelegate,$ionicLoading,$ionicPopup,$timeout,$state,$localStorage) {

    $scope.cour         = courier;
    $scope.token        = $scope.cour.token;
    $scope.username     = $scope.cour.username;

    $scope.cancel = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $window.location.href="#/app/dashboard";
    }

    $scope.details = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $window.location.href="#/app/detailtxn";
    }

    $scope.booked = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $window.location.href="#/app/listbooked";
    }

    $scope.picked = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $window.location.href="#/app/listpicked";
    }

    $scope.received = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $window.location.href="#/app/listreceived";
    }

}])

//list booked parcel
.controller('ListBookedCtrl',['$rootScope','$timeout','$scope','$http','$filter','$location','$window','courier', '$ionicHistory','$ionicSideMenuDelegate','$ionicLoading','$ionicPopup','$timeout','$state','$ionicModal','$localStorage', function($rootScope,$timeout,$scope,$http,$filter,$location,$window,courier,$ionicHistory,$ionicSideMenuDelegate,$ionicLoading,$ionicPopup,$timeout,$state,$ionicModal,$localStorage) {
    $scope.cour = courier;
    $scope.notfound = false;
    $scope.dataLoaded = false;
    $scope.loading = false;
    $scope.token = $scope.cour.token;
    $scope.isDisabled = false;
    $scope.spinner1 = true;
    $scope.spinner2 = true;
    $scope.customers = JSON.parse(localStorage.getItem("customers"));
    // $scope.customers.push({id: 0, name: "Others"});
    // console.log(JSON.stringify($scope.customers));
    
    //start test
    $scope.selected = [];

    $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
          list.splice(idx, 1);
        }
        else {
          list.push(item);
        }
    };

    $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
    };

    $scope.cancel = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $window.location.href="#/app/parcelmenu";
        // $window.history.back();
    }
    
    $scope.pick = function(){
        console.log(JSON.stringify($scope.selected));
        $scope.isDisabled = true;
        $scope.cour.selected = $scope.selected;
        var selectedLength = $scope.selected.length;
        if (selectedLength == 0){
            $scope.isDisabled = false;
            var alertPopup = $ionicPopup.alert({
                title: 'No AWB Selected',
                template: '<center> Please select AWB to pick </center>'
            });
        } else {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm Dispatch',
                template: 'Are you sure you want to pick the parcels?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    $window.location.href="#/app/confirmpick";
                } else {
                    $scope.isDisabled = false;
                    console.log('You are not sure');
                    $window.location.href="#/app/listbooked";
                }
            });
        }
    };
    //end test

    //get list of created parcels
    

    $scope.listbookedfun = function(id){
        $scope.loading = true;
        $scope.notfound = false;
        $scope.selected.length = 0;
        $scope.listbooked_url = $scope.cour.url+'/rider/txn/booked/cust/'+id+'?token='+$scope.token;
        $http.get($scope.listbooked_url).
        then(function successCallback(response) {
            console.log(JSON.stringify(response));
            $scope.listbooked = response.data.txn;
            $scope.loading = false;
            $scope.dataLoaded = true;
            if (response.data.txn.length == 0){
                $scope.notfound = true;
            }
        }, function errorCallback(response) {
               console.log(JSON.stringify(response));
               $scope.loading = false;
               $scope.dataLoaded = false;
               $scope.notfound = true;
        });
    }

}])

//confirm pickup
.controller('ConfirmPickCtrl',['$rootScope','$timeout','$scope','$http','$filter','$location','$window','courier', '$ionicHistory','$ionicSideMenuDelegate','$ionicLoading','$ionicPopup','$timeout','$state','$localStorage', function($rootScope,$timeout,$scope,$http,$filter,$location,$window,courier,$ionicHistory,$ionicSideMenuDelegate,$ionicLoading,$ionicPopup,$timeout,$state,$localStorage) {
    $scope.cour         = courier;
    $scope.token        = $scope.cour.token;
    $scope.username     = $scope.cour.username;
    $scope.selected     = $scope.cour.selected;
    $scope.url          = $scope.cour.url;
    $scope.sender_name  = $scope.selected[0].sender_name;
    var selectedLength  = $scope.selected.length;

    console.log(JSON.stringify($scope.selected));

    var canvas = document.querySelector("canvas");
    var signaturePad = new SignaturePad(canvas);
    signaturePad.backgroundColor = "rgb(255,255,240)";

    //Book ticket
    //$scope.txn_url = $scope.url+'/rider/txn/pick?token='+$scope.token;

    $scope.clearsign = function() {
        signaturePad.clear();
    }

    $scope.confirmpick = function(isValid) {
        $scope.isDisabled = true;
        if (signaturePad.isEmpty() == false && isValid){
            $scope.sender_sign = signaturePad.toDataURL();

            $scope.pick_url = $scope.cour.url+'/rider/txn/pick?token='+$scope.token;
            var txn = {
                sender_sign : $scope.sender_sign,
                sender_pass : this.sender_pass,
                notes: this.notes,
                ids : $scope.selected
            }

            var config = {
                headers : {
                    'Content-Type': 'application/json;'
                }
            }

            $http.post($scope.pick_url, txn, config).
            then(function successCallback(response) {
                console.log(JSON.stringify(response));
                $scope.awb_failed = response.data.failed;
                $scope.awb_success = response.data.success;
                $scope.sender_err = response.data.sender_err;

                if ($scope.driver_err == 'diff senders'){
                    var alertPopup = $ionicPopup.alert({
                        title: 'Different senders',
                        template: '<center>Please choose the AWBs from the same sender </center>'
                    });
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $window.location.href="#/app/listpicked";
                }
                if ($scope.awb_failed[0] == null) {
                    $scope.awb_failed = 'none';
                }
                if ($scope.awb_success[0] == null) {
                    $scope.awb_success = 'none';
                }
                if ($scope.awb_failed == 'none'){
                    var alertPopup = $ionicPopup.alert({
                        title: 'Pickup Complete',
                        template: '<center>Success: '+ $scope.awb_success + ' </center>'
                    });
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $window.location.href="#/app/listpicked";
                }
                else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Please enter the correct password for failed AWBs',
                        template: '<center>Success: '+ $scope.awb_success + '<br>Failed: ' + $scope.awb_failed +' </center>'
                    });
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $window.location.href="#/app/listbooked";
                }
            }, function errorCallback(response) {
                $scope.isDisabled   = false;
                console.log(JSON.stringify(response));
            });
         }
         else {
            $scope.isDisabled = false;
            var alertPopup = $ionicPopup.alert({
                title: 'Password/Sign Error',
                template: '<center> Please enter the correct password and/or sign</center>'
            });
         }
    }

    $scope.cancel = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $window.location.href="#/app/dashboard";
    }

}])

//list picked awb
.controller('ListPickedCtrl',['$rootScope','$timeout','$scope','$http','$filter','$location','$window','courier', '$ionicHistory','$ionicSideMenuDelegate','$ionicLoading','$ionicPopup','$timeout','$state','$ionicModal','$localStorage', function($rootScope,$timeout,$scope,$http,$filter,$location,$window,courier,$ionicHistory,$ionicSideMenuDelegate,$ionicLoading,$ionicPopup,$timeout,$state,$ionicModal,$localStorage) {
    $scope.cour = courier;
    $scope.notfound = false;
    $scope.dataLoaded = false;
    $scope.loading = false;
    $scope.token = $scope.cour.token;
    $scope.isDisabled = false;
    $scope.spinner1 = true;
    $scope.spinner2 = true;
    $scope.customers = JSON.parse(localStorage.getItem("customers"));
    $scope.customers.push({id: 0, name: "Others"});
    //start test
    $scope.selected = [];

    $scope.selectItem = function(item) {
        $scope.selected.length = 0;
        $scope.selected.push(item);
    };

    $scope.cancel = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $window.location.href="#/app/parcelmenu";
        // $window.history.back();
    }

    $scope.receive = function(){
        $scope.isDisabled = true;
        $scope.cour.selected = $scope.selected;
        var selectedLength = $scope.selected.length;
        if (selectedLength == 0){
            $scope.isDisabled = false;
            var alertPopup = $ionicPopup.alert({
                title: 'No AWB Selected',
                template: '<center> Please select AWB to receive </center>'
            });
        } else {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm Receipt',
                template: 'Are you sure you want to receive the parcels?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    $window.location.href="#/app/confirmreceipt";
                } else {
                    $scope.isDisabled = false;
                    console.log('You are not sure');
                    $window.location.href="#/app/listpicked";
                }
            });
        }
    };
    //end test
    $scope.listpickedfun = function(id){
        $scope.loading = true;
        $scope.notfound = false;
        $scope.selected.length = 0;
        //get list of created parcels
        $scope.listpicked_url = $scope.cour.url+'/rider/txn/picked/cust/'+id+'?token='+$scope.token;

        $http.get($scope.listpicked_url).
        then(function successCallback(response) {
            // console.log(JSON.stringify(response));
            $scope.listpicked = response.data.txn;
            $scope.loading =false;
            $scope.dataLoaded = true;
            if (response.data.txn.length == 0){
                $scope.notfound = true;
            }
        }, function errorCallback(response) {
               console.log(JSON.stringify(response));
               $scope.loading =false;
               $scope.dataLoaded = false;
               $scope.notfound = true;
        });
    }

}])

//confirm receipt
.controller('ConfirmReceiptCtrl',['$rootScope','$timeout','$scope','$http','$filter','$location','$window','courier', '$ionicHistory','$ionicSideMenuDelegate','$ionicLoading','$ionicPopup','$timeout','$state','$localStorage', function($rootScope,$timeout,$scope,$http,$filter,$location,$window,courier,$ionicHistory,$ionicSideMenuDelegate,$ionicLoading,$ionicPopup,$timeout,$state,$localStorage) {

    $scope.cour         = courier;
    $scope.token        = $scope.cour.token;
    $scope.username     = $scope.cour.username;
    $scope.selected     = $scope.cour.selected;
    $scope.receiver_name = $scope.selected[0].receiver_name;
    $scope.receiver_phone = $scope.selected[0].receiver_phone;
    var selectedLength  = $scope.selected.length;

    console.log(JSON.stringify($scope.selected));

    var canvas = document.querySelector("canvas");
    var signaturePad = new SignaturePad(canvas);
    signaturePad.backgroundColor = "rgb(255,255,240)";

    $scope.clearsign = function() {
        signaturePad.clear();
    }

    $scope.confirmreceipt = function(isValid) {
        $scope.isDisabled = true;
        if (signaturePad.isEmpty() == false && isValid){
            $scope.receiver_sign = signaturePad.toDataURL();

            for (var i = 0; i < 1; i++) {
                console.log($scope.selected[i]);
                //dispatch
                $scope.receive_url = $scope.cour.url+'/rider/txn/receive/'+ $scope.selected[i].id +'?token='+$scope.token;
                var txn = {
                    'receiver_id_num' : this.receiver_id_num,
                    'receiver_sign' : $scope.receiver_sign,
                    'notes': this.notes,
                    // 'receiver_code' : this.receiver_code
                }

                var config = {
                    headers : {
                        'Content-Type': 'application/json;'
                    }
                }

                 $http.post($scope.receive_url, txn, config).
                 then(function successCallback(response) {
                    console.log(JSON.stringify(response));
                    $scope.errormsg = response.data.errormsg;
                    console.log($scope.errormsg);
                    if ($scope.errormsg == "code error"){
                        $scope.isDisabled = false;
                        var alertPopup = $ionicPopup.alert({
                            title: 'Enter valid code',
                            template: '<center>Please enter a valid code</center>'
                        });
                        // $window.location.href="#/app/listawaitdelivery";
                    }
                    else {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Receipt Success',
                            template: '<center> Parcel received successfully.</center>'
                        });
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $window.location.href="#/app/dashboard";
                    }
                  }, function errorCallback(response) {
                      $scope.isDisabled   = false;
                      console.log(JSON.stringify(response));
                  });

            }
         }
         else {
            $scope.isDisabled = false;
            var alertPopup = $ionicPopup.alert({
                title: 'ID and/or Sign Required',
                template: '<center> Please enter ID and/or sign first</center>'
            });
         }
    }

    $scope.cancel = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $window.location.href="#/app/dashboard";
    }

}])

//list received awb
.controller('ListReceivedCtrl',['$rootScope','$timeout','$scope','$http','$filter','$location','$window','courier', '$ionicHistory','$ionicSideMenuDelegate','$ionicLoading','$ionicPopup','$timeout','$state','$localStorage', function($rootScope,$timeout,$scope,$http,$filter,$location,$window,courier,$ionicHistory,$ionicSideMenuDelegate,$ionicLoading,$ionicPopup,$timeout,$state,$localStorage) {
    $scope.cour = courier;
    $scope.notfound = false;
    $scope.dataLoaded = false;
    $scope.loading = false;
    $scope.isDisabled = false;
    $scope.spinner1 = true;
    $scope.spinner2 = true;
    $scope.token = $scope.cour.token;
    // $scope.customers = JSON.parse(localStorage.getItem("customers"));
    // $scope.customers.push({id: 0, name: "Others"});
    
    $scope.cancel = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $window.location.href="#/app/parcelmenu";
        // $window.history.back();
    }

    $scope.listreceivedfun = function(id){
        $scope.loading = true;
        $scope.notfound = false;
        //get list of dispatched parcels
        $scope.listreceived_url = $scope.cour.url+'/rider/txn/received/cust/'+id+'?token='+$scope.token;

        $http.get($scope.listreceived_url).
        then(function successCallback(response) {
            console.log(JSON.stringify(response));
            $scope.listreceived = response.data.txn;
            $scope.loading =false;
            $scope.dataLoaded = true;
            if (response.data.txn.length == 0){
                $scope.notfound = true;
            }
        }, function errorCallback(response) {
               console.log(JSON.stringify(response));
               $scope.loading =false;
               $scope.dataLoaded = false;
               $scope.notfound = true;
        });
    }
}])

//show awb details
.controller('DetailTxnCtrl',['$rootScope','$timeout','$scope','$http','$filter','$location','$window','courier', '$ionicHistory','$ionicSideMenuDelegate','$ionicLoading','$ionicPopup','$timeout','$state','$localStorage', function($rootScope,$timeout,$scope,$http,$filter,$location,$window,courier,$ionicHistory,$ionicSideMenuDelegate,$ionicLoading,$ionicPopup,$timeout,$state,$localStorage) {
    $scope.cour = courier;
    $scope.companyname  = $scope.cour.companyname;
    $scope.companyaddr  = $scope.cour.companyaddr+' '+$scope.cour.companycity;
    $scope.username     = $scope.cour.username;
    $scope.fullname     = $scope.cour.fullname;
    $scope.token        = $scope.cour.token;
    $scope.isDisabled = false;
    $scope.notfound = false;
    $scope.dataLoaded = false;
    $scope.loading = false;
    $scope.printer = "Print";

    $scope.cancel = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $window.location.href="#/app/dashboard";
    }

    $scope.reset = function() {
        $scope.dataLoaded = false;
        $scope.notfound = false;
        this.awb_num = "";
    }

    $scope.caller = function(){
        $scope.isDisabled   = true;
        $scope.printer="Printing...";
        var jsonn = {func:"rider_awb", companyname:$scope.companyname, companyaddr:$scope.companyaddr,
              companycity:$scope.companycity, companyphone:$scope.companyphone, companyemail:$scope.companyemail,
              fullname:$scope.fullname, awb_num:$scope.awb_num, origin_name:$scope.origin_name,
              dest_name:$scope.dest_name, parcel_type_name:$scope.parcel_type_name, parcel_desc:$scope.parcel_desc,
              price:$scope.price, vat:$scope.vat, sender_name:$scope.sender_name, 
              sender_company_name:$scope.sender_company_name, sender_phone:$scope.sender_phone, sender_id_num:$scope.sender_id_num,
              receiver_name:$scope.receiver_name, receiver_company_name:$scope.receiver_company_name, receiver_phone:$scope.receiver_phone
              };
        console.log(jsonn);
        cordova.plugins.Keyboard.justprint(jsonn);
        $scope.printer="Printed";
    }

    $scope.search_awb = function(){
        $scope.isDisabled = true;
        $scope.dataLoaded = true;
        $scope.notfound = false;
        if (this.awb_num){
            //get details of created parcels
            $scope.detailcreated_url = $scope.cour.url+'/rider/txn/details/'+this.awb_num+'?token='+$scope.token;
            $http.get($scope.detailcreated_url).
            then(function successCallback(response) {
                console.log(JSON.stringify(response));
                //need to get details again

                if (response.data.txn[0] == null) {
                    $scope.dataLoaded = false;
                    $scope.notfound = true;
                    $scope.isDisabled = false;
                    console.log("No data");
                }
                else {
                    $scope.awb_id          = response.data.txn[0].id;
                    // $scope.origin_id        = response.data.txn[0].origin_id;
                    // $scope.origin_name      = response.data.txn[0].origin_name;
                    $scope.origin_addr      = response.data.txn[0].origin_addr;
                    // $scope.dest_id          = response.data.txn[0].dest_id;
                    // $scope.dest_name        = response.data.txn[0].dest_name;
                    $scope.dest_addr        = response.data.txn[0].dest_addr;
                    $scope.parcel_type_id   = response.data.txn[0].parcel_type_id;
                    $scope.parcel_type_name = response.data.txn[0].parcel_type_name;
                    $scope.parcel_status_id   = response.data.txn[0].parcel_status_id;
                    $scope.parcel_status_name = response.data.txn[0].parcel_status_name;
                    $scope.parcel_desc      = response.data.txn[0].parcel_desc;
                    $scope.price            = response.data.txn[0].price;
                    $scope.vat              = response.data.txn[0].vat;
                    $scope.sender_name      = response.data.txn[0].sender_name;
                    $scope.sender_company_name      = response.data.txn[0].sender_company_name;
                    $scope.sender_phone     = response.data.txn[0].sender_phone;
                    $scope.sender_id_num    = response.data.txn[0].sender_id_num;
                    $scope.sender_sign      = $scope.cour.sign_url + response.data.txn[0].sender_sign;
                    $scope.receiver_name    = response.data.txn[0].receiver_name;
                    $scope.receiver_company_name    = response.data.txn[0].receiver_company_name;
                    $scope.receiver_phone   = response.data.txn[0].receiver_phone;
                    $scope.receiver_id_num  = response.data.txn[0].receiver_id_num;
                    $scope.bkmode           = response.data.txn[0].mode;
                    $scope.roundtrip           = response.data.txn[0].round;
                    if ($scope.bkmode == 0){
                        $scope.bkmode_name = "Normal";
                    }
                    else if ($scope.bkmode == 1){
                        $scope.bkmode_name = "Express";
                    }
                    if ($scope.roundtrip == 0){
                        $scope.roundtrip_name = "One way";
                    }
                    else if ($scope.roundtrip == 1){
                        $scope.roundtrip_name = "Round";
                    }
                    $scope.fullname         = $scope.cour.fullname;
                    $scope.bkmode           = response.data.txn[0].mode;
                    console.log($scope.sender_sign);

                    $scope.cour.awb_id          = response.data.txn[0].id;
                    // $scope.cour.origin_id        = response.data.txn[0].origin_id;
                    // $scope.cour.origin_name      = response.data.txn[0].origin_name;
                    // $scope.cour.dest_id          = response.data.txn[0].dest_id;
                    // $scope.cour.dest_name        = response.data.txn[0].dest_name;
                    $scope.cour.origin_addr      = response.data.txn[0].origin_addr;
                    $scope.cour.dest_addr        = response.data.txn[0].dest_addr;
                    $scope.cour.parcel_type_id   = response.data.txn[0].parcel_type_id;
                    $scope.cour.parcel_type_name = response.data.txn[0].parcel_type_name;
                    $scope.cour.parcel_status_id   = response.data.txn[0].parcel_status_id;
                    $scope.cour.parcel_status_name = response.data.txn[0].parcel_status_name;
                    $scope.cour.parcel_desc          = response.data.txn[0].parcel_desc;
                    $scope.cour.price            = response.data.txn[0].price;
                    $scope.cour.vat            = response.data.txn[0].vat;
                    $scope.cour.sender_name      = response.data.txn[0].sender_name;
                    $scope.cour.sender_company_name      = response.data.txn[0].sender_company_name;
                    $scope.cour.sender_phone     = response.data.txn[0].sender_phone;
                    $scope.cour.sender_id_num    = response.data.txn[0].sender_id_num;
                    $scope.cour.sender_sign      = response.data.txn[0].sender_sign;
                    $scope.cour.receiver_name    = response.data.txn[0].receiver_name;
                    $scope.cour.receiver_company_name    = response.data.txn[0].receiver_company_name;
                    $scope.cour.receiver_phone   = response.data.txn[0].receiver_phone;
                    $scope.cour.receiver_id_num  = response.data.txn[0].receiver_id_num;
                    $scope.cour.bkmode           = response.data.txn[0].mode;
                    $scope.cour.roundtrip           = response.data.txn[0].round;
                    $scope.cour.bkmode_name          = $scope.bkmode_name;
                    $scope.cour.roundtrip_name       = $scope.roundtrip_name;

                    $scope.loading =false;
                    $scope.dataLoaded = true;
                    $scope.isDisabled = false;
                    $scope.notfound = false;

                    //get shipment status details
                    $scope.statusdetails_url = $scope.cour.url+'/txn/statusdetails/'+$scope.awb_id+'?token='+$scope.token;
                    $http.get($scope.statusdetails_url).
                    then(function successCallback(response) {
                        console.log(JSON.stringify(response));
                        $scope.statusdetails = response.data.statusDet;
                        $scope.cour.statusdetails = response.data.statusDet;
                    }, function errorCallback(response) {
                        console.log(JSON.stringify(response));
                    });
                    $window.location.href="#/app/detailtxn";
                }
            }, function errorCallback(response) {
                  console.log(JSON.stringify(response));
            });
        } else {
            $scope.isDisabled = false;
            $scope.dataLoaded = false;
            $scope.notfound = false;
            var alertPopup = $ionicPopup.alert({
                title: 'Enter AWB No',
                template: '<center>Please enter AWB number</center>'
            });
        }
    }
}])

//Daily Summary
.controller('SummaryCtrl',['$rootScope','$timeout','$scope','$http','$filter','$location','$window','courier', '$ionicHistory','$ionicSideMenuDelegate','$ionicLoading','$ionicPopup','$timeout','$state','$localStorage', function($rootScope,$timeout,$scope,$http,$filter,$location,$window,courier,$ionicHistory,$ionicSideMenuDelegate,$ionicLoading,$ionicPopup,$timeout,$state,$localStorage) {

        $scope.cour     = courier;
        $scope.companyname = $scope.cour.companyname;
        $scope.companyaddr = $scope.cour.companyaddr+' '+$scope.cour.companycity;
        $scope.companycity = $scope.cour.companycity;
        $scope.companyphone = $scope.cour.companyphone;
        $scope.companyemail = $scope.cour.companyemail;
        $scope.origin_name = $scope.cour.origin_name;
        $scope.username = $scope.cour.username;
        $scope.fullname = $scope.cour.fullname;
        $scope.token    = $scope.cour.token;
        $scope.printer  = "Print";

        ///get userid and stationid
        $scope.summary_url = $scope.cour.url+'/rider/txn/dailysumm?token='+$scope.token;
        $http.get($scope.summary_url).
        then(function successCallback(response) {
            console.log(JSON.stringify(response));
            $scope.booked = response.data.booked;
            $scope.picked = response.data.picked;
            $scope.received = response.data.received;

            if ($scope.booked == null){
                $scope.booked = 0;
            }
            if ($scope.picked == null){
                $scope.picked = 0;
            }
            if ($scope.received == null){
                $scope.received = 0;
            }

            /*if (null){
               $scope.loading =false;
               $scope.dataLoaded = false;
               $scope.notfound = true;
            }*/
        }, function errorCallback(response) {
               console.log(JSON.stringify(response));
               // $scope.loading =false;
               // $scope.dataLoaded = false;
               // $scope.notfound = true;
        });

        $scope.cancel = function(){
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $window.location.href="#/app/dashboard";
        }

        $scope.print = function(){
            $scope.printer="Printing...";
            var jsonn = {func:"rider_summary", companyname:$scope.companyname, companyaddr:$scope.companyaddr,
              companycity:$scope.companycity, companyphone:$scope.companyphone, companyemail:$scope.companyemail,
              fullname:$scope.fullname, origin_name:$scope.origin_name, 
              booked:$scope.booked, picked:$scope.picked, received:$scope.received
              };
            console.log(jsonn);
            cordova.plugins.Keyboard.justprint(jsonn);
            $scope.printer="Printed";
        }
}])

//Change Password
.controller('ChangepassCtrl',['$rootScope','$timeout','$scope','$http','$filter','$location','$window','courier', '$ionicHistory','$ionicSideMenuDelegate','$ionicLoading','$ionicPopup','$timeout','$state','$localStorage', function($rootScope,$timeout,$scope,$http,$filter,$location,$window,courier,$ionicHistory,$ionicSideMenuDelegate,$ionicLoading,$ionicPopup,$timeout,$state,$localStorage) {

    $scope.cour       = courier;
    $scope.username = $scope.cour.username;
    $scope.token    = $scope.cour.token;

    $scope.isDisabled   = false;

    ///get userid and stationid
    $scope.changepass_url = $scope.cour.url+'/user/'+$scope.username+'/changepassword?token='+$scope.token;
    console.log($scope.changepass_url);

    $scope.changepass = function(){
    if (this.curr_password && this.new_password && this.new_password_2 ) {
        $scope.curr_password    = this.curr_password;
        $scope.new_password     = this.new_password;
        $scope.new_password_2   = this.new_password_2;

        if (this.new_password != this.new_password_2){
            var alertPopup = $ionicPopup.alert({
                title: 'New passwords not same',
                template: '<center> The 2 new passwords must be same</center>'
            });
            //$window.location.href="#/app/changepass";

        } else {

            var password = {
                    curr_password:  $scope.curr_password,
                    new_password:   $scope.new_password,
                    new_password_2: $scope.new_password_2
            }

            var config = {
                headers : {
                    'Content-Type': 'application/json;'
                }
            }

             $http.post($scope.changepass_url, password, config).
             then(function successCallback(response) {
                console.log(JSON.stringify(response));
                var alertPopup = $ionicPopup.alert({
                    title: 'Password changed',
                    template: 'Please relogin'
                });
                $window.location.href="#/app/browse";
              }, function errorCallback(response) {
               console.log(JSON.stringify(response));
               $scope.message = response.data.message;
               var alertPopup = $ionicPopup.alert({
                    title: 'Password change failed',
                    template: '<center>'+$scope.message+'</center>'
                });
              });
         }

    }
    else {
       var alertPopup = $ionicPopup.alert({
            title: 'Change Password',
            template: '<center> Please fill in the missing information </center>'
          });
        }
    }

}])