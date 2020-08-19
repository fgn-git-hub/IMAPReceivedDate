//Get various part of the web extensiion framewrork that we need.
var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
var { ExtensionParent } = ChromeUtils.import("resource://gre/modules/ExtensionParent.jsm");
//var {Services} = ChromeUtils.import("resource://gre/modules/Services.jsm");
//var {Log4Moz} = ChromeUtils.import("resource:///modules/gloda/log4moz.js");
const {Services} = ChromeUtils.import("resource://gre/modules/Services.jsm");


var imaprd_bgrndAPI = class extends ExtensionCommon.ExtensionAPI
{

onShutdown(isAppShutdown) {
            if (isAppShutdown) return;
            // invalidate the startup cache, such that after updating the addon the old
            // version is no longer cached
             shutdown();

            console.log("webextension:shutdown");
            }

    getAPI(context)
        {
               return{
                imaprd_bgrndAPI:
                            {
                                OnStartup: function()
                                {
                                    startup();
                                },
                            }
                    };
        }
};


function startup() {
    var prefBranch = Components.classes["@mozilla.org/preferences-service;1"]
        .getService(Components.interfaces.nsIPrefBranch);
    var prefName = "mailnews.customDBHeaders";
    var headers = prefBranch.getCharPref(prefName);
    if (headers.search(/(^| )Received( |$)/i) < 0) {
	headers = headers + " Received";
	prefBranch.setCharPref(prefName, headers);
    }
    Services.obs.addObserver(WindowObserver, "mail-startup-done", false);
    forEachOpenWindow(loadIntoWindow);
}

function shutdown() {
}

function install() {
}

function uninstall() {
}

function forEachOpenWindow(todo) { // Apply a function to all open windows
  for (let window of Services.wm.getEnumerator("mail:3pane")) {
    if (window.document.readyState != "complete")
      continue;
    todo(window);
  }
}

var WindowObserver = {
    observe: function(aSubject, aTopic, aData) {
        var window = aSubject;
        var document = window.document;
        if (document.documentElement.getAttribute("windowtype") ==
            "mail:3pane") {
            loadIntoWindow(window);
        }
    },
};

function loadIntoWindow(window) {
}
