function buildTabsList() {
    
    var tabsList = $("#tabsList");

    getCurrentTabs(function (tabs) {
        console.log(tabs);
        tabs.forEach(function (tab) {
            console.log(tab);
            var btnRemover = '<button class="btnRemove" data-tab-id="' + tab.id + '">x</button>'
            tabsList.append('<li class="liTab" data-tab-id="' + tab.id + '">' + btnRemover + ' ' + tab.url + '</li>');
        })
    })
}

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

function getCurrentTabs(callback) {
    var queryInfo = {};
    chrome.tabs.query(queryInfo, function (tabs) {
        callback(tabs);
    });
}

$(document).ready(function () {

    buildTabsList();

    moveExtensionTabToStart();
    defineEventRemoveLineOnClickX();
    defineEventOpenTabOnClickLine();

});