(function(){
    'use strict';

    var app = angular.module('NarrowItDownApp', []);
    app.controller('NarrowItDownController',NarrowItDownController);
    app.service('MenuSearchService',MenuSearchService);
    app.constant('BasePath', "https://davids-restaurant.herokuapp.com/menu_items.json");
    app.directive('foundItems',FoundItems);

    function FoundItems(){
        var ddo = {
             templateUrl: 'listtable.html',
             restrict : 'E',
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

        list.toFound = function(){
            var itemTofind = list.getItem();

            if(itemTofind == null || itemTofind == undefined )
            {
                    $scope.message =  "Nothing found";
            }
            else
            {
                     if(itemTofind.length > 0)
                     {
                           var promise = MenuSearchService.getItems( );
                            promise
                            .then(function (response){
                                //From object to array
                                var foundItems =Object.values(response.data);
                                //
                                list.found = MenuSearchService.getMatchedMenuItems(foundItems,itemTofind);
                                if (list.found == null)
                                {
                                    $scope.message =  "Nothing found";
                                    itemTofind = undefined ;
                                }
                                else
                                {
                                    $scope.message =  null;
                                    itemTofind = undefined ;
                                }
                            })
                            .catch (function (error){
                                console.log(error);
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

    MenuSearchService.$inject = ['$http','BasePath'];
    function MenuSearchService($http,BasePath){

        var service = this;

        var found =[];

        service.getMatchedMenuItems= function(arrayItems,searchTerm){
             if(found.length > 0)
             {
                  found.length = 0;
             }
             for (var j = 0; j < arrayItems[0].length;++j )
                {
                    var plat = arrayItems[0][j];
                    if(plat["description"].toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)
                    {
                        var plt = {
                                name: plat["name"],
                                short_name :plat["short_name"],
                                description: plat["description"]
                                };
                        found.push(plt);

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
           var response = $http({
                method: "GET",
                url: (BasePath)
            });
            return response;
        };

        service.removeItem = function (itemIndex) {
            found.splice(itemIndex, 1);
        };
    }
})();
