var load;
var reset;
var editor;

function setup(file, storageKey, globalOptions) {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/json");

    var defData = "";
    if (localStorage.getItem(storageKey) != null) {
        editor.setValue(localStorage.getItem(storageKey));
        httpGet(file, function (resp) {
            defData = resp;
        });
    } else {
        httpGet(file, function (resp) {
            defData = resp;
            editor.setValue(defData);
        });
    }

    load = function() {
        localStorage.setItem(storageKey, editor.getValue());
        localStorage.setItem("globalOptions", globalOptions);
        document.getElementById("frame").src = "index.html";
    };

    reset = function() {
        editor.setValue(defData);
    };

    function httpGet(url, callback) {
        var oReq = new XMLHttpRequest();
        oReq.onload = function () {
            callback(oReq.response)
        };
        oReq.open("GET", url);
        oReq.send();
    }
}
