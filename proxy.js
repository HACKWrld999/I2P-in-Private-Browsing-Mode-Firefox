var titlepref = chrome.i18n.getMessage("titlePreface");
var webpref = chrome.i18n.getMessage("webPreface");
var routerpref = chrome.i18n.getMessage("routerPreface");
var mailpref = chrome.i18n.getMessage("mailPreface");
var torrentpref = chrome.i18n.getMessage("torrentPreface");
var tunnelpref = chrome.i18n.getMessage("i2ptunnelPreface");
var ircpref = chrome.i18n.getMessage("ircPreface");
var extensionpref = chrome.i18n.getMessage("extensionPreface");
var muwirepref = chrome.i18n.getMessage("muwirePreface");
var botepref = chrome.i18n.getMessage("botePreface");
var blogpref = chrome.i18n.getMessage("blogPreface");
var blogprefpriv = chrome.i18n.getMessage("blogPrefacePrivate");
var torpref = chrome.i18n.getMessage("torPreface");
var torprefpriv = chrome.i18n.getMessage("torPreface");

browser.privacy.network.peerConnectionEnabled.set({
  value: true
});

chrome.privacy.network.networkPredictionEnabled.set({
  value: false
});
chrome.privacy.network.webRTCIPHandlingPolicy.set({
  value: "disable_non_proxied_udp"
});
console.log("Disabled unproxied UDP.");

function shouldProxyRequest(requestInfo) {
  return requestInfo.parentFrameId != -1;
}

var handleContextProxyRequest = async function (requestDetails) {
  if (proxyHost(requestDetails)) {
    proxy = {
      type: proxy_scheme(),
      host: proxy_host(),
      port: proxy_port()
    };
    console.warn("(proxy) is proxy check");
    return proxy;
  }

  function ircProxy() {
    if (!requestDetails.url.includes("7669")) {
      proxy = {
        type: proxy_scheme(),
        host: proxy_host(),
        port: proxy_port()
      };
      return proxy;
    }
    if (requestDetails.url.includes(":7669")) {
      proxy = null;
      return proxy;
    }
  }
  /* This is **NOT** the tor SOCKS5 proxy.
            These are the rules for visiting the SOCKS5 proxy manager.
            */
  function torProxy() {
    if (!requestDetails.url.includes("7695")) {
      proxy = {
        type: proxy_scheme(),
        host: proxy_host(),
        port: proxy_port()
      };
      return proxy;
    }
    if (requestDetails.url.includes(":7695")) {
      proxy = null;
      return proxy;
    }
  }

  function blogProxy() {
    if (!requestDetails.url.includes("8084")) {
      proxy = {
        type: proxy_scheme(),
        host: proxy_host(),
        port: proxy_port()
      };
      return proxy;
    }
    if (requestDetails.url.includes(":8084")) {
      proxy = null;
      return proxy;
    }
  }

  function btProxy() {
    proxy = routerProxy();
    if (requestDetails.url.includes(":7662")) {
      proxy = null;
      return proxy;
    }
    console.log("(bt proxy)", proxy);
    return proxy;
  }

  function mainProxy() {
    console.log("(proxy) mainproxy 0");
    proxy = {
      type: proxy_scheme(),
      host: proxy_host(),
      port: proxy_port()
    };
    let url = new URL(requestDetails.url);
    if (
      requestDetails.url.startsWith(
        "http://" + proxy_host() + ":" + control_port() + "/i2psnark/"
      )
    ) {
      //+url.host)) {
      console.log("(proxy) mainproxy 2", url);
      proxy = null;
    }
    return proxy;
  }

  function routerProxy() {
    if (isRouterHost(requestDetails.url)) {
      proxy = null;
      return proxy;
    } else if (!isRouterHost(requestDetails.url)) {
      proxy = {
        type: proxy_scheme(),
        host: proxy_host(),
        port: proxy_port()
      };
      return proxy;
    }
  }
  try {
    var handleProxyRequest = function (context) {
      proxy = {
        type: proxy_scheme(),
        host: proxy_host(),
        port: proxy_port()
      };

      if (context == "firefox-default" || context == "firefox-private") {
        proxy = null;
        return proxy;
      }

      // eslint-disable-next-line no-negated-condition
      if (context != undefined) {
        console.log("(proxy), context", context);
        if (context.name == ircpref) {
          proxy = ircProxy();
          return proxy;
        } else if (context.name == torpref) {
          proxy = torProxy();
          return proxy;
        } else if (context.name == blogpref) {
          proxy = blogProxy();
          return proxy;
        } else if (context.name == titlepref) {
          proxy = mainProxy();
          return proxy;
        } else if (context.name == routerpref) {
          proxy = routerProxy();
          return proxy;
        } else if (context.name == torrentpref) {
          proxy = btProxy();
          return proxy;
        } else if (context.name == mailpref) {
          proxy = routerProxy();
          return proxy;
        } else if (context.name == tunnelpref) {
          proxy = routerProxy();
          return proxy;
        } else if (context.name == muwirepref) {
          proxy = routerProxy();
          return proxy;
        } else if (context.name == botepref) {
          proxy = routerProxy();
          return proxy;
        }
      } else {
        if (!isRouterHost(requestDetails.url)) {
          if (getLocalhostUrlType(requestDetails.url)) {
            if (requestDetails.url.includes(":7669")) {
              proxy = null;
            } else if (requestDetails.url.includes(":7662")) {
              proxy = null;
            } else if (requestDetails.url.includes(":7695")) {
              proxy = null;
            } else {
              console.log(
                "(proxy) non-routerconsole localhost url, will not interfere",
                requestDetails.url
              );
            }
          }
        }
        if (i2pHost(requestDetails)) {
          proxy = {
            type: proxy_scheme(),
            host: proxy_host(),
            port: proxy_port()
          };
        } else if (proxyHost(requestDetails)) {
          proxy = {
            type: proxy_scheme(),
            host: proxy_host(),
            port: proxy_port()
          };
        } else {
          proxy = null;
        }
        if (requestDetails.url.includes("rpc")) {
          console.log("(proxy for rpc url)", rpc);
        }
        /* var tab = tabGet(requestDetails.tabId);
                                                   tab.then(handleTabRequest,) */
        return proxy;
      }
    };
    var contextGet = async function (tabInfo) {
      try {
        context = await browser.contextualIdentities.get(tabInfo.cookieStoreId);
        return context;
      } catch (error) {
        console.warn(error);
        return "firefox-default";
      }
    };
    var tabGet = async function (tabId) {
      try {
        let tabInfo = await browser.tabs.get(tabId);
        return tabInfo;
      } catch (error) {
        console.log("(proxy)Tab error", error);
      }
    };
    if (proxyHost(requestDetails)) {
      proxy = {
        type: proxy_scheme(),
        host: proxy_host(),
        port: proxy_port()
      };
      return proxy;
    }
    if (requestDetails.originUrl == browser.runtime.getURL("security.html")) {
      proxy = {
        type: proxy_scheme(),
        host: proxy_host(),
        port: proxy_port()
      };
      return proxy;
    }
    if (
      requestDetails.cookieStoreId == "firefox-default" ||
      requestDetails.cookieStoreId == "firefox-private"
    ) {
      if (browser.windows != undefined) {
        return browser.proxy.settings.get({});
      }
    }
    if (requestDetails.tabId > 0) {
      if (requestDetails.url.includes("MuWire")) {
        return;
      }
      if (proxyHost(requestDetails)) {
        proxy = {
          type: proxy_scheme(),
          host: proxy_host(),
          port: proxy_port()
        };
        return proxy;
      } else if (i2pHost(requestDetails)) {
        var tab = tabGet(requestDetails.tabId);
        requestDetails.tabId = tab;
        var context = tab.then(contextGet);
        var proxy = await context.then(handleProxyRequest);
        //console.log('(proxy)Returning I2P Proxy', proxy);
        return proxy;
      } else if (extensionHost(requestDetails)) {
        return;
      } else {
        var tab = tabGet(requestDetails.tabId);
        var context = tab.then(contextGet);
        var proxy = await context.then(handleProxyRequest);
        //console.log("(proxy)Returning I2P Proxy", proxy);
        return proxy;
      }
      /*proxy = {};
                                    console.log("(proxy)Returning unset Proxy", proxy);
                                    return proxy;*/
    } else {
      proxy = {
        type: proxy_scheme(),
        host: proxy_host(),
        port: proxy_port()
      };
      //console.log('(proxy for rpc url)', rpc);
      return proxy;
    }
  } catch (error) {
    console.log("(proxy)Not using I2P Proxy.", error);
  }
};

function SetupSettings() {
  console.log("Initialising Settings");
}

function setupProxy() {
  console.log("Setting up Firefox WebExtension proxy");
  browser.proxy.onRequest.addListener(handleContextProxyRequest, {
    urls: ["<all_urls>"]
  });
  console.log("i2p settings created for WebExtension Proxy");
  browser.proxy.onError.addListener(handleContextProxyError);
}

function handleContextProxyError(err) {
  function changeTabErr(error) {
    console.error(`(proxy) Error : ${error}`);
  }
  console.warn("(proxy) Error:", err);
  if (err.message = "ProxyInfoData: Invalid proxy server type: \"undefined\"") {
    return;
  }

  function changeTabPage(tabs) {
    function checkTabCookieStore(context) {
      for (let index = 0; index < tabs.length; index += 1) {
        let tab = tabs[index];
        if (!tab.url.endsWith("proxyerr.html")) {
          if (tab.cookieStoreId == context[0].cookieStoreId) {
            function onProxyErrorUpdated() {
              console.warn("(proxy) Updated tab : " + tab);
            }

            function onProxyError(error) {
              console.error(`(proxy) Error : ${error}`);
            }
            let createData = {
              url: "proxyerr.html"
            };
            let creating = browser.tabs.update(tab.id, createData);
            creating.then(onProxyErrorUpdated, onProxyError);
          } else {
            console.warn(
              "Not directing to proxy error page due to context mismatch"
            );
          }
        } else {
          console.warn(
            "Not directing to proxy error page due to hostname match"
          );
        }
      }
    }
    browser.contextualIdentities
      .query({ name: titlepref })
      .then(checkTabCookieStore, changeTabErr);
  }
  browser.tabs
    .query({ url: ["http://*.i2p/*"] })
    .then(changeTabPage, changeTabErr);
}

function update() {
  console.log("(proxy) restoring proxy scheme:", proxy_scheme());
  console.log("(proxy) restoring proxy host:", proxy_host());
  console.log("(proxy) restoring proxy port:", proxy_port());
  console.log("(proxy) restoring control host:", control_host());
  console.log("(proxy) restoring control port:", control_port());
}

function updateFromStorage() {
  console.log("updating settings from storage");
  chrome.storage.local.get(function () {
    SetupSettings();
    update();
    setupProxy();
  });
}

//updateFromStorage();
browser.storage.onChanged.addListener(updateFromStorage);
SetupSettings();
setupProxy();

var gettingListenerInfo = browser.runtime.getPlatformInfo();
gettingListenerInfo.then(got => {
  if (browser.windows != undefined) {
    browser.windows.onCreated.addListener(() => {
      chrome.storage.local.get(function () {
        setupProxy();
      });
    });
  }
});
