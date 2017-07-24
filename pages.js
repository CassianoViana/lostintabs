var MAX_TABS = 19;

var M = function () {

    var selectedId = 0;

    return {
        removeTab: function (id) {
            chrome.tabs.remove(id);
        },
        getCurrentTab: function (callback) {
            chrome.tabs.getCurrent(function (tab) {
                callback(tab);
            });
        },
        getCurrentTabs: function (callback) {
            var queryInfo = {};
            chrome.tabs.query(queryInfo, function (tabs) {
                callback(tabs);
            });
        },
        getSelected: function (callback) {
            var hasSelectedClass = function (tab) { return $(tab).hasClass('selected') };
            var selected = $($('.liTab').toArray().filter(hasSelectedClass));
            callback(selected);
        }
    }
}();

var V = function () {

    var getTabsList = function () { return $("#tabsList") };

    return {
        activeTab: function (id) {
            chrome.tabs.update(id, { selected: true });
        },
        removeTab: function (id) {
            $('[data-tab-id="' + id + '"]').remove();
        },
        buildTabsList: function (tabs) {
            getTabsList().empty();
            tabs.forEach(function (tab) {
                var btnRemover = '<button class="btnRemove" data-tab-id="' + tab.id + '">x</button>'
                getTabsList().append('<li class="liTab" data-tab-id="' + tab.id + '">' + btnRemover + ' ' + tab.title + '</li>');
            })
        },
        higlightTab: function (id) {
            getTabsList().find('li[data-tab-id="' + id + '"]').addClass('selected');
        },
        moveToStart: function (id) {
            chrome.tabs.move(id, { index: 0 })
        },
        highlightUp: function (selected) {
            var next = selected.prev();
            if (!next.length) {
                next = $('.liTab:last');
            }
            selected.removeClass('selected');
            next.addClass('selected');
        },
        highlightDown: function (selected) {
            var next = selected.next();
            if (!next.length) {
                next = $('.liTab:first');
            }
            selected.removeClass('selected');
            next.addClass('selected');
        },
        ajustColumns: function () {
            if($('li').length > MAX_TABS){
                $("ul").addClass('twocolumns')
            }else{
                $("ul").removeClass('twocolumns')
            }
        }
    }
}();

var C = function () {

    return {
        highlightUp: function () {
            M.getSelected(function (selected) {
                V.highlightUp(selected);
                V.ajustColumns();
            })
        },
        highlightDown: function () {
            M.getSelected(function (selected) {
                V.highlightDown(selected);
                V.ajustColumns();
            })
        },
        removeTab: function (id) {
            M.removeTab(id);
            V.removeTab(id);
            V.ajustColumns();
        },
        buildTabsList: function () {
            M.getCurrentTabs(function (tabs) {
                V.buildTabsList(tabs);
                V.ajustColumns();
            })
        },
        highlightSelectedTab: function () {
            M.getCurrentTab(function (tab) {
                V.higlightTab(tab.id);
            })
        },
        moveExtensionTabToStart: function () {
            M.getCurrentTab(function (tab) {
                V.moveToStart(tab.id)
            })
        },
        deleteSelected: function () {
            M.getSelected(function (selected) {
                V.highlightUp(selected);
                var id = selected.data().tabId;
                M.removeTab(id);
                V.removeTab(id);
                V.ajustColumns();
            })
        },
        activeTab: function (id) {
            if (id) {
                V.activeTab(id);
                return;
            }
            M.getSelected(function (selected) {
                V.activeTab(selected.data().tabId);
            })
        }
    }
}();

var Events = function () {
    $(window).focus(function() {
        C.buildTabsList();
        C.highlightSelectedTab();
    });

    $(document).on('click', '.btnRemove', function (e) {
        var btn = $(e.target);
        var tabId = btn.data().tabId;
        C.removeTab(tabId);
    });

    $(document).on('click', '.liTab', function (e) {
        var li = $(e.target);
        if (!li.is('li')) return;
        var tabId = li.data().tabId;
        C.activeTab(tabId);
    });

    $(document).keydown(function (e) {
        switch (e.which) {
            case 38: // up
                C.highlightUp();
                break;
            case 40: // down
                C.highlightDown();
                break;
            case 46: // delete
                C.deleteSelected();
                break;
            case 13: // enter
                C.activeTab();
            default: return;
        }
        e.preventDefault();
    });
}();

$(document).ready(function () {
    C.buildTabsList();
    C.moveExtensionTabToStart();
    C.highlightSelectedTab();
});