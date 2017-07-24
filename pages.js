function moveExtensionTabToStart() {
    chrome.tabs.getCurrent(function (tab) {
        chrome.tabs.move(tab.id, { index: 0 })
    });
}

function defineEventRemoveLineOnClickX() {
    $(document).on('click', '.btnRemove', function (e) {
        var btn = $(e.target);
        var tabId = btn.data().tabId;
        chrome.tabs.remove(tabId);
        $('[data-tab-id="' + tabId + '"]').remove();
    });
}

function defineEventOpenTabOnClickLine() {
    $(document).on('click', '.liTab', function (e) {
        var li = $(e.target);
        var tabId = li.data().tabId;
        chrome.tabs.update(tabId, { selected: true });
    })
}

var app = angular.module("lostInTabs", []);

$(document).ready(function () {
    moveExtensionTabToStart();
    defineEventRemoveLineOnClickX();
    defineEventOpenTabOnClickLine();
    angular.bootstrap(document, ['lostInTabs']);
});

app.factory("pagesService", function ($q) {

    function getPages() {
        var deferred = $q.defer();
        chrome.tabs.query({}, function (tabs) {
            angular.bootstrap(document, ['lostInTabs']);
            deferred.resolve(tabs);
        });
        return deferred.promise;
    };

    return  {
        getPages: getPages
    };
})

app.controller("pagesCtrl", function ($scope, pagesService) {
    $scope.loadPages = function () {
        pagesService.getPages().then(function (tabs) {
            console.log(tabs);
            console.log(tabs.length)
            alert(tabs.length)
            $scope.tabs = tabs;
        });
    }
})
