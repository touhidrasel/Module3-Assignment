(function(){
    'use strict';

    var app = angular.module('NarrowItDownApp', []);
    app.controller('NarrowItDownController',NarrowItDownController);
    app.service('MenuSearchService',MenuSearchService);
    app.constant('baseurl', "https://davids-restaurant.herokuapp.com/menu_items.json");
    app.directive('foundItems',FoundItems);

    function FoundItems(){
        var ddo = {
             templateUrl: 'listitems.html',
             restrict : 'AE',
             scope:{
                 list:'<list',
                 onRemove : '&'
             }
        };
        return ddo;
    }

    NarrowItDownController.$inject = ['MenuSearchService','$scope'];
    function NarrowItDownController(MenuSearchService,$scope){
        var list = this;

        list.getItem = function(){
            var item = $scope.itemToSearch;
            return item;
        };

        list.searchItem = function(){
            var searchTerm = list.getItem();

            if(searchTerm == null || searchTerm == undefined )
            {
                    $scope.message =  "Nothing found";
            }
            else
            {
                     if(searchTerm.length > 0)
                     {
                           var promise = MenuSearchService.getItems( );
                            promise
                            .then(function (response){
                                var foundItems = Object.values(response.data);
                                list.found = MenuSearchService.getMatchedMenuItems(foundItems,searchTerm);
                                if (list.found == null)
                                {
                                    $scope.message =  "Nothing found";
                                    searchTerm = undefined ;
                                }
                                else
                                {
                                    $scope.message =  null;
                                    searchTerm = undefined ;
                                }
                            })
                            .catch (function (error){
                                $scope.message =  "Nothing found";
                            })
                     }
                     else
                     {
                            $scope.message =  "Nothing found";
                            list.found = null;
                     }
            }
        };
        list.removeItem = function(itemIndex){
           MenuSearchService.removeItem(itemIndex);
        };
    }

    MenuSearchService.$inject = ['$http','baseurl'];
    function MenuSearchService($http,baseurl){
        var service = this;
        var found =[];

        service.getMatchedMenuItems= function(arrayItems,searchTerm){
             if(found.length > 0)
             {
                  found.length = 0;
             }
             for (var j = 0; j < arrayItems[0].length;++j )
                {
                    var arrObj = arrayItems[0][j];
                    //console.log(arrObj);
                    if(arrObj["description"].toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)
                    {
                        var newObj = {
                                name: arrObj["name"],
                                short_name :arrObj["short_name"],
                                description: arrObj["description"]
                                };
                              //  console.log(newObj);
                        found.push(newObj);

                    }
                }
             if(found.length > 0)
             {
                return found;
             }
             else
             {
                 return null;
             }

        };

        service.getItems=function(){
           var responseJson = $http({
                method: "GET",
                url: baseurl
            });
            return responseJson;
        };
        service.removeItem = function (itemIndex) {
            found.splice(itemIndex, 1);
        };
    }
})();
