var load;
var reset;
var insert;
var editor;

function setup(file, storageKey, globalOptions, insertMaterial) {
    if (!insertMaterial) {
        insertMaterial = "";
    }
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/json");
    editor.commands.addCommand({
        name: 'loadIntoTurtleTime',
        bindKey: {win: 'Ctrl-B',  mac: 'Command-B'},
        exec: function(editor) {
            load();
        },
        readOnly: true
    });
    editor.commands.addCommand({
        name: 'addCustom',
        bindKey: {win: 'Ctrl-I',  mac: 'Command-I'},
        exec: function(editor) {
            insert();
        },
        readOnly: false
    });
    editor.setOptions({
        scrollPastEnd: 0.8,
        tabSize: 2
    });

    var defData = "";
    if (localStorage.getItem(storageKey) != null) {
        editor.setValue(localStorage.getItem(storageKey));
        editor.clearSelection();
        httpGet(file, function (resp) {
            defData = resp;
        });
    } else {
        httpGet(file, function (resp) {
            defData = resp;
            editor.setValue(defData);
            editor.clearSelection();
        });
    }

    load = function() {
        localStorage.setItem(storageKey, editor.getValue());
        localStorage.setItem("globalOptions", globalOptions);
        document.getElementById("frame").src = "index.html";
    };

    reset = function() {
        editor.setValue(defData);
        editor.clearSelection();
    };

    insert = function() {
        var currline = editor.getSelectionRange().start.row;
        var wholelinetxt = editor.session.getLine(currline);
        var leadingWhitespace = wholelinetxt.match(/^\s*/)[0];
        var reformatted = insertMaterial.replace(/\n/g, '\n' + leadingWhitespace);
        editor.insert(reformatted);
    }

    function httpGet(url, callback) {
        var oReq = new XMLHttpRequest();
        oReq.onload = function () {
            callback(oReq.response)
        };
        oReq.open("GET", url);
        oReq.send();
    }
}
