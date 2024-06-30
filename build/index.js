/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@remix-run/router/dist/router.js":
/*!*******************************************************!*\
  !*** ./node_modules/@remix-run/router/dist/router.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortedDeferredError: () => (/* binding */ AbortedDeferredError),
/* harmony export */   Action: () => (/* binding */ Action),
/* harmony export */   IDLE_BLOCKER: () => (/* binding */ IDLE_BLOCKER),
/* harmony export */   IDLE_FETCHER: () => (/* binding */ IDLE_FETCHER),
/* harmony export */   IDLE_NAVIGATION: () => (/* binding */ IDLE_NAVIGATION),
/* harmony export */   UNSAFE_DEFERRED_SYMBOL: () => (/* binding */ UNSAFE_DEFERRED_SYMBOL),
/* harmony export */   UNSAFE_DeferredData: () => (/* binding */ DeferredData),
/* harmony export */   UNSAFE_ErrorResponseImpl: () => (/* binding */ ErrorResponseImpl),
/* harmony export */   UNSAFE_convertRouteMatchToUiMatch: () => (/* binding */ convertRouteMatchToUiMatch),
/* harmony export */   UNSAFE_convertRoutesToDataRoutes: () => (/* binding */ convertRoutesToDataRoutes),
/* harmony export */   UNSAFE_getResolveToMatches: () => (/* binding */ getResolveToMatches),
/* harmony export */   UNSAFE_invariant: () => (/* binding */ invariant),
/* harmony export */   UNSAFE_warning: () => (/* binding */ warning),
/* harmony export */   createBrowserHistory: () => (/* binding */ createBrowserHistory),
/* harmony export */   createHashHistory: () => (/* binding */ createHashHistory),
/* harmony export */   createMemoryHistory: () => (/* binding */ createMemoryHistory),
/* harmony export */   createPath: () => (/* binding */ createPath),
/* harmony export */   createRouter: () => (/* binding */ createRouter),
/* harmony export */   createStaticHandler: () => (/* binding */ createStaticHandler),
/* harmony export */   defer: () => (/* binding */ defer),
/* harmony export */   generatePath: () => (/* binding */ generatePath),
/* harmony export */   getStaticContextFromError: () => (/* binding */ getStaticContextFromError),
/* harmony export */   getToPathname: () => (/* binding */ getToPathname),
/* harmony export */   isDeferredData: () => (/* binding */ isDeferredData),
/* harmony export */   isRouteErrorResponse: () => (/* binding */ isRouteErrorResponse),
/* harmony export */   joinPaths: () => (/* binding */ joinPaths),
/* harmony export */   json: () => (/* binding */ json),
/* harmony export */   matchPath: () => (/* binding */ matchPath),
/* harmony export */   matchRoutes: () => (/* binding */ matchRoutes),
/* harmony export */   normalizePathname: () => (/* binding */ normalizePathname),
/* harmony export */   parsePath: () => (/* binding */ parsePath),
/* harmony export */   redirect: () => (/* binding */ redirect),
/* harmony export */   redirectDocument: () => (/* binding */ redirectDocument),
/* harmony export */   resolvePath: () => (/* binding */ resolvePath),
/* harmony export */   resolveTo: () => (/* binding */ resolveTo),
/* harmony export */   stripBasename: () => (/* binding */ stripBasename)
/* harmony export */ });
/**
 * @remix-run/router v1.17.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

////////////////////////////////////////////////////////////////////////////////
//#region Types and Constants
////////////////////////////////////////////////////////////////////////////////
/**
 * Actions represent the type of change to a location value.
 */
var Action;
(function (Action) {
  /**
   * A POP indicates a change to an arbitrary index in the history stack, such
   * as a back or forward navigation. It does not describe the direction of the
   * navigation, only that the current index changed.
   *
   * Note: This is the default action for newly created history objects.
   */
  Action["Pop"] = "POP";
  /**
   * A PUSH indicates a new entry being added to the history stack, such as when
   * a link is clicked and a new page loads. When this happens, all subsequent
   * entries in the stack are lost.
   */
  Action["Push"] = "PUSH";
  /**
   * A REPLACE indicates the entry at the current index in the history stack
   * being replaced by a new one.
   */
  Action["Replace"] = "REPLACE";
})(Action || (Action = {}));
const PopStateEventType = "popstate";
/**
 * Memory history stores the current location in memory. It is designed for use
 * in stateful non-browser environments like tests and React Native.
 */
function createMemoryHistory(options) {
  if (options === void 0) {
    options = {};
  }
  let {
    initialEntries = ["/"],
    initialIndex,
    v5Compat = false
  } = options;
  let entries; // Declare so we can access from createMemoryLocation
  entries = initialEntries.map((entry, index) => createMemoryLocation(entry, typeof entry === "string" ? null : entry.state, index === 0 ? "default" : undefined));
  let index = clampIndex(initialIndex == null ? entries.length - 1 : initialIndex);
  let action = Action.Pop;
  let listener = null;
  function clampIndex(n) {
    return Math.min(Math.max(n, 0), entries.length - 1);
  }
  function getCurrentLocation() {
    return entries[index];
  }
  function createMemoryLocation(to, state, key) {
    if (state === void 0) {
      state = null;
    }
    let location = createLocation(entries ? getCurrentLocation().pathname : "/", to, state, key);
    warning(location.pathname.charAt(0) === "/", "relative pathnames are not supported in memory history: " + JSON.stringify(to));
    return location;
  }
  function createHref(to) {
    return typeof to === "string" ? to : createPath(to);
  }
  let history = {
    get index() {
      return index;
    },
    get action() {
      return action;
    },
    get location() {
      return getCurrentLocation();
    },
    createHref,
    createURL(to) {
      return new URL(createHref(to), "http://localhost");
    },
    encodeLocation(to) {
      let path = typeof to === "string" ? parsePath(to) : to;
      return {
        pathname: path.pathname || "",
        search: path.search || "",
        hash: path.hash || ""
      };
    },
    push(to, state) {
      action = Action.Push;
      let nextLocation = createMemoryLocation(to, state);
      index += 1;
      entries.splice(index, entries.length, nextLocation);
      if (v5Compat && listener) {
        listener({
          action,
          location: nextLocation,
          delta: 1
        });
      }
    },
    replace(to, state) {
      action = Action.Replace;
      let nextLocation = createMemoryLocation(to, state);
      entries[index] = nextLocation;
      if (v5Compat && listener) {
        listener({
          action,
          location: nextLocation,
          delta: 0
        });
      }
    },
    go(delta) {
      action = Action.Pop;
      let nextIndex = clampIndex(index + delta);
      let nextLocation = entries[nextIndex];
      index = nextIndex;
      if (listener) {
        listener({
          action,
          location: nextLocation,
          delta
        });
      }
    },
    listen(fn) {
      listener = fn;
      return () => {
        listener = null;
      };
    }
  };
  return history;
}
/**
 * Browser history stores the location in regular URLs. This is the standard for
 * most web apps, but it requires some configuration on the server to ensure you
 * serve the same app at multiple URLs.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createbrowserhistory
 */
function createBrowserHistory(options) {
  if (options === void 0) {
    options = {};
  }
  function createBrowserLocation(window, globalHistory) {
    let {
      pathname,
      search,
      hash
    } = window.location;
    return createLocation("", {
      pathname,
      search,
      hash
    },
    // state defaults to `null` because `window.history.state` does
    globalHistory.state && globalHistory.state.usr || null, globalHistory.state && globalHistory.state.key || "default");
  }
  function createBrowserHref(window, to) {
    return typeof to === "string" ? to : createPath(to);
  }
  return getUrlBasedHistory(createBrowserLocation, createBrowserHref, null, options);
}
/**
 * Hash history stores the location in window.location.hash. This makes it ideal
 * for situations where you don't want to send the location to the server for
 * some reason, either because you do cannot configure it or the URL space is
 * reserved for something else.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createhashhistory
 */
function createHashHistory(options) {
  if (options === void 0) {
    options = {};
  }
  function createHashLocation(window, globalHistory) {
    let {
      pathname = "/",
      search = "",
      hash = ""
    } = parsePath(window.location.hash.substr(1));
    // Hash URL should always have a leading / just like window.location.pathname
    // does, so if an app ends up at a route like /#something then we add a
    // leading slash so all of our path-matching behaves the same as if it would
    // in a browser router.  This is particularly important when there exists a
    // root splat route (<Route path="*">) since that matches internally against
    // "/*" and we'd expect /#something to 404 in a hash router app.
    if (!pathname.startsWith("/") && !pathname.startsWith(".")) {
      pathname = "/" + pathname;
    }
    return createLocation("", {
      pathname,
      search,
      hash
    },
    // state defaults to `null` because `window.history.state` does
    globalHistory.state && globalHistory.state.usr || null, globalHistory.state && globalHistory.state.key || "default");
  }
  function createHashHref(window, to) {
    let base = window.document.querySelector("base");
    let href = "";
    if (base && base.getAttribute("href")) {
      let url = window.location.href;
      let hashIndex = url.indexOf("#");
      href = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }
    return href + "#" + (typeof to === "string" ? to : createPath(to));
  }
  function validateHashLocation(location, to) {
    warning(location.pathname.charAt(0) === "/", "relative pathnames are not supported in hash history.push(" + JSON.stringify(to) + ")");
  }
  return getUrlBasedHistory(createHashLocation, createHashHref, validateHashLocation, options);
}
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== "undefined") console.warn(message);
    try {
      // Welcome to debugging history!
      //
      // This error is thrown as a convenience, so you can more easily
      // find the source for a warning that appears in the console by
      // enabling "pause on exceptions" in your JavaScript debugger.
      throw new Error(message);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}
function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
/**
 * For browser-based histories, we combine the state and key into an object
 */
function getHistoryState(location, index) {
  return {
    usr: location.state,
    key: location.key,
    idx: index
  };
}
/**
 * Creates a Location object with a unique key from the given Path
 */
function createLocation(current, to, state, key) {
  if (state === void 0) {
    state = null;
  }
  let location = _extends({
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: ""
  }, typeof to === "string" ? parsePath(to) : to, {
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to && to.key || key || createKey()
  });
  return location;
}
/**
 * Creates a string URL path from the given pathname, search, and hash components.
 */
function createPath(_ref) {
  let {
    pathname = "/",
    search = "",
    hash = ""
  } = _ref;
  if (search && search !== "?") pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#") pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
/**
 * Parses a string URL path into its separate pathname, search, and hash components.
 */
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
function getUrlBasedHistory(getLocation, createHref, validateLocation, options) {
  if (options === void 0) {
    options = {};
  }
  let {
    window = document.defaultView,
    v5Compat = false
  } = options;
  let globalHistory = window.history;
  let action = Action.Pop;
  let listener = null;
  let index = getIndex();
  // Index should only be null when we initialize. If not, it's because the
  // user called history.pushState or history.replaceState directly, in which
  // case we should log a warning as it will result in bugs.
  if (index == null) {
    index = 0;
    globalHistory.replaceState(_extends({}, globalHistory.state, {
      idx: index
    }), "");
  }
  function getIndex() {
    let state = globalHistory.state || {
      idx: null
    };
    return state.idx;
  }
  function handlePop() {
    action = Action.Pop;
    let nextIndex = getIndex();
    let delta = nextIndex == null ? null : nextIndex - index;
    index = nextIndex;
    if (listener) {
      listener({
        action,
        location: history.location,
        delta
      });
    }
  }
  function push(to, state) {
    action = Action.Push;
    let location = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location, to);
    index = getIndex() + 1;
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    // try...catch because iOS limits us to 100 pushState calls :/
    try {
      globalHistory.pushState(historyState, "", url);
    } catch (error) {
      // If the exception is because `state` can't be serialized, let that throw
      // outwards just like a replace call would so the dev knows the cause
      // https://html.spec.whatwg.org/multipage/nav-history-apis.html#shared-history-push/replace-state-steps
      // https://html.spec.whatwg.org/multipage/structured-data.html#structuredserializeinternal
      if (error instanceof DOMException && error.name === "DataCloneError") {
        throw error;
      }
      // They are going to lose state here, but there is no real
      // way to warn them about it since the page will refresh...
      window.location.assign(url);
    }
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 1
      });
    }
  }
  function replace(to, state) {
    action = Action.Replace;
    let location = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location, to);
    index = getIndex();
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    globalHistory.replaceState(historyState, "", url);
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 0
      });
    }
  }
  function createURL(to) {
    // window.location.origin is "null" (the literal string value) in Firefox
    // under certain conditions, notably when serving from a local HTML file
    // See https://bugzilla.mozilla.org/show_bug.cgi?id=878297
    let base = window.location.origin !== "null" ? window.location.origin : window.location.href;
    let href = typeof to === "string" ? to : createPath(to);
    // Treating this as a full URL will strip any trailing spaces so we need to
    // pre-encode them since they might be part of a matching splat param from
    // an ancestor route
    href = href.replace(/ $/, "%20");
    invariant(base, "No window.location.(origin|href) available to create URL for href: " + href);
    return new URL(href, base);
  }
  let history = {
    get action() {
      return action;
    },
    get location() {
      return getLocation(window, globalHistory);
    },
    listen(fn) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window.addEventListener(PopStateEventType, handlePop);
      listener = fn;
      return () => {
        window.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to) {
      return createHref(window, to);
    },
    createURL,
    encodeLocation(to) {
      // Encode a Location the same way window.location would
      let url = createURL(to);
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash
      };
    },
    push,
    replace,
    go(n) {
      return globalHistory.go(n);
    }
  };
  return history;
}
//#endregion

var ResultType;
(function (ResultType) {
  ResultType["data"] = "data";
  ResultType["deferred"] = "deferred";
  ResultType["redirect"] = "redirect";
  ResultType["error"] = "error";
})(ResultType || (ResultType = {}));
const immutableRouteKeys = new Set(["lazy", "caseSensitive", "path", "id", "index", "children"]);
function isIndexRoute(route) {
  return route.index === true;
}
// Walk the route tree generating unique IDs where necessary, so we are working
// solely with AgnosticDataRouteObject's within the Router
function convertRoutesToDataRoutes(routes, mapRouteProperties, parentPath, manifest) {
  if (parentPath === void 0) {
    parentPath = [];
  }
  if (manifest === void 0) {
    manifest = {};
  }
  return routes.map((route, index) => {
    let treePath = [...parentPath, String(index)];
    let id = typeof route.id === "string" ? route.id : treePath.join("-");
    invariant(route.index !== true || !route.children, "Cannot specify children on an index route");
    invariant(!manifest[id], "Found a route id collision on id \"" + id + "\".  Route " + "id's must be globally unique within Data Router usages");
    if (isIndexRoute(route)) {
      let indexRoute = _extends({}, route, mapRouteProperties(route), {
        id
      });
      manifest[id] = indexRoute;
      return indexRoute;
    } else {
      let pathOrLayoutRoute = _extends({}, route, mapRouteProperties(route), {
        id,
        children: undefined
      });
      manifest[id] = pathOrLayoutRoute;
      if (route.children) {
        pathOrLayoutRoute.children = convertRoutesToDataRoutes(route.children, mapRouteProperties, treePath, manifest);
      }
      return pathOrLayoutRoute;
    }
  });
}
/**
 * Matches the given routes to a location and returns the match data.
 *
 * @see https://reactrouter.com/utils/match-routes
 */
function matchRoutes(routes, locationArg, basename) {
  if (basename === void 0) {
    basename = "/";
  }
  return matchRoutesImpl(routes, locationArg, basename, false);
}
function matchRoutesImpl(routes, locationArg, basename, allowPartial) {
  let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    // Incoming pathnames are generally encoded from either window.location
    // or from router.navigate, but we want to match against the unencoded
    // paths in the route definitions.  Memory router locations won't be
    // encoded here but there also shouldn't be anything to decode so this
    // should be a safe operation.  This avoids needing matchRoutes to be
    // history-aware.
    let decoded = decodePath(pathname);
    matches = matchRouteBranch(branches[i], decoded, allowPartial);
  }
  return matches;
}
function convertRouteMatchToUiMatch(match, loaderData) {
  let {
    route,
    pathname,
    params
  } = match;
  return {
    id: route.id,
    pathname,
    params,
    data: loaderData[route.id],
    handle: route.handle
  };
}
function flattenRoutes(routes, branches, parentsMeta, parentPath) {
  if (branches === void 0) {
    branches = [];
  }
  if (parentsMeta === void 0) {
    parentsMeta = [];
  }
  if (parentPath === void 0) {
    parentPath = "";
  }
  let flattenRoute = (route, index, relativePath) => {
    let meta = {
      relativePath: relativePath === undefined ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      invariant(meta.relativePath.startsWith(parentPath), "Absolute route path \"" + meta.relativePath + "\" nested under path " + ("\"" + parentPath + "\" is not valid. An absolute child route path ") + "must start with the combined path of all its parent routes.");
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    // Add the children before adding this route to the array, so we traverse the
    // route tree depth-first and child routes appear before their parents in
    // the "flattened" version.
    if (route.children && route.children.length > 0) {
      invariant(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      route.index !== true, "Index routes must not have child routes. Please remove " + ("all child routes from route path \"" + path + "\"."));
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    // Routes without a path shouldn't ever match by themselves unless they are
    // index routes, so don't add them to the list of possible branches.
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes.forEach((route, index) => {
    var _route$path;
    // coarse-grain check for optional params
    if (route.path === "" || !((_route$path = route.path) != null && _route$path.includes("?"))) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, exploded);
      }
    }
  });
  return branches;
}
/**
 * Computes all combinations of optional path segments for a given path,
 * excluding combinations that are ambiguous and of lower priority.
 *
 * For example, `/one/:two?/three/:four?/:five?` explodes to:
 * - `/one/three`
 * - `/one/:two/three`
 * - `/one/three/:four`
 * - `/one/three/:five`
 * - `/one/:two/three/:four`
 * - `/one/:two/three/:five`
 * - `/one/three/:four/:five`
 * - `/one/:two/three/:four/:five`
 */
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0) return [];
  let [first, ...rest] = segments;
  // Optional path segments are denoted by a trailing `?`
  let isOptional = first.endsWith("?");
  // Compute the corresponding required segment: `foo?` -> `foo`
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    // Intepret empty string as omitting an optional segment
    // `["one", "", "three"]` corresponds to omitting `:two` from `/one/:two?/three` -> `/one/three`
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  // All child paths with the prefix.  Do this for all children before the
  // optional version for all children, so we get consistent ordering where the
  // parent optional aspect is preferred as required.  Otherwise, we can get
  // child sections interspersed where deeper optional segments are higher than
  // parent optional segments, where for example, /:two would explode _earlier_
  // then /:one.  By always including the parent as required _for all children_
  // first, we avoid this issue
  result.push(...restExploded.map(subpath => subpath === "" ? required : [required, subpath].join("/")));
  // Then, if this is an optional value, add all child versions without
  if (isOptional) {
    result.push(...restExploded);
  }
  // for absolute paths, ensure `/` instead of empty segment
  return result.map(exploded => path.startsWith("/") && exploded === "" ? "/" : exploded);
}
function rankRouteBranches(branches) {
  branches.sort((a, b) => a.score !== b.score ? b.score - a.score // Higher score first
  : compareIndexes(a.routesMeta.map(meta => meta.childrenIndex), b.routesMeta.map(meta => meta.childrenIndex)));
}
const paramRe = /^:[\w-]+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = s => s === "*";
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter(s => !isSplat(s)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}
function compareIndexes(a, b) {
  let siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
  return siblings ?
  // If two routes are siblings, we should try to match the earlier sibling
  // first. This allows people to have fine-grained control over the matching
  // behavior by simply putting routes with identical paths in the order they
  // want them tried.
  a[a.length - 1] - b[b.length - 1] :
  // Otherwise, it doesn't really make sense to rank non-siblings by index,
  // so they sort equally.
  0;
}
function matchRouteBranch(branch, pathname, allowPartial) {
  if (allowPartial === void 0) {
    allowPartial = false;
  }
  let {
    routesMeta
  } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath({
      path: meta.relativePath,
      caseSensitive: meta.caseSensitive,
      end
    }, remainingPathname);
    let route = meta.route;
    if (!match && end && allowPartial && !routesMeta[routesMeta.length - 1].route.index) {
      match = matchPath({
        path: meta.relativePath,
        caseSensitive: meta.caseSensitive,
        end: false
      }, remainingPathname);
    }
    if (!match) {
      return null;
    }
    Object.assign(matchedParams, match.params);
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
/**
 * Returns a path with params interpolated.
 *
 * @see https://reactrouter.com/utils/generate-path
 */
function generatePath(originalPath, params) {
  if (params === void 0) {
    params = {};
  }
  let path = originalPath;
  if (path.endsWith("*") && path !== "*" && !path.endsWith("/*")) {
    warning(false, "Route path \"" + path + "\" will be treated as if it were " + ("\"" + path.replace(/\*$/, "/*") + "\" because the `*` character must ") + "always follow a `/` in the pattern. To get rid of this warning, " + ("please change the route path to \"" + path.replace(/\*$/, "/*") + "\"."));
    path = path.replace(/\*$/, "/*");
  }
  // ensure `/` is added at the beginning if the path is absolute
  const prefix = path.startsWith("/") ? "/" : "";
  const stringify = p => p == null ? "" : typeof p === "string" ? p : String(p);
  const segments = path.split(/\/+/).map((segment, index, array) => {
    const isLastSegment = index === array.length - 1;
    // only apply the splat if it's the last segment
    if (isLastSegment && segment === "*") {
      const star = "*";
      // Apply the splat
      return stringify(params[star]);
    }
    const keyMatch = segment.match(/^:([\w-]+)(\??)$/);
    if (keyMatch) {
      const [, key, optional] = keyMatch;
      let param = params[key];
      invariant(optional === "?" || param != null, "Missing \":" + key + "\" param");
      return stringify(param);
    }
    // Remove any optional markers from optional static segments
    return segment.replace(/\?$/g, "");
  })
  // Remove empty segments
  .filter(segment => !!segment);
  return prefix + segments.join("/");
}
/**
 * Performs pattern matching on a URL pathname and returns information about
 * the match.
 *
 * @see https://reactrouter.com/utils/match-path
 */
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = {
      path: pattern,
      caseSensitive: false,
      end: true
    };
  }
  let [matcher, compiledParams] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce((memo, _ref, index) => {
    let {
      paramName,
      isOptional
    } = _ref;
    // We need to compute the pathnameBase here using the raw splat value
    // instead of using params["*"] later because it will be decoded then
    if (paramName === "*") {
      let splatValue = captureGroups[index] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }
    const value = captureGroups[index];
    if (isOptional && !value) {
      memo[paramName] = undefined;
    } else {
      memo[paramName] = (value || "").replace(/%2F/g, "/");
    }
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive, end) {
  if (caseSensitive === void 0) {
    caseSensitive = false;
  }
  if (end === void 0) {
    end = true;
  }
  warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), "Route path \"" + path + "\" will be treated as if it were " + ("\"" + path.replace(/\*$/, "/*") + "\" because the `*` character must ") + "always follow a `/` in the pattern. To get rid of this warning, " + ("please change the route path to \"" + path.replace(/\*$/, "/*") + "\"."));
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "") // Ignore trailing / and /*, we'll handle it below
  .replace(/^\/*/, "/") // Make sure it has a leading /
  .replace(/[\\.*+^${}|()[\]]/g, "\\$&") // Escape special regex chars
  .replace(/\/:([\w-]+)(\?)?/g, (_, paramName, isOptional) => {
    params.push({
      paramName,
      isOptional: isOptional != null
    });
    return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
  });
  if (path.endsWith("*")) {
    params.push({
      paramName: "*"
    });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" // Already matched the initial /, just match the rest
    : "(?:\\/(.+)|\\/*)$"; // Don't include the / in params["*"]
  } else if (end) {
    // When matching to the end, ignore trailing slashes
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    // If our path is non-empty and contains anything beyond an initial slash,
    // then we have _some_ form of path in our regex, so we should expect to
    // match only if we find the end of this path segment.  Look for an optional
    // non-captured trailing slash (to match a portion of the URL) or the end
    // of the path (if we've matched to the end).  We used to do this with a
    // word boundary but that gives false positives on routes like
    // /user-preferences since `-` counts as a word boundary.
    regexpSource += "(?:(?=\\/|$))";
  } else ;
  let matcher = new RegExp(regexpSource, caseSensitive ? undefined : "i");
  return [matcher, params];
}
function decodePath(value) {
  try {
    return value.split("/").map(v => decodeURIComponent(v).replace(/\//g, "%2F")).join("/");
  } catch (error) {
    warning(false, "The URL path \"" + value + "\" could not be decoded because it is is a " + "malformed URL segment. This is probably due to a bad percent " + ("encoding (" + error + ")."));
    return value;
  }
}
/**
 * @private
 */
function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  // We want to leave trailing slash behavior in the user's control, so if they
  // specify a basename with a trailing slash, we should support it
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    // pathname does not start with basename/
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
/**
 * Returns a resolved path object relative to the given pathname.
 *
 * @see https://reactrouter.com/utils/resolve-path
 */
function resolvePath(to, fromPathname) {
  if (fromPathname === void 0) {
    fromPathname = "/";
  }
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname = toPathname ? toPathname.startsWith("/") ? toPathname : resolvePathname(toPathname, fromPathname) : fromPathname;
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach(segment => {
    if (segment === "..") {
      // Keep the root "" segment so the pathname starts at /
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return "Cannot include a '" + char + "' character in a manually specified " + ("`to." + field + "` field [" + JSON.stringify(path) + "].  Please separate it out to the ") + ("`to." + dest + "` field. Alternatively you may provide the full path as ") + "a string in <Link to=\"...\"> and the router will parse it for you.";
}
/**
 * @private
 *
 * When processing relative navigation we want to ignore ancestor routes that
 * do not contribute to the path, such that index/pathless layout routes don't
 * interfere.
 *
 * For example, when moving a route element into an index route and/or a
 * pathless layout route, relative link behavior contained within should stay
 * the same.  Both of the following examples should link back to the root:
 *
 *   <Route path="/">
 *     <Route path="accounts" element={<Link to=".."}>
 *   </Route>
 *
 *   <Route path="/">
 *     <Route path="accounts">
 *       <Route element={<AccountsLayout />}>       // <-- Does not contribute
 *         <Route index element={<Link to=".."} />  // <-- Does not contribute
 *       </Route
 *     </Route>
 *   </Route>
 */
function getPathContributingMatches(matches) {
  return matches.filter((match, index) => index === 0 || match.route.path && match.route.path.length > 0);
}
// Return the array of pathnames for the current route matches - used to
// generate the routePathnames input for resolveTo()
function getResolveToMatches(matches, v7_relativeSplatPath) {
  let pathMatches = getPathContributingMatches(matches);
  // When v7_relativeSplatPath is enabled, use the full pathname for the leaf
  // match so we include splat values for "." links.  See:
  // https://github.com/remix-run/react-router/issues/11052#issuecomment-1836589329
  if (v7_relativeSplatPath) {
    return pathMatches.map((match, idx) => idx === matches.length - 1 ? match.pathname : match.pathnameBase);
  }
  return pathMatches.map(match => match.pathnameBase);
}
/**
 * @private
 */
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative) {
  if (isPathRelative === void 0) {
    isPathRelative = false;
  }
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = _extends({}, toArg);
    invariant(!to.pathname || !to.pathname.includes("?"), getInvalidPathError("?", "pathname", "search", to));
    invariant(!to.pathname || !to.pathname.includes("#"), getInvalidPathError("#", "pathname", "hash", to));
    invariant(!to.search || !to.search.includes("#"), getInvalidPathError("#", "search", "hash", to));
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  // Routing is relative to the current pathname if explicitly requested.
  //
  // If a pathname is explicitly provided in `to`, it should be relative to the
  // route context. This is explained in `Note on `<Link to>` values` in our
  // migration guide from v5 as a means of disambiguation between `to` values
  // that begin with `/` and those that do not. However, this is problematic for
  // `to` values that do not provide a pathname. `to` can simply be a search or
  // hash string, in which case we should assume that the navigation is relative
  // to the current location's pathname and *not* the route pathname.
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    // With relative="route" (the default), each leading .. segment means
    // "go up one route" instead of "go up one URL segment".  This is a key
    // difference from how <a href> works and a major reason we call this a
    // "to" value instead of a "href".
    if (!isPathRelative && toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  // Ensure the pathname has a trailing slash if the original "to" had one
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  // Or if this was a link to the current path which has a trailing slash
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
/**
 * @private
 */
function getToPathname(to) {
  // Empty strings should be treated the same as / paths
  return to === "" || to.pathname === "" ? "/" : typeof to === "string" ? parsePath(to).pathname : to.pathname;
}
/**
 * @private
 */
const joinPaths = paths => paths.join("/").replace(/\/\/+/g, "/");
/**
 * @private
 */
const normalizePathname = pathname => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
/**
 * @private
 */
const normalizeSearch = search => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
/**
 * @private
 */
const normalizeHash = hash => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
/**
 * This is a shortcut for creating `application/json` responses. Converts `data`
 * to JSON and sets the `Content-Type` header.
 */
const json = function json(data, init) {
  if (init === void 0) {
    init = {};
  }
  let responseInit = typeof init === "number" ? {
    status: init
  } : init;
  let headers = new Headers(responseInit.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  return new Response(JSON.stringify(data), _extends({}, responseInit, {
    headers
  }));
};
class AbortedDeferredError extends Error {}
class DeferredData {
  constructor(data, responseInit) {
    this.pendingKeysSet = new Set();
    this.subscribers = new Set();
    this.deferredKeys = [];
    invariant(data && typeof data === "object" && !Array.isArray(data), "defer() only accepts plain objects");
    // Set up an AbortController + Promise we can race against to exit early
    // cancellation
    let reject;
    this.abortPromise = new Promise((_, r) => reject = r);
    this.controller = new AbortController();
    let onAbort = () => reject(new AbortedDeferredError("Deferred data aborted"));
    this.unlistenAbortSignal = () => this.controller.signal.removeEventListener("abort", onAbort);
    this.controller.signal.addEventListener("abort", onAbort);
    this.data = Object.entries(data).reduce((acc, _ref2) => {
      let [key, value] = _ref2;
      return Object.assign(acc, {
        [key]: this.trackPromise(key, value)
      });
    }, {});
    if (this.done) {
      // All incoming values were resolved
      this.unlistenAbortSignal();
    }
    this.init = responseInit;
  }
  trackPromise(key, value) {
    if (!(value instanceof Promise)) {
      return value;
    }
    this.deferredKeys.push(key);
    this.pendingKeysSet.add(key);
    // We store a little wrapper promise that will be extended with
    // _data/_error props upon resolve/reject
    let promise = Promise.race([value, this.abortPromise]).then(data => this.onSettle(promise, key, undefined, data), error => this.onSettle(promise, key, error));
    // Register rejection listeners to avoid uncaught promise rejections on
    // errors or aborted deferred values
    promise.catch(() => {});
    Object.defineProperty(promise, "_tracked", {
      get: () => true
    });
    return promise;
  }
  onSettle(promise, key, error, data) {
    if (this.controller.signal.aborted && error instanceof AbortedDeferredError) {
      this.unlistenAbortSignal();
      Object.defineProperty(promise, "_error", {
        get: () => error
      });
      return Promise.reject(error);
    }
    this.pendingKeysSet.delete(key);
    if (this.done) {
      // Nothing left to abort!
      this.unlistenAbortSignal();
    }
    // If the promise was resolved/rejected with undefined, we'll throw an error as you
    // should always resolve with a value or null
    if (error === undefined && data === undefined) {
      let undefinedError = new Error("Deferred data for key \"" + key + "\" resolved/rejected with `undefined`, " + "you must resolve/reject with a value or `null`.");
      Object.defineProperty(promise, "_error", {
        get: () => undefinedError
      });
      this.emit(false, key);
      return Promise.reject(undefinedError);
    }
    if (data === undefined) {
      Object.defineProperty(promise, "_error", {
        get: () => error
      });
      this.emit(false, key);
      return Promise.reject(error);
    }
    Object.defineProperty(promise, "_data", {
      get: () => data
    });
    this.emit(false, key);
    return data;
  }
  emit(aborted, settledKey) {
    this.subscribers.forEach(subscriber => subscriber(aborted, settledKey));
  }
  subscribe(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }
  cancel() {
    this.controller.abort();
    this.pendingKeysSet.forEach((v, k) => this.pendingKeysSet.delete(k));
    this.emit(true);
  }
  async resolveData(signal) {
    let aborted = false;
    if (!this.done) {
      let onAbort = () => this.cancel();
      signal.addEventListener("abort", onAbort);
      aborted = await new Promise(resolve => {
        this.subscribe(aborted => {
          signal.removeEventListener("abort", onAbort);
          if (aborted || this.done) {
            resolve(aborted);
          }
        });
      });
    }
    return aborted;
  }
  get done() {
    return this.pendingKeysSet.size === 0;
  }
  get unwrappedData() {
    invariant(this.data !== null && this.done, "Can only unwrap data on initialized and settled deferreds");
    return Object.entries(this.data).reduce((acc, _ref3) => {
      let [key, value] = _ref3;
      return Object.assign(acc, {
        [key]: unwrapTrackedPromise(value)
      });
    }, {});
  }
  get pendingKeys() {
    return Array.from(this.pendingKeysSet);
  }
}
function isTrackedPromise(value) {
  return value instanceof Promise && value._tracked === true;
}
function unwrapTrackedPromise(value) {
  if (!isTrackedPromise(value)) {
    return value;
  }
  if (value._error) {
    throw value._error;
  }
  return value._data;
}
const defer = function defer(data, init) {
  if (init === void 0) {
    init = {};
  }
  let responseInit = typeof init === "number" ? {
    status: init
  } : init;
  return new DeferredData(data, responseInit);
};
/**
 * A redirect response. Sets the status code and the `Location` header.
 * Defaults to "302 Found".
 */
const redirect = function redirect(url, init) {
  if (init === void 0) {
    init = 302;
  }
  let responseInit = init;
  if (typeof responseInit === "number") {
    responseInit = {
      status: responseInit
    };
  } else if (typeof responseInit.status === "undefined") {
    responseInit.status = 302;
  }
  let headers = new Headers(responseInit.headers);
  headers.set("Location", url);
  return new Response(null, _extends({}, responseInit, {
    headers
  }));
};
/**
 * A redirect response that will force a document reload to the new location.
 * Sets the status code and the `Location` header.
 * Defaults to "302 Found".
 */
const redirectDocument = (url, init) => {
  let response = redirect(url, init);
  response.headers.set("X-Remix-Reload-Document", "true");
  return response;
};
/**
 * @private
 * Utility class we use to hold auto-unwrapped 4xx/5xx Response bodies
 *
 * We don't export the class for public use since it's an implementation
 * detail, but we export the interface above so folks can build their own
 * abstractions around instances via isRouteErrorResponse()
 */
class ErrorResponseImpl {
  constructor(status, statusText, data, internal) {
    if (internal === void 0) {
      internal = false;
    }
    this.status = status;
    this.statusText = statusText || "";
    this.internal = internal;
    if (data instanceof Error) {
      this.data = data.toString();
      this.error = data;
    } else {
      this.data = data;
    }
  }
}
/**
 * Check if the given error is an ErrorResponse generated from a 4xx/5xx
 * Response thrown from an action/loader
 */
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}

const validMutationMethodsArr = ["post", "put", "patch", "delete"];
const validMutationMethods = new Set(validMutationMethodsArr);
const validRequestMethodsArr = ["get", ...validMutationMethodsArr];
const validRequestMethods = new Set(validRequestMethodsArr);
const redirectStatusCodes = new Set([301, 302, 303, 307, 308]);
const redirectPreserveMethodStatusCodes = new Set([307, 308]);
const IDLE_NAVIGATION = {
  state: "idle",
  location: undefined,
  formMethod: undefined,
  formAction: undefined,
  formEncType: undefined,
  formData: undefined,
  json: undefined,
  text: undefined
};
const IDLE_FETCHER = {
  state: "idle",
  data: undefined,
  formMethod: undefined,
  formAction: undefined,
  formEncType: undefined,
  formData: undefined,
  json: undefined,
  text: undefined
};
const IDLE_BLOCKER = {
  state: "unblocked",
  proceed: undefined,
  reset: undefined,
  location: undefined
};
const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const defaultMapRouteProperties = route => ({
  hasErrorBoundary: Boolean(route.hasErrorBoundary)
});
const TRANSITIONS_STORAGE_KEY = "remix-router-transitions";
//#endregion
////////////////////////////////////////////////////////////////////////////////
//#region createRouter
////////////////////////////////////////////////////////////////////////////////
/**
 * Create a router and listen to history POP navigations
 */
function createRouter(init) {
  const routerWindow = init.window ? init.window : typeof window !== "undefined" ? window : undefined;
  const isBrowser = typeof routerWindow !== "undefined" && typeof routerWindow.document !== "undefined" && typeof routerWindow.document.createElement !== "undefined";
  const isServer = !isBrowser;
  invariant(init.routes.length > 0, "You must provide a non-empty routes array to createRouter");
  let mapRouteProperties;
  if (init.mapRouteProperties) {
    mapRouteProperties = init.mapRouteProperties;
  } else if (init.detectErrorBoundary) {
    // If they are still using the deprecated version, wrap it with the new API
    let detectErrorBoundary = init.detectErrorBoundary;
    mapRouteProperties = route => ({
      hasErrorBoundary: detectErrorBoundary(route)
    });
  } else {
    mapRouteProperties = defaultMapRouteProperties;
  }
  // Routes keyed by ID
  let manifest = {};
  // Routes in tree format for matching
  let dataRoutes = convertRoutesToDataRoutes(init.routes, mapRouteProperties, undefined, manifest);
  let inFlightDataRoutes;
  let basename = init.basename || "/";
  let dataStrategyImpl = init.unstable_dataStrategy || defaultDataStrategy;
  let patchRoutesOnMissImpl = init.unstable_patchRoutesOnMiss;
  // Config driven behavior flags
  let future = _extends({
    v7_fetcherPersist: false,
    v7_normalizeFormMethod: false,
    v7_partialHydration: false,
    v7_prependBasename: false,
    v7_relativeSplatPath: false,
    unstable_skipActionErrorRevalidation: false
  }, init.future);
  // Cleanup function for history
  let unlistenHistory = null;
  // Externally-provided functions to call on all state changes
  let subscribers = new Set();
  // Externally-provided object to hold scroll restoration locations during routing
  let savedScrollPositions = null;
  // Externally-provided function to get scroll restoration keys
  let getScrollRestorationKey = null;
  // Externally-provided function to get current scroll position
  let getScrollPosition = null;
  // One-time flag to control the initial hydration scroll restoration.  Because
  // we don't get the saved positions from <ScrollRestoration /> until _after_
  // the initial render, we need to manually trigger a separate updateState to
  // send along the restoreScrollPosition
  // Set to true if we have `hydrationData` since we assume we were SSR'd and that
  // SSR did the initial scroll restoration.
  let initialScrollRestored = init.hydrationData != null;
  let initialMatches = matchRoutes(dataRoutes, init.history.location, basename);
  let initialErrors = null;
  if (initialMatches == null && !patchRoutesOnMissImpl) {
    // If we do not match a user-provided-route, fall back to the root
    // to allow the error boundary to take over
    let error = getInternalRouterError(404, {
      pathname: init.history.location.pathname
    });
    let {
      matches,
      route
    } = getShortCircuitMatches(dataRoutes);
    initialMatches = matches;
    initialErrors = {
      [route.id]: error
    };
  }
  let initialized;
  if (!initialMatches) {
    // We need to run patchRoutesOnMiss in initialize()
    initialized = false;
    initialMatches = [];
  } else if (initialMatches.some(m => m.route.lazy)) {
    // All initialMatches need to be loaded before we're ready.  If we have lazy
    // functions around still then we'll need to run them in initialize()
    initialized = false;
  } else if (!initialMatches.some(m => m.route.loader)) {
    // If we've got no loaders to run, then we're good to go
    initialized = true;
  } else if (future.v7_partialHydration) {
    // If partial hydration is enabled, we're initialized so long as we were
    // provided with hydrationData for every route with a loader, and no loaders
    // were marked for explicit hydration
    let loaderData = init.hydrationData ? init.hydrationData.loaderData : null;
    let errors = init.hydrationData ? init.hydrationData.errors : null;
    let isRouteInitialized = m => {
      // No loader, nothing to initialize
      if (!m.route.loader) {
        return true;
      }
      // Explicitly opting-in to running on hydration
      if (typeof m.route.loader === "function" && m.route.loader.hydrate === true) {
        return false;
      }
      // Otherwise, initialized if hydrated with data or an error
      return loaderData && loaderData[m.route.id] !== undefined || errors && errors[m.route.id] !== undefined;
    };
    // If errors exist, don't consider routes below the boundary
    if (errors) {
      let idx = initialMatches.findIndex(m => errors[m.route.id] !== undefined);
      initialized = initialMatches.slice(0, idx + 1).every(isRouteInitialized);
    } else {
      initialized = initialMatches.every(isRouteInitialized);
    }
  } else {
    // Without partial hydration - we're initialized if we were provided any
    // hydrationData - which is expected to be complete
    initialized = init.hydrationData != null;
  }
  let router;
  let state = {
    historyAction: init.history.action,
    location: init.history.location,
    matches: initialMatches,
    initialized,
    navigation: IDLE_NAVIGATION,
    // Don't restore on initial updateState() if we were SSR'd
    restoreScrollPosition: init.hydrationData != null ? false : null,
    preventScrollReset: false,
    revalidation: "idle",
    loaderData: init.hydrationData && init.hydrationData.loaderData || {},
    actionData: init.hydrationData && init.hydrationData.actionData || null,
    errors: init.hydrationData && init.hydrationData.errors || initialErrors,
    fetchers: new Map(),
    blockers: new Map()
  };
  // -- Stateful internal variables to manage navigations --
  // Current navigation in progress (to be committed in completeNavigation)
  let pendingAction = Action.Pop;
  // Should the current navigation prevent the scroll reset if scroll cannot
  // be restored?
  let pendingPreventScrollReset = false;
  // AbortController for the active navigation
  let pendingNavigationController;
  // Should the current navigation enable document.startViewTransition?
  let pendingViewTransitionEnabled = false;
  // Store applied view transitions so we can apply them on POP
  let appliedViewTransitions = new Map();
  // Cleanup function for persisting applied transitions to sessionStorage
  let removePageHideEventListener = null;
  // We use this to avoid touching history in completeNavigation if a
  // revalidation is entirely uninterrupted
  let isUninterruptedRevalidation = false;
  // Use this internal flag to force revalidation of all loaders:
  //  - submissions (completed or interrupted)
  //  - useRevalidator()
  //  - X-Remix-Revalidate (from redirect)
  let isRevalidationRequired = false;
  // Use this internal array to capture routes that require revalidation due
  // to a cancelled deferred on action submission
  let cancelledDeferredRoutes = [];
  // Use this internal array to capture fetcher loads that were cancelled by an
  // action navigation and require revalidation
  let cancelledFetcherLoads = [];
  // AbortControllers for any in-flight fetchers
  let fetchControllers = new Map();
  // Track loads based on the order in which they started
  let incrementingLoadId = 0;
  // Track the outstanding pending navigation data load to be compared against
  // the globally incrementing load when a fetcher load lands after a completed
  // navigation
  let pendingNavigationLoadId = -1;
  // Fetchers that triggered data reloads as a result of their actions
  let fetchReloadIds = new Map();
  // Fetchers that triggered redirect navigations
  let fetchRedirectIds = new Set();
  // Most recent href/match for fetcher.load calls for fetchers
  let fetchLoadMatches = new Map();
  // Ref-count mounted fetchers so we know when it's ok to clean them up
  let activeFetchers = new Map();
  // Fetchers that have requested a delete when using v7_fetcherPersist,
  // they'll be officially removed after they return to idle
  let deletedFetchers = new Set();
  // Store DeferredData instances for active route matches.  When a
  // route loader returns defer() we stick one in here.  Then, when a nested
  // promise resolves we update loaderData.  If a new navigation starts we
  // cancel active deferreds for eliminated routes.
  let activeDeferreds = new Map();
  // Store blocker functions in a separate Map outside of router state since
  // we don't need to update UI state if they change
  let blockerFunctions = new Map();
  // Map of pending patchRoutesOnMiss() promises (keyed by path/matches) so
  // that we only kick them off once for a given combo
  let pendingPatchRoutes = new Map();
  // Flag to ignore the next history update, so we can revert the URL change on
  // a POP navigation that was blocked by the user without touching router state
  let ignoreNextHistoryUpdate = false;
  // Initialize the router, all side effects should be kicked off from here.
  // Implemented as a Fluent API for ease of:
  //   let router = createRouter(init).initialize();
  function initialize() {
    // If history informs us of a POP navigation, start the navigation but do not update
    // state.  We'll update our own state once the navigation completes
    unlistenHistory = init.history.listen(_ref => {
      let {
        action: historyAction,
        location,
        delta
      } = _ref;
      // Ignore this event if it was just us resetting the URL from a
      // blocked POP navigation
      if (ignoreNextHistoryUpdate) {
        ignoreNextHistoryUpdate = false;
        return;
      }
      warning(blockerFunctions.size === 0 || delta != null, "You are trying to use a blocker on a POP navigation to a location " + "that was not created by @remix-run/router. This will fail silently in " + "production. This can happen if you are navigating outside the router " + "via `window.history.pushState`/`window.location.hash` instead of using " + "router navigation APIs.  This can also happen if you are using " + "createHashRouter and the user manually changes the URL.");
      let blockerKey = shouldBlockNavigation({
        currentLocation: state.location,
        nextLocation: location,
        historyAction
      });
      if (blockerKey && delta != null) {
        // Restore the URL to match the current UI, but don't update router state
        ignoreNextHistoryUpdate = true;
        init.history.go(delta * -1);
        // Put the blocker into a blocked state
        updateBlocker(blockerKey, {
          state: "blocked",
          location,
          proceed() {
            updateBlocker(blockerKey, {
              state: "proceeding",
              proceed: undefined,
              reset: undefined,
              location
            });
            // Re-do the same POP navigation we just blocked
            init.history.go(delta);
          },
          reset() {
            let blockers = new Map(state.blockers);
            blockers.set(blockerKey, IDLE_BLOCKER);
            updateState({
              blockers
            });
          }
        });
        return;
      }
      return startNavigation(historyAction, location);
    });
    if (isBrowser) {
      // FIXME: This feels gross.  How can we cleanup the lines between
      // scrollRestoration/appliedTransitions persistance?
      restoreAppliedTransitions(routerWindow, appliedViewTransitions);
      let _saveAppliedTransitions = () => persistAppliedTransitions(routerWindow, appliedViewTransitions);
      routerWindow.addEventListener("pagehide", _saveAppliedTransitions);
      removePageHideEventListener = () => routerWindow.removeEventListener("pagehide", _saveAppliedTransitions);
    }
    // Kick off initial data load if needed.  Use Pop to avoid modifying history
    // Note we don't do any handling of lazy here.  For SPA's it'll get handled
    // in the normal navigation flow.  For SSR it's expected that lazy modules are
    // resolved prior to router creation since we can't go into a fallbackElement
    // UI for SSR'd apps
    if (!state.initialized) {
      startNavigation(Action.Pop, state.location, {
        initialHydration: true
      });
    }
    return router;
  }
  // Clean up a router and it's side effects
  function dispose() {
    if (unlistenHistory) {
      unlistenHistory();
    }
    if (removePageHideEventListener) {
      removePageHideEventListener();
    }
    subscribers.clear();
    pendingNavigationController && pendingNavigationController.abort();
    state.fetchers.forEach((_, key) => deleteFetcher(key));
    state.blockers.forEach((_, key) => deleteBlocker(key));
  }
  // Subscribe to state updates for the router
  function subscribe(fn) {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }
  // Update our state and notify the calling context of the change
  function updateState(newState, opts) {
    if (opts === void 0) {
      opts = {};
    }
    state = _extends({}, state, newState);
    // Prep fetcher cleanup so we can tell the UI which fetcher data entries
    // can be removed
    let completedFetchers = [];
    let deletedFetchersKeys = [];
    if (future.v7_fetcherPersist) {
      state.fetchers.forEach((fetcher, key) => {
        if (fetcher.state === "idle") {
          if (deletedFetchers.has(key)) {
            // Unmounted from the UI and can be totally removed
            deletedFetchersKeys.push(key);
          } else {
            // Returned to idle but still mounted in the UI, so semi-remains for
            // revalidations and such
            completedFetchers.push(key);
          }
        }
      });
    }
    // Iterate over a local copy so that if flushSync is used and we end up
    // removing and adding a new subscriber due to the useCallback dependencies,
    // we don't get ourselves into a loop calling the new subscriber immediately
    [...subscribers].forEach(subscriber => subscriber(state, {
      deletedFetchers: deletedFetchersKeys,
      unstable_viewTransitionOpts: opts.viewTransitionOpts,
      unstable_flushSync: opts.flushSync === true
    }));
    // Remove idle fetchers from state since we only care about in-flight fetchers.
    if (future.v7_fetcherPersist) {
      completedFetchers.forEach(key => state.fetchers.delete(key));
      deletedFetchersKeys.forEach(key => deleteFetcher(key));
    }
  }
  // Complete a navigation returning the state.navigation back to the IDLE_NAVIGATION
  // and setting state.[historyAction/location/matches] to the new route.
  // - Location is a required param
  // - Navigation will always be set to IDLE_NAVIGATION
  // - Can pass any other state in newState
  function completeNavigation(location, newState, _temp) {
    var _location$state, _location$state2;
    let {
      flushSync
    } = _temp === void 0 ? {} : _temp;
    // Deduce if we're in a loading/actionReload state:
    // - We have committed actionData in the store
    // - The current navigation was a mutation submission
    // - We're past the submitting state and into the loading state
    // - The location being loaded is not the result of a redirect
    let isActionReload = state.actionData != null && state.navigation.formMethod != null && isMutationMethod(state.navigation.formMethod) && state.navigation.state === "loading" && ((_location$state = location.state) == null ? void 0 : _location$state._isRedirect) !== true;
    let actionData;
    if (newState.actionData) {
      if (Object.keys(newState.actionData).length > 0) {
        actionData = newState.actionData;
      } else {
        // Empty actionData -> clear prior actionData due to an action error
        actionData = null;
      }
    } else if (isActionReload) {
      // Keep the current data if we're wrapping up the action reload
      actionData = state.actionData;
    } else {
      // Clear actionData on any other completed navigations
      actionData = null;
    }
    // Always preserve any existing loaderData from re-used routes
    let loaderData = newState.loaderData ? mergeLoaderData(state.loaderData, newState.loaderData, newState.matches || [], newState.errors) : state.loaderData;
    // On a successful navigation we can assume we got through all blockers
    // so we can start fresh
    let blockers = state.blockers;
    if (blockers.size > 0) {
      blockers = new Map(blockers);
      blockers.forEach((_, k) => blockers.set(k, IDLE_BLOCKER));
    }
    // Always respect the user flag.  Otherwise don't reset on mutation
    // submission navigations unless they redirect
    let preventScrollReset = pendingPreventScrollReset === true || state.navigation.formMethod != null && isMutationMethod(state.navigation.formMethod) && ((_location$state2 = location.state) == null ? void 0 : _location$state2._isRedirect) !== true;
    if (inFlightDataRoutes) {
      dataRoutes = inFlightDataRoutes;
      inFlightDataRoutes = undefined;
    }
    if (isUninterruptedRevalidation) ; else if (pendingAction === Action.Pop) ; else if (pendingAction === Action.Push) {
      init.history.push(location, location.state);
    } else if (pendingAction === Action.Replace) {
      init.history.replace(location, location.state);
    }
    let viewTransitionOpts;
    // On POP, enable transitions if they were enabled on the original navigation
    if (pendingAction === Action.Pop) {
      // Forward takes precedence so they behave like the original navigation
      let priorPaths = appliedViewTransitions.get(state.location.pathname);
      if (priorPaths && priorPaths.has(location.pathname)) {
        viewTransitionOpts = {
          currentLocation: state.location,
          nextLocation: location
        };
      } else if (appliedViewTransitions.has(location.pathname)) {
        // If we don't have a previous forward nav, assume we're popping back to
        // the new location and enable if that location previously enabled
        viewTransitionOpts = {
          currentLocation: location,
          nextLocation: state.location
        };
      }
    } else if (pendingViewTransitionEnabled) {
      // Store the applied transition on PUSH/REPLACE
      let toPaths = appliedViewTransitions.get(state.location.pathname);
      if (toPaths) {
        toPaths.add(location.pathname);
      } else {
        toPaths = new Set([location.pathname]);
        appliedViewTransitions.set(state.location.pathname, toPaths);
      }
      viewTransitionOpts = {
        currentLocation: state.location,
        nextLocation: location
      };
    }
    updateState(_extends({}, newState, {
      actionData,
      loaderData,
      historyAction: pendingAction,
      location,
      initialized: true,
      navigation: IDLE_NAVIGATION,
      revalidation: "idle",
      restoreScrollPosition: getSavedScrollPosition(location, newState.matches || state.matches),
      preventScrollReset,
      blockers
    }), {
      viewTransitionOpts,
      flushSync: flushSync === true
    });
    // Reset stateful navigation vars
    pendingAction = Action.Pop;
    pendingPreventScrollReset = false;
    pendingViewTransitionEnabled = false;
    isUninterruptedRevalidation = false;
    isRevalidationRequired = false;
    cancelledDeferredRoutes = [];
    cancelledFetcherLoads = [];
  }
  // Trigger a navigation event, which can either be a numerical POP or a PUSH
  // replace with an optional submission
  async function navigate(to, opts) {
    if (typeof to === "number") {
      init.history.go(to);
      return;
    }
    let normalizedPath = normalizeTo(state.location, state.matches, basename, future.v7_prependBasename, to, future.v7_relativeSplatPath, opts == null ? void 0 : opts.fromRouteId, opts == null ? void 0 : opts.relative);
    let {
      path,
      submission,
      error
    } = normalizeNavigateOptions(future.v7_normalizeFormMethod, false, normalizedPath, opts);
    let currentLocation = state.location;
    let nextLocation = createLocation(state.location, path, opts && opts.state);
    // When using navigate as a PUSH/REPLACE we aren't reading an already-encoded
    // URL from window.location, so we need to encode it here so the behavior
    // remains the same as POP and non-data-router usages.  new URL() does all
    // the same encoding we'd get from a history.pushState/window.location read
    // without having to touch history
    nextLocation = _extends({}, nextLocation, init.history.encodeLocation(nextLocation));
    let userReplace = opts && opts.replace != null ? opts.replace : undefined;
    let historyAction = Action.Push;
    if (userReplace === true) {
      historyAction = Action.Replace;
    } else if (userReplace === false) ; else if (submission != null && isMutationMethod(submission.formMethod) && submission.formAction === state.location.pathname + state.location.search) {
      // By default on submissions to the current location we REPLACE so that
      // users don't have to double-click the back button to get to the prior
      // location.  If the user redirects to a different location from the
      // action/loader this will be ignored and the redirect will be a PUSH
      historyAction = Action.Replace;
    }
    let preventScrollReset = opts && "preventScrollReset" in opts ? opts.preventScrollReset === true : undefined;
    let flushSync = (opts && opts.unstable_flushSync) === true;
    let blockerKey = shouldBlockNavigation({
      currentLocation,
      nextLocation,
      historyAction
    });
    if (blockerKey) {
      // Put the blocker into a blocked state
      updateBlocker(blockerKey, {
        state: "blocked",
        location: nextLocation,
        proceed() {
          updateBlocker(blockerKey, {
            state: "proceeding",
            proceed: undefined,
            reset: undefined,
            location: nextLocation
          });
          // Send the same navigation through
          navigate(to, opts);
        },
        reset() {
          let blockers = new Map(state.blockers);
          blockers.set(blockerKey, IDLE_BLOCKER);
          updateState({
            blockers
          });
        }
      });
      return;
    }
    return await startNavigation(historyAction, nextLocation, {
      submission,
      // Send through the formData serialization error if we have one so we can
      // render at the right error boundary after we match routes
      pendingError: error,
      preventScrollReset,
      replace: opts && opts.replace,
      enableViewTransition: opts && opts.unstable_viewTransition,
      flushSync
    });
  }
  // Revalidate all current loaders.  If a navigation is in progress or if this
  // is interrupted by a navigation, allow this to "succeed" by calling all
  // loaders during the next loader round
  function revalidate() {
    interruptActiveLoads();
    updateState({
      revalidation: "loading"
    });
    // If we're currently submitting an action, we don't need to start a new
    // navigation, we'll just let the follow up loader execution call all loaders
    if (state.navigation.state === "submitting") {
      return;
    }
    // If we're currently in an idle state, start a new navigation for the current
    // action/location and mark it as uninterrupted, which will skip the history
    // update in completeNavigation
    if (state.navigation.state === "idle") {
      startNavigation(state.historyAction, state.location, {
        startUninterruptedRevalidation: true
      });
      return;
    }
    // Otherwise, if we're currently in a loading state, just start a new
    // navigation to the navigation.location but do not trigger an uninterrupted
    // revalidation so that history correctly updates once the navigation completes
    startNavigation(pendingAction || state.historyAction, state.navigation.location, {
      overrideNavigation: state.navigation
    });
  }
  // Start a navigation to the given action/location.  Can optionally provide a
  // overrideNavigation which will override the normalLoad in the case of a redirect
  // navigation
  async function startNavigation(historyAction, location, opts) {
    // Abort any in-progress navigations and start a new one. Unset any ongoing
    // uninterrupted revalidations unless told otherwise, since we want this
    // new navigation to update history normally
    pendingNavigationController && pendingNavigationController.abort();
    pendingNavigationController = null;
    pendingAction = historyAction;
    isUninterruptedRevalidation = (opts && opts.startUninterruptedRevalidation) === true;
    // Save the current scroll position every time we start a new navigation,
    // and track whether we should reset scroll on completion
    saveScrollPosition(state.location, state.matches);
    pendingPreventScrollReset = (opts && opts.preventScrollReset) === true;
    pendingViewTransitionEnabled = (opts && opts.enableViewTransition) === true;
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let loadingNavigation = opts && opts.overrideNavigation;
    let matches = matchRoutes(routesToUse, location, basename);
    let flushSync = (opts && opts.flushSync) === true;
    let fogOfWar = checkFogOfWar(matches, routesToUse, location.pathname);
    if (fogOfWar.active && fogOfWar.matches) {
      matches = fogOfWar.matches;
    }
    // Short circuit with a 404 on the root error boundary if we match nothing
    if (!matches) {
      let {
        error,
        notFoundMatches,
        route
      } = handleNavigational404(location.pathname);
      completeNavigation(location, {
        matches: notFoundMatches,
        loaderData: {},
        errors: {
          [route.id]: error
        }
      }, {
        flushSync
      });
      return;
    }
    // Short circuit if it's only a hash change and not a revalidation or
    // mutation submission.
    //
    // Ignore on initial page loads because since the initial load will always
    // be "same hash".  For example, on /page#hash and submit a <Form method="post">
    // which will default to a navigation to /page
    if (state.initialized && !isRevalidationRequired && isHashChangeOnly(state.location, location) && !(opts && opts.submission && isMutationMethod(opts.submission.formMethod))) {
      completeNavigation(location, {
        matches
      }, {
        flushSync
      });
      return;
    }
    // Create a controller/Request for this navigation
    pendingNavigationController = new AbortController();
    let request = createClientSideRequest(init.history, location, pendingNavigationController.signal, opts && opts.submission);
    let pendingActionResult;
    if (opts && opts.pendingError) {
      // If we have a pendingError, it means the user attempted a GET submission
      // with binary FormData so assign here and skip to handleLoaders.  That
      // way we handle calling loaders above the boundary etc.  It's not really
      // different from an actionError in that sense.
      pendingActionResult = [findNearestBoundary(matches).route.id, {
        type: ResultType.error,
        error: opts.pendingError
      }];
    } else if (opts && opts.submission && isMutationMethod(opts.submission.formMethod)) {
      // Call action if we received an action submission
      let actionResult = await handleAction(request, location, opts.submission, matches, fogOfWar.active, {
        replace: opts.replace,
        flushSync
      });
      if (actionResult.shortCircuited) {
        return;
      }
      // If we received a 404 from handleAction, it's because we couldn't lazily
      // discover the destination route so we don't want to call loaders
      if (actionResult.pendingActionResult) {
        let [routeId, result] = actionResult.pendingActionResult;
        if (isErrorResult(result) && isRouteErrorResponse(result.error) && result.error.status === 404) {
          pendingNavigationController = null;
          completeNavigation(location, {
            matches: actionResult.matches,
            loaderData: {},
            errors: {
              [routeId]: result.error
            }
          });
          return;
        }
      }
      matches = actionResult.matches || matches;
      pendingActionResult = actionResult.pendingActionResult;
      loadingNavigation = getLoadingNavigation(location, opts.submission);
      flushSync = false;
      // No need to do fog of war matching again on loader execution
      fogOfWar.active = false;
      // Create a GET request for the loaders
      request = createClientSideRequest(init.history, request.url, request.signal);
    }
    // Call loaders
    let {
      shortCircuited,
      matches: updatedMatches,
      loaderData,
      errors
    } = await handleLoaders(request, location, matches, fogOfWar.active, loadingNavigation, opts && opts.submission, opts && opts.fetcherSubmission, opts && opts.replace, opts && opts.initialHydration === true, flushSync, pendingActionResult);
    if (shortCircuited) {
      return;
    }
    // Clean up now that the action/loaders have completed.  Don't clean up if
    // we short circuited because pendingNavigationController will have already
    // been assigned to a new controller for the next navigation
    pendingNavigationController = null;
    completeNavigation(location, _extends({
      matches: updatedMatches || matches
    }, getActionDataForCommit(pendingActionResult), {
      loaderData,
      errors
    }));
  }
  // Call the action matched by the leaf route for this navigation and handle
  // redirects/errors
  async function handleAction(request, location, submission, matches, isFogOfWar, opts) {
    if (opts === void 0) {
      opts = {};
    }
    interruptActiveLoads();
    // Put us in a submitting state
    let navigation = getSubmittingNavigation(location, submission);
    updateState({
      navigation
    }, {
      flushSync: opts.flushSync === true
    });
    if (isFogOfWar) {
      let discoverResult = await discoverRoutes(matches, location.pathname, request.signal);
      if (discoverResult.type === "aborted") {
        return {
          shortCircuited: true
        };
      } else if (discoverResult.type === "error") {
        let {
          error,
          notFoundMatches,
          route
        } = handleDiscoverRouteError(location.pathname, discoverResult);
        return {
          matches: notFoundMatches,
          pendingActionResult: [route.id, {
            type: ResultType.error,
            error
          }]
        };
      } else if (!discoverResult.matches) {
        let {
          notFoundMatches,
          error,
          route
        } = handleNavigational404(location.pathname);
        return {
          matches: notFoundMatches,
          pendingActionResult: [route.id, {
            type: ResultType.error,
            error
          }]
        };
      } else {
        matches = discoverResult.matches;
      }
    }
    // Call our action and get the result
    let result;
    let actionMatch = getTargetMatch(matches, location);
    if (!actionMatch.route.action && !actionMatch.route.lazy) {
      result = {
        type: ResultType.error,
        error: getInternalRouterError(405, {
          method: request.method,
          pathname: location.pathname,
          routeId: actionMatch.route.id
        })
      };
    } else {
      let results = await callDataStrategy("action", request, [actionMatch], matches);
      result = results[0];
      if (request.signal.aborted) {
        return {
          shortCircuited: true
        };
      }
    }
    if (isRedirectResult(result)) {
      let replace;
      if (opts && opts.replace != null) {
        replace = opts.replace;
      } else {
        // If the user didn't explicity indicate replace behavior, replace if
        // we redirected to the exact same location we're currently at to avoid
        // double back-buttons
        let location = normalizeRedirectLocation(result.response.headers.get("Location"), new URL(request.url), basename);
        replace = location === state.location.pathname + state.location.search;
      }
      await startRedirectNavigation(request, result, {
        submission,
        replace
      });
      return {
        shortCircuited: true
      };
    }
    if (isDeferredResult(result)) {
      throw getInternalRouterError(400, {
        type: "defer-action"
      });
    }
    if (isErrorResult(result)) {
      // Store off the pending error - we use it to determine which loaders
      // to call and will commit it when we complete the navigation
      let boundaryMatch = findNearestBoundary(matches, actionMatch.route.id);
      // By default, all submissions to the current location are REPLACE
      // navigations, but if the action threw an error that'll be rendered in
      // an errorElement, we fall back to PUSH so that the user can use the
      // back button to get back to the pre-submission form location to try
      // again
      if ((opts && opts.replace) !== true) {
        pendingAction = Action.Push;
      }
      return {
        matches,
        pendingActionResult: [boundaryMatch.route.id, result]
      };
    }
    return {
      matches,
      pendingActionResult: [actionMatch.route.id, result]
    };
  }
  // Call all applicable loaders for the given matches, handling redirects,
  // errors, etc.
  async function handleLoaders(request, location, matches, isFogOfWar, overrideNavigation, submission, fetcherSubmission, replace, initialHydration, flushSync, pendingActionResult) {
    // Figure out the right navigation we want to use for data loading
    let loadingNavigation = overrideNavigation || getLoadingNavigation(location, submission);
    // If this was a redirect from an action we don't have a "submission" but
    // we have it on the loading navigation so use that if available
    let activeSubmission = submission || fetcherSubmission || getSubmissionFromNavigation(loadingNavigation);
    // If this is an uninterrupted revalidation, we remain in our current idle
    // state.  If not, we need to switch to our loading state and load data,
    // preserving any new action data or existing action data (in the case of
    // a revalidation interrupting an actionReload)
    // If we have partialHydration enabled, then don't update the state for the
    // initial data load since it's not a "navigation"
    let shouldUpdateNavigationState = !isUninterruptedRevalidation && (!future.v7_partialHydration || !initialHydration);
    // When fog of war is enabled, we enter our `loading` state earlier so we
    // can discover new routes during the `loading` state.  We skip this if
    // we've already run actions since we would have done our matching already.
    // If the children() function threw then, we want to proceed with the
    // partial matches it discovered.
    if (isFogOfWar) {
      if (shouldUpdateNavigationState) {
        let actionData = getUpdatedActionData(pendingActionResult);
        updateState(_extends({
          navigation: loadingNavigation
        }, actionData !== undefined ? {
          actionData
        } : {}), {
          flushSync
        });
      }
      let discoverResult = await discoverRoutes(matches, location.pathname, request.signal);
      if (discoverResult.type === "aborted") {
        return {
          shortCircuited: true
        };
      } else if (discoverResult.type === "error") {
        let {
          error,
          notFoundMatches,
          route
        } = handleDiscoverRouteError(location.pathname, discoverResult);
        return {
          matches: notFoundMatches,
          loaderData: {},
          errors: {
            [route.id]: error
          }
        };
      } else if (!discoverResult.matches) {
        let {
          error,
          notFoundMatches,
          route
        } = handleNavigational404(location.pathname);
        return {
          matches: notFoundMatches,
          loaderData: {},
          errors: {
            [route.id]: error
          }
        };
      } else {
        matches = discoverResult.matches;
      }
    }
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let [matchesToLoad, revalidatingFetchers] = getMatchesToLoad(init.history, state, matches, activeSubmission, location, future.v7_partialHydration && initialHydration === true, future.unstable_skipActionErrorRevalidation, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, pendingActionResult);
    // Cancel pending deferreds for no-longer-matched routes or routes we're
    // about to reload.  Note that if this is an action reload we would have
    // already cancelled all pending deferreds so this would be a no-op
    cancelActiveDeferreds(routeId => !(matches && matches.some(m => m.route.id === routeId)) || matchesToLoad && matchesToLoad.some(m => m.route.id === routeId));
    pendingNavigationLoadId = ++incrementingLoadId;
    // Short circuit if we have no loaders to run
    if (matchesToLoad.length === 0 && revalidatingFetchers.length === 0) {
      let updatedFetchers = markFetchRedirectsDone();
      completeNavigation(location, _extends({
        matches,
        loaderData: {},
        // Commit pending error if we're short circuiting
        errors: pendingActionResult && isErrorResult(pendingActionResult[1]) ? {
          [pendingActionResult[0]]: pendingActionResult[1].error
        } : null
      }, getActionDataForCommit(pendingActionResult), updatedFetchers ? {
        fetchers: new Map(state.fetchers)
      } : {}), {
        flushSync
      });
      return {
        shortCircuited: true
      };
    }
    if (shouldUpdateNavigationState) {
      let updates = {};
      if (!isFogOfWar) {
        // Only update navigation/actionNData if we didn't already do it above
        updates.navigation = loadingNavigation;
        let actionData = getUpdatedActionData(pendingActionResult);
        if (actionData !== undefined) {
          updates.actionData = actionData;
        }
      }
      if (revalidatingFetchers.length > 0) {
        updates.fetchers = getUpdatedRevalidatingFetchers(revalidatingFetchers);
      }
      updateState(updates, {
        flushSync
      });
    }
    revalidatingFetchers.forEach(rf => {
      if (fetchControllers.has(rf.key)) {
        abortFetcher(rf.key);
      }
      if (rf.controller) {
        // Fetchers use an independent AbortController so that aborting a fetcher
        // (via deleteFetcher) does not abort the triggering navigation that
        // triggered the revalidation
        fetchControllers.set(rf.key, rf.controller);
      }
    });
    // Proxy navigation abort through to revalidation fetchers
    let abortPendingFetchRevalidations = () => revalidatingFetchers.forEach(f => abortFetcher(f.key));
    if (pendingNavigationController) {
      pendingNavigationController.signal.addEventListener("abort", abortPendingFetchRevalidations);
    }
    let {
      loaderResults,
      fetcherResults
    } = await callLoadersAndMaybeResolveData(state.matches, matches, matchesToLoad, revalidatingFetchers, request);
    if (request.signal.aborted) {
      return {
        shortCircuited: true
      };
    }
    // Clean up _after_ loaders have completed.  Don't clean up if we short
    // circuited because fetchControllers would have been aborted and
    // reassigned to new controllers for the next navigation
    if (pendingNavigationController) {
      pendingNavigationController.signal.removeEventListener("abort", abortPendingFetchRevalidations);
    }
    revalidatingFetchers.forEach(rf => fetchControllers.delete(rf.key));
    // If any loaders returned a redirect Response, start a new REPLACE navigation
    let redirect = findRedirect([...loaderResults, ...fetcherResults]);
    if (redirect) {
      if (redirect.idx >= matchesToLoad.length) {
        // If this redirect came from a fetcher make sure we mark it in
        // fetchRedirectIds so it doesn't get revalidated on the next set of
        // loader executions
        let fetcherKey = revalidatingFetchers[redirect.idx - matchesToLoad.length].key;
        fetchRedirectIds.add(fetcherKey);
      }
      await startRedirectNavigation(request, redirect.result, {
        replace
      });
      return {
        shortCircuited: true
      };
    }
    // Process and commit output from loaders
    let {
      loaderData,
      errors
    } = processLoaderData(state, matches, matchesToLoad, loaderResults, pendingActionResult, revalidatingFetchers, fetcherResults, activeDeferreds);
    // Wire up subscribers to update loaderData as promises settle
    activeDeferreds.forEach((deferredData, routeId) => {
      deferredData.subscribe(aborted => {
        // Note: No need to updateState here since the TrackedPromise on
        // loaderData is stable across resolve/reject
        // Remove this instance if we were aborted or if promises have settled
        if (aborted || deferredData.done) {
          activeDeferreds.delete(routeId);
        }
      });
    });
    // During partial hydration, preserve SSR errors for routes that don't re-run
    if (future.v7_partialHydration && initialHydration && state.errors) {
      Object.entries(state.errors).filter(_ref2 => {
        let [id] = _ref2;
        return !matchesToLoad.some(m => m.route.id === id);
      }).forEach(_ref3 => {
        let [routeId, error] = _ref3;
        errors = Object.assign(errors || {}, {
          [routeId]: error
        });
      });
    }
    let updatedFetchers = markFetchRedirectsDone();
    let didAbortFetchLoads = abortStaleFetchLoads(pendingNavigationLoadId);
    let shouldUpdateFetchers = updatedFetchers || didAbortFetchLoads || revalidatingFetchers.length > 0;
    return _extends({
      matches,
      loaderData,
      errors
    }, shouldUpdateFetchers ? {
      fetchers: new Map(state.fetchers)
    } : {});
  }
  function getUpdatedActionData(pendingActionResult) {
    if (pendingActionResult && !isErrorResult(pendingActionResult[1])) {
      // This is cast to `any` currently because `RouteData`uses any and it
      // would be a breaking change to use any.
      // TODO: v7 - change `RouteData` to use `unknown` instead of `any`
      return {
        [pendingActionResult[0]]: pendingActionResult[1].data
      };
    } else if (state.actionData) {
      if (Object.keys(state.actionData).length === 0) {
        return null;
      } else {
        return state.actionData;
      }
    }
  }
  function getUpdatedRevalidatingFetchers(revalidatingFetchers) {
    revalidatingFetchers.forEach(rf => {
      let fetcher = state.fetchers.get(rf.key);
      let revalidatingFetcher = getLoadingFetcher(undefined, fetcher ? fetcher.data : undefined);
      state.fetchers.set(rf.key, revalidatingFetcher);
    });
    return new Map(state.fetchers);
  }
  // Trigger a fetcher load/submit for the given fetcher key
  function fetch(key, routeId, href, opts) {
    if (isServer) {
      throw new Error("router.fetch() was called during the server render, but it shouldn't be. " + "You are likely calling a useFetcher() method in the body of your component. " + "Try moving it to a useEffect or a callback.");
    }
    if (fetchControllers.has(key)) abortFetcher(key);
    let flushSync = (opts && opts.unstable_flushSync) === true;
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let normalizedPath = normalizeTo(state.location, state.matches, basename, future.v7_prependBasename, href, future.v7_relativeSplatPath, routeId, opts == null ? void 0 : opts.relative);
    let matches = matchRoutes(routesToUse, normalizedPath, basename);
    let fogOfWar = checkFogOfWar(matches, routesToUse, normalizedPath);
    if (fogOfWar.active && fogOfWar.matches) {
      matches = fogOfWar.matches;
    }
    if (!matches) {
      setFetcherError(key, routeId, getInternalRouterError(404, {
        pathname: normalizedPath
      }), {
        flushSync
      });
      return;
    }
    let {
      path,
      submission,
      error
    } = normalizeNavigateOptions(future.v7_normalizeFormMethod, true, normalizedPath, opts);
    if (error) {
      setFetcherError(key, routeId, error, {
        flushSync
      });
      return;
    }
    let match = getTargetMatch(matches, path);
    pendingPreventScrollReset = (opts && opts.preventScrollReset) === true;
    if (submission && isMutationMethod(submission.formMethod)) {
      handleFetcherAction(key, routeId, path, match, matches, fogOfWar.active, flushSync, submission);
      return;
    }
    // Store off the match so we can call it's shouldRevalidate on subsequent
    // revalidations
    fetchLoadMatches.set(key, {
      routeId,
      path
    });
    handleFetcherLoader(key, routeId, path, match, matches, fogOfWar.active, flushSync, submission);
  }
  // Call the action for the matched fetcher.submit(), and then handle redirects,
  // errors, and revalidation
  async function handleFetcherAction(key, routeId, path, match, requestMatches, isFogOfWar, flushSync, submission) {
    interruptActiveLoads();
    fetchLoadMatches.delete(key);
    function detectAndHandle405Error(m) {
      if (!m.route.action && !m.route.lazy) {
        let error = getInternalRouterError(405, {
          method: submission.formMethod,
          pathname: path,
          routeId: routeId
        });
        setFetcherError(key, routeId, error, {
          flushSync
        });
        return true;
      }
      return false;
    }
    if (!isFogOfWar && detectAndHandle405Error(match)) {
      return;
    }
    // Put this fetcher into it's submitting state
    let existingFetcher = state.fetchers.get(key);
    updateFetcherState(key, getSubmittingFetcher(submission, existingFetcher), {
      flushSync
    });
    let abortController = new AbortController();
    let fetchRequest = createClientSideRequest(init.history, path, abortController.signal, submission);
    if (isFogOfWar) {
      let discoverResult = await discoverRoutes(requestMatches, path, fetchRequest.signal);
      if (discoverResult.type === "aborted") {
        return;
      } else if (discoverResult.type === "error") {
        let {
          error
        } = handleDiscoverRouteError(path, discoverResult);
        setFetcherError(key, routeId, error, {
          flushSync
        });
        return;
      } else if (!discoverResult.matches) {
        setFetcherError(key, routeId, getInternalRouterError(404, {
          pathname: path
        }), {
          flushSync
        });
        return;
      } else {
        requestMatches = discoverResult.matches;
        match = getTargetMatch(requestMatches, path);
        if (detectAndHandle405Error(match)) {
          return;
        }
      }
    }
    // Call the action for the fetcher
    fetchControllers.set(key, abortController);
    let originatingLoadId = incrementingLoadId;
    let actionResults = await callDataStrategy("action", fetchRequest, [match], requestMatches);
    let actionResult = actionResults[0];
    if (fetchRequest.signal.aborted) {
      // We can delete this so long as we weren't aborted by our own fetcher
      // re-submit which would have put _new_ controller is in fetchControllers
      if (fetchControllers.get(key) === abortController) {
        fetchControllers.delete(key);
      }
      return;
    }
    // When using v7_fetcherPersist, we don't want errors bubbling up to the UI
    // or redirects processed for unmounted fetchers so we just revert them to
    // idle
    if (future.v7_fetcherPersist && deletedFetchers.has(key)) {
      if (isRedirectResult(actionResult) || isErrorResult(actionResult)) {
        updateFetcherState(key, getDoneFetcher(undefined));
        return;
      }
      // Let SuccessResult's fall through for revalidation
    } else {
      if (isRedirectResult(actionResult)) {
        fetchControllers.delete(key);
        if (pendingNavigationLoadId > originatingLoadId) {
          // A new navigation was kicked off after our action started, so that
          // should take precedence over this redirect navigation.  We already
          // set isRevalidationRequired so all loaders for the new route should
          // fire unless opted out via shouldRevalidate
          updateFetcherState(key, getDoneFetcher(undefined));
          return;
        } else {
          fetchRedirectIds.add(key);
          updateFetcherState(key, getLoadingFetcher(submission));
          return startRedirectNavigation(fetchRequest, actionResult, {
            fetcherSubmission: submission
          });
        }
      }
      // Process any non-redirect errors thrown
      if (isErrorResult(actionResult)) {
        setFetcherError(key, routeId, actionResult.error);
        return;
      }
    }
    if (isDeferredResult(actionResult)) {
      throw getInternalRouterError(400, {
        type: "defer-action"
      });
    }
    // Start the data load for current matches, or the next location if we're
    // in the middle of a navigation
    let nextLocation = state.navigation.location || state.location;
    let revalidationRequest = createClientSideRequest(init.history, nextLocation, abortController.signal);
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let matches = state.navigation.state !== "idle" ? matchRoutes(routesToUse, state.navigation.location, basename) : state.matches;
    invariant(matches, "Didn't find any matches after fetcher action");
    let loadId = ++incrementingLoadId;
    fetchReloadIds.set(key, loadId);
    let loadFetcher = getLoadingFetcher(submission, actionResult.data);
    state.fetchers.set(key, loadFetcher);
    let [matchesToLoad, revalidatingFetchers] = getMatchesToLoad(init.history, state, matches, submission, nextLocation, false, future.unstable_skipActionErrorRevalidation, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, [match.route.id, actionResult]);
    // Put all revalidating fetchers into the loading state, except for the
    // current fetcher which we want to keep in it's current loading state which
    // contains it's action submission info + action data
    revalidatingFetchers.filter(rf => rf.key !== key).forEach(rf => {
      let staleKey = rf.key;
      let existingFetcher = state.fetchers.get(staleKey);
      let revalidatingFetcher = getLoadingFetcher(undefined, existingFetcher ? existingFetcher.data : undefined);
      state.fetchers.set(staleKey, revalidatingFetcher);
      if (fetchControllers.has(staleKey)) {
        abortFetcher(staleKey);
      }
      if (rf.controller) {
        fetchControllers.set(staleKey, rf.controller);
      }
    });
    updateState({
      fetchers: new Map(state.fetchers)
    });
    let abortPendingFetchRevalidations = () => revalidatingFetchers.forEach(rf => abortFetcher(rf.key));
    abortController.signal.addEventListener("abort", abortPendingFetchRevalidations);
    let {
      loaderResults,
      fetcherResults
    } = await callLoadersAndMaybeResolveData(state.matches, matches, matchesToLoad, revalidatingFetchers, revalidationRequest);
    if (abortController.signal.aborted) {
      return;
    }
    abortController.signal.removeEventListener("abort", abortPendingFetchRevalidations);
    fetchReloadIds.delete(key);
    fetchControllers.delete(key);
    revalidatingFetchers.forEach(r => fetchControllers.delete(r.key));
    let redirect = findRedirect([...loaderResults, ...fetcherResults]);
    if (redirect) {
      if (redirect.idx >= matchesToLoad.length) {
        // If this redirect came from a fetcher make sure we mark it in
        // fetchRedirectIds so it doesn't get revalidated on the next set of
        // loader executions
        let fetcherKey = revalidatingFetchers[redirect.idx - matchesToLoad.length].key;
        fetchRedirectIds.add(fetcherKey);
      }
      return startRedirectNavigation(revalidationRequest, redirect.result);
    }
    // Process and commit output from loaders
    let {
      loaderData,
      errors
    } = processLoaderData(state, state.matches, matchesToLoad, loaderResults, undefined, revalidatingFetchers, fetcherResults, activeDeferreds);
    // Since we let revalidations complete even if the submitting fetcher was
    // deleted, only put it back to idle if it hasn't been deleted
    if (state.fetchers.has(key)) {
      let doneFetcher = getDoneFetcher(actionResult.data);
      state.fetchers.set(key, doneFetcher);
    }
    abortStaleFetchLoads(loadId);
    // If we are currently in a navigation loading state and this fetcher is
    // more recent than the navigation, we want the newer data so abort the
    // navigation and complete it with the fetcher data
    if (state.navigation.state === "loading" && loadId > pendingNavigationLoadId) {
      invariant(pendingAction, "Expected pending action");
      pendingNavigationController && pendingNavigationController.abort();
      completeNavigation(state.navigation.location, {
        matches,
        loaderData,
        errors,
        fetchers: new Map(state.fetchers)
      });
    } else {
      // otherwise just update with the fetcher data, preserving any existing
      // loaderData for loaders that did not need to reload.  We have to
      // manually merge here since we aren't going through completeNavigation
      updateState({
        errors,
        loaderData: mergeLoaderData(state.loaderData, loaderData, matches, errors),
        fetchers: new Map(state.fetchers)
      });
      isRevalidationRequired = false;
    }
  }
  // Call the matched loader for fetcher.load(), handling redirects, errors, etc.
  async function handleFetcherLoader(key, routeId, path, match, matches, isFogOfWar, flushSync, submission) {
    let existingFetcher = state.fetchers.get(key);
    updateFetcherState(key, getLoadingFetcher(submission, existingFetcher ? existingFetcher.data : undefined), {
      flushSync
    });
    let abortController = new AbortController();
    let fetchRequest = createClientSideRequest(init.history, path, abortController.signal);
    if (isFogOfWar) {
      let discoverResult = await discoverRoutes(matches, path, fetchRequest.signal);
      if (discoverResult.type === "aborted") {
        return;
      } else if (discoverResult.type === "error") {
        let {
          error
        } = handleDiscoverRouteError(path, discoverResult);
        setFetcherError(key, routeId, error, {
          flushSync
        });
        return;
      } else if (!discoverResult.matches) {
        setFetcherError(key, routeId, getInternalRouterError(404, {
          pathname: path
        }), {
          flushSync
        });
        return;
      } else {
        matches = discoverResult.matches;
        match = getTargetMatch(matches, path);
      }
    }
    // Call the loader for this fetcher route match
    fetchControllers.set(key, abortController);
    let originatingLoadId = incrementingLoadId;
    let results = await callDataStrategy("loader", fetchRequest, [match], matches);
    let result = results[0];
    // Deferred isn't supported for fetcher loads, await everything and treat it
    // as a normal load.  resolveDeferredData will return undefined if this
    // fetcher gets aborted, so we just leave result untouched and short circuit
    // below if that happens
    if (isDeferredResult(result)) {
      result = (await resolveDeferredData(result, fetchRequest.signal, true)) || result;
    }
    // We can delete this so long as we weren't aborted by our our own fetcher
    // re-load which would have put _new_ controller is in fetchControllers
    if (fetchControllers.get(key) === abortController) {
      fetchControllers.delete(key);
    }
    if (fetchRequest.signal.aborted) {
      return;
    }
    // We don't want errors bubbling up or redirects followed for unmounted
    // fetchers, so short circuit here if it was removed from the UI
    if (deletedFetchers.has(key)) {
      updateFetcherState(key, getDoneFetcher(undefined));
      return;
    }
    // If the loader threw a redirect Response, start a new REPLACE navigation
    if (isRedirectResult(result)) {
      if (pendingNavigationLoadId > originatingLoadId) {
        // A new navigation was kicked off after our loader started, so that
        // should take precedence over this redirect navigation
        updateFetcherState(key, getDoneFetcher(undefined));
        return;
      } else {
        fetchRedirectIds.add(key);
        await startRedirectNavigation(fetchRequest, result);
        return;
      }
    }
    // Process any non-redirect errors thrown
    if (isErrorResult(result)) {
      setFetcherError(key, routeId, result.error);
      return;
    }
    invariant(!isDeferredResult(result), "Unhandled fetcher deferred data");
    // Put the fetcher back into an idle state
    updateFetcherState(key, getDoneFetcher(result.data));
  }
  /**
   * Utility function to handle redirects returned from an action or loader.
   * Normally, a redirect "replaces" the navigation that triggered it.  So, for
   * example:
   *
   *  - user is on /a
   *  - user clicks a link to /b
   *  - loader for /b redirects to /c
   *
   * In a non-JS app the browser would track the in-flight navigation to /b and
   * then replace it with /c when it encountered the redirect response.  In
   * the end it would only ever update the URL bar with /c.
   *
   * In client-side routing using pushState/replaceState, we aim to emulate
   * this behavior and we also do not update history until the end of the
   * navigation (including processed redirects).  This means that we never
   * actually touch history until we've processed redirects, so we just use
   * the history action from the original navigation (PUSH or REPLACE).
   */
  async function startRedirectNavigation(request, redirect, _temp2) {
    let {
      submission,
      fetcherSubmission,
      replace
    } = _temp2 === void 0 ? {} : _temp2;
    if (redirect.response.headers.has("X-Remix-Revalidate")) {
      isRevalidationRequired = true;
    }
    let location = redirect.response.headers.get("Location");
    invariant(location, "Expected a Location header on the redirect Response");
    location = normalizeRedirectLocation(location, new URL(request.url), basename);
    let redirectLocation = createLocation(state.location, location, {
      _isRedirect: true
    });
    if (isBrowser) {
      let isDocumentReload = false;
      if (redirect.response.headers.has("X-Remix-Reload-Document")) {
        // Hard reload if the response contained X-Remix-Reload-Document
        isDocumentReload = true;
      } else if (ABSOLUTE_URL_REGEX.test(location)) {
        const url = init.history.createURL(location);
        isDocumentReload =
        // Hard reload if it's an absolute URL to a new origin
        url.origin !== routerWindow.location.origin ||
        // Hard reload if it's an absolute URL that does not match our basename
        stripBasename(url.pathname, basename) == null;
      }
      if (isDocumentReload) {
        if (replace) {
          routerWindow.location.replace(location);
        } else {
          routerWindow.location.assign(location);
        }
        return;
      }
    }
    // There's no need to abort on redirects, since we don't detect the
    // redirect until the action/loaders have settled
    pendingNavigationController = null;
    let redirectHistoryAction = replace === true ? Action.Replace : Action.Push;
    // Use the incoming submission if provided, fallback on the active one in
    // state.navigation
    let {
      formMethod,
      formAction,
      formEncType
    } = state.navigation;
    if (!submission && !fetcherSubmission && formMethod && formAction && formEncType) {
      submission = getSubmissionFromNavigation(state.navigation);
    }
    // If this was a 307/308 submission we want to preserve the HTTP method and
    // re-submit the GET/POST/PUT/PATCH/DELETE as a submission navigation to the
    // redirected location
    let activeSubmission = submission || fetcherSubmission;
    if (redirectPreserveMethodStatusCodes.has(redirect.response.status) && activeSubmission && isMutationMethod(activeSubmission.formMethod)) {
      await startNavigation(redirectHistoryAction, redirectLocation, {
        submission: _extends({}, activeSubmission, {
          formAction: location
        }),
        // Preserve this flag across redirects
        preventScrollReset: pendingPreventScrollReset
      });
    } else {
      // If we have a navigation submission, we will preserve it through the
      // redirect navigation
      let overrideNavigation = getLoadingNavigation(redirectLocation, submission);
      await startNavigation(redirectHistoryAction, redirectLocation, {
        overrideNavigation,
        // Send fetcher submissions through for shouldRevalidate
        fetcherSubmission,
        // Preserve this flag across redirects
        preventScrollReset: pendingPreventScrollReset
      });
    }
  }
  // Utility wrapper for calling dataStrategy client-side without having to
  // pass around the manifest, mapRouteProperties, etc.
  async function callDataStrategy(type, request, matchesToLoad, matches) {
    try {
      let results = await callDataStrategyImpl(dataStrategyImpl, type, request, matchesToLoad, matches, manifest, mapRouteProperties);
      return await Promise.all(results.map((result, i) => {
        if (isRedirectHandlerResult(result)) {
          let response = result.result;
          return {
            type: ResultType.redirect,
            response: normalizeRelativeRoutingRedirectResponse(response, request, matchesToLoad[i].route.id, matches, basename, future.v7_relativeSplatPath)
          };
        }
        return convertHandlerResultToDataResult(result);
      }));
    } catch (e) {
      // If the outer dataStrategy method throws, just return the error for all
      // matches - and it'll naturally bubble to the root
      return matchesToLoad.map(() => ({
        type: ResultType.error,
        error: e
      }));
    }
  }
  async function callLoadersAndMaybeResolveData(currentMatches, matches, matchesToLoad, fetchersToLoad, request) {
    let [loaderResults, ...fetcherResults] = await Promise.all([matchesToLoad.length ? callDataStrategy("loader", request, matchesToLoad, matches) : [], ...fetchersToLoad.map(f => {
      if (f.matches && f.match && f.controller) {
        let fetcherRequest = createClientSideRequest(init.history, f.path, f.controller.signal);
        return callDataStrategy("loader", fetcherRequest, [f.match], f.matches).then(r => r[0]);
      } else {
        return Promise.resolve({
          type: ResultType.error,
          error: getInternalRouterError(404, {
            pathname: f.path
          })
        });
      }
    })]);
    await Promise.all([resolveDeferredResults(currentMatches, matchesToLoad, loaderResults, loaderResults.map(() => request.signal), false, state.loaderData), resolveDeferredResults(currentMatches, fetchersToLoad.map(f => f.match), fetcherResults, fetchersToLoad.map(f => f.controller ? f.controller.signal : null), true)]);
    return {
      loaderResults,
      fetcherResults
    };
  }
  function interruptActiveLoads() {
    // Every interruption triggers a revalidation
    isRevalidationRequired = true;
    // Cancel pending route-level deferreds and mark cancelled routes for
    // revalidation
    cancelledDeferredRoutes.push(...cancelActiveDeferreds());
    // Abort in-flight fetcher loads
    fetchLoadMatches.forEach((_, key) => {
      if (fetchControllers.has(key)) {
        cancelledFetcherLoads.push(key);
        abortFetcher(key);
      }
    });
  }
  function updateFetcherState(key, fetcher, opts) {
    if (opts === void 0) {
      opts = {};
    }
    state.fetchers.set(key, fetcher);
    updateState({
      fetchers: new Map(state.fetchers)
    }, {
      flushSync: (opts && opts.flushSync) === true
    });
  }
  function setFetcherError(key, routeId, error, opts) {
    if (opts === void 0) {
      opts = {};
    }
    let boundaryMatch = findNearestBoundary(state.matches, routeId);
    deleteFetcher(key);
    updateState({
      errors: {
        [boundaryMatch.route.id]: error
      },
      fetchers: new Map(state.fetchers)
    }, {
      flushSync: (opts && opts.flushSync) === true
    });
  }
  function getFetcher(key) {
    if (future.v7_fetcherPersist) {
      activeFetchers.set(key, (activeFetchers.get(key) || 0) + 1);
      // If this fetcher was previously marked for deletion, unmark it since we
      // have a new instance
      if (deletedFetchers.has(key)) {
        deletedFetchers.delete(key);
      }
    }
    return state.fetchers.get(key) || IDLE_FETCHER;
  }
  function deleteFetcher(key) {
    let fetcher = state.fetchers.get(key);
    // Don't abort the controller if this is a deletion of a fetcher.submit()
    // in it's loading phase since - we don't want to abort the corresponding
    // revalidation and want them to complete and land
    if (fetchControllers.has(key) && !(fetcher && fetcher.state === "loading" && fetchReloadIds.has(key))) {
      abortFetcher(key);
    }
    fetchLoadMatches.delete(key);
    fetchReloadIds.delete(key);
    fetchRedirectIds.delete(key);
    deletedFetchers.delete(key);
    state.fetchers.delete(key);
  }
  function deleteFetcherAndUpdateState(key) {
    if (future.v7_fetcherPersist) {
      let count = (activeFetchers.get(key) || 0) - 1;
      if (count <= 0) {
        activeFetchers.delete(key);
        deletedFetchers.add(key);
      } else {
        activeFetchers.set(key, count);
      }
    } else {
      deleteFetcher(key);
    }
    updateState({
      fetchers: new Map(state.fetchers)
    });
  }
  function abortFetcher(key) {
    let controller = fetchControllers.get(key);
    invariant(controller, "Expected fetch controller: " + key);
    controller.abort();
    fetchControllers.delete(key);
  }
  function markFetchersDone(keys) {
    for (let key of keys) {
      let fetcher = getFetcher(key);
      let doneFetcher = getDoneFetcher(fetcher.data);
      state.fetchers.set(key, doneFetcher);
    }
  }
  function markFetchRedirectsDone() {
    let doneKeys = [];
    let updatedFetchers = false;
    for (let key of fetchRedirectIds) {
      let fetcher = state.fetchers.get(key);
      invariant(fetcher, "Expected fetcher: " + key);
      if (fetcher.state === "loading") {
        fetchRedirectIds.delete(key);
        doneKeys.push(key);
        updatedFetchers = true;
      }
    }
    markFetchersDone(doneKeys);
    return updatedFetchers;
  }
  function abortStaleFetchLoads(landedId) {
    let yeetedKeys = [];
    for (let [key, id] of fetchReloadIds) {
      if (id < landedId) {
        let fetcher = state.fetchers.get(key);
        invariant(fetcher, "Expected fetcher: " + key);
        if (fetcher.state === "loading") {
          abortFetcher(key);
          fetchReloadIds.delete(key);
          yeetedKeys.push(key);
        }
      }
    }
    markFetchersDone(yeetedKeys);
    return yeetedKeys.length > 0;
  }
  function getBlocker(key, fn) {
    let blocker = state.blockers.get(key) || IDLE_BLOCKER;
    if (blockerFunctions.get(key) !== fn) {
      blockerFunctions.set(key, fn);
    }
    return blocker;
  }
  function deleteBlocker(key) {
    state.blockers.delete(key);
    blockerFunctions.delete(key);
  }
  // Utility function to update blockers, ensuring valid state transitions
  function updateBlocker(key, newBlocker) {
    let blocker = state.blockers.get(key) || IDLE_BLOCKER;
    // Poor mans state machine :)
    // https://mermaid.live/edit#pako:eNqVkc9OwzAMxl8l8nnjAYrEtDIOHEBIgwvKJTReGy3_lDpIqO27k6awMG0XcrLlnz87nwdonESogKXXBuE79rq75XZO3-yHds0RJVuv70YrPlUrCEe2HfrORS3rubqZfuhtpg5C9wk5tZ4VKcRUq88q9Z8RS0-48cE1iHJkL0ugbHuFLus9L6spZy8nX9MP2CNdomVaposqu3fGayT8T8-jJQwhepo_UtpgBQaDEUom04dZhAN1aJBDlUKJBxE1ceB2Smj0Mln-IBW5AFU2dwUiktt_2Qaq2dBfaKdEup85UV7Yd-dKjlnkabl2Pvr0DTkTreM
    invariant(blocker.state === "unblocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "proceeding" || blocker.state === "blocked" && newBlocker.state === "unblocked" || blocker.state === "proceeding" && newBlocker.state === "unblocked", "Invalid blocker state transition: " + blocker.state + " -> " + newBlocker.state);
    let blockers = new Map(state.blockers);
    blockers.set(key, newBlocker);
    updateState({
      blockers
    });
  }
  function shouldBlockNavigation(_ref4) {
    let {
      currentLocation,
      nextLocation,
      historyAction
    } = _ref4;
    if (blockerFunctions.size === 0) {
      return;
    }
    // We ony support a single active blocker at the moment since we don't have
    // any compelling use cases for multi-blocker yet
    if (blockerFunctions.size > 1) {
      warning(false, "A router only supports one blocker at a time");
    }
    let entries = Array.from(blockerFunctions.entries());
    let [blockerKey, blockerFunction] = entries[entries.length - 1];
    let blocker = state.blockers.get(blockerKey);
    if (blocker && blocker.state === "proceeding") {
      // If the blocker is currently proceeding, we don't need to re-check
      // it and can let this navigation continue
      return;
    }
    // At this point, we know we're unblocked/blocked so we need to check the
    // user-provided blocker function
    if (blockerFunction({
      currentLocation,
      nextLocation,
      historyAction
    })) {
      return blockerKey;
    }
  }
  function handleNavigational404(pathname) {
    let error = getInternalRouterError(404, {
      pathname
    });
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let {
      matches,
      route
    } = getShortCircuitMatches(routesToUse);
    // Cancel all pending deferred on 404s since we don't keep any routes
    cancelActiveDeferreds();
    return {
      notFoundMatches: matches,
      route,
      error
    };
  }
  function handleDiscoverRouteError(pathname, discoverResult) {
    let matches = discoverResult.partialMatches;
    let route = matches[matches.length - 1].route;
    let error = getInternalRouterError(400, {
      type: "route-discovery",
      routeId: route.id,
      pathname,
      message: discoverResult.error != null && "message" in discoverResult.error ? discoverResult.error : String(discoverResult.error)
    });
    return {
      notFoundMatches: matches,
      route,
      error
    };
  }
  function cancelActiveDeferreds(predicate) {
    let cancelledRouteIds = [];
    activeDeferreds.forEach((dfd, routeId) => {
      if (!predicate || predicate(routeId)) {
        // Cancel the deferred - but do not remove from activeDeferreds here -
        // we rely on the subscribers to do that so our tests can assert proper
        // cleanup via _internalActiveDeferreds
        dfd.cancel();
        cancelledRouteIds.push(routeId);
        activeDeferreds.delete(routeId);
      }
    });
    return cancelledRouteIds;
  }
  // Opt in to capturing and reporting scroll positions during navigations,
  // used by the <ScrollRestoration> component
  function enableScrollRestoration(positions, getPosition, getKey) {
    savedScrollPositions = positions;
    getScrollPosition = getPosition;
    getScrollRestorationKey = getKey || null;
    // Perform initial hydration scroll restoration, since we miss the boat on
    // the initial updateState() because we've not yet rendered <ScrollRestoration/>
    // and therefore have no savedScrollPositions available
    if (!initialScrollRestored && state.navigation === IDLE_NAVIGATION) {
      initialScrollRestored = true;
      let y = getSavedScrollPosition(state.location, state.matches);
      if (y != null) {
        updateState({
          restoreScrollPosition: y
        });
      }
    }
    return () => {
      savedScrollPositions = null;
      getScrollPosition = null;
      getScrollRestorationKey = null;
    };
  }
  function getScrollKey(location, matches) {
    if (getScrollRestorationKey) {
      let key = getScrollRestorationKey(location, matches.map(m => convertRouteMatchToUiMatch(m, state.loaderData)));
      return key || location.key;
    }
    return location.key;
  }
  function saveScrollPosition(location, matches) {
    if (savedScrollPositions && getScrollPosition) {
      let key = getScrollKey(location, matches);
      savedScrollPositions[key] = getScrollPosition();
    }
  }
  function getSavedScrollPosition(location, matches) {
    if (savedScrollPositions) {
      let key = getScrollKey(location, matches);
      let y = savedScrollPositions[key];
      if (typeof y === "number") {
        return y;
      }
    }
    return null;
  }
  function checkFogOfWar(matches, routesToUse, pathname) {
    if (patchRoutesOnMissImpl) {
      if (!matches) {
        let fogMatches = matchRoutesImpl(routesToUse, pathname, basename, true);
        return {
          active: true,
          matches: fogMatches || []
        };
      } else {
        let leafRoute = matches[matches.length - 1].route;
        if (leafRoute.path === "*") {
          // If we matched a splat, it might only be because we haven't yet fetched
          // the children that would match with a higher score, so let's fetch
          // around and find out
          let partialMatches = matchRoutesImpl(routesToUse, pathname, basename, true);
          return {
            active: true,
            matches: partialMatches
          };
        }
      }
    }
    return {
      active: false,
      matches: null
    };
  }
  async function discoverRoutes(matches, pathname, signal) {
    let partialMatches = matches;
    let route = partialMatches.length > 0 ? partialMatches[partialMatches.length - 1].route : null;
    while (true) {
      try {
        await loadLazyRouteChildren(patchRoutesOnMissImpl, pathname, partialMatches, dataRoutes || inFlightDataRoutes, manifest, mapRouteProperties, pendingPatchRoutes, signal);
      } catch (e) {
        return {
          type: "error",
          error: e,
          partialMatches
        };
      }
      if (signal.aborted) {
        return {
          type: "aborted"
        };
      }
      let routesToUse = inFlightDataRoutes || dataRoutes;
      let newMatches = matchRoutes(routesToUse, pathname, basename);
      let matchedSplat = false;
      if (newMatches) {
        let leafRoute = newMatches[newMatches.length - 1].route;
        if (leafRoute.index) {
          // If we found an index route, we can stop
          return {
            type: "success",
            matches: newMatches
          };
        }
        if (leafRoute.path && leafRoute.path.length > 0) {
          if (leafRoute.path === "*") {
            // If we found a splat route, we can't be sure there's not a
            // higher-scoring route down some partial matches trail so we need
            // to check that out
            matchedSplat = true;
          } else {
            // If we found a non-splat route, we can stop
            return {
              type: "success",
              matches: newMatches
            };
          }
        }
      }
      let newPartialMatches = matchRoutesImpl(routesToUse, pathname, basename, true);
      // If we are no longer partially matching anything, this was either a
      // legit splat match above, or it's a 404.  Also avoid loops if the
      // second pass results in the same partial matches
      if (!newPartialMatches || partialMatches.map(m => m.route.id).join("-") === newPartialMatches.map(m => m.route.id).join("-")) {
        return {
          type: "success",
          matches: matchedSplat ? newMatches : null
        };
      }
      partialMatches = newPartialMatches;
      route = partialMatches[partialMatches.length - 1].route;
      if (route.path === "*") {
        // The splat is still our most accurate partial, so run with it
        return {
          type: "success",
          matches: partialMatches
        };
      }
    }
  }
  function _internalSetRoutes(newRoutes) {
    manifest = {};
    inFlightDataRoutes = convertRoutesToDataRoutes(newRoutes, mapRouteProperties, undefined, manifest);
  }
  router = {
    get basename() {
      return basename;
    },
    get future() {
      return future;
    },
    get state() {
      return state;
    },
    get routes() {
      return dataRoutes;
    },
    get window() {
      return routerWindow;
    },
    initialize,
    subscribe,
    enableScrollRestoration,
    navigate,
    fetch,
    revalidate,
    // Passthrough to history-aware createHref used by useHref so we get proper
    // hash-aware URLs in DOM paths
    createHref: to => init.history.createHref(to),
    encodeLocation: to => init.history.encodeLocation(to),
    getFetcher,
    deleteFetcher: deleteFetcherAndUpdateState,
    dispose,
    getBlocker,
    deleteBlocker,
    patchRoutes(routeId, children) {
      return patchRoutes(routeId, children, dataRoutes || inFlightDataRoutes, manifest, mapRouteProperties);
    },
    _internalFetchControllers: fetchControllers,
    _internalActiveDeferreds: activeDeferreds,
    // TODO: Remove setRoutes, it's temporary to avoid dealing with
    // updating the tree while validating the update algorithm.
    _internalSetRoutes
  };
  return router;
}
//#endregion
////////////////////////////////////////////////////////////////////////////////
//#region createStaticHandler
////////////////////////////////////////////////////////////////////////////////
const UNSAFE_DEFERRED_SYMBOL = Symbol("deferred");
function createStaticHandler(routes, opts) {
  invariant(routes.length > 0, "You must provide a non-empty routes array to createStaticHandler");
  let manifest = {};
  let basename = (opts ? opts.basename : null) || "/";
  let mapRouteProperties;
  if (opts != null && opts.mapRouteProperties) {
    mapRouteProperties = opts.mapRouteProperties;
  } else if (opts != null && opts.detectErrorBoundary) {
    // If they are still using the deprecated version, wrap it with the new API
    let detectErrorBoundary = opts.detectErrorBoundary;
    mapRouteProperties = route => ({
      hasErrorBoundary: detectErrorBoundary(route)
    });
  } else {
    mapRouteProperties = defaultMapRouteProperties;
  }
  // Config driven behavior flags
  let future = _extends({
    v7_relativeSplatPath: false,
    v7_throwAbortReason: false
  }, opts ? opts.future : null);
  let dataRoutes = convertRoutesToDataRoutes(routes, mapRouteProperties, undefined, manifest);
  /**
   * The query() method is intended for document requests, in which we want to
   * call an optional action and potentially multiple loaders for all nested
   * routes.  It returns a StaticHandlerContext object, which is very similar
   * to the router state (location, loaderData, actionData, errors, etc.) and
   * also adds SSR-specific information such as the statusCode and headers
   * from action/loaders Responses.
   *
   * It _should_ never throw and should report all errors through the
   * returned context.errors object, properly associating errors to their error
   * boundary.  Additionally, it tracks _deepestRenderedBoundaryId which can be
   * used to emulate React error boundaries during SSr by performing a second
   * pass only down to the boundaryId.
   *
   * The one exception where we do not return a StaticHandlerContext is when a
   * redirect response is returned or thrown from any action/loader.  We
   * propagate that out and return the raw Response so the HTTP server can
   * return it directly.
   *
   * - `opts.requestContext` is an optional server context that will be passed
   *   to actions/loaders in the `context` parameter
   * - `opts.skipLoaderErrorBubbling` is an optional parameter that will prevent
   *   the bubbling of errors which allows single-fetch-type implementations
   *   where the client will handle the bubbling and we may need to return data
   *   for the handling route
   */
  async function query(request, _temp3) {
    let {
      requestContext,
      skipLoaderErrorBubbling,
      unstable_dataStrategy
    } = _temp3 === void 0 ? {} : _temp3;
    let url = new URL(request.url);
    let method = request.method;
    let location = createLocation("", createPath(url), null, "default");
    let matches = matchRoutes(dataRoutes, location, basename);
    // SSR supports HEAD requests while SPA doesn't
    if (!isValidMethod(method) && method !== "HEAD") {
      let error = getInternalRouterError(405, {
        method
      });
      let {
        matches: methodNotAllowedMatches,
        route
      } = getShortCircuitMatches(dataRoutes);
      return {
        basename,
        location,
        matches: methodNotAllowedMatches,
        loaderData: {},
        actionData: null,
        errors: {
          [route.id]: error
        },
        statusCode: error.status,
        loaderHeaders: {},
        actionHeaders: {},
        activeDeferreds: null
      };
    } else if (!matches) {
      let error = getInternalRouterError(404, {
        pathname: location.pathname
      });
      let {
        matches: notFoundMatches,
        route
      } = getShortCircuitMatches(dataRoutes);
      return {
        basename,
        location,
        matches: notFoundMatches,
        loaderData: {},
        actionData: null,
        errors: {
          [route.id]: error
        },
        statusCode: error.status,
        loaderHeaders: {},
        actionHeaders: {},
        activeDeferreds: null
      };
    }
    let result = await queryImpl(request, location, matches, requestContext, unstable_dataStrategy || null, skipLoaderErrorBubbling === true, null);
    if (isResponse(result)) {
      return result;
    }
    // When returning StaticHandlerContext, we patch back in the location here
    // since we need it for React Context.  But this helps keep our submit and
    // loadRouteData operating on a Request instead of a Location
    return _extends({
      location,
      basename
    }, result);
  }
  /**
   * The queryRoute() method is intended for targeted route requests, either
   * for fetch ?_data requests or resource route requests.  In this case, we
   * are only ever calling a single action or loader, and we are returning the
   * returned value directly.  In most cases, this will be a Response returned
   * from the action/loader, but it may be a primitive or other value as well -
   * and in such cases the calling context should handle that accordingly.
   *
   * We do respect the throw/return differentiation, so if an action/loader
   * throws, then this method will throw the value.  This is important so we
   * can do proper boundary identification in Remix where a thrown Response
   * must go to the Catch Boundary but a returned Response is happy-path.
   *
   * One thing to note is that any Router-initiated Errors that make sense
   * to associate with a status code will be thrown as an ErrorResponse
   * instance which include the raw Error, such that the calling context can
   * serialize the error as they see fit while including the proper response
   * code.  Examples here are 404 and 405 errors that occur prior to reaching
   * any user-defined loaders.
   *
   * - `opts.routeId` allows you to specify the specific route handler to call.
   *   If not provided the handler will determine the proper route by matching
   *   against `request.url`
   * - `opts.requestContext` is an optional server context that will be passed
   *    to actions/loaders in the `context` parameter
   */
  async function queryRoute(request, _temp4) {
    let {
      routeId,
      requestContext,
      unstable_dataStrategy
    } = _temp4 === void 0 ? {} : _temp4;
    let url = new URL(request.url);
    let method = request.method;
    let location = createLocation("", createPath(url), null, "default");
    let matches = matchRoutes(dataRoutes, location, basename);
    // SSR supports HEAD requests while SPA doesn't
    if (!isValidMethod(method) && method !== "HEAD" && method !== "OPTIONS") {
      throw getInternalRouterError(405, {
        method
      });
    } else if (!matches) {
      throw getInternalRouterError(404, {
        pathname: location.pathname
      });
    }
    let match = routeId ? matches.find(m => m.route.id === routeId) : getTargetMatch(matches, location);
    if (routeId && !match) {
      throw getInternalRouterError(403, {
        pathname: location.pathname,
        routeId
      });
    } else if (!match) {
      // This should never hit I don't think?
      throw getInternalRouterError(404, {
        pathname: location.pathname
      });
    }
    let result = await queryImpl(request, location, matches, requestContext, unstable_dataStrategy || null, false, match);
    if (isResponse(result)) {
      return result;
    }
    let error = result.errors ? Object.values(result.errors)[0] : undefined;
    if (error !== undefined) {
      // If we got back result.errors, that means the loader/action threw
      // _something_ that wasn't a Response, but it's not guaranteed/required
      // to be an `instanceof Error` either, so we have to use throw here to
      // preserve the "error" state outside of queryImpl.
      throw error;
    }
    // Pick off the right state value to return
    if (result.actionData) {
      return Object.values(result.actionData)[0];
    }
    if (result.loaderData) {
      var _result$activeDeferre;
      let data = Object.values(result.loaderData)[0];
      if ((_result$activeDeferre = result.activeDeferreds) != null && _result$activeDeferre[match.route.id]) {
        data[UNSAFE_DEFERRED_SYMBOL] = result.activeDeferreds[match.route.id];
      }
      return data;
    }
    return undefined;
  }
  async function queryImpl(request, location, matches, requestContext, unstable_dataStrategy, skipLoaderErrorBubbling, routeMatch) {
    invariant(request.signal, "query()/queryRoute() requests must contain an AbortController signal");
    try {
      if (isMutationMethod(request.method.toLowerCase())) {
        let result = await submit(request, matches, routeMatch || getTargetMatch(matches, location), requestContext, unstable_dataStrategy, skipLoaderErrorBubbling, routeMatch != null);
        return result;
      }
      let result = await loadRouteData(request, matches, requestContext, unstable_dataStrategy, skipLoaderErrorBubbling, routeMatch);
      return isResponse(result) ? result : _extends({}, result, {
        actionData: null,
        actionHeaders: {}
      });
    } catch (e) {
      // If the user threw/returned a Response in callLoaderOrAction for a
      // `queryRoute` call, we throw the `HandlerResult` to bail out early
      // and then return or throw the raw Response here accordingly
      if (isHandlerResult(e) && isResponse(e.result)) {
        if (e.type === ResultType.error) {
          throw e.result;
        }
        return e.result;
      }
      // Redirects are always returned since they don't propagate to catch
      // boundaries
      if (isRedirectResponse(e)) {
        return e;
      }
      throw e;
    }
  }
  async function submit(request, matches, actionMatch, requestContext, unstable_dataStrategy, skipLoaderErrorBubbling, isRouteRequest) {
    let result;
    if (!actionMatch.route.action && !actionMatch.route.lazy) {
      let error = getInternalRouterError(405, {
        method: request.method,
        pathname: new URL(request.url).pathname,
        routeId: actionMatch.route.id
      });
      if (isRouteRequest) {
        throw error;
      }
      result = {
        type: ResultType.error,
        error
      };
    } else {
      let results = await callDataStrategy("action", request, [actionMatch], matches, isRouteRequest, requestContext, unstable_dataStrategy);
      result = results[0];
      if (request.signal.aborted) {
        throwStaticHandlerAbortedError(request, isRouteRequest, future);
      }
    }
    if (isRedirectResult(result)) {
      // Uhhhh - this should never happen, we should always throw these from
      // callLoaderOrAction, but the type narrowing here keeps TS happy and we
      // can get back on the "throw all redirect responses" train here should
      // this ever happen :/
      throw new Response(null, {
        status: result.response.status,
        headers: {
          Location: result.response.headers.get("Location")
        }
      });
    }
    if (isDeferredResult(result)) {
      let error = getInternalRouterError(400, {
        type: "defer-action"
      });
      if (isRouteRequest) {
        throw error;
      }
      result = {
        type: ResultType.error,
        error
      };
    }
    if (isRouteRequest) {
      // Note: This should only be non-Response values if we get here, since
      // isRouteRequest should throw any Response received in callLoaderOrAction
      if (isErrorResult(result)) {
        throw result.error;
      }
      return {
        matches: [actionMatch],
        loaderData: {},
        actionData: {
          [actionMatch.route.id]: result.data
        },
        errors: null,
        // Note: statusCode + headers are unused here since queryRoute will
        // return the raw Response or value
        statusCode: 200,
        loaderHeaders: {},
        actionHeaders: {},
        activeDeferreds: null
      };
    }
    // Create a GET request for the loaders
    let loaderRequest = new Request(request.url, {
      headers: request.headers,
      redirect: request.redirect,
      signal: request.signal
    });
    if (isErrorResult(result)) {
      // Store off the pending error - we use it to determine which loaders
      // to call and will commit it when we complete the navigation
      let boundaryMatch = skipLoaderErrorBubbling ? actionMatch : findNearestBoundary(matches, actionMatch.route.id);
      let context = await loadRouteData(loaderRequest, matches, requestContext, unstable_dataStrategy, skipLoaderErrorBubbling, null, [boundaryMatch.route.id, result]);
      // action status codes take precedence over loader status codes
      return _extends({}, context, {
        statusCode: isRouteErrorResponse(result.error) ? result.error.status : result.statusCode != null ? result.statusCode : 500,
        actionData: null,
        actionHeaders: _extends({}, result.headers ? {
          [actionMatch.route.id]: result.headers
        } : {})
      });
    }
    let context = await loadRouteData(loaderRequest, matches, requestContext, unstable_dataStrategy, skipLoaderErrorBubbling, null);
    return _extends({}, context, {
      actionData: {
        [actionMatch.route.id]: result.data
      }
    }, result.statusCode ? {
      statusCode: result.statusCode
    } : {}, {
      actionHeaders: result.headers ? {
        [actionMatch.route.id]: result.headers
      } : {}
    });
  }
  async function loadRouteData(request, matches, requestContext, unstable_dataStrategy, skipLoaderErrorBubbling, routeMatch, pendingActionResult) {
    let isRouteRequest = routeMatch != null;
    // Short circuit if we have no loaders to run (queryRoute())
    if (isRouteRequest && !(routeMatch != null && routeMatch.route.loader) && !(routeMatch != null && routeMatch.route.lazy)) {
      throw getInternalRouterError(400, {
        method: request.method,
        pathname: new URL(request.url).pathname,
        routeId: routeMatch == null ? void 0 : routeMatch.route.id
      });
    }
    let requestMatches = routeMatch ? [routeMatch] : pendingActionResult && isErrorResult(pendingActionResult[1]) ? getLoaderMatchesUntilBoundary(matches, pendingActionResult[0]) : matches;
    let matchesToLoad = requestMatches.filter(m => m.route.loader || m.route.lazy);
    // Short circuit if we have no loaders to run (query())
    if (matchesToLoad.length === 0) {
      return {
        matches,
        // Add a null for all matched routes for proper revalidation on the client
        loaderData: matches.reduce((acc, m) => Object.assign(acc, {
          [m.route.id]: null
        }), {}),
        errors: pendingActionResult && isErrorResult(pendingActionResult[1]) ? {
          [pendingActionResult[0]]: pendingActionResult[1].error
        } : null,
        statusCode: 200,
        loaderHeaders: {},
        activeDeferreds: null
      };
    }
    let results = await callDataStrategy("loader", request, matchesToLoad, matches, isRouteRequest, requestContext, unstable_dataStrategy);
    if (request.signal.aborted) {
      throwStaticHandlerAbortedError(request, isRouteRequest, future);
    }
    // Process and commit output from loaders
    let activeDeferreds = new Map();
    let context = processRouteLoaderData(matches, matchesToLoad, results, pendingActionResult, activeDeferreds, skipLoaderErrorBubbling);
    // Add a null for any non-loader matches for proper revalidation on the client
    let executedLoaders = new Set(matchesToLoad.map(match => match.route.id));
    matches.forEach(match => {
      if (!executedLoaders.has(match.route.id)) {
        context.loaderData[match.route.id] = null;
      }
    });
    return _extends({}, context, {
      matches,
      activeDeferreds: activeDeferreds.size > 0 ? Object.fromEntries(activeDeferreds.entries()) : null
    });
  }
  // Utility wrapper for calling dataStrategy server-side without having to
  // pass around the manifest, mapRouteProperties, etc.
  async function callDataStrategy(type, request, matchesToLoad, matches, isRouteRequest, requestContext, unstable_dataStrategy) {
    let results = await callDataStrategyImpl(unstable_dataStrategy || defaultDataStrategy, type, request, matchesToLoad, matches, manifest, mapRouteProperties, requestContext);
    return await Promise.all(results.map((result, i) => {
      if (isRedirectHandlerResult(result)) {
        let response = result.result;
        // Throw redirects and let the server handle them with an HTTP redirect
        throw normalizeRelativeRoutingRedirectResponse(response, request, matchesToLoad[i].route.id, matches, basename, future.v7_relativeSplatPath);
      }
      if (isResponse(result.result) && isRouteRequest) {
        // For SSR single-route requests, we want to hand Responses back
        // directly without unwrapping
        throw result;
      }
      return convertHandlerResultToDataResult(result);
    }));
  }
  return {
    dataRoutes,
    query,
    queryRoute
  };
}
//#endregion
////////////////////////////////////////////////////////////////////////////////
//#region Helpers
////////////////////////////////////////////////////////////////////////////////
/**
 * Given an existing StaticHandlerContext and an error thrown at render time,
 * provide an updated StaticHandlerContext suitable for a second SSR render
 */
function getStaticContextFromError(routes, context, error) {
  let newContext = _extends({}, context, {
    statusCode: isRouteErrorResponse(error) ? error.status : 500,
    errors: {
      [context._deepestRenderedBoundaryId || routes[0].id]: error
    }
  });
  return newContext;
}
function throwStaticHandlerAbortedError(request, isRouteRequest, future) {
  if (future.v7_throwAbortReason && request.signal.reason !== undefined) {
    throw request.signal.reason;
  }
  let method = isRouteRequest ? "queryRoute" : "query";
  throw new Error(method + "() call aborted: " + request.method + " " + request.url);
}
function isSubmissionNavigation(opts) {
  return opts != null && ("formData" in opts && opts.formData != null || "body" in opts && opts.body !== undefined);
}
function normalizeTo(location, matches, basename, prependBasename, to, v7_relativeSplatPath, fromRouteId, relative) {
  let contextualMatches;
  let activeRouteMatch;
  if (fromRouteId) {
    // Grab matches up to the calling route so our route-relative logic is
    // relative to the correct source route
    contextualMatches = [];
    for (let match of matches) {
      contextualMatches.push(match);
      if (match.route.id === fromRouteId) {
        activeRouteMatch = match;
        break;
      }
    }
  } else {
    contextualMatches = matches;
    activeRouteMatch = matches[matches.length - 1];
  }
  // Resolve the relative path
  let path = resolveTo(to ? to : ".", getResolveToMatches(contextualMatches, v7_relativeSplatPath), stripBasename(location.pathname, basename) || location.pathname, relative === "path");
  // When `to` is not specified we inherit search/hash from the current
  // location, unlike when to="." and we just inherit the path.
  // See https://github.com/remix-run/remix/issues/927
  if (to == null) {
    path.search = location.search;
    path.hash = location.hash;
  }
  // Add an ?index param for matched index routes if we don't already have one
  if ((to == null || to === "" || to === ".") && activeRouteMatch && activeRouteMatch.route.index && !hasNakedIndexQuery(path.search)) {
    path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
  }
  // If we're operating within a basename, prepend it to the pathname.  If
  // this is a root navigation, then just use the raw basename which allows
  // the basename to have full control over the presence of a trailing slash
  // on root actions
  if (prependBasename && basename !== "/") {
    path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
  }
  return createPath(path);
}
// Normalize navigation options by converting formMethod=GET formData objects to
// URLSearchParams so they behave identically to links with query params
function normalizeNavigateOptions(normalizeFormMethod, isFetcher, path, opts) {
  // Return location verbatim on non-submission navigations
  if (!opts || !isSubmissionNavigation(opts)) {
    return {
      path
    };
  }
  if (opts.formMethod && !isValidMethod(opts.formMethod)) {
    return {
      path,
      error: getInternalRouterError(405, {
        method: opts.formMethod
      })
    };
  }
  let getInvalidBodyError = () => ({
    path,
    error: getInternalRouterError(400, {
      type: "invalid-body"
    })
  });
  // Create a Submission on non-GET navigations
  let rawFormMethod = opts.formMethod || "get";
  let formMethod = normalizeFormMethod ? rawFormMethod.toUpperCase() : rawFormMethod.toLowerCase();
  let formAction = stripHashFromPath(path);
  if (opts.body !== undefined) {
    if (opts.formEncType === "text/plain") {
      // text only support POST/PUT/PATCH/DELETE submissions
      if (!isMutationMethod(formMethod)) {
        return getInvalidBodyError();
      }
      let text = typeof opts.body === "string" ? opts.body : opts.body instanceof FormData || opts.body instanceof URLSearchParams ?
      // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#plain-text-form-data
      Array.from(opts.body.entries()).reduce((acc, _ref5) => {
        let [name, value] = _ref5;
        return "" + acc + name + "=" + value + "\n";
      }, "") : String(opts.body);
      return {
        path,
        submission: {
          formMethod,
          formAction,
          formEncType: opts.formEncType,
          formData: undefined,
          json: undefined,
          text
        }
      };
    } else if (opts.formEncType === "application/json") {
      // json only supports POST/PUT/PATCH/DELETE submissions
      if (!isMutationMethod(formMethod)) {
        return getInvalidBodyError();
      }
      try {
        let json = typeof opts.body === "string" ? JSON.parse(opts.body) : opts.body;
        return {
          path,
          submission: {
            formMethod,
            formAction,
            formEncType: opts.formEncType,
            formData: undefined,
            json,
            text: undefined
          }
        };
      } catch (e) {
        return getInvalidBodyError();
      }
    }
  }
  invariant(typeof FormData === "function", "FormData is not available in this environment");
  let searchParams;
  let formData;
  if (opts.formData) {
    searchParams = convertFormDataToSearchParams(opts.formData);
    formData = opts.formData;
  } else if (opts.body instanceof FormData) {
    searchParams = convertFormDataToSearchParams(opts.body);
    formData = opts.body;
  } else if (opts.body instanceof URLSearchParams) {
    searchParams = opts.body;
    formData = convertSearchParamsToFormData(searchParams);
  } else if (opts.body == null) {
    searchParams = new URLSearchParams();
    formData = new FormData();
  } else {
    try {
      searchParams = new URLSearchParams(opts.body);
      formData = convertSearchParamsToFormData(searchParams);
    } catch (e) {
      return getInvalidBodyError();
    }
  }
  let submission = {
    formMethod,
    formAction,
    formEncType: opts && opts.formEncType || "application/x-www-form-urlencoded",
    formData,
    json: undefined,
    text: undefined
  };
  if (isMutationMethod(submission.formMethod)) {
    return {
      path,
      submission
    };
  }
  // Flatten submission onto URLSearchParams for GET submissions
  let parsedPath = parsePath(path);
  // On GET navigation submissions we can drop the ?index param from the
  // resulting location since all loaders will run.  But fetcher GET submissions
  // only run a single loader so we need to preserve any incoming ?index params
  if (isFetcher && parsedPath.search && hasNakedIndexQuery(parsedPath.search)) {
    searchParams.append("index", "");
  }
  parsedPath.search = "?" + searchParams;
  return {
    path: createPath(parsedPath),
    submission
  };
}
// Filter out all routes below any caught error as they aren't going to
// render so we don't need to load them
function getLoaderMatchesUntilBoundary(matches, boundaryId) {
  let boundaryMatches = matches;
  if (boundaryId) {
    let index = matches.findIndex(m => m.route.id === boundaryId);
    if (index >= 0) {
      boundaryMatches = matches.slice(0, index);
    }
  }
  return boundaryMatches;
}
function getMatchesToLoad(history, state, matches, submission, location, isInitialLoad, skipActionErrorRevalidation, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, pendingActionResult) {
  let actionResult = pendingActionResult ? isErrorResult(pendingActionResult[1]) ? pendingActionResult[1].error : pendingActionResult[1].data : undefined;
  let currentUrl = history.createURL(state.location);
  let nextUrl = history.createURL(location);
  // Pick navigation matches that are net-new or qualify for revalidation
  let boundaryId = pendingActionResult && isErrorResult(pendingActionResult[1]) ? pendingActionResult[0] : undefined;
  let boundaryMatches = boundaryId ? getLoaderMatchesUntilBoundary(matches, boundaryId) : matches;
  // Don't revalidate loaders by default after action 4xx/5xx responses
  // when the flag is enabled.  They can still opt-into revalidation via
  // `shouldRevalidate` via `actionResult`
  let actionStatus = pendingActionResult ? pendingActionResult[1].statusCode : undefined;
  let shouldSkipRevalidation = skipActionErrorRevalidation && actionStatus && actionStatus >= 400;
  let navigationMatches = boundaryMatches.filter((match, index) => {
    let {
      route
    } = match;
    if (route.lazy) {
      // We haven't loaded this route yet so we don't know if it's got a loader!
      return true;
    }
    if (route.loader == null) {
      return false;
    }
    if (isInitialLoad) {
      if (typeof route.loader !== "function" || route.loader.hydrate) {
        return true;
      }
      return state.loaderData[route.id] === undefined && (
      // Don't re-run if the loader ran and threw an error
      !state.errors || state.errors[route.id] === undefined);
    }
    // Always call the loader on new route instances and pending defer cancellations
    if (isNewLoader(state.loaderData, state.matches[index], match) || cancelledDeferredRoutes.some(id => id === match.route.id)) {
      return true;
    }
    // This is the default implementation for when we revalidate.  If the route
    // provides it's own implementation, then we give them full control but
    // provide this value so they can leverage it if needed after they check
    // their own specific use cases
    let currentRouteMatch = state.matches[index];
    let nextRouteMatch = match;
    return shouldRevalidateLoader(match, _extends({
      currentUrl,
      currentParams: currentRouteMatch.params,
      nextUrl,
      nextParams: nextRouteMatch.params
    }, submission, {
      actionResult,
      unstable_actionStatus: actionStatus,
      defaultShouldRevalidate: shouldSkipRevalidation ? false :
      // Forced revalidation due to submission, useRevalidator, or X-Remix-Revalidate
      isRevalidationRequired || currentUrl.pathname + currentUrl.search === nextUrl.pathname + nextUrl.search ||
      // Search params affect all loaders
      currentUrl.search !== nextUrl.search || isNewRouteInstance(currentRouteMatch, nextRouteMatch)
    }));
  });
  // Pick fetcher.loads that need to be revalidated
  let revalidatingFetchers = [];
  fetchLoadMatches.forEach((f, key) => {
    // Don't revalidate:
    //  - on initial load (shouldn't be any fetchers then anyway)
    //  - if fetcher won't be present in the subsequent render
    //    - no longer matches the URL (v7_fetcherPersist=false)
    //    - was unmounted but persisted due to v7_fetcherPersist=true
    if (isInitialLoad || !matches.some(m => m.route.id === f.routeId) || deletedFetchers.has(key)) {
      return;
    }
    let fetcherMatches = matchRoutes(routesToUse, f.path, basename);
    // If the fetcher path no longer matches, push it in with null matches so
    // we can trigger a 404 in callLoadersAndMaybeResolveData.  Note this is
    // currently only a use-case for Remix HMR where the route tree can change
    // at runtime and remove a route previously loaded via a fetcher
    if (!fetcherMatches) {
      revalidatingFetchers.push({
        key,
        routeId: f.routeId,
        path: f.path,
        matches: null,
        match: null,
        controller: null
      });
      return;
    }
    // Revalidating fetchers are decoupled from the route matches since they
    // load from a static href.  They revalidate based on explicit revalidation
    // (submission, useRevalidator, or X-Remix-Revalidate)
    let fetcher = state.fetchers.get(key);
    let fetcherMatch = getTargetMatch(fetcherMatches, f.path);
    let shouldRevalidate = false;
    if (fetchRedirectIds.has(key)) {
      // Never trigger a revalidation of an actively redirecting fetcher
      shouldRevalidate = false;
    } else if (cancelledFetcherLoads.includes(key)) {
      // Always revalidate if the fetcher was cancelled
      shouldRevalidate = true;
    } else if (fetcher && fetcher.state !== "idle" && fetcher.data === undefined) {
      // If the fetcher hasn't ever completed loading yet, then this isn't a
      // revalidation, it would just be a brand new load if an explicit
      // revalidation is required
      shouldRevalidate = isRevalidationRequired;
    } else {
      // Otherwise fall back on any user-defined shouldRevalidate, defaulting
      // to explicit revalidations only
      shouldRevalidate = shouldRevalidateLoader(fetcherMatch, _extends({
        currentUrl,
        currentParams: state.matches[state.matches.length - 1].params,
        nextUrl,
        nextParams: matches[matches.length - 1].params
      }, submission, {
        actionResult,
        unstable_actionStatus: actionStatus,
        defaultShouldRevalidate: shouldSkipRevalidation ? false : isRevalidationRequired
      }));
    }
    if (shouldRevalidate) {
      revalidatingFetchers.push({
        key,
        routeId: f.routeId,
        path: f.path,
        matches: fetcherMatches,
        match: fetcherMatch,
        controller: new AbortController()
      });
    }
  });
  return [navigationMatches, revalidatingFetchers];
}
function isNewLoader(currentLoaderData, currentMatch, match) {
  let isNew =
  // [a] -> [a, b]
  !currentMatch ||
  // [a, b] -> [a, c]
  match.route.id !== currentMatch.route.id;
  // Handle the case that we don't have data for a re-used route, potentially
  // from a prior error or from a cancelled pending deferred
  let isMissingData = currentLoaderData[match.route.id] === undefined;
  // Always load if this is a net-new route or we don't yet have data
  return isNew || isMissingData;
}
function isNewRouteInstance(currentMatch, match) {
  let currentPath = currentMatch.route.path;
  return (
    // param change for this match, /users/123 -> /users/456
    currentMatch.pathname !== match.pathname ||
    // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    currentPath != null && currentPath.endsWith("*") && currentMatch.params["*"] !== match.params["*"]
  );
}
function shouldRevalidateLoader(loaderMatch, arg) {
  if (loaderMatch.route.shouldRevalidate) {
    let routeChoice = loaderMatch.route.shouldRevalidate(arg);
    if (typeof routeChoice === "boolean") {
      return routeChoice;
    }
  }
  return arg.defaultShouldRevalidate;
}
/**
 * Idempotent utility to execute route.children() method to lazily load route
 * definitions and update the routes/routeManifest
 */
async function loadLazyRouteChildren(patchRoutesOnMissImpl, path, matches, routes, manifest, mapRouteProperties, pendingRouteChildren, signal) {
  let key = [path, ...matches.map(m => m.route.id)].join("-");
  try {
    let pending = pendingRouteChildren.get(key);
    if (!pending) {
      pending = patchRoutesOnMissImpl({
        path,
        matches,
        patch: (routeId, children) => {
          if (!signal.aborted) {
            patchRoutes(routeId, children, routes, manifest, mapRouteProperties);
          }
        }
      });
      pendingRouteChildren.set(key, pending);
    }
    if (pending && isPromise(pending)) {
      await pending;
    }
  } finally {
    pendingRouteChildren.delete(key);
  }
}
function patchRoutes(routeId, children, routes, manifest, mapRouteProperties) {
  if (routeId) {
    var _route$children;
    let route = manifest[routeId];
    invariant(route, "No route found to patch children into: routeId = " + routeId);
    let dataChildren = convertRoutesToDataRoutes(children, mapRouteProperties, [routeId, "patch", String(((_route$children = route.children) == null ? void 0 : _route$children.length) || "0")], manifest);
    if (route.children) {
      route.children.push(...dataChildren);
    } else {
      route.children = dataChildren;
    }
  } else {
    let dataChildren = convertRoutesToDataRoutes(children, mapRouteProperties, ["patch", String(routes.length || "0")], manifest);
    routes.push(...dataChildren);
  }
}
/**
 * Execute route.lazy() methods to lazily load route modules (loader, action,
 * shouldRevalidate) and update the routeManifest in place which shares objects
 * with dataRoutes so those get updated as well.
 */
async function loadLazyRouteModule(route, mapRouteProperties, manifest) {
  if (!route.lazy) {
    return;
  }
  let lazyRoute = await route.lazy();
  // If the lazy route function was executed and removed by another parallel
  // call then we can return - first lazy() to finish wins because the return
  // value of lazy is expected to be static
  if (!route.lazy) {
    return;
  }
  let routeToUpdate = manifest[route.id];
  invariant(routeToUpdate, "No route found in manifest");
  // Update the route in place.  This should be safe because there's no way
  // we could yet be sitting on this route as we can't get there without
  // resolving lazy() first.
  //
  // This is different than the HMR "update" use-case where we may actively be
  // on the route being updated.  The main concern boils down to "does this
  // mutation affect any ongoing navigations or any current state.matches
  // values?".  If not, it should be safe to update in place.
  let routeUpdates = {};
  for (let lazyRouteProperty in lazyRoute) {
    let staticRouteValue = routeToUpdate[lazyRouteProperty];
    let isPropertyStaticallyDefined = staticRouteValue !== undefined &&
    // This property isn't static since it should always be updated based
    // on the route updates
    lazyRouteProperty !== "hasErrorBoundary";
    warning(!isPropertyStaticallyDefined, "Route \"" + routeToUpdate.id + "\" has a static property \"" + lazyRouteProperty + "\" " + "defined but its lazy function is also returning a value for this property. " + ("The lazy route property \"" + lazyRouteProperty + "\" will be ignored."));
    if (!isPropertyStaticallyDefined && !immutableRouteKeys.has(lazyRouteProperty)) {
      routeUpdates[lazyRouteProperty] = lazyRoute[lazyRouteProperty];
    }
  }
  // Mutate the route with the provided updates.  Do this first so we pass
  // the updated version to mapRouteProperties
  Object.assign(routeToUpdate, routeUpdates);
  // Mutate the `hasErrorBoundary` property on the route based on the route
  // updates and remove the `lazy` function so we don't resolve the lazy
  // route again.
  Object.assign(routeToUpdate, _extends({}, mapRouteProperties(routeToUpdate), {
    lazy: undefined
  }));
}
// Default implementation of `dataStrategy` which fetches all loaders in parallel
function defaultDataStrategy(opts) {
  return Promise.all(opts.matches.map(m => m.resolve()));
}
async function callDataStrategyImpl(dataStrategyImpl, type, request, matchesToLoad, matches, manifest, mapRouteProperties, requestContext) {
  let routeIdsToLoad = matchesToLoad.reduce((acc, m) => acc.add(m.route.id), new Set());
  let loadedMatches = new Set();
  // Send all matches here to allow for a middleware-type implementation.
  // handler will be a no-op for unneeded routes and we filter those results
  // back out below.
  let results = await dataStrategyImpl({
    matches: matches.map(match => {
      let shouldLoad = routeIdsToLoad.has(match.route.id);
      // `resolve` encapsulates the route.lazy, executing the
      // loader/action, and mapping return values/thrown errors to a
      // HandlerResult.  Users can pass a callback to take fine-grained control
      // over the execution of the loader/action
      let resolve = handlerOverride => {
        loadedMatches.add(match.route.id);
        return shouldLoad ? callLoaderOrAction(type, request, match, manifest, mapRouteProperties, handlerOverride, requestContext) : Promise.resolve({
          type: ResultType.data,
          result: undefined
        });
      };
      return _extends({}, match, {
        shouldLoad,
        resolve
      });
    }),
    request,
    params: matches[0].params,
    context: requestContext
  });
  // Throw if any loadRoute implementations not called since they are what
  // ensures a route is fully loaded
  matches.forEach(m => invariant(loadedMatches.has(m.route.id), "`match.resolve()` was not called for route id \"" + m.route.id + "\". " + "You must call `match.resolve()` on every match passed to " + "`dataStrategy` to ensure all routes are properly loaded."));
  // Filter out any middleware-only matches for which we didn't need to run handlers
  return results.filter((_, i) => routeIdsToLoad.has(matches[i].route.id));
}
// Default logic for calling a loader/action is the user has no specified a dataStrategy
async function callLoaderOrAction(type, request, match, manifest, mapRouteProperties, handlerOverride, staticContext) {
  let result;
  let onReject;
  let runHandler = handler => {
    // Setup a promise we can race against so that abort signals short circuit
    let reject;
    // This will never resolve so safe to type it as Promise<HandlerResult> to
    // satisfy the function return value
    let abortPromise = new Promise((_, r) => reject = r);
    onReject = () => reject();
    request.signal.addEventListener("abort", onReject);
    let actualHandler = ctx => {
      if (typeof handler !== "function") {
        return Promise.reject(new Error("You cannot call the handler for a route which defines a boolean " + ("\"" + type + "\" [routeId: " + match.route.id + "]")));
      }
      return handler({
        request,
        params: match.params,
        context: staticContext
      }, ...(ctx !== undefined ? [ctx] : []));
    };
    let handlerPromise;
    if (handlerOverride) {
      handlerPromise = handlerOverride(ctx => actualHandler(ctx));
    } else {
      handlerPromise = (async () => {
        try {
          let val = await actualHandler();
          return {
            type: "data",
            result: val
          };
        } catch (e) {
          return {
            type: "error",
            result: e
          };
        }
      })();
    }
    return Promise.race([handlerPromise, abortPromise]);
  };
  try {
    let handler = match.route[type];
    if (match.route.lazy) {
      if (handler) {
        // Run statically defined handler in parallel with lazy()
        let handlerError;
        let [value] = await Promise.all([
        // If the handler throws, don't let it immediately bubble out,
        // since we need to let the lazy() execution finish so we know if this
        // route has a boundary that can handle the error
        runHandler(handler).catch(e => {
          handlerError = e;
        }), loadLazyRouteModule(match.route, mapRouteProperties, manifest)]);
        if (handlerError !== undefined) {
          throw handlerError;
        }
        result = value;
      } else {
        // Load lazy route module, then run any returned handler
        await loadLazyRouteModule(match.route, mapRouteProperties, manifest);
        handler = match.route[type];
        if (handler) {
          // Handler still runs even if we got interrupted to maintain consistency
          // with un-abortable behavior of handler execution on non-lazy or
          // previously-lazy-loaded routes
          result = await runHandler(handler);
        } else if (type === "action") {
          let url = new URL(request.url);
          let pathname = url.pathname + url.search;
          throw getInternalRouterError(405, {
            method: request.method,
            pathname,
            routeId: match.route.id
          });
        } else {
          // lazy() route has no loader to run.  Short circuit here so we don't
          // hit the invariant below that errors on returning undefined.
          return {
            type: ResultType.data,
            result: undefined
          };
        }
      }
    } else if (!handler) {
      let url = new URL(request.url);
      let pathname = url.pathname + url.search;
      throw getInternalRouterError(404, {
        pathname
      });
    } else {
      result = await runHandler(handler);
    }
    invariant(result.result !== undefined, "You defined " + (type === "action" ? "an action" : "a loader") + " for route " + ("\"" + match.route.id + "\" but didn't return anything from your `" + type + "` ") + "function. Please return a value or `null`.");
  } catch (e) {
    // We should already be catching and converting normal handler executions to
    // HandlerResults and returning them, so anything that throws here is an
    // unexpected error we still need to wrap
    return {
      type: ResultType.error,
      result: e
    };
  } finally {
    if (onReject) {
      request.signal.removeEventListener("abort", onReject);
    }
  }
  return result;
}
async function convertHandlerResultToDataResult(handlerResult) {
  let {
    result,
    type,
    status
  } = handlerResult;
  if (isResponse(result)) {
    let data;
    try {
      let contentType = result.headers.get("Content-Type");
      // Check between word boundaries instead of startsWith() due to the last
      // paragraph of https://httpwg.org/specs/rfc9110.html#field.content-type
      if (contentType && /\bapplication\/json\b/.test(contentType)) {
        if (result.body == null) {
          data = null;
        } else {
          data = await result.json();
        }
      } else {
        data = await result.text();
      }
    } catch (e) {
      return {
        type: ResultType.error,
        error: e
      };
    }
    if (type === ResultType.error) {
      return {
        type: ResultType.error,
        error: new ErrorResponseImpl(result.status, result.statusText, data),
        statusCode: result.status,
        headers: result.headers
      };
    }
    return {
      type: ResultType.data,
      data,
      statusCode: result.status,
      headers: result.headers
    };
  }
  if (type === ResultType.error) {
    return {
      type: ResultType.error,
      error: result,
      statusCode: isRouteErrorResponse(result) ? result.status : status
    };
  }
  if (isDeferredData(result)) {
    var _result$init, _result$init2;
    return {
      type: ResultType.deferred,
      deferredData: result,
      statusCode: (_result$init = result.init) == null ? void 0 : _result$init.status,
      headers: ((_result$init2 = result.init) == null ? void 0 : _result$init2.headers) && new Headers(result.init.headers)
    };
  }
  return {
    type: ResultType.data,
    data: result,
    statusCode: status
  };
}
// Support relative routing in internal redirects
function normalizeRelativeRoutingRedirectResponse(response, request, routeId, matches, basename, v7_relativeSplatPath) {
  let location = response.headers.get("Location");
  invariant(location, "Redirects returned/thrown from loaders/actions must have a Location header");
  if (!ABSOLUTE_URL_REGEX.test(location)) {
    let trimmedMatches = matches.slice(0, matches.findIndex(m => m.route.id === routeId) + 1);
    location = normalizeTo(new URL(request.url), trimmedMatches, basename, true, location, v7_relativeSplatPath);
    response.headers.set("Location", location);
  }
  return response;
}
function normalizeRedirectLocation(location, currentUrl, basename) {
  if (ABSOLUTE_URL_REGEX.test(location)) {
    // Strip off the protocol+origin for same-origin + same-basename absolute redirects
    let normalizedLocation = location;
    let url = normalizedLocation.startsWith("//") ? new URL(currentUrl.protocol + normalizedLocation) : new URL(normalizedLocation);
    let isSameBasename = stripBasename(url.pathname, basename) != null;
    if (url.origin === currentUrl.origin && isSameBasename) {
      return url.pathname + url.search + url.hash;
    }
  }
  return location;
}
// Utility method for creating the Request instances for loaders/actions during
// client-side navigations and fetches.  During SSR we will always have a
// Request instance from the static handler (query/queryRoute)
function createClientSideRequest(history, location, signal, submission) {
  let url = history.createURL(stripHashFromPath(location)).toString();
  let init = {
    signal
  };
  if (submission && isMutationMethod(submission.formMethod)) {
    let {
      formMethod,
      formEncType
    } = submission;
    // Didn't think we needed this but it turns out unlike other methods, patch
    // won't be properly normalized to uppercase and results in a 405 error.
    // See: https://fetch.spec.whatwg.org/#concept-method
    init.method = formMethod.toUpperCase();
    if (formEncType === "application/json") {
      init.headers = new Headers({
        "Content-Type": formEncType
      });
      init.body = JSON.stringify(submission.json);
    } else if (formEncType === "text/plain") {
      // Content-Type is inferred (https://fetch.spec.whatwg.org/#dom-request)
      init.body = submission.text;
    } else if (formEncType === "application/x-www-form-urlencoded" && submission.formData) {
      // Content-Type is inferred (https://fetch.spec.whatwg.org/#dom-request)
      init.body = convertFormDataToSearchParams(submission.formData);
    } else {
      // Content-Type is inferred (https://fetch.spec.whatwg.org/#dom-request)
      init.body = submission.formData;
    }
  }
  return new Request(url, init);
}
function convertFormDataToSearchParams(formData) {
  let searchParams = new URLSearchParams();
  for (let [key, value] of formData.entries()) {
    // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#converting-an-entry-list-to-a-list-of-name-value-pairs
    searchParams.append(key, typeof value === "string" ? value : value.name);
  }
  return searchParams;
}
function convertSearchParamsToFormData(searchParams) {
  let formData = new FormData();
  for (let [key, value] of searchParams.entries()) {
    formData.append(key, value);
  }
  return formData;
}
function processRouteLoaderData(matches, matchesToLoad, results, pendingActionResult, activeDeferreds, skipLoaderErrorBubbling) {
  // Fill in loaderData/errors from our loaders
  let loaderData = {};
  let errors = null;
  let statusCode;
  let foundError = false;
  let loaderHeaders = {};
  let pendingError = pendingActionResult && isErrorResult(pendingActionResult[1]) ? pendingActionResult[1].error : undefined;
  // Process loader results into state.loaderData/state.errors
  results.forEach((result, index) => {
    let id = matchesToLoad[index].route.id;
    invariant(!isRedirectResult(result), "Cannot handle redirect results in processLoaderData");
    if (isErrorResult(result)) {
      let error = result.error;
      // If we have a pending action error, we report it at the highest-route
      // that throws a loader error, and then clear it out to indicate that
      // it was consumed
      if (pendingError !== undefined) {
        error = pendingError;
        pendingError = undefined;
      }
      errors = errors || {};
      if (skipLoaderErrorBubbling) {
        errors[id] = error;
      } else {
        // Look upwards from the matched route for the closest ancestor error
        // boundary, defaulting to the root match.  Prefer higher error values
        // if lower errors bubble to the same boundary
        let boundaryMatch = findNearestBoundary(matches, id);
        if (errors[boundaryMatch.route.id] == null) {
          errors[boundaryMatch.route.id] = error;
        }
      }
      // Clear our any prior loaderData for the throwing route
      loaderData[id] = undefined;
      // Once we find our first (highest) error, we set the status code and
      // prevent deeper status codes from overriding
      if (!foundError) {
        foundError = true;
        statusCode = isRouteErrorResponse(result.error) ? result.error.status : 500;
      }
      if (result.headers) {
        loaderHeaders[id] = result.headers;
      }
    } else {
      if (isDeferredResult(result)) {
        activeDeferreds.set(id, result.deferredData);
        loaderData[id] = result.deferredData.data;
        // Error status codes always override success status codes, but if all
        // loaders are successful we take the deepest status code.
        if (result.statusCode != null && result.statusCode !== 200 && !foundError) {
          statusCode = result.statusCode;
        }
        if (result.headers) {
          loaderHeaders[id] = result.headers;
        }
      } else {
        loaderData[id] = result.data;
        // Error status codes always override success status codes, but if all
        // loaders are successful we take the deepest status code.
        if (result.statusCode && result.statusCode !== 200 && !foundError) {
          statusCode = result.statusCode;
        }
        if (result.headers) {
          loaderHeaders[id] = result.headers;
        }
      }
    }
  });
  // If we didn't consume the pending action error (i.e., all loaders
  // resolved), then consume it here.  Also clear out any loaderData for the
  // throwing route
  if (pendingError !== undefined && pendingActionResult) {
    errors = {
      [pendingActionResult[0]]: pendingError
    };
    loaderData[pendingActionResult[0]] = undefined;
  }
  return {
    loaderData,
    errors,
    statusCode: statusCode || 200,
    loaderHeaders
  };
}
function processLoaderData(state, matches, matchesToLoad, results, pendingActionResult, revalidatingFetchers, fetcherResults, activeDeferreds) {
  let {
    loaderData,
    errors
  } = processRouteLoaderData(matches, matchesToLoad, results, pendingActionResult, activeDeferreds, false // This method is only called client side so we always want to bubble
  );
  // Process results from our revalidating fetchers
  for (let index = 0; index < revalidatingFetchers.length; index++) {
    let {
      key,
      match,
      controller
    } = revalidatingFetchers[index];
    invariant(fetcherResults !== undefined && fetcherResults[index] !== undefined, "Did not find corresponding fetcher result");
    let result = fetcherResults[index];
    // Process fetcher non-redirect errors
    if (controller && controller.signal.aborted) {
      // Nothing to do for aborted fetchers
      continue;
    } else if (isErrorResult(result)) {
      let boundaryMatch = findNearestBoundary(state.matches, match == null ? void 0 : match.route.id);
      if (!(errors && errors[boundaryMatch.route.id])) {
        errors = _extends({}, errors, {
          [boundaryMatch.route.id]: result.error
        });
      }
      state.fetchers.delete(key);
    } else if (isRedirectResult(result)) {
      // Should never get here, redirects should get processed above, but we
      // keep this to type narrow to a success result in the else
      invariant(false, "Unhandled fetcher revalidation redirect");
    } else if (isDeferredResult(result)) {
      // Should never get here, deferred data should be awaited for fetchers
      // in resolveDeferredResults
      invariant(false, "Unhandled fetcher deferred data");
    } else {
      let doneFetcher = getDoneFetcher(result.data);
      state.fetchers.set(key, doneFetcher);
    }
  }
  return {
    loaderData,
    errors
  };
}
function mergeLoaderData(loaderData, newLoaderData, matches, errors) {
  let mergedLoaderData = _extends({}, newLoaderData);
  for (let match of matches) {
    let id = match.route.id;
    if (newLoaderData.hasOwnProperty(id)) {
      if (newLoaderData[id] !== undefined) {
        mergedLoaderData[id] = newLoaderData[id];
      }
    } else if (loaderData[id] !== undefined && match.route.loader) {
      // Preserve existing keys not included in newLoaderData and where a loader
      // wasn't removed by HMR
      mergedLoaderData[id] = loaderData[id];
    }
    if (errors && errors.hasOwnProperty(id)) {
      // Don't keep any loader data below the boundary
      break;
    }
  }
  return mergedLoaderData;
}
function getActionDataForCommit(pendingActionResult) {
  if (!pendingActionResult) {
    return {};
  }
  return isErrorResult(pendingActionResult[1]) ? {
    // Clear out prior actionData on errors
    actionData: {}
  } : {
    actionData: {
      [pendingActionResult[0]]: pendingActionResult[1].data
    }
  };
}
// Find the nearest error boundary, looking upwards from the leaf route (or the
// route specified by routeId) for the closest ancestor error boundary,
// defaulting to the root match
function findNearestBoundary(matches, routeId) {
  let eligibleMatches = routeId ? matches.slice(0, matches.findIndex(m => m.route.id === routeId) + 1) : [...matches];
  return eligibleMatches.reverse().find(m => m.route.hasErrorBoundary === true) || matches[0];
}
function getShortCircuitMatches(routes) {
  // Prefer a root layout route if present, otherwise shim in a route object
  let route = routes.length === 1 ? routes[0] : routes.find(r => r.index || !r.path || r.path === "/") || {
    id: "__shim-error-route__"
  };
  return {
    matches: [{
      params: {},
      pathname: "",
      pathnameBase: "",
      route
    }],
    route
  };
}
function getInternalRouterError(status, _temp5) {
  let {
    pathname,
    routeId,
    method,
    type,
    message
  } = _temp5 === void 0 ? {} : _temp5;
  let statusText = "Unknown Server Error";
  let errorMessage = "Unknown @remix-run/router error";
  if (status === 400) {
    statusText = "Bad Request";
    if (type === "route-discovery") {
      errorMessage = "Unable to match URL \"" + pathname + "\" - the `children()` function for " + ("route `" + routeId + "` threw the following error:\n" + message);
    } else if (method && pathname && routeId) {
      errorMessage = "You made a " + method + " request to \"" + pathname + "\" but " + ("did not provide a `loader` for route \"" + routeId + "\", ") + "so there is no way to handle the request.";
    } else if (type === "defer-action") {
      errorMessage = "defer() is not supported in actions";
    } else if (type === "invalid-body") {
      errorMessage = "Unable to encode submission body";
    }
  } else if (status === 403) {
    statusText = "Forbidden";
    errorMessage = "Route \"" + routeId + "\" does not match URL \"" + pathname + "\"";
  } else if (status === 404) {
    statusText = "Not Found";
    errorMessage = "No route matches URL \"" + pathname + "\"";
  } else if (status === 405) {
    statusText = "Method Not Allowed";
    if (method && pathname && routeId) {
      errorMessage = "You made a " + method.toUpperCase() + " request to \"" + pathname + "\" but " + ("did not provide an `action` for route \"" + routeId + "\", ") + "so there is no way to handle the request.";
    } else if (method) {
      errorMessage = "Invalid request method \"" + method.toUpperCase() + "\"";
    }
  }
  return new ErrorResponseImpl(status || 500, statusText, new Error(errorMessage), true);
}
// Find any returned redirect errors, starting from the lowest match
function findRedirect(results) {
  for (let i = results.length - 1; i >= 0; i--) {
    let result = results[i];
    if (isRedirectResult(result)) {
      return {
        result,
        idx: i
      };
    }
  }
}
function stripHashFromPath(path) {
  let parsedPath = typeof path === "string" ? parsePath(path) : path;
  return createPath(_extends({}, parsedPath, {
    hash: ""
  }));
}
function isHashChangeOnly(a, b) {
  if (a.pathname !== b.pathname || a.search !== b.search) {
    return false;
  }
  if (a.hash === "") {
    // /page -> /page#hash
    return b.hash !== "";
  } else if (a.hash === b.hash) {
    // /page#hash -> /page#hash
    return true;
  } else if (b.hash !== "") {
    // /page#hash -> /page#other
    return true;
  }
  // If the hash is removed the browser will re-perform a request to the server
  // /page#hash -> /page
  return false;
}
function isPromise(val) {
  return typeof val === "object" && val != null && "then" in val;
}
function isHandlerResult(result) {
  return result != null && typeof result === "object" && "type" in result && "result" in result && (result.type === ResultType.data || result.type === ResultType.error);
}
function isRedirectHandlerResult(result) {
  return isResponse(result.result) && redirectStatusCodes.has(result.result.status);
}
function isDeferredResult(result) {
  return result.type === ResultType.deferred;
}
function isErrorResult(result) {
  return result.type === ResultType.error;
}
function isRedirectResult(result) {
  return (result && result.type) === ResultType.redirect;
}
function isDeferredData(value) {
  let deferred = value;
  return deferred && typeof deferred === "object" && typeof deferred.data === "object" && typeof deferred.subscribe === "function" && typeof deferred.cancel === "function" && typeof deferred.resolveData === "function";
}
function isResponse(value) {
  return value != null && typeof value.status === "number" && typeof value.statusText === "string" && typeof value.headers === "object" && typeof value.body !== "undefined";
}
function isRedirectResponse(result) {
  if (!isResponse(result)) {
    return false;
  }
  let status = result.status;
  let location = result.headers.get("Location");
  return status >= 300 && status <= 399 && location != null;
}
function isValidMethod(method) {
  return validRequestMethods.has(method.toLowerCase());
}
function isMutationMethod(method) {
  return validMutationMethods.has(method.toLowerCase());
}
async function resolveDeferredResults(currentMatches, matchesToLoad, results, signals, isFetcher, currentLoaderData) {
  for (let index = 0; index < results.length; index++) {
    let result = results[index];
    let match = matchesToLoad[index];
    // If we don't have a match, then we can have a deferred result to do
    // anything with.  This is for revalidating fetchers where the route was
    // removed during HMR
    if (!match) {
      continue;
    }
    let currentMatch = currentMatches.find(m => m.route.id === match.route.id);
    let isRevalidatingLoader = currentMatch != null && !isNewRouteInstance(currentMatch, match) && (currentLoaderData && currentLoaderData[match.route.id]) !== undefined;
    if (isDeferredResult(result) && (isFetcher || isRevalidatingLoader)) {
      // Note: we do not have to touch activeDeferreds here since we race them
      // against the signal in resolveDeferredData and they'll get aborted
      // there if needed
      let signal = signals[index];
      invariant(signal, "Expected an AbortSignal for revalidating fetcher deferred result");
      await resolveDeferredData(result, signal, isFetcher).then(result => {
        if (result) {
          results[index] = result || results[index];
        }
      });
    }
  }
}
async function resolveDeferredData(result, signal, unwrap) {
  if (unwrap === void 0) {
    unwrap = false;
  }
  let aborted = await result.deferredData.resolveData(signal);
  if (aborted) {
    return;
  }
  if (unwrap) {
    try {
      return {
        type: ResultType.data,
        data: result.deferredData.unwrappedData
      };
    } catch (e) {
      // Handle any TrackedPromise._error values encountered while unwrapping
      return {
        type: ResultType.error,
        error: e
      };
    }
  }
  return {
    type: ResultType.data,
    data: result.deferredData.data
  };
}
function hasNakedIndexQuery(search) {
  return new URLSearchParams(search).getAll("index").some(v => v === "");
}
function getTargetMatch(matches, location) {
  let search = typeof location === "string" ? parsePath(location).search : location.search;
  if (matches[matches.length - 1].route.index && hasNakedIndexQuery(search || "")) {
    // Return the leaf index route when index is present
    return matches[matches.length - 1];
  }
  // Otherwise grab the deepest "path contributing" match (ignoring index and
  // pathless layout routes)
  let pathMatches = getPathContributingMatches(matches);
  return pathMatches[pathMatches.length - 1];
}
function getSubmissionFromNavigation(navigation) {
  let {
    formMethod,
    formAction,
    formEncType,
    text,
    formData,
    json
  } = navigation;
  if (!formMethod || !formAction || !formEncType) {
    return;
  }
  if (text != null) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData: undefined,
      json: undefined,
      text
    };
  } else if (formData != null) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData,
      json: undefined,
      text: undefined
    };
  } else if (json !== undefined) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData: undefined,
      json,
      text: undefined
    };
  }
}
function getLoadingNavigation(location, submission) {
  if (submission) {
    let navigation = {
      state: "loading",
      location,
      formMethod: submission.formMethod,
      formAction: submission.formAction,
      formEncType: submission.formEncType,
      formData: submission.formData,
      json: submission.json,
      text: submission.text
    };
    return navigation;
  } else {
    let navigation = {
      state: "loading",
      location,
      formMethod: undefined,
      formAction: undefined,
      formEncType: undefined,
      formData: undefined,
      json: undefined,
      text: undefined
    };
    return navigation;
  }
}
function getSubmittingNavigation(location, submission) {
  let navigation = {
    state: "submitting",
    location,
    formMethod: submission.formMethod,
    formAction: submission.formAction,
    formEncType: submission.formEncType,
    formData: submission.formData,
    json: submission.json,
    text: submission.text
  };
  return navigation;
}
function getLoadingFetcher(submission, data) {
  if (submission) {
    let fetcher = {
      state: "loading",
      formMethod: submission.formMethod,
      formAction: submission.formAction,
      formEncType: submission.formEncType,
      formData: submission.formData,
      json: submission.json,
      text: submission.text,
      data
    };
    return fetcher;
  } else {
    let fetcher = {
      state: "loading",
      formMethod: undefined,
      formAction: undefined,
      formEncType: undefined,
      formData: undefined,
      json: undefined,
      text: undefined,
      data
    };
    return fetcher;
  }
}
function getSubmittingFetcher(submission, existingFetcher) {
  let fetcher = {
    state: "submitting",
    formMethod: submission.formMethod,
    formAction: submission.formAction,
    formEncType: submission.formEncType,
    formData: submission.formData,
    json: submission.json,
    text: submission.text,
    data: existingFetcher ? existingFetcher.data : undefined
  };
  return fetcher;
}
function getDoneFetcher(data) {
  let fetcher = {
    state: "idle",
    formMethod: undefined,
    formAction: undefined,
    formEncType: undefined,
    formData: undefined,
    json: undefined,
    text: undefined,
    data
  };
  return fetcher;
}
function restoreAppliedTransitions(_window, transitions) {
  try {
    let sessionPositions = _window.sessionStorage.getItem(TRANSITIONS_STORAGE_KEY);
    if (sessionPositions) {
      let json = JSON.parse(sessionPositions);
      for (let [k, v] of Object.entries(json || {})) {
        if (v && Array.isArray(v)) {
          transitions.set(k, new Set(v || []));
        }
      }
    }
  } catch (e) {
    // no-op, use default empty object
  }
}
function persistAppliedTransitions(_window, transitions) {
  if (transitions.size > 0) {
    let json = {};
    for (let [k, v] of transitions) {
      json[k] = [...v];
    }
    try {
      _window.sessionStorage.setItem(TRANSITIONS_STORAGE_KEY, JSON.stringify(json));
    } catch (error) {
      warning(false, "Failed to save applied view transitions in sessionStorage (" + error + ").");
    }
  }
}
//#endregion


//# sourceMappingURL=router.js.map


/***/ }),

/***/ "./src/assets/images/get-5-star-support.svg":
/*!**************************************************!*\
  !*** ./src/assets/images/get-5-star-support.svg ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReactComponent: () => (/* binding */ SvgGet5StarSupport),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _circle, _path, _path2;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

function SvgGet5StarSupport(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", _extends({
    width: 36,
    height: 36,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _circle || (_circle = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
    cx: 18,
    cy: 18,
    r: 18,
    fill: "#0167FF",
    fillOpacity: 0.2
  })), _path || (_path = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M26.22 24.86c-.483-1.44-2.41-2.34-3.783-2.943-.538-.236-2.028-.636-2.207-1.313a1.401 1.401 0 01-.003-.695 1.35 1.35 0 01-.254.025h-.895a1.296 1.296 0 01-1.295-1.295c0-.714.581-1.294 1.295-1.294h.895c.296 0 .576.1.802.279.322-.043.64-.112.95-.208.391-.82.696-1.8.765-2.645.292-3.611-1.922-5.724-5.097-5.36-2.308.267-3.687 1.988-3.836 4.203-.15 2.259.687 3.927 1.576 5.15.39.535.8.88.736 1.524-.073.762-.888.974-1.47 1.209-.691.277-1.435.698-1.787.893-1.21.668-2.539 1.473-2.837 2.574-.661 2.44 1.572 3.18 3.415 3.52 1.582.293 3.366.316 4.833.316 2.655 0 7.427-.107 8.197-2.102.219-.566.125-1.468 0-1.839z",
    fill: "#0167FF"
  })), _path2 || (_path2 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M20.537 18.273a.676.676 0 00-.566-.307h-.895a.675.675 0 100 1.348h.895a.67.67 0 00.595-.365c1.248-.098 2.333-.479 3.095-1.042.175.113.381.18.605.18h.056a1.126 1.126 0 001.125-1.127V14.71a1.122 1.122 0 00-.641-1.013c-.166-3.61-3.154-6.499-6.805-6.499s-6.64 2.888-6.805 6.499a1.12 1.12 0 00-.641 1.013v2.249a1.124 1.124 0 001.124 1.126h.057a1.125 1.125 0 001.125-1.126V14.71a1.123 1.123 0 00-.626-1.006A5.781 5.781 0 0118 8.24a5.78 5.78 0 015.765 5.466 1.124 1.124 0 00-.625 1.006v2.249c0 .15.03.288.08.418-.655.47-1.61.803-2.684.895z",
    fill: "#0167FF"
  })));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTgiIGN5PSIxOCIgcj0iMTgiIGZpbGw9IiMwMTY3RkYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+CjxwYXRoIGQ9Ik0yNi4yMiAyNC44NTkyQzI1LjczNjcgMjMuNDIwNyAyMy44MTAyIDIyLjUyMDIgMjIuNDM2NyAyMS45MTY2QzIxLjg5ODYgMjEuNjgwOSAyMC40MDg5IDIxLjI4MTEgMjAuMjI5OSAyMC42MDM2QzIwLjE2NTggMjAuMzU5NSAyMC4xNzQ0IDIwLjEyOTMgMjAuMjI3IDE5LjkwODhDMjAuMTQzNCAxOS45MjUyIDIwLjA1ODUgMTkuOTMzNiAxOS45NzMzIDE5LjkzNEgxOS4wNzgzQzE4LjczNSAxOS45MzM2IDE4LjQwNTcgMTkuNzk3IDE4LjE2MyAxOS41NTQxQzE3LjkyMDIgMTkuMzExMyAxNy43ODM2IDE4Ljk4MjEgMTcuNzgzMyAxOC42Mzg3QzE3Ljc4MzMgMTcuOTI1MiAxOC4zNjQxIDE3LjM0NTEgMTkuMDc4MyAxNy4zNDUxSDE5Ljk3MzNDMjAuMjY5IDE3LjM0NTEgMjAuNTQ5MyAxNy40NDUyIDIwLjc3NTQgMTcuNjIzN0MyMS4wOTcxIDE3LjU4MTMgMjEuNDE0NiAxNy41MTE4IDIxLjcyNDYgMTcuNDE1OUMyMi4xMTYgMTYuNTk1OCAyMi40MjEzIDE1LjYxNTIgMjIuNDg5NyAxNC43NzExQzIyLjc4MTggMTEuMTU5NiAyMC41Njc4IDkuMDQ2NiAxNy4zOTMzIDkuNDExODhDMTUuMDg1MiA5LjY3NzU2IDEzLjcwNjQgMTEuMzk4NiAxMy41NTc0IDEzLjYxNDNDMTMuNDA2NyAxNS44NzI3IDE0LjI0NCAxNy41NDA3IDE1LjEzMzUgMTguNzY0MkMxNS41MjMgMTkuMjk5MiAxNS45MzIyIDE5LjY0MzEgMTUuODY5MyAyMC4yODc3QzE1Ljc5NjMgMjEuMDUgMTQuOTgxMyAyMS4yNjI0IDE0LjM5ODMgMjEuNDk2NkMxMy43MDc2IDIxLjc3NCAxMi45NjM2IDIyLjE5NSAxMi42MTIzIDIyLjM4OTZDMTEuNDAxOSAyMy4wNTggMTAuMDczNSAyMy44NjMgOS43NzQ5OSAyNC45NjQxQzkuMTEzNzkgMjcuNDA0NCAxMS4zNDY3IDI4LjE0MzYgMTMuMTkwMiAyOC40ODQ5QzE0Ljc3MjMgMjguNzc2OCAxNi41NTYyIDI4Ljc5OTggMTguMDIzNSAyOC43OTk4QzIwLjY3NzcgMjguNzk5OCAyNS40NTAzIDI4LjY5MzUgMjYuMjIgMjYuNjk4NEMyNi40Mzg5IDI2LjEzMjIgMjYuMzQ1MSAyNS4yMyAyNi4yMiAyNC44NTkyWiIgZmlsbD0iIzAxNjdGRiIvPgo8cGF0aCBkPSJNMjAuNTM2OCAxOC4yNzM1QzIwLjQ3NTUgMTguMTc5MiAyMC4zOTE2IDE4LjEwMTYgMjAuMjkyOCAxOC4wNDc5QzIwLjE5NCAxNy45OTQxIDIwLjA4MzMgMTcuOTY1OCAxOS45NzA4IDE3Ljk2NTZIMTkuMDc1OUMxOC45ODU4IDE3Ljk2MzIgMTguODk2MiAxNy45Nzg5IDE4LjgxMjMgMTguMDExN0MxOC43Mjg0IDE4LjA0NDUgMTguNjUyIDE4LjA5MzcgMTguNTg3NCAxOC4xNTY2QzE4LjUyMjkgMTguMjE5NCAxOC40NzE2IDE4LjI5NDYgMTguNDM2NiAxOC4zNzc1QzE4LjQwMTUgMTguNDYwNSAxOC4zODM1IDE4LjU0OTcgMTguMzgzNSAxOC42Mzk4QzE4LjM4MzUgMTguNzI5OSAxOC40MDE1IDE4LjgxOSAxOC40MzY2IDE4LjkwMkMxOC40NzE2IDE4Ljk4NSAxOC41MjI5IDE5LjA2MDEgMTguNTg3NCAxOS4xMjNDMTguNjUyIDE5LjE4NTggMTguNzI4NCAxOS4yMzUxIDE4LjgxMjMgMTkuMjY3OUMxOC44OTYyIDE5LjMwMDcgMTguOTg1OCAxOS4zMTYzIDE5LjA3NTkgMTkuMzEzOUgxOS45NzA4QzIwLjA5NCAxOS4zMTM4IDIwLjIxNDcgMTkuMjc5NyAyMC4zMTk3IDE5LjIxNTRDMjAuNDI0NiAxOS4xNTExIDIwLjUwOTggMTkuMDU5IDIwLjU2NTggMTguOTQ5NEMyMS44MTM2IDE4Ljg1MTIgMjIuODk4OCAxOC40NzAxIDIzLjY2MDYgMTcuOTA3M0MyMy44MzU2IDE4LjAyMDEgMjQuMDQyNCAxOC4wODYxIDI0LjI2NTYgMTguMDg2MUgyNC4zMjE4QzI0LjQ2OTcgMTguMDg2MSAyNC42MTYxIDE4LjA1NyAyNC43NTI3IDE4LjAwMDRDMjQuODg5MyAxNy45NDM4IDI1LjAxMzQgMTcuODYwOCAyNS4xMTc5IDE3Ljc1NjJDMjUuMjIyNCAxNy42NTE2IDI1LjMwNTIgMTcuNTI3NCAyNS4zNjE3IDE3LjM5MDdDMjUuNDE4MiAxNy4yNTQxIDI1LjQ0NzEgMTcuMTA3NiAyNS40NDY5IDE2Ljk1OThWMTQuNzExNUMyNS40NDcgMTQuNDk5MSAyNS4zODY3IDE0LjI5MTEgMjUuMjczMiAxNC4xMTE2QzI1LjE1OTcgMTMuOTMyMiAyNC45OTc1IDEzLjc4ODYgMjQuODA1NiAxMy42OTc3QzI0LjY0MDUgMTAuMDg3NCAyMS42NTE4IDcuMTk5MjIgMTguMDAwOSA3LjE5OTIyQzE0LjM1IDcuMTk5MjIgMTEuMzYwOCAxMC4wODc0IDExLjE5NjQgMTMuNjk3N0MxMS4wMDQ0IDEzLjc4ODUgMTAuODQyMSAxMy45MzIgMTAuNzI4NSAxNC4xMTE1QzEwLjYxNDkgMTQuMjkxIDEwLjU1NDYgMTQuNDk5IDEwLjU1NDcgMTQuNzExNVYxNi45NTk4QzEwLjU1NDUgMTcuMTA3NiAxMC41ODM0IDE3LjI1MzkgMTAuNjM5OCAxNy4zOTA1QzEwLjY5NjIgMTcuNTI3MSAxMC43NzkgMTcuNjUxMyAxMC44ODM0IDE3Ljc1NTlDMTAuOTg3OCAxNy44NjA1IDExLjExMTggMTcuOTQzNSAxMS4yNDgzIDE4LjAwMDFDMTEuMzg0OCAxOC4wNTY4IDExLjUzMTEgMTguMDg2IDExLjY3ODggMTguMDg2MUgxMS43MzU3QzExLjg4MzYgMTguMDg2MSAxMi4wMjk5IDE4LjA1NjkgMTIuMTY2NSAxOC4wMDAzQzEyLjMwMzEgMTcuOTQzNiAxMi40MjcxIDE3Ljg2MDcgMTIuNTMxNiAxNy43NTYxQzEyLjYzNiAxNy42NTE0IDEyLjcxODkgMTcuNTI3MyAxMi43NzUzIDE3LjM5MDdDMTIuODMxOCAxNy4yNTQgMTIuODYwOCAxNy4xMDc2IDEyLjg2MDYgMTYuOTU5OFYxNC43MTE1QzEyLjg2MDUgMTQuNTAyMSAxMi44MDE4IDE0LjI5NjkgMTIuNjkxMiAxNC4xMTkxQzEyLjU4MDYgMTMuOTQxMyAxMi40MjI1IDEzLjc5OCAxMi4yMzQ3IDEzLjcwNTRDMTIuMzk1MiAxMC42NjM0IDE0LjkxOTYgOC4yMzg2NiAxOC4wMDA5IDguMjM4NjZDMjEuMDgxMSA4LjIzODY2IDIzLjYwNjYgMTAuNjYzNCAyMy43NjY0IDEzLjcwNTRDMjMuNTc4OSAxMy43OTgyIDIzLjQyMDkgMTMuOTQxNSAyMy4zMTA0IDE0LjExOTNDMjMuMiAxNC4yOTcxIDIzLjE0MTQgMTQuNTAyMiAyMy4xNDEyIDE0LjcxMTVWMTYuOTU5OEMyMy4xNDEyIDE3LjEwOTEgMjMuMTcwMyAxNy4yNDggMjMuMjIxNCAxNy4zNzc5QzIyLjU2NTcgMTcuODQ3MSAyMS42MTEyIDE4LjE4MTQgMjAuNTM2OCAxOC4yNzM1WiIgZmlsbD0iIzAxNjdGRiIvPgo8L3N2Zz4K");


/***/ }),

/***/ "./src/assets/images/icon.svg":
/*!************************************!*\
  !*** ./src/assets/images/icon.svg ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReactComponent: () => (/* binding */ SvgIcon),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _path, _path2;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

function SvgIcon(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", _extends({
    width: 59,
    height: 42,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M49.536 32.747a1.047 1.047 0 01.41-1.044 15.312 15.312 0 018.456-2.46c-2.214-1.87-6.29-4.217-13.081-4.99v6.196a5.3 5.3 0 01-1.56 3.695 5.338 5.338 0 01-3.71 1.555h-16.68a3.293 3.293 0 00-2.207.785 3.27 3.27 0 00-1.121 2.05 3.181 3.181 0 00.816 2.415 3.203 3.203 0 002.33 1.05 82.18 82.18 0 0013.302-1.605 142.977 142.977 0 0122.514-2.513c-2.862-2.79-8.641-4.305-8.696-4.315a1.054 1.054 0 01-.773-.819z",
    fill: "#fff"
  })), _path2 || (_path2 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M20.023 29.819c1.951-.292 3.822-.595 5.624-.89A92.693 92.693 0 0139.95 27.3a3.287 3.287 0 012.264.924c.607.587.963 1.385.993 2.227a3.17 3.17 0 01-.933 2.22 3.194 3.194 0 01-2.228.93h-16.68a5.548 5.548 0 00-3.344 1.14v-4.921zM42.31.937c.581.59.904 1.386.898 2.213v23.114a5.476 5.476 0 00-3.253-1.064h-.014c-4.914.17-9.808.726-14.635 1.662a157.553 157.553 0 01-24.252 2.52 1.052 1.052 0 01-.976-.647A1.04 1.04 0 010 28.332v-23.1a1.048 1.048 0 011.054-1.05A159.263 159.263 0 0025.649 1.63 91.712 91.712 0 0140.047 0h.06c.83.01 1.622.347 2.203.937zM30.19 18.114a2.33 2.33 0 01-1.648.683 2.324 2.324 0 01-2.224-1.674l-6.321-1.265v6.05a2.333 2.333 0 01-2.33 2.332 2.33 2.33 0 01-2.331-2.332v-6.299a3.884 3.884 0 01-3.092-4.2 3.889 3.889 0 013.869-3.498h3.03l7.175-1.436a2.325 2.325 0 012.563-1.652 2.323 2.323 0 011.992 2.31v9.332c0 .618-.246 1.212-.683 1.649zm-1.099-11.53a.777.777 0 00-1.326.55v9.33a.778.778 0 001.554 0v-9.33a.778.778 0 00-.228-.55zM16.89 19.574h1.554v-3.887h-1.554v3.888zm-2.425-9.424a2.334 2.334 0 001.649 3.982h2.33V9.466h-2.33a2.33 2.33 0 00-1.649.684zm2.653 12.307a.777.777 0 001.326-.55v-.777h-1.554v.777c0 .207.082.404.228.55zm9.095-14.375l-6.215 1.244v4.945l6.215 1.244V8.082z",
    fill: "#fff"
  })));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTkiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCA1OSA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQ5LjUzNjMgMzIuNzQ3M0M0OS40OTg1IDMyLjU1MjQgNDkuNTE3IDMyLjM1MDggNDkuNTg5NSAzMi4xNjU4QzQ5LjY2MjEgMzEuOTgwOSA0OS43ODU4IDMxLjgyMDMgNDkuOTQ2MyAzMS43MDI2QzUyLjQ2MTQgMzAuMDczMSA1NS40MDI1IDI5LjIxNzggNTguNDAyNCAyOS4yNDM1QzU2LjE4ODMgMjcuMzcyNCA1Mi4xMTIgMjUuMDI1NyA0NS4zMjA5IDI0LjI1MzlWMzAuNDQ4OUM0NS4zMDU1IDMxLjgzNjUgNDQuNzQ1NSAzMy4xNjMgNDMuNzYwNiAzNC4xNDQzQzQyLjc3NTcgMzUuMTI1NiA0MS40NDQzIDM1LjY4MzYgNDAuMDUxNiAzNS42OTg5SDIzLjM3MTFDMjIuNTYzNiAzNS42ODEzIDIxLjc3NzkgMzUuOTYwNyAyMS4xNjQxIDM2LjQ4MzZDMjAuNTUwMiAzNy4wMDY1IDIwLjE1MTEgMzcuNzM2NCAyMC4wNDMgMzguNTMzOUMyMC4wMDUzIDM4Ljk3MDcgMjAuMDU4NCAzOS40MTA1IDIwLjE5ODggMzkuODI2QzIwLjMzOTMgNDAuMjQxNSAyMC41NjQyIDQwLjYyMzcgMjAuODU5NCA0MC45NDg4QzIxLjE1NDYgNDEuMjczOSAyMS41MTM5IDQxLjUzNDkgMjEuOTE0OSA0MS43MTU2QzIyLjMxNTggNDEuODk2MyAyMi43NDk4IDQxLjk5MjcgMjMuMTg5OCA0MS45OTg4QzI3LjY2IDQxLjgyNjkgMzIuMTA4NCA0MS4yOTAzIDM2LjQ5MDYgNDAuMzk0NUM0My45MTY2IDM4Ljk2MjUgNTEuNDQ1MyAzOC4xMjE5IDU5LjAwNTMgMzcuODgwOEM1Ni4xNDMgMzUuMDkwOSA1MC4zNjM2IDMzLjU3NTggNTAuMzA4OCAzMy41NjYzQzUwLjExNTQgMzMuNTE2OCA0OS45NDAxIDMzLjQxMzUgNDkuODAzMyAzMy4yNjg1QzQ5LjY2NjYgMzMuMTIzNSA0OS41NzQgMzIuOTQyNyA0OS41MzYzIDMyLjc0NzNaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIwLjAyMzQgMjkuODE4OUMyMS45NzQgMjkuNTI3IDIzLjg0NDYgMjkuMjIzNSAyNS42NDY3IDI4LjkyOTVDMzAuMzY0OSAyOC4wMTYzIDM1LjE0NzUgMjcuNDcxNSAzOS45NTA4IDI3LjI5OTlDNDAuNzk2NiAyNy4zMDUzIDQxLjYwNzcgMjcuNjM2IDQyLjIxNDYgMjguMjIyOUM0Mi44MjE2IDI4LjgwOTkgNDMuMTc3NiAyOS42MDc3IDQzLjIwODMgMzAuNDQ5OUM0My4yMDE0IDMxLjI4MzIgNDIuODY2MSAzMi4wODA0IDQyLjI3NDYgMzIuNjY5N0M0MS42ODMyIDMzLjI1OSA0MC44ODMxIDMzLjU5MyA0MC4wNDY3IDMzLjU5OTlIMjMuMzY2MkMyMi4xNTY5IDMzLjYwNTYgMjAuOTgyOCAzNC4wMDU3IDIwLjAyMzQgMzQuNzM5MVYyOS44MTg5Wk00Mi4zMSAwLjkzNzIzOUM0Mi44OTEyIDEuNTI3NTMgNDMuMjE0MiAyLjMyMzExIDQzLjIwODMgMy4xNDk5OVYyNi4yNjM2QzQyLjI2NjMgMjUuNTcwOCA0MS4xMjU4IDI1LjE5NzkgMzkuOTU1IDI1LjE5OTlIMzkuOTQxM0MzNS4wMjY4IDI1LjM3MDcgMzAuMTMzNCAyNS45MjY0IDI1LjMwNjQgMjYuODYyMUMxNy4zIDI4LjMyNzMgOS4xOTEzOSAyOS4xNjk4IDEuMDUzODkgMjkuMzgyMUMwLjkxNTIxNyAyOS4zODMgMC43Nzc3MzYgMjkuMzU2NSAwLjY0OTQzMyAyOS4zMDQxQzAuNTIxMTMgMjkuMjUxNyAwLjQwNDU2NCAyOS4xNzQ0IDAuMzA2NTA4IDI5LjA3NjdDMC4yMDg0NTIgMjguOTc5IDAuMTMwODYyIDI4Ljg2MjkgMC4wNzgyNDgzIDI4LjczNUMwLjAyNTYzNDQgMjguNjA3MiAtMC4wMDA5NTQ4MjggMjguNDcwMiAyLjYxODllLTA1IDI4LjMzMjFWNS4yMzIxM0MyLjYxODllLTA1IDQuOTUzNjYgMC4xMTEwNTcgNC42ODY1OSAwLjMwODY5NCA0LjQ4OTY3QzAuNTA2MzMxIDQuMjkyNzYgMC43NzQzODUgNC4xODIxNCAxLjA1Mzg5IDQuMTgyMTRDOS4zMDYzNiAzLjk2OTkzIDE3LjUyOTYgMy4xMTY1IDI1LjY0ODkgMS42Mjk1OUMzMC4zOTczIDAuNzA3NTcxIDM1LjIxMTcgMC4xNjI2NjEgNDAuMDQ2NyAwSDQwLjEwNjhDNDAuOTM2NiAwLjAwOTk3MTg1IDQxLjcyODggMC4zNDY5NDggNDIuMzEgMC45MzcyMzlaTTMwLjE5IDE4LjExNEMyOS43NTMgMTguNTUxNCAyOS4xNjAyIDE4Ljc5NzIgMjguNTQyMSAxOC43OTcyQzI4LjA0MDYgMTguNzk1NSAyNy41NTMxIDE4LjYzMTUgMjcuMTUyMyAxOC4zMjk4QzI2Ljc1MTUgMTguMDI4MSAyNi40NTg4IDE3LjYwNDkgMjYuMzE4IDE3LjEyMzFMMTkuOTk2NyAxNS44NThWMjEuOTA3NUMxOS45OTY3IDIyLjUyNjEgMTkuNzUxMiAyMy4xMTk1IDE5LjMxNDEgMjMuNTU2OUMxOC44NzcxIDIzLjk5NDQgMTguMjg0MyAyNC4yNDAyIDE3LjY2NjIgMjQuMjQwMkMxNy4wNDgxIDI0LjI0MDIgMTYuNDU1MyAyMy45OTQ0IDE2LjAxODIgMjMuNTU2OUMxNS41ODEyIDIzLjExOTUgMTUuMzM1NiAyMi41MjYxIDE1LjMzNTYgMjEuOTA3NVYxNS42MDkyQzE0LjM5MTYgMTUuNDE3MyAxMy41NTI1IDE0Ljg4MTIgMTIuOTgxMiAxNC4xMDVDMTIuNDA5OSAxMy4zMjg3IDEyLjE0NzIgMTIuMzY3NiAxMi4yNDQgMTEuNDA4NEMxMi4zNDA4IDEwLjQ0OTEgMTIuNzkwMiA5LjU2MDA4IDEzLjUwNTEgOC45MTM4NUMxNC4yMTk5IDguMjY3NjIgMTUuMTQ5MiA3LjkxMDMxIDE2LjExMjUgNy45MTEyN0gxOS4xNDIyTDI2LjMxOCA2LjQ3NTExQzI2LjQ3NDQgNS45MzY2NCAyNi44MiA1LjQ3Mjg4IDI3LjI5MSA1LjE2OTI0QzI3Ljc2MiA0Ljg2NTYxIDI4LjMyNjggNC43NDI1NSAyOC44ODEzIDQuODIyNzNDMjkuNDM1OCA0LjkwMjkxIDI5Ljk0MjcgNS4xODA5MyAzMC4zMDg2IDUuNjA1NTlDMzAuNjc0NiA2LjAzMDI0IDMwLjg3NDkgNi41NzI5MyAzMC44NzI2IDcuMTMzNzFWMTYuNDY0NUMzMC44NzI2IDE3LjA4MzIgMzAuNjI3MSAxNy42NzY1IDMwLjE5IDE4LjExNFpNMjkuMDkxNCA2LjU4Mzg5QzI4Ljk0NTcgNi40MzgwNiAyOC43NDgxIDYuMzU2MTQgMjguNTQyMSA2LjM1NjE0QzI4LjMzNjEgNi4zNTYxNCAyOC4xMzg1IDYuNDM4MDYgMjcuOTkyOCA2LjU4Mzg5QzI3Ljg0NzEgNi43Mjk3MSAyNy43NjUyIDYuOTI3NDggMjcuNzY1MiA3LjEzMzcxVjE2LjQ2NDVDMjcuNzY1MiAxNi42NzA3IDI3Ljg0NzEgMTYuODY4NSAyNy45OTI4IDE3LjAxNDNDMjguMTM4NSAxNy4xNjAyIDI4LjMzNjEgMTcuMjQyMSAyOC41NDIxIDE3LjI0MjFDMjguNzQ4MSAxNy4yNDIxIDI4Ljk0NTcgMTcuMTYwMiAyOS4wOTE0IDE3LjAxNDNDMjkuMjM3MSAxNi44Njg1IDI5LjMxODkgMTYuNjcwNyAyOS4zMTg5IDE2LjQ2NDVWNy4xMzM3MUMyOS4zMTg5IDYuOTI3NDggMjkuMjM3MSA2LjcyOTcxIDI5LjA5MTQgNi41ODM4OVpNMTYuODg5MyAxOS41NzQ4SDE4LjQ0M1YxNS42ODY5SDE2Ljg4OTNWMTkuNTc0OFpNMTQuNDY0NSAxMC4xNDk2QzE0LjAyNzQgMTAuNTg3MSAxMy43ODE5IDExLjE4MDQgMTMuNzgxOSAxMS43OTkxQzEzLjc4MTkgMTIuNDE3OCAxNC4wMjc0IDEzLjAxMTEgMTQuNDY0NSAxMy40NDg2QzE0LjkwMTYgMTMuODg2IDE1LjQ5NDQgMTQuMTMxOCAxNi4xMTI1IDE0LjEzMThIMTguNDQzVjkuNDY2NDFIMTYuMTEyNUMxNS40OTQ0IDkuNDY2NDEgMTQuOTAxNiA5LjcxMjE3IDE0LjQ2NDUgMTAuMTQ5NlpNMTcuMTE2OCAyMi40NTczQzE3LjI2MjUgMjIuNjAzMSAxNy40NjAxIDIyLjY4NSAxNy42NjYyIDIyLjY4NUMxNy44NzIyIDIyLjY4NSAxOC4wNjk4IDIyLjYwMzEgMTguMjE1NSAyMi40NTczQzE4LjM2MTIgMjIuMzExNSAxOC40NDMgMjIuMTEzNyAxOC40NDMgMjEuOTA3NVYyMS4xMjk5SDE2Ljg4OTNWMjEuOTA3NUMxNi44ODkzIDIyLjExMzcgMTYuOTcxMiAyMi4zMTE1IDE3LjExNjggMjIuNDU3M1pNMjYuMjExNSA4LjA4MTU2TDE5Ljk5NjcgOS4zMjU2N1YxNC4yNzFMMjYuMjExNSAxNS41MTUxVjguMDgxNTZaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K");


/***/ }),

/***/ "./src/assets/images/join-the-community.svg":
/*!**************************************************!*\
  !*** ./src/assets/images/join-the-community.svg ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReactComponent: () => (/* binding */ SvgJoinTheCommunity),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _circle, _path;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

function SvgJoinTheCommunity(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", _extends({
    width: 36,
    height: 36,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _circle || (_circle = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
    cx: 18,
    cy: 18,
    r: 18,
    fill: "#0167FF",
    fillOpacity: 0.2
  })), _path || (_path = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M23.066 21.052v1.066c0 .018 0 .037-.003.056a.96.96 0 01-.96.904h-8.217a.959.959 0 01-.96-.904c-.004-.019-.004-.038-.004-.056v-1.066c-.006-1.13.789-2.091 1.857-2.366l.844-.281c1.235 1.192 3.511 1.192 4.747 0l.848.281c1.06.285 1.858 1.238 1.848 2.366zm4.043-2.52l-.567-.187c-.825.894-2.336 1.205-3.465.668.48.571.741 1.294.74 2.04v1.064c0 .02 0 .038-.005.057h3.84a.85.85 0 00.848-.848v-.858a2.04 2.04 0 00-1.391-1.936zm-.428-2.355a2.353 2.353 0 00-2.351-2.35 2.355 2.355 0 00-2.351 2.35 2.355 2.355 0 002.351 2.352 2.353 2.353 0 002.351-2.352zm-11.509-.434a2.825 2.825 0 002.824 2.82 2.824 2.824 0 002.82-2.82 2.824 2.824 0 00-2.82-2.82 2.825 2.825 0 00-2.823 2.82zm-5.853.434a2.353 2.353 0 002.351 2.352 2.352 2.352 0 000-4.703 2.353 2.353 0 00-2.351 2.351zm2.853 5.94v-1.065c0-.757.263-1.47.736-2.032-.39.17-.812.259-1.238.259-.866 0-1.65-.357-2.209-.934l-.57.191A2.032 2.032 0 007.5 20.467v.86a.851.851 0 00.848.847h3.828c-.004-.019-.004-.038-.004-.056zm14.653.862a.376.376 0 00-.516.123A9.695 9.695 0 0118 27.75a9.693 9.693 0 01-8.31-4.648.375.375 0 10-.638.393A10.439 10.439 0 0018 28.5c3.675 0 7.02-1.871 8.948-5.005a.375.375 0 00-.123-.516zM7.875 18.15a.38.38 0 00.383-.367C8.367 12.526 12.74 8.25 18 8.25c5.26 0 9.631 4.277 9.742 9.532a.375.375 0 00.375.368h.008a.375.375 0 00.367-.383C28.372 12.106 23.666 7.5 18 7.5c-5.665 0-10.372 4.606-10.492 10.267a.375.375 0 00.367.383zm3.622 4.918a.375.375 0 00-.591.462A8.95 8.95 0 0018 27a8.951 8.951 0 007.094-3.47.375.375 0 00-.59-.462A8.205 8.205 0 0118 26.25a8.205 8.205 0 01-6.503-3.182zm13.035-10.1a.376.376 0 10.593-.458A8.944 8.944 0 0018 9a8.947 8.947 0 00-7.125 3.51.375.375 0 00.593.458A8.201 8.201 0 0118 9.75a8.202 8.202 0 016.532 3.218z",
    fill: "#0167FF"
  })));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTgiIGN5PSIxOCIgcj0iMTgiIGZpbGw9IiMwMTY3RkYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+CjxwYXRoIGQ9Ik0yMy4wNjYzIDIxLjA1MjVWMjIuMTE3NUMyMy4wNjYzIDIyLjEzNjIgMjMuMDY2MyAyMi4xNTUgMjMuMDYyNSAyMi4xNzM3QzIzLjA0ODQgMjIuNDE4NiAyMi45NDEgMjIuNjQ4NyAyMi43NjI1IDIyLjgxNjhDMjIuNTgzOSAyMi45ODQ5IDIyLjM0NzcgMjMuMDc4MiAyMi4xMDI1IDIzLjA3NzVIMTMuODg2M0MxMy4zNzI1IDIzLjA3NzUgMTIuOTUyNSAyMi42NzYzIDEyLjkyNjMgMjIuMTczN0MxMi45MjI1IDIyLjE1NSAxMi45MjI1IDIyLjEzNjIgMTIuOTIyNSAyMi4xMTc1VjIxLjA1MjVDMTIuOTE2MSAxOS45MjI2IDEzLjcxMDggMTguOTYwOCAxNC43Nzg4IDE4LjY4NjNMMTUuNjIyNSAxOC40MDVDMTYuODU4MSAxOS41OTc1IDE5LjEzNDQgMTkuNTk3NSAyMC4zNyAxOC40MDVMMjEuMjE3NSAxOC42ODYzQzIyLjI3ODggMTguOTcxMyAyMy4wNzU2IDE5LjkyMzcgMjMuMDY2MyAyMS4wNTI1Wk0yNy4xMDg4IDE4LjUzMjVMMjYuNTQyNSAxOC4zNDVDMjUuNzE3NSAxOS4yMzk0IDI0LjIwNjMgMTkuNTQ5OSAyMy4wNzc1IDE5LjAxMjVDMjMuNTU2NyAxOS41ODQgMjMuODE4NCAyMC4zMDY2IDIzLjgxNjIgMjEuMDUyNVYyMi4xMTc1QzIzLjgxNjIgMjIuMTM2MiAyMy44MTYzIDIyLjE1NSAyMy44MTI1IDIyLjE3MzdIMjcuNjUyNUMyNy44NzcgMjIuMTcyOCAyOC4wOTIgMjIuMDgzMiAyOC4yNTA3IDIxLjkyNDRDMjguNDA5NCAyMS43NjU3IDI4LjQ5OSAyMS41NTA3IDI4LjUgMjEuMzI2M1YyMC40Njc1QzI4LjUgMTkuNTkgMjcuOTQxMyAxOC44MTM3IDI3LjEwODggMTguNTMyNVpNMjYuNjgxMyAxNi4xNzc1QzI2LjY4MTMgMTQuODggMjUuNjI3NSAxMy44MjYzIDI0LjMzIDEzLjgyNjNDMjMuMDM2MyAxMy44MjYzIDIxLjk3ODggMTQuODggMjEuOTc4OCAxNi4xNzc1QzIxLjk3ODggMTcuNDc1IDIzLjAzNjMgMTguNTI4NyAyNC4zMyAxOC41Mjg3QzI1LjYyNzUgMTguNTI4NyAyNi42ODEzIDE3LjQ3NSAyNi42ODEzIDE2LjE3NzVaTTE1LjE3MjUgMTUuNzQyNUMxNS4xNzI1IDE3LjI5ODcgMTYuNDQgMTguNTYyNSAxNy45OTYzIDE4LjU2MjVDMTkuNTQ4OCAxOC41NjI1IDIwLjgxNjMgMTcuMjk4NyAyMC44MTYzIDE1Ljc0MjVDMjAuODE2MyAxNC4xODYyIDE5LjU0ODggMTIuOTIyNSAxNy45OTYzIDEyLjkyMjVDMTYuNDQgMTIuOTIyNSAxNS4xNzI1IDE0LjE4NjIgMTUuMTcyNSAxNS43NDI1Wk05LjMxODc1IDE2LjE3NzVDOS4zMTg3NSAxNy40NzUgMTAuMzcyNSAxOC41Mjg3IDExLjY3IDE4LjUyODdDMTIuOTYzOCAxOC41Mjg3IDE0LjAxNzUgMTcuNDc1IDE0LjAxNzUgMTYuMTc3NUMxNC4wMTc1IDE0Ljg4IDEyLjk2MzggMTMuODI2MyAxMS42NyAxMy44MjYzQzEwLjM3MjUgMTMuODI2MyA5LjMxODc1IDE0Ljg4IDkuMzE4NzUgMTYuMTc3NVpNMTIuMTcyNSAyMi4xMTc1VjIxLjA1MjVDMTIuMTcyNSAyMC4yOTUgMTIuNDM1IDE5LjU4MjUgMTIuOTA3NSAxOS4wMkMxMi41MTcyIDE5LjE5MDQgMTIuMDk1OSAxOS4yNzg1IDExLjY3IDE5LjI3ODdDMTAuODAzOCAxOS4yNzg3IDEwLjAyIDE4LjkyMjUgOS40NjEyNSAxOC4zNDVMOC44OTEyNSAxOC41MzYzQzguNDg1NzggMTguNjcxMSA4LjEzMzEyIDE4LjkzMDIgNy44ODMzNiAxOS4yNzY5QzcuNjMzNiAxOS42MjM2IDcuNDk5NDYgMjAuMDQwMiA3LjUgMjAuNDY3NVYyMS4zMjYzQzcuNTAwOTkgMjEuNTUwNyA3LjU5MDU5IDIxLjc2NTcgNy43NDkzMiAyMS45MjQ0QzcuOTA4MDQgMjIuMDgzMiA4LjEyMzAzIDIyLjE3MjggOC4zNDc1IDIyLjE3MzdIMTIuMTc2M0MxMi4xNzI1IDIyLjE1NSAxMi4xNzI1IDIyLjEzNjIgMTIuMTcyNSAyMi4xMTc1Wk0yNi44MjUzIDIyLjk3OTJDMjYuNzgzMyAyMi45NTMzIDI2LjczNjcgMjIuOTM2IDI2LjY4OCAyMi45MjgxQzI2LjYzOTQgMjIuOTIwMyAyNi41ODk2IDIyLjkyMjEgMjYuNTQxNyAyMi45MzM1QzI2LjQ5MzcgMjIuOTQ1IDI2LjQ0ODUgMjIuOTY1OCAyNi40MDg2IDIyLjk5NDdDMjYuMzY4OCAyMy4wMjM3IDI2LjMzNSAyMy4wNjAyIDI2LjMwOTMgMjMuMTAyMkMyNC41MTg2IDI2LjAxMjIgMjEuNDEyNSAyNy43NSAxOCAyNy43NUMxNC41ODc1IDI3Ljc1IDExLjQ4MTQgMjYuMDEyNiA5LjY5MDc1IDIzLjEwMjJDOS42NjU0NSAyMy4wNTkzIDkuNjMxODMgMjMuMDIxOCA5LjU5MTg3IDIyLjk5MkM5LjU1MTkxIDIyLjk2MjIgOS41MDY0MSAyMi45NDA3IDkuNDU4MDIgMjIuOTI4NkM5LjQwOTY0IDIyLjkxNjYgOS4zNTkzNCAyMi45MTQ0IDkuMzEwMDggMjIuOTIyQzkuMjYwODEgMjIuOTI5NyA5LjIxMzU3IDIyLjk0NzEgOS4xNzExMSAyMi45NzMyQzkuMTI4NjUgMjIuOTk5MyA5LjA5MTgzIDIzLjAzMzcgOS4wNjI4IDIzLjA3NDJDOS4wMzM3NyAyMy4xMTQ3IDkuMDEzMTEgMjMuMTYwNiA5LjAwMjAzIDIzLjIwOTNDOC45OTA5NSAyMy4yNTc5IDguOTg5NjcgMjMuMzA4MiA4Ljk5ODI3IDIzLjM1NzNDOS4wMDY4OCAyMy40MDY0IDkuMDI1MTggMjMuNDUzMyA5LjA1MjEzIDIzLjQ5NTJDMTAuOTggMjYuNjI4NyAxNC4zMjUgMjguNSAxOCAyOC41QzIxLjY3NSAyOC41IDI1LjAyIDI2LjYyODcgMjYuOTQ3OSAyMy40OTUyQzI2Ljk3MzcgMjMuNDUzMyAyNi45OTEgMjMuNDA2NyAyNi45OTg4IDIzLjM1ODFDMjcuMDA2NyAyMy4zMDk1IDI3LjAwNDggMjMuMjU5OCAyNi45OTM0IDIzLjIxMTlDMjYuOTgyMSAyMy4xNjM5IDI2Ljk2MTMgMjMuMTE4NyAyNi45MzI1IDIzLjA3ODhDMjYuOTAzNiAyMy4wMzg5IDI2Ljg2NzIgMjMuMDA1MSAyNi44MjUzIDIyLjk3OTJaTTcuODc0NjMgMTguMTVDNy45NzM3MyAxOC4xNTA2IDguMDY5MTggMTguMTEyNiA4LjE0MDY4IDE4LjA0NEM4LjIxMjE3IDE3Ljk3NTQgOC4yNTQwOSAxNy44ODE1IDguMjU3NSAxNy43ODI1QzguMzY4ODggMTIuNTI2OSAxMi43Mzk1IDguMjUgMTggOC4yNUMyMy4yNjA1IDguMjUgMjcuNjMxMSAxMi41MjY1IDI3Ljc0MjUgMTcuNzgyNUMyNy43NDQ1IDE3Ljg4MDcgMjcuNzg0OCAxNy45NzQxIDI3Ljg1NSAxOC4wNDI4QzI3LjkyNTEgMTguMTExNSAyOC4wMTkzIDE4LjE1IDI4LjExNzUgMTguMTVIMjguMTI1QzI4LjE3NDIgMTguMTQ5IDI4LjIyMjggMTguMTM4MyAyOC4yNjc5IDE4LjExODVDMjguMzEzIDE4LjA5ODcgMjguMzUzOCAxOC4wNzAyIDI4LjM4NzkgMTguMDM0NkMyOC40MjIgMTcuOTk5MSAyOC40NDg3IDE3Ljk1NzEgMjguNDY2NiAxNy45MTEyQzI4LjQ4NDUgMTcuODY1MyAyOC40OTMyIDE3LjgxNjQgMjguNDkyMSAxNy43NjcxQzI4LjM3MjUgMTIuMTA1OCAyMy42NjU1IDcuNSAxOCA3LjVDMTIuMzM0NSA3LjUgNy42Mjc1IDEyLjEwNTggNy41MDc1IDE3Ljc2NzFDNy41MDU0OSAxNy44NjY1IDcuNTQzMDMgMTcuOTYyNyA3LjYxMTg4IDE4LjAzNDRDNy42ODA3MiAxOC4xMDYxIDcuNzc1MjMgMTguMTQ3NiA3Ljg3NDYzIDE4LjE0OTZWMTguMTVaTTExLjQ5NzEgMjMuMDY3N0MxMS40MzU5IDIyLjk4OTMgMTEuMzQ2IDIyLjkzODUgMTEuMjQ3MiAyMi45MjYzQzExLjE0ODQgMjIuOTE0MiAxMS4wNDg5IDIyLjk0MTggMTAuOTcwNCAyMy4wMDMxQzEwLjg5MiAyMy4wNjQzIDEwLjg0MTEgMjMuMTU0MiAxMC44MjkgMjMuMjUzQzEwLjgxNjkgMjMuMzUxOCAxMC44NDQ1IDIzLjQ1MTMgMTAuOTA1OCAyMy41Mjk3QzEyLjYyODUgMjUuNzM1MSAxNS4yMTQxIDI3IDE4IDI3QzIwLjc4NTkgMjcgMjMuMzcxNSAyNS43MzUxIDI1LjA5NDMgMjMuNTI5N0MyNS4xNTU1IDIzLjQ1MTQgMjUuMTgzMSAyMy4zNTE5IDI1LjE3MSAyMy4yNTMxQzI1LjE1ODkgMjMuMTU0NCAyNS4xMDgxIDIzLjA2NDUgMjUuMDI5OCAyMy4wMDMzQzI0Ljk1MTQgMjIuOTQyIDI0Ljg1MTkgMjIuOTE0NCAyNC43NTMxIDIyLjkyNjVDMjQuNjU0NCAyMi45Mzg2IDI0LjU2NDUgMjIuOTg5NCAyNC41MDMzIDIzLjA2NzdDMjIuOTIzOCAyNS4wOTAxIDIwLjU1MzQgMjYuMjUgMTggMjYuMjVDMTUuNDQ2NiAyNi4yNSAxMy4wNzYzIDI1LjA5MDEgMTEuNDk2OCAyMy4wNjc3SDExLjQ5NzFaTTI0LjUzMjEgMTIuOTY4M0MyNC41NjE1IDEzLjAwOTEgMjQuNTk4OSAxMy4wNDM2IDI0LjY0MTkgMTMuMDY5N0MyNC42ODQ5IDEzLjA5NTggMjQuNzMyOCAxMy4xMTMgMjQuNzgyNiAxMy4xMjAyQzI0LjgzMjQgMTMuMTI3NSAyNC44ODMxIDEzLjEyNDYgMjQuOTMxOCAxMy4xMTE4QzI0Ljk4MDUgMTMuMDk5IDI1LjAyNjEgMTMuMDc2NSAyNS4wNjU5IDEzLjA0NTdDMjUuMTA1NyAxMy4wMTQ5IDI1LjEzODkgMTIuOTc2NCAyNS4xNjM1IDEyLjkzMjVDMjUuMTg4MSAxMi44ODg2IDI1LjIwMzcgMTIuODQwMiAyNS4yMDkyIDEyLjc5MDJDMjUuMjE0NyAxMi43NDAyIDI1LjIxMDEgMTIuNjg5NiAyNS4xOTU2IDEyLjY0MTRDMjUuMTgxMiAxMi41OTMyIDI1LjE1NzEgMTIuNTQ4NCAyNS4xMjUgMTIuNTA5NkMyMy40MDI2IDEwLjI3ODcgMjAuODA1NCA5IDE4IDlDMTUuMTk0NiA5IDEyLjU5NzQgMTAuMjc5MSAxMC44NzQ2IDEyLjUwOTZDMTAuODEzOCAxMi41ODgzIDEwLjc4NjggMTIuNjg4IDEwLjc5OTQgMTIuNzg2N0MxMC44MTIxIDEyLjg4NTMgMTAuODYzNCAxMi45NzQ5IDEwLjk0MjEgMTMuMDM1N0MxMS4wMjA4IDEzLjA5NjYgMTEuMTIwNSAxMy4xMjM2IDExLjIxOTIgMTMuMTExQzExLjMxNzggMTMuMDk4MyAxMS40MDc0IDEzLjA0NyAxMS40NjgzIDEyLjk2ODNDMTMuMDQ3OCAxMC45MjMgMTUuNDI4NiA5Ljc1IDE4IDkuNzVDMjAuNTcxNCA5Ljc1IDIyLjk1MjYgMTAuOTIzIDI0LjUzMjEgMTIuOTY4M1oiIGZpbGw9IiMwMTY3RkYiLz4KPC9zdmc+Cg==");


/***/ }),

/***/ "./src/assets/images/logo.svg":
/*!************************************!*\
  !*** ./src/assets/images/logo.svg ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReactComponent: () => (/* binding */ SvgLogo),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _path, _mask, _path2, _path3;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

function SvgLogo(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", _extends({
    width: 176,
    height: 36,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M80 0H0v36h80V0zM13.922 20l-3.367.21c.099 1.157.523 2.11 1.273 2.86.75.75 2.1 1.125 4.047 1.125 1.11 0 2.029-.159 2.758-.476.729-.323 1.297-.795 1.703-1.414a3.63 3.63 0 00.61-2.032c0-.625-.154-1.19-.462-1.695-.302-.505-.789-.927-1.46-1.265-.667-.344-1.774-.683-3.32-1.016-.626-.13-1.022-.271-1.188-.422-.172-.146-.258-.31-.258-.492 0-.25.104-.461.312-.633.209-.177.518-.266.93-.266.5 0 .89.118 1.172.352.286.234.474.61.562 1.125l3.336-.195c-.146-1.188-.604-2.053-1.375-2.594-.765-.547-1.88-.82-3.343-.82-1.193 0-2.133.15-2.82.453-.683.297-1.196.708-1.54 1.234a3 3 0 00-.508 1.664c0 .896.334 1.633 1 2.211.662.578 1.769 1.042 3.32 1.39.949.209 1.553.43 1.813.665.26.234.39.5.39.797 0 .312-.137.588-.413.828-.271.234-.66.351-1.164.351-.677 0-1.198-.232-1.563-.695-.224-.287-.372-.703-.445-1.25zm18.765-7.453H21.93v2.828h3.61V24h3.538v-8.625h3.61v-2.828zm2.18 1.367c-1.041 1.042-1.562 2.498-1.562 4.367 0 1.339.263 2.453.789 3.344.526.89 1.21 1.542 2.054 1.953.85.412 1.92.617 3.211.617 1.271 0 2.331-.237 3.18-.71a4.818 4.818 0 001.953-2c.453-.86.68-1.959.68-3.297 0-1.844-.516-3.276-1.547-4.297-1.031-1.026-2.5-1.54-4.406-1.54-1.86 0-3.31.521-4.352 1.563zm2.617 6.875c-.427-.505-.64-1.336-.64-2.492 0-1.167.216-2.003.648-2.508.433-.505 1.005-.758 1.719-.758.745 0 1.333.25 1.766.75.437.495.656 1.281.656 2.36 0 1.28-.209 2.169-.625 2.664-.417.494-1.005.742-1.766.742-.74 0-1.325-.253-1.758-.758zm9.641-8.242V24h3.555v-4.648h.312c.323 0 .612.088.867.265.188.136.401.43.641.883l1.89 3.5h4l-1.71-3.32c-.084-.167-.25-.404-.5-.711-.245-.308-.433-.508-.563-.602-.192-.14-.5-.281-.922-.422.526-.12.94-.27 1.242-.453a3.187 3.187 0 001.118-1.117c.27-.463.406-1.013.406-1.648 0-.73-.177-1.347-.531-1.852-.355-.51-.82-.86-1.399-1.047-.578-.187-1.414-.281-2.508-.281h-5.898zm5.047 4.64H50.68V14.86h1.554c.646 0 1.086.1 1.32.297.235.198.352.482.352.852 0 .25-.075.471-.226.664a.92.92 0 01-.57.36c-.464.103-.777.155-.938.155zm16.836-4.64h-9.485V24h9.657v-2.594h-6.11v-2.258h5.508v-2.335H63.07v-1.82h5.938v-2.446z",
    fill: "#fff"
  })), _mask || (_mask = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("mask", {
    id: "logo_svg__a",
    fill: "#fff"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M80 0h96v36H80V0z"
  }))), _path2 || (_path2 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M176 0h2v-2h-2v2zm0 36v2h2v-2h-2zM80 2h96v-4H80v4zm94-2v36h4V0h-4zm2 34H80v4h96v-4z",
    fill: "#fff",
    mask: "url(#logo_svg__a)"
  })), _path3 || (_path3 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M91.18 12.547h6.625c1.104 0 1.95.273 2.539.82a2.65 2.65 0 01.89 2.031c0 .678-.211 1.258-.632 1.743-.282.323-.693.578-1.235.765.823.198 1.427.54 1.813 1.024.39.479.586 1.083.586 1.812 0 .594-.138 1.128-.414 1.602a3.052 3.052 0 01-1.133 1.125c-.297.172-.745.297-1.344.375-.797.104-1.326.156-1.586.156h-6.11V12.547zm3.57 4.492h1.54c.551 0 .934-.094 1.147-.281.22-.193.329-.469.329-.828 0-.334-.11-.594-.329-.782-.213-.187-.588-.28-1.124-.28H94.75v2.171zm0 4.5h1.805c.61 0 1.039-.107 1.289-.32.25-.219.375-.51.375-.875a.994.994 0 00-.375-.813c-.245-.208-.677-.312-1.297-.312H94.75v2.32zm15.641.57h-4.032L105.805 24h-3.617l4.304-11.453h3.86L114.656 24h-3.703l-.562-1.89zm-.743-2.476l-1.265-4.117-1.258 4.117h2.523zm6.172-7.086h3.305l4.313 6.336v-6.336h3.335V24h-3.335l-4.29-6.29V24h-3.328V12.547zm13.328 0h3.305l4.313 6.336v-6.336h3.336V24h-3.336l-4.289-6.29V24h-3.329V12.547zm13.297 0h9.485v2.445h-5.938v1.82h5.508v2.336h-5.508v2.258h6.11V24h-9.657V12.547zM154.062 24V12.547h5.899c1.094 0 1.93.094 2.508.281a2.663 2.663 0 011.398 1.047c.354.505.531 1.122.531 1.852 0 .635-.135 1.184-.406 1.648-.271.458-.643.83-1.117 1.117-.302.182-.716.334-1.242.453.422.14.729.282.922.422.13.094.317.294.562.602.25.307.417.544.5.71L165.328 24h-4l-1.89-3.5c-.24-.453-.454-.747-.641-.883a1.484 1.484 0 00-.867-.265h-.313V24h-3.555zm3.555-6.813h1.492c.162 0 .474-.052.938-.156a.92.92 0 00.57-.36c.151-.192.227-.413.227-.663 0-.37-.117-.654-.352-.852-.234-.198-.674-.297-1.32-.297h-1.555v2.329z",
    fill: "#fff"
  })));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc2IiBoZWlnaHQ9IjM2IiB2aWV3Qm94PSIwIDAgMTc2IDM2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTgwIDBIMFYzNkg4MFYwWk0xMy45MjE5IDIwTDEwLjU1NDcgMjAuMjEwOUMxMC42NTM2IDIxLjM2NzIgMTEuMDc4MSAyMi4zMjAzIDExLjgyODEgMjMuMDcwM0MxMi41NzgxIDIzLjgyMDMgMTMuOTI3MSAyNC4xOTUzIDE1Ljg3NSAyNC4xOTUzQzE2Ljk4NDQgMjQuMTk1MyAxNy45MDM2IDI0LjAzNjUgMTguNjMyOCAyMy43MTg4QzE5LjM2MiAyMy4zOTU4IDE5LjkyOTcgMjIuOTI0NSAyMC4zMzU5IDIyLjMwNDdDMjAuNzQyMiAyMS42ODQ5IDIwLjk0NTMgMjEuMDA3OCAyMC45NDUzIDIwLjI3MzRDMjAuOTQ1MyAxOS42NDg0IDIwLjc5MTcgMTkuMDgzMyAyMC40ODQ0IDE4LjU3ODFDMjAuMTgyMyAxOC4wNzI5IDE5LjY5NTMgMTcuNjUxIDE5LjAyMzQgMTcuMzEyNUMxOC4zNTY4IDE2Ljk2ODggMTcuMjUgMTYuNjMwMiAxNS43MDMxIDE2LjI5NjlDMTUuMDc4MSAxNi4xNjY3IDE0LjY4MjMgMTYuMDI2IDE0LjUxNTYgMTUuODc1QzE0LjM0MzggMTUuNzI5MiAxNC4yNTc4IDE1LjU2NTEgMTQuMjU3OCAxNS4zODI4QzE0LjI1NzggMTUuMTMyOCAxNC4zNjIgMTQuOTIxOSAxNC41NzAzIDE0Ljc1QzE0Ljc3ODYgMTQuNTcyOSAxNS4wODg1IDE0LjQ4NDQgMTUuNSAxNC40ODQ0QzE2IDE0LjQ4NDQgMTYuMzkwNiAxNC42MDE2IDE2LjY3MTkgMTQuODM1OUMxNi45NTgzIDE1LjA3MDMgMTcuMTQ1OCAxNS40NDUzIDE3LjIzNDQgMTUuOTYwOUwyMC41NzAzIDE1Ljc2NTZDMjAuNDI0NSAxNC41NzgxIDE5Ljk2NjEgMTMuNzEzNSAxOS4xOTUzIDEzLjE3MTlDMTguNDI5NyAxMi42MjUgMTcuMzE1MSAxMi4zNTE2IDE1Ljg1MTYgMTIuMzUxNkMxNC42NTg5IDEyLjM1MTYgMTMuNzE4OCAxMi41MDI2IDEzLjAzMTIgMTIuODA0N0MxMi4zNDkgMTMuMTAxNiAxMS44MzU5IDEzLjUxMyAxMS40OTIyIDE0LjAzOTFDMTEuMTUzNiAxNC41NTk5IDEwLjk4NDQgMTUuMTE0NiAxMC45ODQ0IDE1LjcwMzFDMTAuOTg0NCAxNi41OTkgMTEuMzE3NyAxNy4zMzU5IDExLjk4NDQgMTcuOTE0MUMxMi42NDU4IDE4LjQ5MjIgMTMuNzUyNiAxOC45NTU3IDE1LjMwNDcgMTkuMzA0N0MxNi4yNTI2IDE5LjUxMyAxNi44NTY4IDE5LjczNDQgMTcuMTE3MiAxOS45Njg4QzE3LjM3NzYgMjAuMjAzMSAxNy41MDc4IDIwLjQ2ODggMTcuNTA3OCAyMC43NjU2QzE3LjUwNzggMjEuMDc4MSAxNy4zNjk4IDIxLjM1NDIgMTcuMDkzOCAyMS41OTM4QzE2LjgyMjkgMjEuODI4MSAxNi40MzQ5IDIxLjk0NTMgMTUuOTI5NyAyMS45NDUzQzE1LjI1MjYgMjEuOTQ1MyAxNC43MzE4IDIxLjcxMzUgMTQuMzY3MiAyMS4yNUMxNC4xNDMyIDIwLjk2MzUgMTMuOTk0OCAyMC41NDY5IDEzLjkyMTkgMjBaTTMyLjY4NzUgMTIuNTQ2OUgyMS45Mjk3VjE1LjM3NUgyNS41MzkxVjI0SDI5LjA3ODFWMTUuMzc1SDMyLjY4NzVWMTIuNTQ2OVpNMzQuODY3MiAxMy45MTQxQzMzLjgyNTUgMTQuOTU1NyAzMy4zMDQ3IDE2LjQxMTUgMzMuMzA0NyAxOC4yODEyQzMzLjMwNDcgMTkuNjE5OCAzMy41Njc3IDIwLjczNDQgMzQuMDkzOCAyMS42MjVDMzQuNjE5OCAyMi41MTU2IDM1LjMwNDcgMjMuMTY2NyAzNi4xNDg0IDIzLjU3ODFDMzYuOTk3NCAyMy45ODk2IDM4LjA2NzcgMjQuMTk1MyAzOS4zNTk0IDI0LjE5NTNDNDAuNjMwMiAyNC4xOTUzIDQxLjY5MDEgMjMuOTU4MyA0Mi41MzkxIDIzLjQ4NDRDNDMuMzkzMiAyMy4wMDUyIDQ0LjA0NDMgMjIuMzM4NSA0NC40OTIyIDIxLjQ4NDRDNDQuOTQ1MyAyMC42MjUgNDUuMTcxOSAxOS41MjYgNDUuMTcxOSAxOC4xODc1QzQ1LjE3MTkgMTYuMzQzOCA0NC42NTYyIDE0LjkxMTUgNDMuNjI1IDEzLjg5MDZDNDIuNTkzOCAxMi44NjQ2IDQxLjEyNSAxMi4zNTE2IDM5LjIxODggMTIuMzUxNkMzNy4zNTk0IDEyLjM1MTYgMzUuOTA4OSAxMi44NzI0IDM0Ljg2NzIgMTMuOTE0MVpNMzcuNDg0NCAyMC43ODkxQzM3LjA1NzMgMjAuMjgzOSAzNi44NDM4IDE5LjQ1MzEgMzYuODQzOCAxOC4yOTY5QzM2Ljg0MzggMTcuMTMwMiAzNy4wNTk5IDE2LjI5NDMgMzcuNDkyMiAxNS43ODkxQzM3LjkyNDUgMTUuMjgzOSAzOC40OTc0IDE1LjAzMTIgMzkuMjEwOSAxNS4wMzEyQzM5Ljk1NTcgMTUuMDMxMiA0MC41NDQzIDE1LjI4MTIgNDAuOTc2NiAxNS43ODEyQzQxLjQxNDEgMTYuMjc2IDQxLjYzMjggMTcuMDYyNSA0MS42MzI4IDE4LjE0MDZDNDEuNjMyOCAxOS40MjE5IDQxLjQyNDUgMjAuMzA5OSA0MS4wMDc4IDIwLjgwNDdDNDAuNTkxMSAyMS4yOTk1IDQwLjAwMjYgMjEuNTQ2OSAzOS4yNDIyIDIxLjU0NjlDMzguNTAyNiAyMS41NDY5IDM3LjkxNjcgMjEuMjk0MyAzNy40ODQ0IDIwLjc4OTFaTTQ3LjEyNSAxMi41NDY5VjI0SDUwLjY3OTdWMTkuMzUxNkg1MC45OTIyQzUxLjMxNTEgMTkuMzUxNiA1MS42MDQyIDE5LjQ0MDEgNTEuODU5NCAxOS42MTcyQzUyLjA0NjkgMTkuNzUyNiA1Mi4yNjA0IDIwLjA0NjkgNTIuNSAyMC41TDU0LjM5MDYgMjRINTguMzkwNkw1Ni42Nzk3IDIwLjY3OTdDNTYuNTk2NCAyMC41MTMgNTYuNDI5NyAyMC4yNzYgNTYuMTc5NyAxOS45Njg4QzU1LjkzNDkgMTkuNjYxNSA1NS43NDc0IDE5LjQ2MDkgNTUuNjE3MiAxOS4zNjcyQzU1LjQyNDUgMTkuMjI2NiA1NS4xMTcyIDE5LjA4NTkgNTQuNjk1MyAxOC45NDUzQzU1LjIyMTQgMTguODI1NSA1NS42MzU0IDE4LjY3NDUgNTUuOTM3NSAxOC40OTIyQzU2LjQxMTUgMTguMjA1NyA1Ni43ODM5IDE3LjgzMzMgNTcuMDU0NyAxNy4zNzVDNTcuMzI1NSAxNi45MTE1IDU3LjQ2MDkgMTYuMzYyIDU3LjQ2MDkgMTUuNzI2NkM1Ny40NjA5IDE0Ljk5NzQgNTcuMjgzOSAxNC4zODAyIDU2LjkyOTcgMTMuODc1QzU2LjU3NTUgMTMuMzY0NiA1Ni4xMDk0IDEzLjAxNTYgNTUuNTMxMiAxMi44MjgxQzU0Ljk1MzEgMTIuNjQwNiA1NC4xMTcyIDEyLjU0NjkgNTMuMDIzNCAxMi41NDY5SDQ3LjEyNVpNNTIuMTcxOSAxNy4xODc1SDUwLjY3OTdWMTQuODU5NEg1Mi4yMzQ0QzUyLjg4MDIgMTQuODU5NCA1My4zMjAzIDE0Ljk1ODMgNTMuNTU0NyAxNS4xNTYyQzUzLjc4OTEgMTUuMzU0MiA1My45MDYyIDE1LjYzOCA1My45MDYyIDE2LjAwNzhDNTMuOTA2MiAxNi4yNTc4IDUzLjgzMDcgMTYuNDc5MiA1My42Nzk3IDE2LjY3MTlDNTMuNTMzOSAxNi44NjQ2IDUzLjM0MzggMTYuOTg0NCA1My4xMDk0IDE3LjAzMTJDNTIuNjQ1OCAxNy4xMzU0IDUyLjMzMzMgMTcuMTg3NSA1Mi4xNzE5IDE3LjE4NzVaTTY5LjAwNzggMTIuNTQ2OUg1OS41MjM0VjI0SDY5LjE3OTdWMjEuNDA2Mkg2My4wNzAzVjE5LjE0ODRINjguNTc4MVYxNi44MTI1SDYzLjA3MDNWMTQuOTkyMkg2OS4wMDc4VjEyLjU0NjlaIiBmaWxsPSJ3aGl0ZSIvPgo8bWFzayBpZD0icGF0aC0yLWluc2lkZS0xXzM4MzNfMTcxNjkiIGZpbGw9IndoaXRlIj4KPHBhdGggZD0iTTgwIDBIMTc2VjM2SDgwVjBaIi8+CjwvbWFzaz4KPHBhdGggZD0iTTE3NiAwSDE3OFYtMkgxNzZWMFpNMTc2IDM2VjM4SDE3OFYzNkgxNzZaTTgwIDJIMTc2Vi0ySDgwVjJaTTE3NCAwVjM2SDE3OFYwSDE3NFpNMTc2IDM0SDgwVjM4SDE3NlYzNFoiIGZpbGw9IndoaXRlIiBtYXNrPSJ1cmwoI3BhdGgtMi1pbnNpZGUtMV8zODMzXzE3MTY5KSIvPgo8cGF0aCBkPSJNOTEuMTc5NyAxMi41NDY5SDk3LjgwNDdDOTguOTA4OSAxMi41NDY5IDk5Ljc1NTIgMTIuODIwMyAxMDAuMzQ0IDEzLjM2NzJDMTAwLjkzOCAxMy45MTQxIDEwMS4yMzQgMTQuNTkxMSAxMDEuMjM0IDE1LjM5ODRDMTAxLjIzNCAxNi4wNzU1IDEwMS4wMjMgMTYuNjU2MiAxMDAuNjAyIDE3LjE0MDZDMTAwLjMyIDE3LjQ2MzUgOTkuOTA4OSAxNy43MTg4IDk5LjM2NzIgMTcuOTA2MkMxMDAuMTkgMTguMTA0MiAxMDAuNzk0IDE4LjQ0NTMgMTAxLjE4IDE4LjkyOTdDMTAxLjU3IDE5LjQwODkgMTAxLjc2NiAyMC4wMTMgMTAxLjc2NiAyMC43NDIyQzEwMS43NjYgMjEuMzM1OSAxMDEuNjI4IDIxLjg2OTggMTAxLjM1MiAyMi4zNDM4QzEwMS4wNzYgMjIuODE3NyAxMDAuNjk4IDIzLjE5MjcgMTAwLjIxOSAyMy40Njg4Qzk5LjkyMTkgMjMuNjQwNiA5OS40NzQgMjMuNzY1NiA5OC44NzUgMjMuODQzOEM5OC4wNzgxIDIzLjk0NzkgOTcuNTQ5NSAyNCA5Ny4yODkxIDI0SDkxLjE3OTdWMTIuNTQ2OVpNOTQuNzUgMTcuMDM5MUg5Ni4yODkxQzk2Ljg0MTEgMTcuMDM5MSA5Ny4yMjQgMTYuOTQ1MyA5Ny40Mzc1IDE2Ljc1NzhDOTcuNjU2MiAxNi41NjUxIDk3Ljc2NTYgMTYuMjg5MSA5Ny43NjU2IDE1LjkyOTdDOTcuNzY1NiAxNS41OTY0IDk3LjY1NjIgMTUuMzM1OSA5Ny40Mzc1IDE1LjE0ODRDOTcuMjI0IDE0Ljk2MDkgOTYuODQ5IDE0Ljg2NzIgOTYuMzEyNSAxNC44NjcySDk0Ljc1VjE3LjAzOTFaTTk0Ljc1IDIxLjUzOTFIOTYuNTU0N0M5Ny4xNjQxIDIxLjUzOTEgOTcuNTkzOCAyMS40MzIzIDk3Ljg0MzggMjEuMjE4OEM5OC4wOTM4IDIxIDk4LjIxODggMjAuNzA4MyA5OC4yMTg4IDIwLjM0MzhDOTguMjE4OCAyMC4wMDUyIDk4LjA5MzggMTkuNzM0NCA5Ny44NDM4IDE5LjUzMTJDOTcuNTk5IDE5LjMyMjkgOTcuMTY2NyAxOS4yMTg4IDk2LjU0NjkgMTkuMjE4OEg5NC43NVYyMS41MzkxWk0xMTAuMzkxIDIyLjEwOTRIMTA2LjM1OUwxMDUuODA1IDI0SDEwMi4xODhMMTA2LjQ5MiAxMi41NDY5SDExMC4zNTJMMTE0LjY1NiAyNEgxMTAuOTUzTDExMC4zOTEgMjIuMTA5NFpNMTA5LjY0OCAxOS42MzI4TDEwOC4zODMgMTUuNTE1NkwxMDcuMTI1IDE5LjYzMjhIMTA5LjY0OFpNMTE1LjgyIDEyLjU0NjlIMTE5LjEyNUwxMjMuNDM4IDE4Ljg4MjhWMTIuNTQ2OUgxMjYuNzczVjI0SDEyMy40MzhMMTE5LjE0OCAxNy43MTA5VjI0SDExNS44MlYxMi41NDY5Wk0xMjkuMTQ4IDEyLjU0NjlIMTMyLjQ1M0wxMzYuNzY2IDE4Ljg4MjhWMTIuNTQ2OUgxNDAuMTAyVjI0SDEzNi43NjZMMTMyLjQ3NyAxNy43MTA5VjI0SDEyOS4xNDhWMTIuNTQ2OVpNMTQyLjQ0NSAxMi41NDY5SDE1MS45M1YxNC45OTIySDE0NS45OTJWMTYuODEyNUgxNTEuNVYxOS4xNDg0SDE0NS45OTJWMjEuNDA2MkgxNTIuMTAyVjI0SDE0Mi40NDVWMTIuNTQ2OVpNMTU0LjA2MiAyNFYxMi41NDY5SDE1OS45NjFDMTYxLjA1NSAxMi41NDY5IDE2MS44OTEgMTIuNjQwNiAxNjIuNDY5IDEyLjgyODFDMTYzLjA0NyAxMy4wMTU2IDE2My41MTMgMTMuMzY0NiAxNjMuODY3IDEzLjg3NUMxNjQuMjIxIDE0LjM4MDIgMTY0LjM5OCAxNC45OTc0IDE2NC4zOTggMTUuNzI2NkMxNjQuMzk4IDE2LjM2MiAxNjQuMjYzIDE2LjkxMTUgMTYzLjk5MiAxNy4zNzVDMTYzLjcyMSAxNy44MzMzIDE2My4zNDkgMTguMjA1NyAxNjIuODc1IDE4LjQ5MjJDMTYyLjU3MyAxOC42NzQ1IDE2Mi4xNTkgMTguODI1NSAxNjEuNjMzIDE4Ljk0NTNDMTYyLjA1NSAxOS4wODU5IDE2Mi4zNjIgMTkuMjI2NiAxNjIuNTU1IDE5LjM2NzJDMTYyLjY4NSAxOS40NjA5IDE2Mi44NzIgMTkuNjYxNSAxNjMuMTE3IDE5Ljk2ODhDMTYzLjM2NyAyMC4yNzYgMTYzLjUzNCAyMC41MTMgMTYzLjYxNyAyMC42Nzk3TDE2NS4zMjggMjRIMTYxLjMyOEwxNTkuNDM4IDIwLjVDMTU5LjE5OCAyMC4wNDY5IDE1OC45ODQgMTkuNzUyNiAxNTguNzk3IDE5LjYxNzJDMTU4LjU0MiAxOS40NDAxIDE1OC4yNTMgMTkuMzUxNiAxNTcuOTMgMTkuMzUxNkgxNTcuNjE3VjI0SDE1NC4wNjJaTTE1Ny42MTcgMTcuMTg3NUgxNTkuMTA5QzE1OS4yNzEgMTcuMTg3NSAxNTkuNTgzIDE3LjEzNTQgMTYwLjA0NyAxNy4wMzEyQzE2MC4yODEgMTYuOTg0NCAxNjAuNDcxIDE2Ljg2NDYgMTYwLjYxNyAxNi42NzE5QzE2MC43NjggMTYuNDc5MiAxNjAuODQ0IDE2LjI1NzggMTYwLjg0NCAxNi4wMDc4QzE2MC44NDQgMTUuNjM4IDE2MC43MjcgMTUuMzU0MiAxNjAuNDkyIDE1LjE1NjJDMTYwLjI1OCAxNC45NTgzIDE1OS44MTggMTQuODU5NCAxNTkuMTcyIDE0Ljg1OTRIMTU3LjYxN1YxNy4xODc1WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==");


/***/ }),

/***/ "./src/assets/images/rate-us.svg":
/*!***************************************!*\
  !*** ./src/assets/images/rate-us.svg ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReactComponent: () => (/* binding */ SvgRateUs),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _circle, _g, _defs;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

function SvgRateUs(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", _extends({
    width: 36,
    height: 36,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _circle || (_circle = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
    cx: 18,
    cy: 18,
    r: 18,
    fill: "#0167FF",
    fillOpacity: 0.2
  })), _g || (_g = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("g", {
    clipPath: "url(#rate-us_svg__clip0_3779_16319)",
    fill: "#0167FF"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M25.403 19.126l-2.542 2.478.6 3.498c.225 1.309-1.15 2.302-2.321 1.686l-3.142-1.651-3.141 1.651c-1.168.616-2.546-.375-2.321-1.686l.6-3.498-2.542-2.478c-.95-.925-.425-2.539.886-2.729l3.513-.51 1.57-3.183c.585-1.185 2.28-1.192 2.87 0l1.57 3.183 3.513.51c1.312.19 1.836 1.805.887 2.73z"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M29.635 14.566l-1.94 1.89.459 2.67c.169.984-.867 1.732-1.747 1.269l-.754-.396c.285-.277.42-.396.572-.603 1.064-1.445.208-3.531-1.592-3.792l-3.096-.45-1.383-2.802 1.578-.229 1.198-2.429c.442-.894 1.718-.894 2.16 0l1.198 2.43 2.68.389c.985.142 1.383 1.355.667 2.053zm-13.789-2.214l-1.383 2.802-3.096.45c-1.968.285-2.753 2.707-1.33 4.094l.31.301-.754.396c-.883.465-1.915-.286-1.747-1.269l.458-2.67-1.94-1.89c-.715-.698-.317-1.911.668-2.053l2.68-.39 1.199-2.429c.441-.894 1.717-.894 2.16 0l1.198 2.43 1.577.228z"
  }))), _defs || (_defs = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("defs", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("clipPath", {
    id: "rate-us_svg__clip0_3779_16319"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    fill: "#fff",
    transform: "translate(6 6)",
    d: "M0 0h24v24H0z"
  })))));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTgiIGN5PSIxOCIgcj0iMTgiIGZpbGw9IiMwMTY3RkYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8zNzc5XzE2MzE5KSI+CjxwYXRoIGQ9Ik0yNS40MDI4IDE5LjEyNjFMMjIuODYxNCAyMS42MDM2TDIzLjQ2MTMgMjUuMTAxNUMyMy42ODU1IDI2LjQxMDYgMjIuMzEwNSAyNy40MDQ1IDIxLjEzOTkgMjYuNzg4TDE3Ljk5ODQgMjUuMTM2NUwxNC44NTcgMjYuNzg4QzEzLjY4OTEgMjcuNDA0MSAxMi4zMTExIDI2LjQxMjUgMTIuNTM1NSAyNS4xMDE1TDEzLjEzNTUgMjEuNjAzNkwxMC41OTQxIDE5LjEyNjFDOS42NDQ2MiAxOC4yMDE1IDEwLjE2OTIgMTYuNTg3MyAxMS40ODA1IDE2LjM5NzJMMTQuOTkzIDE1Ljg4NjdMMTYuNTYzNSAxMi43MDQyQzE3LjE0ODUgMTEuNTE4OSAxOC44NDM2IDExLjUxMTYgMTkuNDMzNCAxMi43MDQyTDIxLjAwMzkgMTUuODg2N0wyNC41MTYzIDE2LjM5NzJDMjUuODI3OSAxNi41ODczIDI2LjM1MjEgMTguMjAxNiAyNS40MDI4IDE5LjEyNjFaIiBmaWxsPSIjMDE2N0ZGIi8+CjxwYXRoIGQ9Ik0yOS42MzU0IDE0LjU2NjFMMjcuNjk1OSAxNi40NTY1TDI4LjE1MzkgMTkuMTI2QzI4LjMyMjUgMjAuMTA5OSAyNy4yODY4IDIwLjg1ODQgMjYuNDA2OSAyMC4zOTVMMjUuNjUzNCAxOS45OTlDMjUuOTM4MSAxOS43MjE3IDI2LjA3MzIgMTkuNjAyOCAyNi4yMjU0IDE5LjM5NkMyNy4yODg2IDE3Ljk1MDcgMjYuNDMzNCAxNS44NjUgMjQuNjMzIDE1LjYwNDFMMjEuNTM3IDE1LjE1NDFMMjAuMTU0IDEyLjM1MjFMMjEuNzMxNSAxMi4xMjMxTDIyLjkzIDkuNjk0MTVDMjMuMzcxNyA4Ljc5OTgyIDI0LjY0NzggOC43OTk5MiAyNS4wODk1IDkuNjk0MTVMMjYuMjg3OSAxMi4xMjMxTDI4Ljk2ODQgMTIuNTEyNkMyOS45NTM0IDEyLjY1NSAzMC4zNTA2IDEzLjg2ODIgMjkuNjM1NCAxNC41NjYxWk0xNS44NDYxIDEyLjM1MjFMMTQuNDYzMSAxNS4xNTQxTDExLjM2NzIgMTUuNjA0MUM5LjM5OTQxIDE1Ljg4OTMgOC42MTM3MiAxOC4zMTA4IDEwLjAzNzIgMTkuNjk3NUwxMC4zNDY3IDE5Ljk5OUw5LjU5MzIxIDIwLjM5NUM4LjcxMDMyIDIwLjg1OTYgNy42Nzc3NCAyMC4xMDg4IDcuODQ2MjQgMTkuMTI2TDguMzA0MjMgMTYuNDU2NUw2LjM2NDc2IDE0LjU2NjFDNS42NDkyMiAxMy44Njc5IDYuMDQ2ODIgMTIuNjU0OSA3LjAzMjI1IDEyLjUxMjZMOS43MTIyMSAxMi4xMjMxTDEwLjkxMDcgOS42OTQxNUMxMS4zNTI0IDguNzk5ODcgMTIuNjI4NCA4Ljc5OTkyIDEzLjA3MDEgOS42OTQxNUwxNC4yNjg2IDEyLjEyMzFMMTUuODQ2MSAxMi4zNTIxWiIgZmlsbD0iIzAxNjdGRiIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzM3NzlfMTYzMTkiPgo8cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2IDYpIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==");


/***/ }),

/***/ "./src/assets/images/welcome-feature-image.svg":
/*!*****************************************************!*\
  !*** ./src/assets/images/welcome-feature-image.svg ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReactComponent: () => (/* binding */ SvgWelcomeFeatureImage),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _path, _path2, _path3, _path4, _path5, _path6, _path7, _path8, _path9, _path10, _path11, _path12, _path13, _path14, _path15, _path16, _path17, _path18, _path19, _path20;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

function SvgWelcomeFeatureImage(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", _extends({
    width: 710,
    height: 450,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _path || (_path = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M423.359 119.113a4.47 4.47 0 001.531 2.734 10.293 10.293 0 00-2.533 4.152 10.24 10.24 0 00-.337 4.845c-10.567 9.301-19.443 20.455-23.578 33.737-.418 1.341 1.229 2.016 2.137 1.278a16.278 16.278 0 016.38-3.295c2.348-.61 4.803-.69 7.185-.232 4.091.87 7.64 3.087 11.606 4.256a25.12 25.12 0 0018.448-2.249c.219 0-.438-.435 12.033 10.394a18.54 18.54 0 019.283-7.052s-9.283-6.503-13.987-9.726c3.785-5.75 3.476-13.381-5.802-21.337-5.859-5.023-12.083-8.35-5.621-16.29.985-1.211-.61-2.857-1.649-1.884a.56.56 0 00-.304.059 157.409 157.409 0 00-13.989 10.451 10.629 10.629 0 011.833-6.384 4.205 4.205 0 003.947-1.151 4.152 4.152 0 001.061-3.955c-1.002-4.315-8.399-3.279-7.644 1.649zm25.777 24.74a11.67 11.67 0 011.404 10.516 61.642 61.642 0 00-5.863-4.437 29.87 29.87 0 00-6.535-3.701c-.737-.294-1.031.777-.49 1.154 4.041 2.83 7.39 6.93 11.606 9.484a15.728 15.728 0 01-4.949 4.618c-7.141 4.383-14.901 4.191-22.477.973a26.88 26.88 0 00-11.666-2.918 34.074 34.074 0 019.222-13.98c.49-.488-.175-1.45-.794-.973-4.829 3.723-10.139 8.927-10.994 15.258a18.83 18.83 0 00-5.621 2.006c6.109-16.9 20.402-29.788 34.452-40.607-6.323 11.004 7.741 14.849 12.705 22.607zM421.22 106.648a.956.956 0 001.435.381.947.947 0 00.337-.442 62.203 62.203 0 001.405-17.81c-.044-2.554-.733-7.901-4.704-6.93-3.481.851-2.956 6.628-2.748 9.18a57.12 57.12 0 004.275 15.621zM400.629 109.265c4.027 2.436 8.491 2.551 13.072 2.795h.061a1.292 1.292 0 001.338-.873 1.278 1.278 0 00-.544-1.498 35.998 35.998 0 01-6.964-5.713 25.015 25.015 0 00-4.336-4.074c-2.339-1.37-5.859-1.334-6.902 1.581-1.156 3.224 1.77 6.264 4.275 7.782zM403.317 130.965c2.641-3.377 6.43-10.103 10.199-11.673 1.215-.502.795-2.429-.549-2.005a27.799 27.799 0 00-10.751 5.957c-1.934 1.844-4.784 5.226-3.719 8.145 1.013 2.805 3.588 1.15 4.82-.424z",
    fill: "#0167FF"
  })), _path2 || (_path2 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M446.436 293.089c-.118-1.088 0-1.835-.978-2.31a13.249 13.249 0 00-4.765-.061c-11.241.122-22.478.608-33.717 1.032-2.159-2.865-41.42-52.004-49.782-60.482a4.82 4.82 0 001.32-3.4 4.82 4.82 0 00-1.442-3.35c-3.032-2.88-10.064-3.279-11.3 1.762a5.82 5.82 0 00.125 3.108 5.858 5.858 0 001.706 2.607c-10.873 11.603-25.313 29.829-41.168 49.907-3.79 4.79-7.942 9.482-11.241 14.588-6.597.305-13.193.688-19.789 1.089a34.767 34.767 0 00-6.599.566c-1.831.485-1.936 2.312-2.137 4.013-2.033 17.2.628 93.324 3.971 122.363a1.152 1.152 0 00.855 1.088 179.45 179.45 0 0046.301 2.127c1.037-.069 1.094-1.689 0-1.641a214.94 214.94 0 01-44.957-2.552c-4.223-42.176-5.689-114.81-3.543-123.219 1.129 0 1.919-.172 2.932-.244 3.299-.23 171.58-7.171 172.009-7.171-.477 1.892 6.345 49.729 5.688 124.25-33.235 4.525-54.695 3.532-75.07 6.384-.856.12-.672 1.524.183 1.524 25.41-1.461 50.95-2.434 76.169-5.959a1.117 1.117 0 00.795-1.032 1226.413 1226.413 0 00-5.566-124.987zm-149.041 3.281c3.559-4.075 34.76-45.437 51.002-63.705a6.856 6.856 0 007.758-.365s46.24 56.716 48.804 59.572c-11.178.427-82.888 3.283-107.564 4.498z",
    fill: "#282828"
  })), _path3 || (_path3 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M521.755 210.72c-.54-1.705-6.108-5.533-9.346-7.66a7.056 7.056 0 00-4.777-1.076 7.037 7.037 0 00-4.322 2.293l-1.162 1.337a2.117 2.117 0 000 2.857c1.969 2.221 10.147 11.428 13.127 11.428 3.494 0 7.266-6.706 6.48-9.179zM433.74 141.786a1.576 1.576 0 00-1.637.6 1.545 1.545 0 00-.283 1.105c.028.183.092.359.188.518a1.41 1.41 0 00.879.634 1.506 1.506 0 001.589-.489 1.486 1.486 0 00-.736-2.368zM276.7 306.58a39.02 39.02 0 016.903.183c1.159.015 1.093-1.69 0-1.764-7.273-.488-8.662-.964-9.712-.305-1.05.66-1.039 1.886-1.094 2.979 0 1.581.241 18.844.367 25.835.322 17.924 1.156 65.854 4.825 83.95.172.851 1.417.483 1.284-.366-3.229-20.467-4.511-109.012-4.4-109.419.328-1.208.672-.884 1.827-1.093zM436.967 412.232c-3.49.283-27.669 2.438-36.283 3.159-5.863.492-11.788 1.524-17.653 1.581a.583.583 0 00-.547.578.578.578 0 00.547.578c13.444.028 33.132-1.742 53.752-3.702a43.14 43.14 0 006.292-.668c2.326-.594 1.878-2.676 1.895-4.62.031-3.649.243-26.08.243-33.678a1 1 0 00-.295-.709 1.01 1.01 0 00-1.425 0 1 1 0 00-.295.709c0 6.018-.337 26.26-.368 30.394 0 1.035.55 5.106-.181 5.775-.792.722-4.641.518-5.682.603zM504.843 281.593a16482.195 16482.195 0 00-48.569 52.764c-.497.54.304 1.337.794.791 17.041-16.718 33.528-34.157 48.926-52.401.678-.79-.42-1.944-1.151-1.154zM486.941 321.96c-6.058 4.925-11.055 11.123-16.614 16.534-.556.542.253 1.35.855.851a189.557 189.557 0 0016.859-16.29.776.776 0 00-.564-1.277.787.787 0 00-.536.182zM232.165 309.618c.501-.599-.186-1.707-.916-1.156-9.754 7.363-18.343 16.636-27.182 24.984-9.189 8.672-18.378 17.34-27.304 26.26a.573.573 0 00-.185.401.563.563 0 00.354.534.56.56 0 00.443-.011.559.559 0 00.182-.134c10.631-9.362 30.396-27.771 40.742-37.449a162.172 162.172 0 0013.866-13.429zM248.533 308.524c-10.829 10.451-21.834 20.758-32.618 31.307-.678.653.306 1.58 1.039 1.032a405.571 405.571 0 0032.435-31.488c.426-.607-.298-1.389-.856-.851z",
    fill: "#0167FF"
  })), _path4 || (_path4 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M238.1 205.489a24.817 24.817 0 0010.438-5.108 1.515 1.515 0 00.701-1.083 1.492 1.492 0 00-.395-1.227 172.032 172.032 0 00-12.4-12.948c-.742-.653-2.083.187-1.466 1.088a130.094 130.094 0 0010.502 12.583c-2.687 1.703-5.551 3.111-8.246 4.79-.972.631-.228 2.092.866 1.905zM221.831 193.091c1.451-1.295.372-3.468-.549-4.679-.971-1.28-1.953-2.859-3.719-2.978-2.247 0-1.591 4.23-.123 6.137.957 1.237 2.786 2.959 4.391 1.52zM239.433 174.73c-3.75 0 .597 10.95 4.215 7.721 1.449-1.295.337-3.447-.551-4.681-.945-1.317-1.954-2.863-3.664-3.04zM218.361 179.35a.696.696 0 00.476-.493.692.692 0 00-.17-.663 7.254 7.254 0 00-7.697.122 8.021 8.021 0 00-2.275 2.992 7.96 7.96 0 00-.656 3.695.7.7 0 00.509.639.705.705 0 00.773-.274c.916-1.641 1.177-3.627 2.686-4.864 1.978-1.615 4.153-.866 6.354-1.154zM231.553 215.336c1.042 4.97 4.949 13.634 11.239 13.063 7.22-.653 5.566-10.64 5.131-15.502a1.041 1.041 0 00-.413-.784 1.043 1.043 0 00-.414-.19 1.043 1.043 0 00-.455.001c-4.868.57-9.7 1.402-14.477 2.493a.725.725 0 00-.633.608.727.727 0 00.022.311zm14.475-1.215c.49 4.315 1.407 12.338-3.787 12.399-5.069.061-7.513-6.686-8.97-10.821a56.93 56.93 0 0012.757-1.578zM458.722 201.904c.735-1.642.921-2.007.123-3.527a17.592 17.592 0 01.919-18.519 17.728 17.728 0 017.452-6.153 17.826 17.826 0 019.589-1.344c.978.109 1.159-1.524.242-1.703a19.542 19.542 0 00-10.659.928 19.444 19.444 0 00-8.555 6.398 19.28 19.28 0 00-1.859 20.393c.895 1.742.545 2.308-.306 4.137-7.743 16.636-27.702 36.809-53.569 65.536-.547.609.296 1.448.856.851 15.292-16.279 46.769-46.883 55.767-66.997zM474.418 190.173c.119.852 1.475.608 1.466-.18a17.07 17.07 0 011.358-7.209 17.133 17.133 0 014.261-5.984c4.261-3.664 9.407-3.897 14.721-3.464a.779.779 0 00.366-1.458c-9.618-4.679-24.158 4.167-22.172 18.295zM486.875 183.122a14.622 14.622 0 00-4.452 6.858 14.565 14.565 0 00-.068 8.165c.197.653 1.35.607 1.282-.183a15.148 15.148 0 01.67-7.034 15.204 15.204 0 013.791-5.975c4.321-3.847 8.97-3.09 14.221-2.613.792.072.86-.98.365-1.337-4.522-3.296-11.847-1.236-15.809 2.119zM509.539 191.388c.674.055.856-.912.306-1.217-6.657-4.437-15.971 1.411-18.325 7.965-.24.668.799 1.034 1.094.485a14.823 14.823 0 017.756-6.749 20.608 20.608 0 019.169-.484zM514.726 198.685a6.462 6.462 0 00-2.886-2.745 6.503 6.503 0 00-3.955-.538 11.919 11.919 0 00-7.207 5.411c-.422.55.499 1.289.978.79 2.626-2.737 8.338-6.514 11.116-1.703.709 1.23 2.602.074 1.954-1.215zM494.578 214.546c-10.213 18.829-7.423 14.806-20.889 33.92-12.362 17.551-22.032 25.574-28.77 34.283-.613.791.674 1.585 1.343 1.035a134.505 134.505 0 0015.881-16.657 207.858 207.858 0 0033.413-52.095.543.543 0 00-.255-.709.552.552 0 00-.723.223zM230.818 394.361a.584.584 0 00.256-.357.577.577 0 00-.073-.432.57.57 0 00-.583-.261.563.563 0 00-.21.079c-18.542 11.452-37.733 22.06-58.944 27.475a78.275 78.275 0 00-10.445 2.493c-2.748-6.079-5.861-11.855-8.123-18.176a106.017 106.017 0 01-4.459-57.698c4.861-21.705 18.618-40.739 35.55-54.83a126.867 126.867 0 0137.442-20.606 296.24 296.24 0 012.321 6.443c.593 1.709 3.295.973 2.689-.73-5.87-16.466-15.833-40.223-24.556-53.561a6.481 6.481 0 002.076-2.177c.552-.912-.816-2.086-1.588-1.215-4.275 4.818-10.747 2.247-13.315-2.798-2.074-4.073-.07-14.021 6.292-11.184a.507.507 0 00.374.047.488.488 0 00.359-.412.487.487 0 00-.245-.487c-5.284-3.346-10.819 3.451-9.712 10.214-.061-.061-.061-.122-.122-.122-2.759 8.239-4.081 16.236-10.874 22.916-13.634 13.412-38.488 21.1-51.195 37.142-12.225 23.732-21.769 53.417-15.698 79.512 3.182 13.675 9.283 20.484 9.345 20.545a.354.354 0 00.377.075.36.36 0 00.113-.075 43.586 43.586 0 0125.958-12.158 111.265 111.265 0 006.17 39.757 88.277 88.277 0 009.957 21.215.728.728 0 00.978.242 41.904 41.904 0 0010.993-2.127c25.29-6.304 44.385-19.861 58.892-28.749z",
    fill: "#191919"
  })), _path5 || (_path5 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M174.322 236.188c9.478-10.233 5.848-24.686 17.225-33.748 1.461-1.163 3.063-2.249 4.581-3.283 8.43-10.887 9.531-28.022 9.712-32.947 1.516-.753 4.096-1.611 14.722-6.686a39.173 39.173 0 0018.264 4.254c7.694-.202 11.814-4.163 16.98-9.362.547-.551 1.332.176 1.039.79a19.582 19.582 0 01-8.314 8.509.66.66 0 00-.429.356.652.652 0 00.002.556c11.92 26.441 19.015 33.191 18.323 44.134-1.039 16.473-18.158 31.625-34.694 29.299-.794-.113-.976 1.213-.182 1.398 3.467.689 7.038.678 10.5-.032a26.465 26.465 0 009.657-4.105c.556 3.721 5.111 12.959 7.876 15.441a13.352 13.352 0 008.187 2.432c.792.064 1.588.12 2.321.12-1.801 17.092-17.686 29.152-36.587 26.104a.61.61 0 00-.455.061.6.6 0 00-.292.596.583.583 0 00.231.394.588.588 0 00.21.103 32.112 32.112 0 0015.423.198 32.027 32.027 0 0013.721-7.013 32.556 32.556 0 0010.628-20.484c8.126 0 18.262-2.014 28.831-.366a138.359 138.359 0 0118.997 4.194c.794.243 1.339-1.019.549-1.337a80.34 80.34 0 00-29.076-6.314 145.107 145.107 0 00-20.583-80.788 143.543 143.543 0 00-22.235-28.762c1.781-9.09 3.063-25.842-4.216-32.224-6.104-5.351-13.982-.359-19.301 3.647a49.496 49.496 0 00-12.704 14.893c-9.285-4.681-20.402-3.048-29.687 1.641a4.4 4.4 0 00-1.053-2.34 4.434 4.434 0 00-2.185-1.361 7.794 7.794 0 00-6.657 1.276c-2.691 2.062-4.704 8.328-.795 10.092-9.285 9.057-15.211 23.403-12.339 36.29a.498.498 0 00.54.345.501.501 0 00.438-.466 42.16 42.16 0 017.023-28.029 42.513 42.513 0 0123.458-17.015 35.163 35.163 0 0120.401 1.089c-1.223 2.127-2.369 4.324-3.483 6.505-5.069 9.94-9.893 20.423-9.773 31.73-17.426 7.494-22.3 8.391-39.092 13.617a.786.786 0 00-.477.377.788.788 0 00.309 1.077.797.797 0 00.606.07c1.713-.218 3.422-.608 5.071-.911-3.938 54.099-19.39 56.061-38.554 90.087 13.633-13.849 34.275-20.002 47.338-34.102zm-.61-101.394c-2.321-2.066-1.284-5.837.917-7.537 2.441-1.888 6.535-1.764 6.963 1.822a36.466 36.466 0 00-7.88 5.715zm34.633 5.531c3.741-7.712 7.572-15.927 13.499-22.248 14.184-15.121 26.083-14.244 26.571 6.384a70.332 70.332 0 01-1.404 15.622l-4.766 4.742c-11.3 7.416-23.775 12.665-36.088 18.174-1.894.847-3.787 1.702-5.741 2.493a80.546 80.546 0 017.929-25.167z",
    fill: "#191919"
  })), _path6 || (_path6 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M242.974 168.227a8.137 8.137 0 00-6.841-.302 6.521 6.521 0 00-2.344 1.947 6.492 6.492 0 00-1.199 2.795c-.188.788.996 1.347 1.405.607.897-1.62 1.595-3.205 3.483-3.769a12.434 12.434 0 015.13.242.847.847 0 00.457-.206.828.828 0 00-.091-1.314zM375.716 276.188c-5.156-1.624-10.757-2.524-16.065-3.647-5.308-1.124-10.69-2.31-16.063-3.344.172-1.921.192-3.851.059-5.775a1.043 1.043 0 00-.488-.851 29.755 29.755 0 00-12.704-3.403c-.917-.013-.858 1.285 0 1.398a30.747 30.747 0 018.917 2.31c.742.346 1.772.607 2.138 1.398 1.829 3.185-1.672 13.638-3.849 18.289a.71.71 0 00.275.924.717.717 0 00.948-.195 30.48 30.48 0 004.459-12.097c5.437 1.215 10.939 2.195 16.369 3.281a139.08 139.08 0 0015.821 2.859c.73.068.789-.964.183-1.147z",
    fill: "#191919"
  })), _path7 || (_path7 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M431.961 341.879l-145.035 4.065a1.926 1.926 0 00-1.321.748 1.974 1.974 0 00-.391 1.48l2.645 59.23c.061.46.289.882.641 1.181.351.3.801.456 1.26.438l144.027-4.037a1.86 1.86 0 001.288-.592c.336-.36.52-.838.511-1.333l-1.683-59.462a1.739 1.739 0 00-.584-1.305 1.705 1.705 0 00-1.358-.413zm-92.577 55.46l-36.098 1.012a2.012 2.012 0 01-1.411-.543 2.058 2.058 0 01-.649-1.378c-.345-6.51-1.416-27.228-2-39.358a2.018 2.018 0 011.178-1.955c.244-.111.509-.171.777-.177l36.258-1.017a1.995 1.995 0 011.431.539c.388.363.619.866.642 1.4.374 10.384 1.527 31.219 1.836 39.322.012.272-.03.544-.123.799a2.066 2.066 0 01-1.063 1.167 2.018 2.018 0 01-.778.189zm11.226-30.783c1.097-.777 2.439-.677 2.866.165.189.549.18 1.147-.025 1.689a2.464 2.464 0 01-1.094 1.278c-1.108.762-2.44.676-2.869-.165-.553-.84.005-2.176 1.122-2.967zm-.789 13.433a2.44 2.44 0 01.044-1.717 2.409 2.409 0 011.161-1.253c1.182-.767 2.562-.68 3.029.161.19.558.172 1.168-.05 1.714a2.422 2.422 0 01-1.158 1.253c-1.146.807-2.534.732-3.026-.158zm3.861 9.673c-1.181.767-2.562.68-3.029-.16a2.46 2.46 0 01.05-1.714 2.419 2.419 0 011.156-1.253c1.182-.767 2.562-.68 3.029.158.2.558.187 1.171-.036 1.72-.223.549-.64.994-1.17 1.249zm42.147-.936c-13.113 1.082-27.941 1.392-33.243.687-5.304-.748 1.025-2.231 14.144-3.332 13.119-1.102 27.941-1.391 33.244-.687 5.257.749-1.072 2.252-14.145 3.332zm-27.143-13.138c6.664-.939 14.285-1.009 17.008-.234 2.725.822-.501 2.216-7.209 3.138-6.666.921-14.285 1.008-17.008.231-2.724-.777.499-2.191 7.209-3.135zm27.069-8.057c-13.805 1.181-29.511 1.561-35.136.863-5.583-.699 1.106-2.233 14.903-3.394 13.804-1.198 29.51-1.561 35.135-.863 5.584.703-1.068 2.213-14.908 3.396l.006-.002zM433.711 311.33l-145.858 4.088c-.791.022-1.354 1.123-1.316 2.46l.356 12.565c.038 1.337.747 2.487 1.539 2.38l145.859-4.088c.79-.022 1.353-1.123 1.315-2.46l-.356-12.565c-.117-1.335-.744-2.402-1.539-2.38zm-1.653 10.45c.007.181-.021.362-.081.532-.061.17-.153.325-.272.457a1.285 1.285 0 01-.419.31 1.231 1.231 0 01-.502.114l-139.459 3.909a1.258 1.258 0 01-.942-.373 1.372 1.372 0 01-.297-.441 1.436 1.436 0 01-.111-.526l-.093-3.3c-.007-.181.02-.362.081-.532.06-.169.153-.325.271-.456.118-.132.261-.237.419-.31.158-.073.328-.112.501-.115l139.459-3.909c.173-.007.345.023.507.087.162.064.31.161.436.286.126.125.227.275.297.441.07.166.108.345.112.526l.093 3.3z",
    fill: "#0167FF"
  })), _path8 || (_path8 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M9.008 353.375c0 30.729 20.3 60.397 38.413 79.856C58.233 444.849 73.925 450 89.818 450h311.977c62.076 0 159.148-97.061 160.245-158.958a209.327 209.327 0 00-.998-24.464c-8.788-88.436-68.563-115.459-130.976-149.029-62.412-33.574-21.975-82.705-129.217-112.183C193.604-24.113 80.209 73.33 83.726 164.222c3.516 90.892-74.718 103.995-74.718 189.153z",
    fill: "#EFEBFF"
  })), _path9 || (_path9 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M475.628 116.564c-36.242-12.289-59.195-47.288-66.142-63.252-12.685-36.145 24.463-17.169 50.741 15.361 26.274 32.531 60.704 63.253 15.401 47.891zM263.917 237.353c-36.242-12.289-59.195-47.288-66.142-63.252-12.685-36.145 24.463-17.169 50.741 15.361 26.274 32.532 60.704 63.253 15.401 47.891zM47.376 66.435l-6.834 9.121a1.771 1.771 0 01-1.759.692L30.336 74.6c-1.817-.355-2.914 2.025-1.511 3.28l6.639 5.943c.485.434.714 1.102.602 1.757L34.4 95.377c-.313 1.842 1.864 2.982 3.096 1.622l6.82-7.53c.4-.442.98-.655 1.559-.573l7.892 1.12c1.778.252 2.785-2.057 1.433-3.286l-5.87-5.338a1.929 1.929 0 01-.595-1.724l1.85-11.77c.304-1.924-2.056-3-3.209-1.463zm465.652 17.249l-.714 5.116a.883.883 0 01-.563.693l-3.836 1.455c-.826.313-.732 1.48.13 1.608l4.076.607c.296.044.542.24.646.514l1.556 4.101c.293.77 1.444.667 1.639-.15l1.074-4.513a.879.879 0 01.507-.6l3.488-1.517c.786-.342.672-1.46-.164-1.59l-3.623-.569a.814.814 0 01-.636-.503l-1.931-4.89c-.314-.8-1.527-.625-1.649.238z",
    fill: "#EFEBFF"
  })), _path10 || (_path10 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M156.938 353.375c0 30.729 20.3 60.397 38.413 79.856C206.162 444.849 221.855 450 237.747 450h311.978c62.075 0 159.148-97.061 160.245-158.958a209.327 209.327 0 00-.998-24.464c-8.789-88.436-68.564-115.459-130.976-149.029-62.412-33.574-21.975-82.705-129.217-112.183-107.245-29.479-220.64 67.964-217.123 158.856 3.516 90.892-74.718 103.995-74.718 189.153zM195.298 66.435l-6.834 9.121a1.772 1.772 0 01-1.759.692l-8.447-1.649c-1.818-.355-2.914 2.025-1.512 3.28l6.64 5.943c.484.434.713 1.102.602 1.757l-1.666 9.798c-.313 1.842 1.864 2.982 3.096 1.622l6.819-7.53a1.768 1.768 0 011.56-.573l7.892 1.12c1.778.252 2.785-2.057 1.433-3.286l-5.87-5.338a1.93 1.93 0 01-.595-1.724l1.851-11.77c.303-1.924-2.058-3-3.21-1.463zM660.95 83.684l-.715 5.116a.882.882 0 01-.562.693l-3.836 1.455c-.826.313-.732 1.48.129 1.608l4.077.607c.296.044.542.24.646.514l1.555 4.101c.294.77 1.445.667 1.64-.15l1.074-4.513a.88.88 0 01.506-.6l3.489-1.517c.785-.342.671-1.46-.165-1.59l-3.622-.569a.814.814 0 01-.636-.503l-1.931-4.89c-.314-.8-1.528-.625-1.649.238z",
    fill: "#EFEBFF"
  })), _path11 || (_path11 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M609.236 78.396l-6.835 9.121a1.77 1.77 0 01-1.758.692l-8.448-1.65c-1.817-.354-2.914 2.026-1.511 3.282l6.639 5.942c.485.434.714 1.102.602 1.757l-1.665 9.798c-.313 1.842 1.863 2.982 3.095 1.622l6.82-7.53c.4-.442.981-.655 1.559-.573l7.893 1.12c1.778.252 2.785-2.057 1.432-3.287l-5.869-5.337a1.927 1.927 0 01-.595-1.724l1.85-11.77c.303-1.924-2.057-3-3.209-1.463zM19.189 225.985l-6.835 9.122a1.77 1.77 0 01-1.758.692l-8.448-1.649c-1.817-.355-2.913 2.025-1.51 3.28l6.638 5.943c.485.433.714 1.102.603 1.757l-1.666 9.798c-.313 1.842 1.863 2.982 3.095 1.622l6.82-7.53c.4-.442.981-.656 1.56-.574l7.892 1.121c1.778.252 2.785-2.057 1.433-3.287l-5.87-5.337a1.93 1.93 0 01-.595-1.724l1.85-11.769c.303-1.925-2.057-3.002-3.21-1.465z",
    fill: "#EFEBFF"
  })), _path12 || (_path12 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M399.424 379.112c-6.168 17.636-13.127 29.175-31.457 39.389-41.568 23.186-90.768 24.448-126.502 8.025-19.434-8.927-30.192-19.952-42.391-35.439-.438-.547-1.282.18-.978.729 8.158 14.692 22.171 26.448 36.957 34.223 34.62 18.21 84.887 19.813 130.287-3.647 17.045-8.807 31.618-23.53 35.49-42.917a.72.72 0 00-.52-.881.731.731 0 00-.551.076.721.721 0 00-.335.442z",
    fill: "#191919"
  })), _path13 || (_path13 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M376.215 400.565c-.488.608.177 1.631.855 1.156a46.69 46.69 0 0018.139-29.665.638.638 0 00-1.22-.366c-4.879 14.954-9.314 19.533-17.774 28.875zM388.242 368.467c-10.355 18.984-12.164 18.477-20.401 29.361-.552.727.599 1.446 1.223.912a75.875 75.875 0 0011.788-13.921 52.844 52.844 0 008.613-15.866.667.667 0 00-.864-.764.675.675 0 00-.359.278zM359.241 394.91a71.624 71.624 0 0011.788-12.097 46.315 46.315 0 008.491-12.948c.254-.725-.79-1.03-1.162-.486a138.895 138.895 0 01-20.156 24.497c-.731.671.311 1.587 1.039 1.034z",
    fill: "#191919"
  })), _path14 || (_path14 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M456.421 79.242a4.475 4.475 0 001.532 2.734 10.278 10.278 0 00-2.533 4.151 10.242 10.242 0 00-.338 4.846c-10.567 9.301-19.443 20.455-23.578 33.737-.418 1.341 1.23 2.016 2.138 1.278a16.278 16.278 0 016.38-3.295c2.347-.61 4.802-.69 7.184-.233 4.091.871 7.64 3.088 11.607 4.257a25.123 25.123 0 0018.447-2.249c.219 0-.437-.436 12.033 10.394a18.545 18.545 0 019.283-7.052s-9.283-6.504-13.987-9.726c3.785-5.75 3.477-13.381-5.802-21.337-5.859-5.023-12.083-8.35-5.62-16.29.984-1.211-.611-2.857-1.65-1.884a.56.56 0 00-.304.059 157.583 157.583 0 00-13.989 10.45 10.635 10.635 0 011.834-6.383 4.213 4.213 0 003.947-1.15 4.156 4.156 0 001.061-3.955c-1.002-4.316-8.4-3.28-7.645 1.647zm25.777 24.74a11.696 11.696 0 011.405 10.516 61.528 61.528 0 00-5.864-4.437 29.868 29.868 0 00-6.535-3.702c-.737-.293-1.03.778-.49 1.154 4.041 2.831 7.391 6.931 11.607 9.485a15.74 15.74 0 01-4.949 4.618c-7.141 4.383-14.901 4.191-22.478.973a26.878 26.878 0 00-11.665-2.918 34.062 34.062 0 019.221-13.98c.49-.488-.175-1.45-.794-.973-4.828 3.723-10.138 8.927-10.994 15.258a18.795 18.795 0 00-5.62 2.005c6.108-16.9 20.401-29.787 34.452-40.606-6.323 11.004 7.74 14.85 12.704 22.607zM454.283 66.777a.956.956 0 00.906.561.96.96 0 00.866-.622 62.24 62.24 0 001.404-17.81c-.043-2.554-.733-7.901-4.703-6.93-3.481.851-2.956 6.627-2.748 9.18a57.085 57.085 0 004.275 15.621zM433.691 69.393c4.028 2.437 8.491 2.552 13.072 2.796h.062a1.296 1.296 0 001.338-.873 1.282 1.282 0 00-.544-1.498 35.965 35.965 0 01-6.964-5.713 25.05 25.05 0 00-4.336-4.074c-2.339-1.37-5.859-1.334-6.903 1.58-1.155 3.225 1.77 6.265 4.275 7.782zM436.379 91.094c2.641-3.377 6.43-10.103 10.2-11.673 1.214-.503.794-2.43-.549-2.005a27.78 27.78 0 00-10.751 5.957c-1.934 1.844-4.785 5.226-3.719 8.145 1.013 2.805 3.588 1.15 4.819-.424z",
    fill: "#0167FF"
  })), _path15 || (_path15 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M479.498 253.218c-.118-1.088 0-1.835-.978-2.31a13.249 13.249 0 00-4.765-.061c-11.241.122-22.477.608-33.716 1.032-2.16-2.865-41.42-52.004-49.782-60.482a4.82 4.82 0 001.32-3.4 4.82 4.82 0 00-1.443-3.35c-3.032-2.881-10.064-3.279-11.3 1.761a5.843 5.843 0 001.832 5.716c-10.874 11.602-25.314 29.828-41.169 49.907-3.789 4.79-7.942 9.482-11.241 14.588-6.596.305-13.192.688-19.789 1.089a34.757 34.757 0 00-6.598.566c-1.831.485-1.936 2.312-2.138 4.013-2.032 17.2.628 93.324 3.971 122.362a1.148 1.148 0 00.856 1.089 179.494 179.494 0 0046.301 2.127c1.037-.069 1.094-1.689 0-1.641a214.949 214.949 0 01-44.958-2.552c-4.222-42.176-5.688-114.81-3.542-123.219 1.129 0 1.919-.172 2.932-.244 3.299-.23 171.58-7.172 172.008-7.172-.476 1.893 6.345 49.729 5.689 124.251-33.235 4.524-54.696 3.532-75.071 6.384-.855.12-.672 1.524.184 1.524 25.409-1.461 50.95-2.434 76.169-5.959a1.117 1.117 0 00.794-1.032 1226.126 1226.126 0 00-5.566-124.987zm-149.041 3.281c3.56-4.076 34.76-45.437 51.003-63.705a6.853 6.853 0 007.758-.365s46.239 56.715 48.803 59.572c-11.177.427-82.887 3.283-107.564 4.498z",
    fill: "#282828"
  })), _path16 || (_path16 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M554.818 170.845c-.541-1.705-6.109-5.533-9.347-7.66a7.042 7.042 0 00-9.099 1.217l-1.161 1.337a2.118 2.118 0 000 2.857c1.969 2.221 10.147 11.428 13.126 11.428 3.494 0 7.266-6.706 6.481-9.179zM466.803 101.915a1.578 1.578 0 00-1.188.185 1.574 1.574 0 00-.705.969 1.383 1.383 0 00.161 1.069 1.406 1.406 0 00.879.634 1.501 1.501 0 001.861-1.004 1.47 1.47 0 00-.118-1.134 1.502 1.502 0 00-.89-.719zM309.762 266.709a39.02 39.02 0 016.903.183c1.16.015 1.094-1.69 0-1.764-7.272-.488-8.662-.964-9.712-.305-1.05.66-1.039 1.886-1.094 2.979 0 1.58.241 18.844.368 25.835.322 17.924 1.155 65.854 4.824 83.95.173.851 1.418.483 1.284-.366-3.229-20.467-4.511-109.012-4.399-109.419.328-1.209.671-.884 1.826-1.093zM470.03 372.361c-3.49.283-27.67 2.438-36.283 3.159-5.864.492-11.788 1.524-17.654 1.58a.584.584 0 00-.546.579.58.58 0 00.546.578c13.444.028 33.133-1.742 53.753-3.702a43.14 43.14 0 006.292-.668c2.326-.595 1.877-2.676 1.895-4.62.03-3.649.242-26.08.242-33.678a1 1 0 00-.295-.709 1.01 1.01 0 00-1.424 0 1 1 0 00-.295.709c0 6.018-.337 26.26-.368 30.394 0 1.035.549 5.106-.182 5.774-.792.723-4.64.519-5.681.604zM537.906 241.726a16599.871 16599.871 0 00-48.57 52.764c-.496.54.304 1.337.794.79 17.041-16.717 33.529-34.157 48.927-52.4.678-.79-.42-1.944-1.151-1.154zM520.003 282.089c-6.058 4.925-11.055 11.123-16.614 16.534-.556.542.254 1.35.856.851a189.693 189.693 0 0016.859-16.29.772.772 0 00-.046-1.05.783.783 0 00-1.055-.045zM265.228 269.751c.501-.599-.186-1.707-.917-1.157-9.753 7.364-18.343 16.637-27.181 24.985-9.189 8.672-18.378 17.34-27.304 26.26a.565.565 0 00-.185.401.538.538 0 00.04.221.554.554 0 00.536.352.558.558 0 00.403-.184c10.63-9.362 30.395-27.771 40.741-37.449a162.336 162.336 0 0013.867-13.429zM281.596 268.653c-10.83 10.451-21.835 20.758-32.618 31.307-.679.653.306 1.58 1.039 1.032a405.726 405.726 0 0032.434-31.488c.427-.608-.297-1.389-.855-.851z",
    fill: "#0167FF"
  })), _path17 || (_path17 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M271.163 165.622a24.823 24.823 0 0010.438-5.108 1.512 1.512 0 00.642-1.741 1.515 1.515 0 00-.336-.569 171.863 171.863 0 00-12.401-12.948c-.741-.654-2.082.187-1.465 1.088a130.084 130.084 0 0010.501 12.583c-2.687 1.702-5.55 3.111-8.246 4.79-.971.631-.227 2.092.867 1.905zM254.894 153.22c1.45-1.296.372-3.468-.549-4.679-.972-1.28-1.954-2.859-3.719-2.979-2.247 0-1.591 4.231-.123 6.138.956 1.237 2.785 2.959 4.391 1.52zM272.495 134.859c-3.75 0 .597 10.95 4.216 7.721 1.448-1.295.337-3.447-.551-4.681-.945-1.317-1.954-2.863-3.665-3.04zM251.423 139.483a.7.7 0 00.478-.846.713.713 0 00-.171-.31 7.257 7.257 0 00-7.697.122 7.985 7.985 0 00-2.932 6.686.702.702 0 00.94.627.71.71 0 00.342-.261c.917-1.641 1.177-3.627 2.687-4.864 1.978-1.615 4.152-.866 6.353-1.154zM264.616 175.469c1.041 4.97 4.949 13.634 11.239 13.063 7.22-.653 5.566-10.64 5.13-15.502a1.05 1.05 0 00-1.282-.973c-4.867.57-9.7 1.402-14.477 2.493a.72.72 0 00-.61.919zm14.475-1.215c.49 4.315 1.406 12.338-3.788 12.399-5.069.061-7.513-6.686-8.97-10.821a57.003 57.003 0 0012.758-1.578zM491.785 162.037c.735-1.642.921-2.007.122-3.527a17.596 17.596 0 01.919-18.52 17.722 17.722 0 017.453-6.152 17.824 17.824 0 019.588-1.345c.978.109 1.16-1.524.243-1.702a19.536 19.536 0 00-10.66.928 19.441 19.441 0 00-8.554 6.398 19.284 19.284 0 00-1.859 20.393c.895 1.742.545 2.308-.307 4.137-7.742 16.636-27.702 36.809-53.568 65.536-.547.609.295 1.447.855.851 15.293-16.28 46.769-46.883 55.768-66.997zM507.481 150.302c.118.851 1.475.608 1.466-.181a17.053 17.053 0 011.357-7.208 17.145 17.145 0 014.261-5.984c4.262-3.664 9.408-3.897 14.722-3.464a.786.786 0 00.742-.59.781.781 0 00-.377-.868c-9.617-4.679-24.158 4.167-22.171 18.295zM519.938 143.251a14.631 14.631 0 00-4.453 6.858c-.8 2.66-.824 5.492-.067 8.165.197.653 1.35.607 1.282-.183a15.14 15.14 0 01.67-7.035 15.196 15.196 0 013.791-5.974c4.321-3.847 8.97-3.09 14.221-2.613.792.072.859-.98.365-1.337-4.522-3.296-11.847-1.237-15.809 2.119zM542.602 151.517c.673.055.855-.912.306-1.217-6.658-4.437-15.971 1.411-18.325 7.965-.241.668.798 1.034 1.094.485a14.818 14.818 0 017.755-6.749 20.613 20.613 0 019.17-.484zM547.789 158.814a6.472 6.472 0 00-2.886-2.745 6.506 6.506 0 00-3.956-.538 11.916 11.916 0 00-7.206 5.41c-.423.551.498 1.289.978.791 2.625-2.737 8.337-6.515 11.116-1.703.709 1.23 2.601.074 1.954-1.215zM527.64 174.679c-10.212 18.829-7.423 14.806-20.889 33.92-12.361 17.551-22.031 25.574-28.77 34.283-.612.791.674 1.585 1.344 1.034a134.496 134.496 0 0015.881-16.656 207.855 207.855 0 0033.412-52.095.544.544 0 00-.661-.742.55.55 0 00-.317.256zM263.881 354.486a.58.58 0 00.255-.357.558.558 0 00-.073-.432.58.58 0 00-.358-.255.57.57 0 00-.435.073c-18.541 11.452-37.733 22.06-58.944 27.475a78.275 78.275 0 00-10.445 2.493c-2.747-6.079-5.861-11.855-8.123-18.176a106.036 106.036 0 01-4.459-57.698c4.862-21.705 18.619-40.739 35.55-54.83a126.872 126.872 0 0137.443-20.606 296.24 296.24 0 012.321 6.443c.593 1.709 3.295.973 2.689-.73-5.87-16.466-15.834-40.223-24.556-53.561a6.481 6.481 0 002.076-2.177c.551-.912-.816-2.086-1.589-1.215-4.275 4.818-10.746 2.247-13.315-2.798-2.074-4.073-.07-14.021 6.293-11.184a.507.507 0 00.373.047.483.483 0 00.345-.602.49.49 0 00-.231-.297c-5.283-3.346-10.818 3.451-9.711 10.214-.062-.061-.062-.122-.123-.122-2.759 8.239-4.08 16.236-10.873 22.916-13.635 13.412-38.489 21.1-51.195 37.142-12.226 23.732-21.769 53.417-15.698 79.512 3.181 13.675 9.283 20.484 9.344 20.545a.349.349 0 00.49 0 43.589 43.589 0 0125.959-12.158 111.265 111.265 0 006.169 39.757 88.315 88.315 0 009.957 21.215.726.726 0 00.978.242 41.92 41.92 0 0010.994-2.127c25.289-6.304 44.384-19.861 58.892-28.749z",
    fill: "#191919"
  })), _path18 || (_path18 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M207.385 196.317c9.477-10.234 5.848-24.686 17.225-33.748 1.461-1.163 3.062-2.249 4.581-3.283 8.43-10.887 9.53-28.022 9.712-32.947 1.516-.753 4.095-1.611 14.721-6.686a39.173 39.173 0 0018.264 4.254c7.695-.202 11.815-4.163 16.98-9.362.547-.551 1.332.176 1.039.79a19.585 19.585 0 01-8.313 8.509.657.657 0 00-.491.634.666.666 0 00.064.278c11.919 26.441 19.014 33.191 18.323 44.134-1.039 16.473-18.159 31.624-34.695 29.299-.794-.113-.975 1.213-.181 1.398a26.513 26.513 0 0020.156-4.137c.556 3.721 5.111 12.959 7.876 15.441a13.356 13.356 0 008.187 2.432c.792.064 1.589.12 2.322.12-1.801 17.092-17.687 29.152-36.587 26.104a.597.597 0 10-.307 1.153 32.104 32.104 0 0015.424.199 32.018 32.018 0 0013.72-7.013 32.562 32.562 0 0010.629-20.484c8.125 0 18.262-2.014 28.831-.366a138.504 138.504 0 0118.997 4.193c.794.244 1.339-1.019.549-1.336a80.346 80.346 0 00-29.076-6.315 145.114 145.114 0 00-20.583-80.787 143.58 143.58 0 00-22.235-28.762c1.781-9.09 3.063-25.842-4.216-32.224-6.104-5.352-13.982-.36-19.301 3.647a49.492 49.492 0 00-12.705 14.893c-9.285-4.681-20.401-3.049-29.686 1.641a4.393 4.393 0 00-1.054-2.34 4.43 4.43 0 00-2.184-1.361 7.813 7.813 0 00-6.658 1.276c-2.691 2.062-4.704 8.328-.794 10.091-9.285 9.058-15.212 23.404-12.339 36.291a.494.494 0 00.207.27.506.506 0 00.636-.079.498.498 0 00.135-.313 42.159 42.159 0 017.023-28.028 42.513 42.513 0 0123.457-17.015 35.168 35.168 0 0120.402 1.089c-1.223 2.127-2.37 4.324-3.483 6.505-5.069 9.94-9.894 20.423-9.773 31.73-17.426 7.494-22.301 8.391-39.092 13.616a.801.801 0 00-.573.672.782.782 0 00.168.583.791.791 0 00.842.27c1.713-.218 3.422-.608 5.072-.911-3.938 54.099-19.391 56.061-38.554 90.087 13.632-13.849 34.274-20.002 47.338-34.102zm-.611-101.394c-2.321-2.066-1.284-5.837.917-7.538 2.442-1.887 6.535-1.763 6.964 1.823a36.467 36.467 0 00-7.881 5.715zm34.634 5.53c3.741-7.712 7.572-15.926 13.499-22.247 14.183-15.121 26.083-14.244 26.571 6.384a70.278 70.278 0 01-1.405 15.622l-4.765 4.742c-11.3 7.416-23.775 12.665-36.088 18.174-1.895.847-3.787 1.702-5.741 2.493a80.534 80.534 0 017.929-25.168z",
    fill: "#191919"
  })), _path19 || (_path19 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M276.036 128.356a8.132 8.132 0 00-6.841-.303 6.522 6.522 0 00-2.343 1.948 6.48 6.48 0 00-1.199 2.795c-.188.788.995 1.347 1.405.607.897-1.62 1.594-3.205 3.483-3.769a12.434 12.434 0 015.13.242.84.84 0 00.713-.634.835.835 0 00-.348-.886zM408.779 236.317c-5.157-1.625-10.758-2.524-16.065-3.647-5.308-1.124-10.69-2.31-16.063-3.344.171-1.921.191-3.851.059-5.775a1.056 1.056 0 00-.488-.851 29.76 29.76 0 00-12.705-3.403c-.917-.013-.858 1.285 0 1.398a30.722 30.722 0 018.918 2.31c.741.346 1.772.607 2.137 1.398 1.829 3.185-1.671 13.638-3.848 18.289a.707.707 0 00.274.924.72.72 0 00.949-.195 30.48 30.48 0 004.459-12.097c5.436 1.215 10.939 2.195 16.369 3.281a139.062 139.062 0 0015.82 2.859c.731.068.79-.964.184-1.147z",
    fill: "#191919"
  })), _path20 || (_path20 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    d: "M465.024 302.012l-145.035 4.065a1.944 1.944 0 00-1.665 1.448 1.987 1.987 0 00-.047.779l2.645 59.23c.06.461.289.882.64 1.182.352.299.801.456 1.261.438l144.027-4.037a1.862 1.862 0 001.288-.592c.336-.36.519-.838.51-1.334l-1.682-59.461a1.753 1.753 0 00-.585-1.305 1.7 1.7 0 00-1.357-.413zm-92.578 55.46l-36.098 1.012a2.019 2.019 0 01-1.411-.543 2.055 2.055 0 01-.648-1.378c-.345-6.51-1.417-27.228-2.001-39.358a2.056 2.056 0 01.531-1.485 1.991 1.991 0 011.425-.648l36.258-1.016a1.994 1.994 0 011.43.539c.389.363.619.866.642 1.4.374 10.384 1.527 31.219 1.837 39.322a2.09 2.09 0 01-.54 1.49 2.044 2.044 0 01-1.425.665zm11.226-30.784c1.097-.776 2.44-.676 2.867.165a2.502 2.502 0 01-.025 1.69 2.46 2.46 0 01-1.095 1.277c-1.107.763-2.439.677-2.868-.165-.553-.84.005-2.175 1.121-2.967zm-.789 13.433a2.444 2.444 0 01.045-1.716 2.401 2.401 0 011.161-1.253c1.181-.767 2.562-.68 3.029.16a2.463 2.463 0 01-.051 1.715 2.417 2.417 0 01-1.157 1.253c-1.146.806-2.534.732-3.027-.159zm3.862 9.674c-1.182.767-2.562.68-3.029-.16a2.455 2.455 0 01.05-1.714 2.417 2.417 0 011.156-1.254c1.181-.767 2.561-.68 3.028.159.2.558.188 1.171-.035 1.72-.223.549-.64.994-1.17 1.249zm42.146-.936c-13.113 1.081-27.941 1.392-33.243.687-5.304-.748 1.026-2.231 14.145-3.332 13.118-1.102 27.941-1.392 33.243-.687 5.257.749-1.071 2.252-14.145 3.332zm-27.142-13.139c6.663-.938 14.284-1.008 17.007-.233 2.725.822-.5 2.216-7.209 3.138-6.666.92-14.284 1.008-17.008.231-2.723-.777.5-2.191 7.21-3.136zm27.068-8.057c-13.804 1.182-29.51 1.561-35.136.863-5.582-.699 1.107-2.232 14.903-3.393 13.804-1.198 29.511-1.561 35.136-.863 5.583.703-1.069 2.213-14.909 3.396l.006-.003zM466.774 271.459l-145.859 4.088c-.791.022-1.353 1.123-1.315 2.46l.355 12.565c.038 1.337.747 2.487 1.54 2.38l145.858-4.088c.791-.022 1.353-1.123 1.315-2.46l-.355-12.565c-.117-1.335-.745-2.402-1.539-2.38zm-1.653 10.45a1.415 1.415 0 01-.353.989 1.303 1.303 0 01-.42.31 1.243 1.243 0 01-.501.114l-139.46 3.909a1.256 1.256 0 01-.942-.373 1.416 1.416 0 01-.407-.967l-.094-3.3a1.384 1.384 0 01.352-.988c.119-.132.261-.237.419-.31.158-.073.328-.112.501-.115l139.46-3.909a1.284 1.284 0 01.942.373 1.398 1.398 0 01.409.967l.094 3.3z",
    fill: "#0167FF"
  })));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzEwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDcxMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik00MjMuMzU5IDExOS4xMTNDNDIzLjUyMiAxMjAuMTc4IDQyNC4wNjYgMTIxLjE0OSA0MjQuODkgMTIxLjg0N0M0MjMuNzI1IDEyMy4wMSA0MjIuODU3IDEyNC40MzQgNDIyLjM1NyAxMjUuOTk5QzQyMS44NTggMTI3LjU2NCA0MjEuNzQyIDEyOS4yMjUgNDIyLjAyIDEzMC44NDRDNDExLjQ1MyAxNDAuMTQ1IDQwMi41NzcgMTUxLjI5OSAzOTguNDQyIDE2NC41ODFDMzk4LjAyNCAxNjUuOTIyIDM5OS42NzEgMTY2LjU5NyA0MDAuNTc5IDE2NS44NTlDNDAyLjQzMiAxNjQuMyA0MDQuNjEyIDE2My4xNzUgNDA2Ljk1OSAxNjIuNTY0QzQwOS4zMDcgMTYxLjk1NCA0MTEuNzYyIDE2MS44NzQgNDE0LjE0NCAxNjIuMzMyQzQxOC4yMzUgMTYzLjIwMiA0MjEuNzg0IDE2NS40MTkgNDI1Ljc1IDE2Ni41ODhDNDMxLjk2MSAxNjguMjI0IDQzOC41NjcgMTY3LjQxOSA0NDQuMTk4IDE2NC4zMzlDNDQ0LjQxNyAxNjQuMzM5IDQ0My43NiAxNjMuOTA0IDQ1Ni4yMzEgMTc0LjczM0M0NTguNDgyIDE3MS40NDkgNDYxLjczNyAxNjguOTc2IDQ2NS41MTQgMTY3LjY4MUM0NjUuNTE0IDE2Ny42ODEgNDU2LjIzMSAxNjEuMTc4IDQ1MS41MjcgMTU3Ljk1NUM0NTUuMzEyIDE1Mi4yMDUgNDU1LjAwMyAxNDQuNTc0IDQ0NS43MjUgMTM2LjYxOEM0MzkuODY2IDEzMS41OTUgNDMzLjY0MiAxMjguMjY4IDQ0MC4xMDQgMTIwLjMyOEM0NDEuMDg5IDExOS4xMTcgNDM5LjQ5NCAxMTcuNDcxIDQzOC40NTUgMTE4LjQ0NEM0MzguMzUgMTE4LjQzNSA0MzguMjQ0IDExOC40NTUgNDM4LjE1MSAxMTguNTAzQzQzMy4yOTcgMTIxLjcyNiA0MjguNjI3IDEyNS4yMTUgNDI0LjE2MiAxMjguOTU0QzQyNC4wNzUgMTI2LjY4NiA0MjQuNzE3IDEyNC40NSA0MjUuOTk1IDEyMi41N0M0MjYuNjk3IDEyMi43MzIgNDI3LjQyOSAxMjIuNzExIDQyOC4xMiAxMjIuNTA5QzQyOC44MTIgMTIyLjMwOCA0MjkuNDM5IDEyMS45MzIgNDI5Ljk0MiAxMjEuNDE5QzQzMC40NDYgMTIwLjkwNiA0MzAuODA4IDEyMC4yNzMgNDMwLjk5MyAxMTkuNThDNDMxLjE3OSAxMTguODg3IDQzMS4xODIgMTE4LjE1OSA0MzEuMDAzIDExNy40NjRDNDMwLjAwMSAxMTMuMTQ5IDQyMi42MDQgMTE0LjE4NSA0MjMuMzU5IDExOS4xMTNaTTQ0OS4xMzYgMTQzLjg1M0M0NTAuMTgzIDE0NS4zNzMgNDUwLjg1NyAxNDcuMTE3IDQ1MS4xMDEgMTQ4Ljk0NEM0NTEuMzQ1IDE1MC43NzEgNDUxLjE1MyAxNTIuNjMgNDUwLjU0IDE1NC4zNjlDNDQ4LjY3NiAxNTIuNzc1IDQ0Ni43MTggMTUxLjI5MyA0NDQuNjc3IDE0OS45MzJDNDQyLjY2NCAxNDguNDI5IDQ0MC40NjggMTQ3LjE4NSA0MzguMTQyIDE0Ni4yMzFDNDM3LjQwNSAxNDUuOTM3IDQzNy4xMTEgMTQ3LjAwOCA0MzcuNjUyIDE0Ny4zODVDNDQxLjY5MyAxNTAuMjE1IDQ0NS4wNDIgMTU0LjMxNSA0NDkuMjU4IDE1Ni44NjlDNDQ3Ljk2NSAxNTguNzQ4IDQ0Ni4yNzYgMTYwLjMyMyA0NDQuMzA5IDE2MS40ODdDNDM3LjE2OCAxNjUuODcgNDI5LjQwOCAxNjUuNjc4IDQyMS44MzIgMTYyLjQ2QzQxOC4yMTYgMTYwLjYxOSA0MTQuMjI3IDE1OS42MjIgNDEwLjE2NiAxNTkuNTQyQzQxMi4wMjYgMTU0LjE5MiA0MTUuMTk1IDE0OS4zODggNDE5LjM4OCAxNDUuNTYyQzQxOS44NzggMTQ1LjA3NCA0MTkuMjEzIDE0NC4xMTIgNDE4LjU5NCAxNDQuNTg5QzQxMy43NjUgMTQ4LjMxMiA0MDguNDU1IDE1My41MTYgNDA3LjYgMTU5Ljg0N0M0MDUuNjMxIDE2MC4yMTMgNDAzLjczMyAxNjAuODkgNDAxLjk3OSAxNjEuODUzQzQwOC4wODggMTQ0Ljk1MyA0MjIuMzgxIDEzMi4wNjUgNDM2LjQzMSAxMjEuMjQ2QzQzMC4xMDggMTMyLjI1IDQ0NC4xNzIgMTM2LjA5NSA0NDkuMTM2IDE0My44NTNaIiBmaWxsPSIjMDE2N0ZGIi8+CjxwYXRoIGQ9Ik00MjEuMjIgMTA2LjY0OEM0MjEuMjk4IDEwNi44MjEgNDIxLjQyNiAxMDYuOTY2IDQyMS41ODggMTA3LjA2NkM0MjEuNzQ5IDEwNy4xNjYgNDIxLjkzNyAxMDcuMjE2IDQyMi4xMjcgMTA3LjIwOUM0MjIuMzE3IDEwNy4yMDMgNDIyLjUgMTA3LjE0IDQyMi42NTUgMTA3LjAyOUM0MjIuODA5IDEwNi45MTkgNDIyLjkyNiAxMDYuNzY1IDQyMi45OTIgMTA2LjU4N0M0MjQuMzE1IDEwMC43NDggNDI0Ljc4OCA5NC43NTAyIDQyNC4zOTcgODguNzc3MkM0MjQuMzUzIDg2LjIyMzIgNDIzLjY2NCA4MC44NzU5IDQxOS42OTMgODEuODQ2OUM0MTYuMjEyIDgyLjY5ODIgNDE2LjczNyA4OC40NzQ1IDQxNi45NDUgOTEuMDI2M0M0MTcuNjIgOTYuNDA4NyA0MTkuMDYgMTAxLjY2OCA0MjEuMjIgMTA2LjY0OFoiIGZpbGw9IiMwMTY3RkYiLz4KPHBhdGggZD0iTTQwMC42MjkgMTA5LjI2NUM0MDQuNjU2IDExMS43MDEgNDA5LjEyIDExMS44MTYgNDEzLjcwMSAxMTIuMDZINDEzLjc2MkM0MTQuMDUxIDExMi4wODYgNDE0LjM0MSAxMTIuMDEzIDQxNC41ODMgMTExLjg1NUM0MTQuODI2IDExMS42OTYgNDE1LjAwOCAxMTEuNDYxIDQxNS4xIDExMS4xODdDNDE1LjE5MiAxMTAuOTEzIDQxNS4xODggMTEwLjYxNiA0MTUuMDg5IDExMC4zNDRDNDE0Ljk5MSAxMTAuMDcyIDQxNC44MDMgMTA5Ljg0MSA0MTQuNTU2IDEwOS42ODlDNDEyLjAwMyAxMDguMDgzIDQwOS42NjQgMTA2LjE2MyA0MDcuNTkyIDEwMy45NzZDNDA2LjMxNSAxMDIuNDUxIDQwNC44NTkgMTAxLjA4NCA0MDMuMjU2IDk5LjkwMjJDNDAwLjkxNyA5OC41MzI3IDM5Ny4zOTcgOTguNTY3NiAzOTYuMzU0IDEwMS40ODNDMzk1LjE5OCAxMDQuNzA3IDM5OC4xMjQgMTA3Ljc0NyA0MDAuNjI5IDEwOS4yNjVaIiBmaWxsPSIjMDE2N0ZGIi8+CjxwYXRoIGQ9Ik00MDMuMzE3IDEzMC45NjVDNDA1Ljk1OCAxMjcuNTg4IDQwOS43NDcgMTIwLjg2MiA0MTMuNTE2IDExOS4yOTJDNDE0LjczMSAxMTguNzkgNDE0LjMxMSAxMTYuODYzIDQxMi45NjcgMTE3LjI4N0M0MDguOTgxIDExOC40NDcgNDA1LjMwNyAxMjAuNDgzIDQwMi4yMTYgMTIzLjI0NEM0MDAuMjgyIDEyNS4wODggMzk3LjQzMiAxMjguNDcgMzk4LjQ5NyAxMzEuMzg5QzM5OS41MSAxMzQuMTk0IDQwMi4wODUgMTMyLjUzOSA0MDMuMzE3IDEzMC45NjVaIiBmaWxsPSIjMDE2N0ZGIi8+CjxwYXRoIGQ9Ik00NDYuNDM2IDI5My4wODlDNDQ2LjMxOCAyOTIuMDAxIDQ0Ni40MzYgMjkxLjI1NCA0NDUuNDU4IDI5MC43NzlDNDQzLjg4NiAyOTAuNDcxIDQ0Mi4yNzIgMjkwLjQ1IDQ0MC42OTMgMjkwLjcxOEM0MjkuNDUyIDI5MC44NCA0MTguMjE1IDI5MS4zMjYgNDA2Ljk3NiAyOTEuNzVDNDA0LjgxNyAyODguODg1IDM2NS41NTYgMjM5Ljc0NiAzNTcuMTk0IDIzMS4yNjhDMzU4LjA2MyAyMzAuMzQ5IDM1OC41MzcgMjI5LjEyOSAzNTguNTE0IDIyNy44NjhDMzU4LjQ5MSAyMjYuNjA3IDM1Ny45NzQgMjI1LjQwNSAzNTcuMDcyIDIyNC41MThDMzU0LjA0IDIyMS42MzggMzQ3LjAwOCAyMjEuMjM5IDM0NS43NzIgMjI2LjI4QzM0NS41MzEgMjI3LjMwOCAzNDUuNTc0IDIyOC4zODIgMzQ1Ljg5NyAyMjkuMzg4QzM0Ni4yMTkgMjMwLjM5NCAzNDYuODA5IDIzMS4yOTUgMzQ3LjYwMyAyMzEuOTk1QzMzNi43MyAyNDMuNTk4IDMyMi4yOSAyNjEuODI0IDMwNi40MzUgMjgxLjkwMkMzMDIuNjQ1IDI4Ni42OTIgMjk4LjQ5MyAyOTEuMzg0IDI5NS4xOTQgMjk2LjQ5QzI4OC41OTcgMjk2Ljc5NSAyODIuMDAxIDI5Ny4xNzggMjc1LjQwNSAyOTcuNTc5QzI3My4xOTIgMjk3LjU1NyAyNzAuOTgzIDI5Ny43NDcgMjY4LjgwNiAyOTguMTQ1QzI2Ni45NzUgMjk4LjYzIDI2Ni44NyAzMDAuNDU3IDI2Ni42NjkgMzAyLjE1OEMyNjQuNjM2IDMxOS4zNTggMjY3LjI5NyAzOTUuNDgyIDI3MC42NCA0MjQuNTIxQzI3MC42NDQgNDI0Ljc3IDI3MC43MyA0MjUuMDExIDI3MC44ODQgNDI1LjIwN0MyNzEuMDM5IDQyNS40MDQgMjcxLjI1MyA0MjUuNTQ1IDI3MS40OTUgNDI1LjYwOUMyODYuNzcgNDI4LjMxNiAzMDIuMzM1IDQyOS4wMzIgMzE3Ljc5NiA0MjcuNzM2QzMxOC44MzMgNDI3LjY2NyAzMTguODkgNDI2LjA0NyAzMTcuNzk2IDQyNi4wOTVDMzAyLjc2MiA0MjYuODIxIDI4Ny42OTIgNDI1Ljk2NSAyNzIuODM5IDQyMy41NDNDMjY4LjYxNiAzODEuMzY3IDI2Ny4xNSAzMDguNzMzIDI2OS4yOTYgMzAwLjMyNEMyNzAuNDI1IDMwMC4zMjQgMjcxLjIxNSAzMDAuMTUyIDI3Mi4yMjggMzAwLjA4QzI3NS41MjcgMjk5Ljg1IDQ0My44MDggMjkyLjkwOSA0NDQuMjM3IDI5Mi45MDlDNDQzLjc2IDI5NC44MDEgNDUwLjU4MiAzNDIuNjM4IDQ0OS45MjUgNDE3LjE1OUM0MTYuNjkgNDIxLjY4NCAzOTUuMjMgNDIwLjY5MSAzNzQuODU1IDQyMy41NDNDMzczLjk5OSA0MjMuNjYzIDM3NC4xODMgNDI1LjA2NyAzNzUuMDM4IDQyNS4wNjdDNDAwLjQ0OCA0MjMuNjA2IDQyNS45ODggNDIyLjYzMyA0NTEuMjA3IDQxOS4xMDhDNDUxLjQzMiA0MTkuMDQxIDQ1MS42MjkgNDE4LjkwNSA0NTEuNzcyIDQxOC43MkM0NTEuOTE1IDQxOC41MzQgNDUxLjk5NSA0MTguMzA5IDQ1Mi4wMDIgNDE4LjA3NkM0NTIuMjc0IDM3Ni4zNDcgNDUwLjQxNyAzMzQuNjMxIDQ0Ni40MzYgMjkzLjA4OVpNMjk3LjM5NSAyOTYuMzdDMzAwLjk1NCAyOTIuMjk1IDMzMi4xNTUgMjUwLjkzMyAzNDguMzk3IDIzMi42NjVDMzQ5LjU3NCAyMzMuMzk2IDM1MC45NDggMjMzLjc1MyAzNTIuMzM0IDIzMy42ODhDMzUzLjcyIDIzMy42MjIgMzU1LjA1MyAyMzMuMTM4IDM1Ni4xNTUgMjMyLjNDMzU2LjE1NSAyMzIuMyA0MDIuMzk1IDI4OS4wMTYgNDA0Ljk1OSAyOTEuODcyQzM5My43ODEgMjkyLjI5OSAzMjIuMDcxIDI5NS4xNTUgMjk3LjM5NSAyOTYuMzdaIiBmaWxsPSIjMjgyODI4Ii8+CjxwYXRoIGQ9Ik01MjEuNzU1IDIxMC43MkM1MjEuMjE1IDIwOS4wMTUgNTE1LjY0NyAyMDUuMTg3IDUxMi40MDkgMjAzLjA2QzUxMC45OTggMjAyLjE0MyA1MDkuMzAyIDIwMS43NjEgNTA3LjYzMiAyMDEuOTg0QzUwNS45NjEgMjAyLjIwOCA1MDQuNDI3IDIwMy4wMjIgNTAzLjMxIDIwNC4yNzdMNTAyLjE0OCAyMDUuNjE0QzUwMS43OTEgMjA2LjAwNSA1MDEuNTk0IDIwNi41MTQgNTAxLjU5NCAyMDcuMDQyQzUwMS41OTQgMjA3LjU3MSA1MDEuNzkxIDIwOC4wOCA1MDIuMTQ4IDIwOC40NzFDNTA0LjExNyAyMTAuNjkyIDUxMi4yOTUgMjE5Ljg5OSA1MTUuMjc1IDIxOS44OTlDNTE4Ljc2OSAyMTkuODk5IDUyMi41NDEgMjEzLjE5MyA1MjEuNzU1IDIxMC43MloiIGZpbGw9IiMwMTY3RkYiLz4KPHBhdGggZD0iTTQzMy43NCAxNDEuNzg2QzQzMy41NCAxNDEuNzM4IDQzMy4zMzIgMTQxLjcyOSA0MzMuMTI4IDE0MS43NjFDNDMyLjkyNCAxNDEuNzkzIDQzMi43MjkgMTQxLjg2NCA0MzIuNTUzIDE0MS45NzJDNDMyLjM3NyAxNDIuMDc5IDQzMi4yMjQgMTQyLjIyIDQzMi4xMDMgMTQyLjM4NkM0MzEuOTgyIDE0Mi41NTIgNDMxLjg5NSAxNDIuNzQxIDQzMS44NDggMTQyLjk0QzQzMS44MDIgMTQzLjEyIDQzMS43OTMgMTQzLjMwNyA0MzEuODIgMTQzLjQ5MUM0MzEuODQ4IDE0My42NzQgNDMxLjkxMiAxNDMuODUgNDMyLjAwOCAxNDQuMDA5QzQzMi4xMDUgMTQ0LjE2NyA0MzIuMjMzIDE0NC4zMDUgNDMyLjM4NCAxNDQuNDE0QzQzMi41MzQgMTQ0LjUyMyA0MzIuNzA2IDE0NC42MDEgNDMyLjg4NyAxNDQuNjQzQzQzMy4wNzYgMTQ0LjY5OSA0MzMuMjczIDE0NC43MTcgNDMzLjQ2OSAxNDQuNjk3QzQzMy42NjQgMTQ0LjY3NiA0MzMuODU0IDE0NC42MTggNDM0LjAyNyAxNDQuNTI1QzQzNC4yIDE0NC40MzIgNDM0LjM1MyAxNDQuMzA1IDQzNC40NzYgMTQ0LjE1NEM0MzQuNiAxNDQuMDAyIDQzNC42OTMgMTQzLjgyNyA0MzQuNzQ5IDE0My42MzlDNDM0LjgwNSAxNDMuNDUyIDQzNC44MjMgMTQzLjI1NSA0MzQuODAzIDE0My4wNkM0MzQuNzgzIDE0Mi44NjYgNDM0LjcyNCAxNDIuNjc3IDQzNC42MyAxNDIuNTA1QzQzNC41MzcgMTQyLjMzMyA0MzQuNDEgMTQyLjE4MSA0MzQuMjU3IDE0Mi4wNThDNDM0LjEwNCAxNDEuOTM0IDQzMy45MjkgMTQxLjg0MiA0MzMuNzQgMTQxLjc4NloiIGZpbGw9IiMwMTY3RkYiLz4KPHBhdGggZD0iTTI3Ni43IDMwNi41OEMyNzkuMDAyIDMwNi40MzcgMjgxLjMxMiAzMDYuNDk4IDI4My42MDMgMzA2Ljc2M0MyODQuNzYyIDMwNi43NzggMjg0LjY5NiAzMDUuMDczIDI4My42MDMgMzA0Ljk5OUMyNzYuMzMgMzA0LjUxMSAyNzQuOTQxIDMwNC4wMzUgMjczLjg5MSAzMDQuNjk0QzI3Mi44NDEgMzA1LjM1NCAyNzIuODUyIDMwNi41OCAyNzIuNzk3IDMwNy42NzNDMjcyLjc5NyAzMDkuMjU0IDI3My4wMzggMzI2LjUxNyAyNzMuMTY0IDMzMy41MDhDMjczLjQ4NiAzNTEuNDMyIDI3NC4zMiAzOTkuMzYyIDI3Ny45ODkgNDE3LjQ1OEMyNzguMTYxIDQxOC4zMDkgMjc5LjQwNiA0MTcuOTQxIDI3OS4yNzMgNDE3LjA5MkMyNzYuMDQ0IDM5Ni42MjUgMjc0Ljc2MiAzMDguMDggMjc0Ljg3MyAzMDcuNjczQzI3NS4yMDEgMzA2LjQ2NSAyNzUuNTQ1IDMwNi43ODkgMjc2LjcgMzA2LjU4WiIgZmlsbD0iIzAxNjdGRiIvPgo8cGF0aCBkPSJNNDM2Ljk2NyA0MTIuMjMyQzQzMy40NzcgNDEyLjUxNSA0MDkuMjk4IDQxNC42NyA0MDAuNjg0IDQxNS4zOTFDMzk0LjgyMSA0MTUuODgzIDM4OC44OTYgNDE2LjkxNSAzODMuMDMxIDQxNi45NzJDMzgyLjg4MyA0MTYuOTgxIDM4Mi43NDQgNDE3LjA0NSAzODIuNjQyIDQxNy4xNTNDMzgyLjU0MSA0MTcuMjYgMzgyLjQ4NCA0MTcuNDAyIDM4Mi40ODQgNDE3LjU1QzM4Mi40ODQgNDE3LjY5NyAzODIuNTQxIDQxNy44MzkgMzgyLjY0MiA0MTcuOTQ2QzM4Mi43NDQgNDE4LjA1NCAzODIuODgzIDQxOC4xMTkgMzgzLjAzMSA0MTguMTI4QzM5Ni40NzUgNDE4LjE1NiA0MTYuMTYzIDQxNi4zODYgNDM2Ljc4MyA0MTQuNDI2QzQzOC44OTQgNDE0LjM1OCA0NDAuOTk3IDQxNC4xMzQgNDQzLjA3NSA0MTMuNzU4QzQ0NS40MDEgNDEzLjE2NCA0NDQuOTUzIDQxMS4wODIgNDQ0Ljk3IDQwOS4xMzhDNDQ1LjAwMSA0MDUuNDg5IDQ0NS4yMTMgMzgzLjA1OCA0NDUuMjEzIDM3NS40NkM0NDUuMjEzIDM3NS4xOTQgNDQ1LjEwNyAzNzQuOTM5IDQ0NC45MTggMzc0Ljc1MUM0NDQuNzI5IDM3NC41NjMgNDQ0LjQ3MyAzNzQuNDU3IDQ0NC4yMDUgMzc0LjQ1N0M0NDMuOTM4IDM3NC40NTcgNDQzLjY4MiAzNzQuNTYzIDQ0My40OTMgMzc0Ljc1MUM0NDMuMzA0IDM3NC45MzkgNDQzLjE5OCAzNzUuMTk0IDQ0My4xOTggMzc1LjQ2QzQ0My4xOTggMzgxLjQ3OCA0NDIuODYxIDQwMS43MiA0NDIuODMgNDA1Ljg1NEM0NDIuODMgNDA2Ljg4OSA0NDMuMzggNDEwLjk2IDQ0Mi42NDkgNDExLjYyOUM0NDEuODU3IDQxMi4zNTEgNDM4LjAwOCA0MTIuMTQ3IDQzNi45NjcgNDEyLjIzMloiIGZpbGw9IiMwMTY3RkYiLz4KPHBhdGggZD0iTTUwNC44NDMgMjgxLjU5M0M0ODguNjI3IDI5OS4xMzMgNDcyLjQzNyAzMTYuNzIxIDQ1Ni4yNzQgMzM0LjM1N0M0NTUuNzc3IDMzNC44OTcgNDU2LjU3OCAzMzUuNjk0IDQ1Ny4wNjggMzM1LjE0OEM0NzQuMTA5IDMxOC40MyA0OTAuNTk2IDMwMC45OTEgNTA1Ljk5NCAyODIuNzQ3QzUwNi42NzIgMjgxLjk1NyA1MDUuNTc0IDI4MC44MDMgNTA0Ljg0MyAyODEuNTkzWiIgZmlsbD0iIzAxNjdGRiIvPgo8cGF0aCBkPSJNNDg2Ljk0MSAzMjEuOTZDNDgwLjg4MyAzMjYuODg1IDQ3NS44ODYgMzMzLjA4MyA0NzAuMzI3IDMzOC40OTRDNDY5Ljc3MSAzMzkuMDM2IDQ3MC41OCAzMzkuODQ0IDQ3MS4xODIgMzM5LjM0NUM0NzcuMTM0IDMzNC4yNjYgNDgyLjc2NSAzMjguODI2IDQ4OC4wNDEgMzIzLjA1NUM0ODguMTY3IDMyMi45MDYgNDg4LjIzMiAzMjIuNzE2IDQ4OC4yMjQgMzIyLjUyMUM0ODguMjE2IDMyMi4zMjcgNDg4LjEzNCAzMjIuMTQzIDQ4Ny45OTYgMzIyLjAwNUM0ODcuODU4IDMyMS44NjcgNDg3LjY3MyAzMjEuNzg2IDQ4Ny40NzcgMzIxLjc3OEM0ODcuMjgyIDMyMS43NyA0ODcuMDkxIDMyMS44MzUgNDg2Ljk0MSAzMjEuOTZaIiBmaWxsPSIjMDE2N0ZGIi8+CjxwYXRoIGQ9Ik0yMzIuMTY1IDMwOS42MThDMjMyLjY2NiAzMDkuMDE5IDIzMS45NzkgMzA3LjkxMSAyMzEuMjQ5IDMwOC40NjJDMjIxLjQ5NSAzMTUuODI1IDIxMi45MDYgMzI1LjA5OCAyMDQuMDY3IDMzMy40NDZDMTk0Ljg3OCAzNDIuMTE4IDE4NS42ODkgMzUwLjc4NiAxNzYuNzYzIDM1OS43MDZDMTc2LjcwNyAzNTkuNzU3IDE3Ni42NjEgMzU5LjgxOSAxNzYuNjI5IDM1OS44ODhDMTc2LjU5OCAzNTkuOTU3IDE3Ni41OCAzNjAuMDMxIDE3Ni41NzggMzYwLjEwN0MxNzYuNTc2IDM2MC4xODMgMTc2LjU5IDM2MC4yNTggMTc2LjYxOCAzNjAuMzI5QzE3Ni42NDcgMzYwLjM5OSAxNzYuNjg5IDM2MC40NjMgMTc2Ljc0MyAzNjAuNTE3QzE3Ni43OTcgMzYwLjU3IDE3Ni44NjEgMzYwLjYxMiAxNzYuOTMyIDM2MC42NDFDMTc3LjAwMiAzNjAuNjY5IDE3Ny4wNzggMzYwLjY4MiAxNzcuMTU0IDM2MC42OEMxNzcuMjMxIDM2MC42NzggMTc3LjMwNiAzNjAuNjYxIDE3Ny4zNzUgMzYwLjYzQzE3Ny40NDQgMzYwLjU5OCAxNzcuNTA2IDM2MC41NTMgMTc3LjU1NyAzNjAuNDk2QzE4OC4xODggMzUxLjEzNCAyMDcuOTUzIDMzMi43MjUgMjE4LjI5OSAzMjMuMDQ3QzIyMy4xODUgMzE4Ljg0OSAyMjcuODE1IDMxNC4zNjQgMjMyLjE2NSAzMDkuNjE4WiIgZmlsbD0iIzAxNjdGRiIvPgo8cGF0aCBkPSJNMjQ4LjUzMyAzMDguNTI0QzIzNy43MDQgMzE4Ljk3NSAyMjYuNjk5IDMyOS4yODIgMjE1LjkxNSAzMzkuODMxQzIxNS4yMzcgMzQwLjQ4NCAyMTYuMjIxIDM0MS40MTEgMjE2Ljk1NCAzNDAuODYzQzIyOC4zNDYgMzMwLjk3NSAyMzkuMTc0IDMyMC40NjMgMjQ5LjM4OSAzMDkuMzc1QzI0OS44MTUgMzA4Ljc2OCAyNDkuMDkxIDMwNy45ODYgMjQ4LjUzMyAzMDguNTI0WiIgZmlsbD0iIzAxNjdGRiIvPgo8cGF0aCBkPSJNMjM4LjEgMjA1LjQ4OUMyNDEuOTM4IDIwNC42MzUgMjQ1LjUxNSAyMDIuODg0IDI0OC41MzggMjAwLjM4MUMyNDguNzI4IDIwMC4yNjMgMjQ4Ljg5IDIwMC4xMDUgMjQ5LjAxMSAxOTkuOTE4QzI0OS4xMzIgMTk5LjczMSAyNDkuMjEgMTk5LjUxOSAyNDkuMjM5IDE5OS4yOThDMjQ5LjI2OSAxOTkuMDc3IDI0OS4yNDggMTk4Ljg1MyAyNDkuMTggMTk4LjY0MUMyNDkuMTEyIDE5OC40MjggMjQ4Ljk5NyAxOTguMjM0IDI0OC44NDQgMTk4LjA3MUMyNDQuOTQgMTkzLjU0NCAyNDAuODAxIDE4OS4yMjIgMjM2LjQ0NCAxODUuMTIzQzIzNS43MDIgMTg0LjQ3IDIzNC4zNjEgMTg1LjMxIDIzNC45NzggMTg2LjIxMUMyMzguMjEgMTkwLjYyMSAyNDEuNzE3IDE5NC44MjMgMjQ1LjQ4IDE5OC43OTRDMjQyLjc5MyAyMDAuNDk3IDIzOS45MjkgMjAxLjkwNSAyMzcuMjM0IDIwMy41ODRDMjM2LjI2MiAyMDQuMjE1IDIzNy4wMDYgMjA1LjY3NiAyMzguMSAyMDUuNDg5WiIgZmlsbD0iIzE5MTkxOSIvPgo8cGF0aCBkPSJNMjIxLjgzMSAxOTMuMDkxQzIyMy4yODIgMTkxLjc5NiAyMjIuMjAzIDE4OS42MjMgMjIxLjI4MiAxODguNDEyQzIyMC4zMTEgMTg3LjEzMiAyMTkuMzI5IDE4NS41NTMgMjE3LjU2MyAxODUuNDM0QzIxNS4zMTYgMTg1LjQzNCAyMTUuOTcyIDE4OS42NjQgMjE3LjQ0IDE5MS41NzFDMjE4LjM5NyAxOTIuODA4IDIyMC4yMjYgMTk0LjUzIDIyMS44MzEgMTkzLjA5MVoiIGZpbGw9IiMxOTE5MTkiLz4KPHBhdGggZD0iTTIzOS40MzMgMTc0LjczQzIzNS42ODMgMTc0LjczIDI0MC4wMyAxODUuNjggMjQzLjY0OCAxODIuNDUxQzI0NS4wOTcgMTgxLjE1NiAyNDMuOTg1IDE3OS4wMDQgMjQzLjA5NyAxNzcuNzdDMjQyLjE1MiAxNzYuNDUzIDI0MS4xNDMgMTc0LjkwNyAyMzkuNDMzIDE3NC43M1oiIGZpbGw9IiMxOTE5MTkiLz4KPHBhdGggZD0iTTIxOC4zNjEgMTc5LjM1QzIxOC40NzYgMTc5LjMxNSAyMTguNTggMTc5LjI1MiAyMTguNjYzIDE3OS4xNjVDMjE4Ljc0NyAxNzkuMDc5IDIxOC44MDcgMTc4Ljk3MyAyMTguODM3IDE3OC44NTdDMjE4Ljg2OCAxNzguNzQxIDIxOC44NjkgMTc4LjYyIDIxOC44MzkgMTc4LjUwNEMyMTguODA5IDE3OC4zODggMjE4Ljc1IDE3OC4yODEgMjE4LjY2NyAxNzguMTk0QzIxNy41MDMgMTc3LjQ5IDIxNi4xNjMgMTc3LjEyOCAyMTQuODAxIDE3Ny4xNDlDMjEzLjQzOSAxNzcuMTcxIDIxMi4xMTEgMTc3LjU3NSAyMTAuOTcgMTc4LjMxNkMyMDkuOTg1IDE3OS4xMiAyMDkuMjA1IDE4MC4xNDUgMjA4LjY5NSAxODEuMzA4QzIwOC4xODUgMTgyLjQ3IDIwNy45NiAxODMuNzM3IDIwOC4wMzkgMTg1LjAwM0MyMDguMDQ2IDE4NS4xNDkgMjA4LjA5OSAxODUuMjg5IDIwOC4xOSAxODUuNDA0QzIwOC4yODIgMTg1LjUxOSAyMDguNDA3IDE4NS42MDIgMjA4LjU0OCAxODUuNjQyQzIwOC42OSAxODUuNjgzIDIwOC44NCAxODUuNjc4IDIwOC45NzkgMTg1LjYyOUMyMDkuMTE3IDE4NS41OCAyMDkuMjM3IDE4NS40ODkgMjA5LjMyMSAxODUuMzY4QzIxMC4yMzcgMTgzLjcyNyAyMTAuNDk4IDE4MS43NDEgMjEyLjAwNyAxODAuNTA0QzIxMy45ODUgMTc4Ljg4OSAyMTYuMTYgMTc5LjYzOCAyMTguMzYxIDE3OS4zNVoiIGZpbGw9IiMxOTE5MTkiLz4KPHBhdGggZD0iTTIzMS41NTMgMjE1LjMzNkMyMzIuNTk1IDIyMC4zMDYgMjM2LjUwMiAyMjguOTcgMjQyLjc5MiAyMjguMzk5QzI1MC4wMTIgMjI3Ljc0NiAyNDguMzU4IDIxNy43NTkgMjQ3LjkyMyAyMTIuODk3QzI0Ny45MTYgMjEyLjc0NCAyNDcuODc1IDIxMi41OTUgMjQ3LjgwNCAyMTIuNDZDMjQ3LjczMiAyMTIuMzI0IDI0Ny42MzIgMjEyLjIwNiAyNDcuNTEgMjEyLjExM0MyNDcuMzg4IDIxMi4wMiAyNDcuMjQ2IDIxMS45NTUgMjQ3LjA5NiAyMTEuOTIzQzI0Ni45NDYgMjExLjg5IDI0Ni43OTEgMjExLjg5IDI0Ni42NDEgMjExLjkyNEMyNDEuNzczIDIxMi40OTQgMjM2Ljk0MSAyMTMuMzI2IDIzMi4xNjQgMjE0LjQxN0MyMzIuMDU5IDIxNC40MjkgMjMxLjk1OCAyMTQuNDYzIDIzMS44NjggMjE0LjUxOEMyMzEuNzc4IDIxNC41NzMgMjMxLjcwMSAyMTQuNjQ3IDIzMS42NDMgMjE0LjczNUMyMzEuNTg1IDIxNC44MjIgMjMxLjU0NyAyMTQuOTIxIDIzMS41MzEgMjE1LjAyNUMyMzEuNTE2IDIxNS4xMjkgMjMxLjUyMyAyMTUuMjM1IDIzMS41NTMgMjE1LjMzNlpNMjQ2LjAyOCAyMTQuMTIxQzI0Ni41MTggMjE4LjQzNiAyNDcuNDM1IDIyNi40NTkgMjQyLjI0MSAyMjYuNTJDMjM3LjE3MiAyMjYuNTgxIDIzNC43MjggMjE5LjgzNCAyMzMuMjcxIDIxNS42OTlDMjM3LjU3IDIxNS42NTYgMjQxLjg1IDIxNS4xMjcgMjQ2LjAyOCAyMTQuMTIxWiIgZmlsbD0iIzE5MTkxOSIvPgo8cGF0aCBkPSJNNDU4LjcyMiAyMDEuOTA0QzQ1OS40NTcgMjAwLjI2MiA0NTkuNjQzIDE5OS44OTcgNDU4Ljg0NSAxOTguMzc3QzQ1Ny4yNTggMTk1LjUwOSA0NTYuNTA0IDE5Mi4yNTggNDU2LjY2NiAxODguOTg4QzQ1Ni44MjggMTg1LjcxNyA0NTcuOTAxIDE4Mi41NTYgNDU5Ljc2NCAxNzkuODU4QzQ2MS42MjcgMTc3LjE1OSA0NjQuMjA3IDE3NS4wMjkgNDY3LjIxNiAxNzMuNzA1QzQ3MC4yMjUgMTcyLjM4MSA0NzMuNTQ1IDE3MS45MTYgNDc2LjgwNSAxNzIuMzYxQzQ3Ny43ODMgMTcyLjQ3IDQ3Ny45NjQgMTcwLjgzNyA0NzcuMDQ3IDE3MC42NThDNDczLjQ3NyAxNjkuOTcgNDY5Ljc4NCAxNzAuMjkxIDQ2Ni4zODggMTcxLjU4NkM0NjIuOTkxIDE3Mi44ODEgNDYwLjAyOCAxNzUuMDk3IDQ1Ny44MzMgMTc3Ljk4NEM0NTUuNjM5IDE4MC44NyA0NTQuMzAyIDE4NC4zMTEgNDUzLjk3MyAxODcuOTE2QzQ1My42NDQgMTkxLjUyMSA0NTQuMzM4IDE5NS4xNDUgNDU1Ljk3NCAxOTguMzc3QzQ1Ni44NjkgMjAwLjExOSA0NTYuNTE5IDIwMC42ODUgNDU1LjY2OCAyMDIuNTE0QzQ0Ny45MjUgMjE5LjE1IDQyNy45NjYgMjM5LjMyMyA0MDIuMDk5IDI2OC4wNUM0MDEuNTUyIDI2OC42NTkgNDAyLjM5NSAyNjkuNDk4IDQwMi45NTUgMjY4LjkwMUM0MTguMjQ3IDI1Mi42MjIgNDQ5LjcyNCAyMjIuMDE4IDQ1OC43MjIgMjAxLjkwNFoiIGZpbGw9IiMxOTE5MTkiLz4KPHBhdGggZD0iTTQ3NC40MTggMTkwLjE3M0M0NzQuNTM3IDE5MS4wMjUgNDc1Ljg5MyAxOTAuNzgxIDQ3NS44ODQgMTg5Ljk5M0M0NzUuODA5IDE4Ny41MiA0NzYuMjcyIDE4NS4wNjEgNDc3LjI0MiAxODIuNzg0QzQ3OC4yMTEgMTgwLjUwNyA0NzkuNjY1IDE3OC40NjYgNDgxLjUwMyAxNzYuOEM0ODUuNzY0IDE3My4xMzYgNDkwLjkxIDE3Mi45MDMgNDk2LjIyNCAxNzMuMzM2QzQ5Ni4zOTYgMTczLjMzMiA0OTYuNTYyIDE3My4yNzIgNDk2LjY5NiAxNzMuMTY2QzQ5Ni44MyAxNzMuMDU5IDQ5Ni45MjUgMTcyLjkxMSA0OTYuOTY2IDE3Mi43NDZDNDk3LjAwOCAxNzIuNTggNDk2Ljk5MyAxNzIuNDA1IDQ5Ni45MjUgMTcyLjI0OEM0OTYuODU3IDE3Mi4wOTIgNDk2LjczOSAxNzEuOTYxIDQ5Ni41OSAxNzEuODc4QzQ4Ni45NzIgMTY3LjE5OSA0NzIuNDMyIDE3Ni4wNDUgNDc0LjQxOCAxOTAuMTczWiIgZmlsbD0iIzE5MTkxOSIvPgo8cGF0aCBkPSJNNDg2Ljg3NSAxODMuMTIyQzQ4NC43NjcgMTg0Ljk0MSA0ODMuMjIzIDE4Ny4zMiA0ODIuNDIzIDE4OS45OEM0ODEuNjIyIDE5Mi42NCA0ODEuNTk5IDE5NS40NzIgNDgyLjM1NSAxOTguMTQ1QzQ4Mi41NTIgMTk4Ljc5OCA0ODMuNzA1IDE5OC43NTIgNDgzLjYzNyAxOTcuOTYyQzQ4My4zMDMgMTk1LjU5NyA0ODMuNTMyIDE5My4xODggNDg0LjMwNyAxOTAuOTI4QzQ4NS4wODIgMTg4LjY2NyA0ODYuMzgxIDE4Ni42MjEgNDg4LjA5OCAxODQuOTUzQzQ5Mi40MTkgMTgxLjEwNiA0OTcuMDY4IDE4MS44NjMgNTAyLjMxOSAxODIuMzRDNTAzLjExMSAxODIuNDEyIDUwMy4xNzkgMTgxLjM2IDUwMi42ODQgMTgxLjAwM0M0OTguMTYyIDE3Ny43MDcgNDkwLjgzNyAxNzkuNzY3IDQ4Ni44NzUgMTgzLjEyMloiIGZpbGw9IiMxOTE5MTkiLz4KPHBhdGggZD0iTTUwOS41MzkgMTkxLjM4OEM1MTAuMjEzIDE5MS40NDMgNTEwLjM5NSAxOTAuNDc2IDUwOS44NDUgMTkwLjE3MUM1MDMuMTg4IDE4NS43MzQgNDkzLjg3NCAxOTEuNTgyIDQ5MS41MiAxOTguMTM2QzQ5MS4yOCAxOTguODA0IDQ5Mi4zMTkgMTk5LjE3IDQ5Mi42MTQgMTk4LjYyMUM0OTQuMzA3IDE5NS41MjIgNDk3LjA1OCAxOTMuMTI4IDUwMC4zNyAxOTEuODcyQzUwMy4zNSAxOTEuMDIzIDUwNi40ODUgMTkwLjg1OCA1MDkuNTM5IDE5MS4zODhaIiBmaWxsPSIjMTkxOTE5Ii8+CjxwYXRoIGQ9Ik01MTQuNzI2IDE5OC42ODVDNTE0LjA3OSAxOTcuNDkxIDUxMy4wNjkgMTk2LjUzIDUxMS44NCAxOTUuOTRDNTEwLjYxMiAxOTUuMzUxIDUwOS4yMjcgMTk1LjE2MiA1MDcuODg1IDE5NS40MDJDNTA0Ljg2MyAxOTYuMTk2IDUwMi4yNzUgMTk4LjEzOSA1MDAuNjc4IDIwMC44MTNDNTAwLjI1NiAyMDEuMzYzIDUwMS4xNzcgMjAyLjEwMiA1MDEuNjU2IDIwMS42MDNDNTA0LjI4MiAxOTguODY2IDUwOS45OTQgMTk1LjA4OSA1MTIuNzcyIDE5OS45QzUxMy40ODEgMjAxLjEzIDUxNS4zNzQgMTk5Ljk3NCA1MTQuNzI2IDE5OC42ODVaIiBmaWxsPSIjMTkxOTE5Ii8+CjxwYXRoIGQ9Ik00OTQuNTc4IDIxNC41NDZDNDg0LjM2NSAyMzMuMzc1IDQ4Ny4xNTUgMjI5LjM1MiA0NzMuNjg5IDI0OC40NjZDNDYxLjMyNyAyNjYuMDE3IDQ1MS42NTcgMjc0LjA0IDQ0NC45MTkgMjgyLjc0OUM0NDQuMzA2IDI4My41NCA0NDUuNTkzIDI4NC4zMzQgNDQ2LjI2MiAyODMuNzg0QzQ1Mi4wMjQgMjc4LjY5MyA0NTcuMzM3IDI3My4xMjEgNDYyLjE0MyAyNjcuMTI3QzQ3NS44MjYgMjUxLjUxNSA0ODcuMDg3IDIzMy45NTYgNDk1LjU1NiAyMTUuMDMyQzQ5NS42MTMgMjE0LjkwNCA0OTUuNjE5IDIxNC43NTggNDk1LjU3MSAyMTQuNjI2QzQ5NS41MjQgMjE0LjQ5NCA0OTUuNDI3IDIxNC4zODYgNDk1LjMwMSAyMTQuMzIzQzQ5NS4xNzQgMjE0LjI2IDQ5NS4wMjkgMjE0LjI0OSA0OTQuODk0IDIxNC4yOUM0OTQuNzYgMjE0LjMzMiA0OTQuNjQ2IDIxNC40MjQgNDk0LjU3OCAyMTQuNTQ2WiIgZmlsbD0iIzE5MTkxOSIvPgo8cGF0aCBkPSJNMjMwLjgxOCAzOTQuMzYxQzIzMC44ODIgMzk0LjMyMSAyMzAuOTM4IDM5NC4yNjkgMjMwLjk4MiAzOTQuMjA4QzIzMS4wMjYgMzk0LjE0NiAyMzEuMDU3IDM5NC4wNzcgMjMxLjA3NCAzOTQuMDA0QzIzMS4wOTEgMzkzLjkzMSAyMzEuMDkzIDM5My44NTUgMjMxLjA4MSAzOTMuNzgxQzIzMS4wNjggMzkzLjcwNiAyMzEuMDQxIDM5My42MzUgMjMxLjAwMSAzOTMuNTcyQzIzMC45NjEgMzkzLjUwOCAyMzAuOTA5IDM5My40NTMgMjMwLjg0NyAzOTMuNDA5QzIzMC43ODYgMzkzLjM2NSAyMzAuNzE2IDM5My4zMzQgMjMwLjY0MiAzOTMuMzE3QzIzMC41NjkgMzkzLjMgMjMwLjQ5MiAzOTMuMjk4IDIzMC40MTggMzkzLjMxMUMyMzAuMzQzIDM5My4zMjMgMjMwLjI3MiAzOTMuMzUgMjMwLjIwOCAzOTMuMzlDMjExLjY2NiA0MDQuODQyIDE5Mi40NzUgNDE1LjQ1IDE3MS4yNjQgNDIwLjg2NUMxNjcuNzI5IDQyMS40NTYgMTY0LjIzOSA0MjIuMjg5IDE2MC44MTkgNDIzLjM1OEMxNTguMDcxIDQxNy4yNzkgMTU0Ljk1OCA0MTEuNTAzIDE1Mi42OTYgNDA1LjE4MkMxNDUuODg3IDM4Ni43MjcgMTQ0LjM0NCAzNjYuNzU4IDE0OC4yMzcgMzQ3LjQ4NEMxNTMuMDk4IDMyNS43NzkgMTY2Ljg1NSAzMDYuNzQ1IDE4My43ODcgMjkyLjY1NEMxOTUuMDAzIDI4My43MjIgMjA3LjY2NSAyNzYuNzU1IDIyMS4yMjkgMjcyLjA0OEMyMjIuMDIzIDI3NC4xNzUgMjIyLjc5MyAyNzYuMzExIDIyMy41NSAyNzguNDkxQzIyNC4xNDMgMjgwLjIgMjI2Ljg0NSAyNzkuNDY0IDIyNi4yMzkgMjc3Ljc2MUMyMjAuMzY5IDI2MS4yOTUgMjEwLjQwNiAyMzcuNTM4IDIwMS42ODMgMjI0LjJDMjAyLjUzNyAyMjMuNjQ2IDIwMy4yNDggMjIyLjkwMSAyMDMuNzU5IDIyMi4wMjNDMjA0LjMxMSAyMjEuMTExIDIwMi45NDMgMjE5LjkzNyAyMDIuMTcxIDIyMC44MDhDMTk3Ljg5NiAyMjUuNjI2IDE5MS40MjQgMjIzLjA1NSAxODguODU2IDIxOC4wMUMxODYuNzgyIDIxMy45MzcgMTg4Ljc4NiAyMDMuOTg5IDE5NS4xNDggMjA2LjgyNkMxOTUuMjA0IDIwNi44NTcgMTk1LjI2NiAyMDYuODc4IDE5NS4zMyAyMDYuODg2QzE5NS4zOTQgMjA2Ljg5NCAxOTUuNDYgMjA2Ljg5IDE5NS41MjIgMjA2Ljg3M0MxOTUuNTg0IDIwNi44NTYgMTk1LjY0MyAyMDYuODI3IDE5NS42OTQgMjA2Ljc4N0MxOTUuNzQ1IDIwNi43NDggMTk1Ljc4OCAyMDYuNjk5IDE5NS44MiAyMDYuNjQzQzE5NS44NTIgMjA2LjU4NyAxOTUuODcyIDIwNi41MjUgMTk1Ljg4MSAyMDYuNDYxQzE5NS44ODkgMjA2LjM5NyAxOTUuODg0IDIwNi4zMzMgMTk1Ljg2NyAyMDYuMjcxQzE5NS44NSAyMDYuMjA5IDE5NS44MjEgMjA2LjE1IDE5NS43ODEgMjA2LjFDMTk1Ljc0MSAyMDYuMDQ5IDE5NS42OTIgMjA2LjAwNiAxOTUuNjM2IDIwNS45NzRDMTkwLjM1MiAyMDIuNjI4IDE4NC44MTcgMjA5LjQyNSAxODUuOTI0IDIxNi4xODhDMTg1Ljg2MyAyMTYuMTI3IDE4NS44NjMgMjE2LjA2NiAxODUuODAyIDIxNi4wNjZDMTgzLjA0MyAyMjQuMzA1IDE4MS43MjEgMjMyLjMwMiAxNzQuOTI4IDIzOC45ODJDMTYxLjI5NCAyNTIuMzk0IDEzNi40NCAyNjAuMDgyIDEyMy43MzMgMjc2LjEyNEMxMTEuNTA4IDI5OS44NTYgMTAxLjk2NCAzMjkuNTQxIDEwOC4wMzUgMzU1LjYzNkMxMTEuMjE3IDM2OS4zMTEgMTE3LjMxOCAzNzYuMTIgMTE3LjM4IDM3Ni4xODFDMTE3LjQxMiAzNzYuMjEzIDExNy40NSAzNzYuMjM4IDExNy40OTIgMzc2LjI1NkMxMTcuNTM0IDM3Ni4yNzMgMTE3LjU3OSAzNzYuMjgyIDExNy42MjUgMzc2LjI4MkMxMTcuNjcgMzc2LjI4MiAxMTcuNzE1IDM3Ni4yNzMgMTE3Ljc1NyAzNzYuMjU2QzExNy43OTkgMzc2LjIzOCAxMTcuODM4IDM3Ni4yMTMgMTE3Ljg3IDM3Ni4xODFDMTI0Ljg5MiAzNjkuMzIzIDEzNC4wNDMgMzY1LjAzOCAxNDMuODI4IDM2NC4wMjNDMTQzLjQ1MSAzNzcuNTM3IDE0NS41NDIgMzkxLjAwOCAxNDkuOTk4IDQwMy43OEMxNTIuMzU4IDQxMS4yNTkgMTU1LjcwNiA0MTguMzk0IDE1OS45NTUgNDI0Ljk5NUMxNjAuMDU0IDQyNS4xNTQgMTYwLjIxMiA0MjUuMjY4IDE2MC4zOTUgNDI1LjMxM0MxNjAuNTc3IDQyNS4zNTggMTYwLjc3IDQyNS4zMzEgMTYwLjkzMyA0MjUuMjM3QzE2NC42NzcgNDI1LjAyMyAxNjguMzc1IDQyNC4zMDcgMTcxLjkyNiA0MjMuMTFDMTk3LjIxNiA0MTYuODA2IDIxNi4zMTEgNDAzLjI0OSAyMzAuODE4IDM5NC4zNjFaIiBmaWxsPSIjMTkxOTE5Ii8+CjxwYXRoIGQ9Ik0xNzQuMzIyIDIzNi4xODhDMTgzLjggMjI1Ljk1NSAxODAuMTcgMjExLjUwMiAxOTEuNTQ3IDIwMi40NEMxOTMuMDA4IDIwMS4yNzcgMTk0LjYxIDIwMC4xOTEgMTk2LjEyOCAxOTkuMTU3QzIwNC41NTggMTg4LjI3IDIwNS42NTkgMTcxLjEzNSAyMDUuODQgMTY2LjIxQzIwNy4zNTYgMTY1LjQ1NyAyMDkuOTM2IDE2NC41OTkgMjIwLjU2MiAxNTkuNTI0QzIyNi4yMTIgMTYyLjM5OSAyMzIuNDgxIDE2My44NTkgMjM4LjgyNiAxNjMuNzc4QzI0Ni41MiAxNjMuNTc2IDI1MC42NCAxNTkuNjE1IDI1NS44MDYgMTU0LjQxNkMyNTYuMzUzIDE1My44NjUgMjU3LjEzOCAxNTQuNTkyIDI1Ni44NDUgMTU1LjIwNkMyNTUuMDI3IDE1OC44MzIgMjUyLjEyMiAxNjEuODA1IDI0OC41MzEgMTYzLjcxNUMyNDguNDM4IDE2My43MzkgMjQ4LjM1MSAxNjMuNzg0IDI0OC4yNzcgMTYzLjg0NUMyNDguMjAzIDE2My45MDcgMjQ4LjE0MyAxNjMuOTg0IDI0OC4xMDIgMTY0LjA3MUMyNDguMDYxIDE2NC4xNTggMjQ4LjA0MSAxNjQuMjUzIDI0OC4wNDEgMTY0LjM1QzI0OC4wNDEgMTY0LjQ0NiAyNDguMDYzIDE2NC41NCAyNDguMTA0IDE2NC42MjdDMjYwLjAyNCAxOTEuMDY4IDI2Ny4xMTkgMTk3LjgxOCAyNjYuNDI3IDIwOC43NjFDMjY1LjM4OCAyMjUuMjM0IDI0OC4yNjkgMjQwLjM4NiAyMzEuNzMzIDIzOC4wNkMyMzAuOTM5IDIzNy45NDcgMjMwLjc1NyAyMzkuMjczIDIzMS41NTEgMjM5LjQ1OEMyMzUuMDE4IDI0MC4xNDcgMjM4LjU4OSAyNDAuMTM2IDI0Mi4wNTEgMjM5LjQyNkMyNDUuNTE0IDIzOC43MTUgMjQ4Ljc5OCAyMzcuMzE5IDI1MS43MDggMjM1LjMyMUMyNTIuMjY0IDIzOS4wNDIgMjU2LjgxOSAyNDguMjggMjU5LjU4NCAyNTAuNzYyQzI2MS45NyAyNTIuNDQ2IDI2NC44NDcgMjUzLjMwMSAyNjcuNzcxIDI1My4xOTRDMjY4LjU2MyAyNTMuMjU4IDI2OS4zNTkgMjUzLjMxNCAyNzAuMDkyIDI1My4zMTRDMjY4LjI5MSAyNzAuNDA2IDI1Mi40MDYgMjgyLjQ2NiAyMzMuNTA1IDI3OS40MThDMjMzLjQyOSAyNzkuMzk4IDIzMy4zNSAyNzkuMzkzIDIzMy4yNzIgMjc5LjQwM0MyMzMuMTk0IDI3OS40MTQgMjMzLjExOCAyNzkuNDM5IDIzMy4wNSAyNzkuNDc5QzIzMi45ODIgMjc5LjUxOCAyMzIuOTIzIDI3OS41NzEgMjMyLjg3NSAyNzkuNjMzQzIzMi44MjcgMjc5LjY5NSAyMzIuNzkyIDI3OS43NjYgMjMyLjc3MiAyNzkuODQyQzIzMi43NTIgMjc5LjkxOCAyMzIuNzQ3IDI3OS45OTcgMjMyLjc1OCAyODAuMDc1QzIzMi43NjggMjgwLjE1MiAyMzIuNzk0IDI4MC4yMjcgMjMyLjgzNCAyODAuMjk1QzIzMi44NzMgMjgwLjM2MyAyMzIuOTI2IDI4MC40MjIgMjMyLjk4OSAyODAuNDY5QzIzMy4wNTEgMjgwLjUxNyAyMzMuMTIzIDI4MC41NTIgMjMzLjE5OSAyODAuNTcyQzIzOC4yNDcgMjgxLjg5IDI0My41NDIgMjgxLjk1OCAyNDguNjIyIDI4MC43N0MyNTMuNzAyIDI3OS41ODIgMjU4LjQxMyAyNzcuMTc0IDI2Mi4zNDMgMjczLjc1N0MyNjguMjc0IDI2OC40NDQgMjcyLjA1MyAyNjEuMTYxIDI3Mi45NzEgMjUzLjI3M0MyODEuMDk3IDI1My4yNzMgMjkxLjIzMyAyNTEuMjU5IDMwMS44MDIgMjUyLjkwN0MzMDguMjI2IDI1My44NTggMzE0LjU3NCAyNTUuMjU5IDMyMC43OTkgMjU3LjEwMUMzMjEuNTkzIDI1Ny4zNDQgMzIyLjEzOCAyNTYuMDgyIDMyMS4zNDggMjU1Ljc2NEMzMTIuMTM4IDI1MS44NjggMzAyLjI3NiAyNDkuNzI3IDI5Mi4yNzIgMjQ5LjQ1QzI5My40NjQgMjIxLjEgMjg2LjMxMSAxOTMuMDIxIDI3MS42ODkgMTY4LjY2MkMyNjUuNTMxIDE1OC4xNzcgMjU4LjA1OSAxNDguNTEyIDI0OS40NTQgMTM5LjlDMjUxLjIzNSAxMzAuODEgMjUyLjUxNyAxMTQuMDU4IDI0NS4yMzggMTA3LjY3NkMyMzkuMTM0IDEwMi4zMjUgMjMxLjI1NiAxMDcuMzE3IDIyNS45MzcgMTExLjMyM0MyMjAuNzQ5IDExNS4zOTcgMjE2LjQzIDEyMC40NiAyMTMuMjMzIDEyNi4yMTZDMjAzLjk0OCAxMjEuNTM1IDE5Mi44MzEgMTIzLjE2OCAxODMuNTQ2IDEyNy44NTdDMTgzLjQzNiAxMjYuOTkxIDE4My4wNjkgMTI2LjE3NiAxODIuNDkzIDEyNS41MTdDMTgxLjkxNiAxMjQuODU4IDE4MS4xNTYgMTI0LjM4NCAxODAuMzA4IDEyNC4xNTZDMTc5LjE3NCAxMjMuODU1IDE3Ny45ODUgMTIzLjgxMyAxNzYuODMyIDEyNC4wMzRDMTc1LjY3OSAxMjQuMjU1IDE3NC41OTIgMTI0LjczMyAxNzMuNjUxIDEyNS40MzJDMTcwLjk2IDEyNy40OTQgMTY4Ljk0NyAxMzMuNzYgMTcyLjg1NiAxMzUuNTI0QzE2My41NzEgMTQ0LjU4MSAxNTcuNjQ1IDE1OC45MjcgMTYwLjUxNyAxNzEuODE0QzE2MC41NTIgMTcxLjkyNiAxNjAuNjI2IDE3Mi4wMjEgMTYwLjcyNCAxNzIuMDg0QzE2MC44MjMgMTcyLjE0NyAxNjAuOTQxIDE3Mi4xNzQgMTYxLjA1NyAxNzIuMTU5QzE2MS4xNzMgMTcyLjE0NSAxNjEuMjgxIDE3Mi4wOSAxNjEuMzYxIDE3Mi4wMDVDMTYxLjQ0MSAxNzEuOTE5IDE2MS40ODggMTcxLjgwOSAxNjEuNDk1IDE3MS42OTNDMTYwLjQ2IDE2MS44MTkgMTYyLjk0NiAxNTEuODk4IDE2OC41MTggMTQzLjY2NEMxNzQuMDkgMTM1LjQzIDE4Mi4zOTMgMTI5LjQwNyAxOTEuOTc2IDEyNi42NDlDMTk4LjczNCAxMjQuOTg1IDIwNS44MzcgMTI1LjM2NCAyMTIuMzc3IDEyNy43MzhDMjExLjE1NCAxMjkuODY1IDIxMC4wMDggMTMyLjA2MiAyMDguODk0IDEzNC4yNDNDMjAzLjgyNSAxNDQuMTgzIDE5OS4wMDEgMTU0LjY2NiAxOTkuMTIxIDE2NS45NzNDMTgxLjY5NSAxNzMuNDY3IDE3Ni44MjEgMTc0LjM2NCAxNjAuMDI5IDE3OS41OUMxNTkuOTI5IDE3OS42MTggMTU5LjgzNSAxNzkuNjY2IDE1OS43NTMgMTc5LjczMUMxNTkuNjcxIDE3OS43OTYgMTU5LjYwMyAxNzkuODc2IDE1OS41NTIgMTc5Ljk2N0MxNTkuNTAxIDE4MC4wNTggMTU5LjQ2OSAxODAuMTU4IDE1OS40NTcgMTgwLjI2MUMxNTkuNDQ1IDE4MC4zNjQgMTU5LjQ1NCAxODAuNDY5IDE1OS40ODIgMTgwLjU2OUMxNTkuNTExIDE4MC42NjkgMTU5LjU1OSAxODAuNzYzIDE1OS42MjQgMTgwLjg0NEMxNTkuNjg5IDE4MC45MjYgMTU5Ljc3IDE4MC45OTQgMTU5Ljg2MSAxODEuMDQ0QzE1OS45NTMgMTgxLjA5NSAxNjAuMDUzIDE4MS4xMjcgMTYwLjE1NyAxODEuMTM5QzE2MC4yNjEgMTgxLjE1MSAxNjAuMzY2IDE4MS4xNDIgMTYwLjQ2NyAxODEuMTE0QzE2Mi4xOCAxODAuODk2IDE2My44ODkgMTgwLjUwNiAxNjUuNTM4IDE4MC4yMDNDMTYxLjYgMjM0LjMwMiAxNDYuMTQ4IDIzNi4yNjQgMTI2Ljk4NCAyNzAuMjlDMTQwLjYxNyAyNTYuNDQxIDE2MS4yNTkgMjUwLjI4OCAxNzQuMzIyIDIzNi4xODhaTTE3My43MTIgMTM0Ljc5NEMxNzEuMzkxIDEzMi43MjggMTcyLjQyOCAxMjguOTU3IDE3NC42MjkgMTI3LjI1N0MxNzcuMDcgMTI1LjM2OSAxODEuMTY0IDEyNS40OTMgMTgxLjU5MiAxMjkuMDc5QzE3OC43MiAxMzAuNjI0IDE3Ni4wNyAxMzIuNTQ3IDE3My43MTIgMTM0Ljc5NFpNMjA4LjM0NSAxNDAuMzI1QzIxMi4wODYgMTMyLjYxMyAyMTUuOTE3IDEyNC4zOTggMjIxLjg0NCAxMTguMDc3QzIzNi4wMjggMTAyLjk1NiAyNDcuOTI3IDEwMy44MzMgMjQ4LjQxNSAxMjQuNDYxQzI0OC41MzEgMTI5LjcwNCAyNDguMDYgMTM0Ljk0NCAyNDcuMDExIDE0MC4wODNMMjQyLjI0NSAxNDQuODI1QzIzMC45NDUgMTUyLjI0MSAyMTguNDcgMTU3LjQ5IDIwNi4xNTcgMTYyLjk5OUMyMDQuMjYzIDE2My44NDYgMjAyLjM3IDE2NC43MDEgMjAwLjQxNiAxNjUuNDkyQzIwMS42NTcgMTU2LjcyNyAyMDQuMzM1IDE0OC4yMjUgMjA4LjM0NSAxNDAuMzI1WiIgZmlsbD0iIzE5MTkxOSIvPgo8cGF0aCBkPSJNMjQyLjk3NCAxNjguMjI3QzI0MS45MjUgMTY3LjY4MiAyNDAuNzY5IDE2Ny4zNzMgMjM5LjU4NyAxNjcuMzJDMjM4LjQwNSAxNjcuMjY4IDIzNy4yMjYgMTY3LjQ3NCAyMzYuMTMzIDE2Ny45MjVDMjM1LjIwOCAxNjguMzggMjM0LjQwNSAxNjkuMDQ4IDIzMy43ODkgMTY5Ljg3MkMyMzMuMTczIDE3MC42OTYgMjMyLjc2MyAxNzEuNjU0IDIzMi41OSAxNzIuNjY3QzIzMi40MDIgMTczLjQ1NSAyMzMuNTg2IDE3NC4wMTQgMjMzLjk5NSAxNzMuMjc0QzIzNC44OTIgMTcxLjY1NCAyMzUuNTkgMTcwLjA2OSAyMzcuNDc4IDE2OS41MDVDMjM5LjE4NiAxNjkuMjI4IDI0MC45MzQgMTY5LjMxIDI0Mi42MDggMTY5Ljc0N0MyNDIuNzc4IDE2OS43MjYgMjQyLjkzNyAxNjkuNjU0IDI0My4wNjUgMTY5LjU0MUMyNDMuMTkyIDE2OS40MjggMjQzLjI4MiAxNjkuMjc5IDI0My4zMjEgMTY5LjExM0MyNDMuMzYxIDE2OC45NDggMjQzLjM0OSAxNjguNzc0IDI0My4yODcgMTY4LjYxNkMyNDMuMjI1IDE2OC40NTggMjQzLjExNiAxNjguMzIyIDI0Mi45NzQgMTY4LjIyN1oiIGZpbGw9IiMxOTE5MTkiLz4KPHBhdGggZD0iTTM3NS43MTYgMjc2LjE4OEMzNzAuNTYgMjc0LjU2NCAzNjQuOTU5IDI3My42NjQgMzU5LjY1MSAyNzIuNTQxQzM1NC4zNDMgMjcxLjQxNyAzNDguOTYxIDI3MC4yMzEgMzQzLjU4OCAyNjkuMTk3QzM0My43NiAyNjcuMjc2IDM0My43OCAyNjUuMzQ2IDM0My42NDcgMjYzLjQyMkMzNDMuNjQyIDI2My4yNTIgMzQzLjU5NSAyNjMuMDg1IDM0My41MSAyNjIuOTM2QzM0My40MjUgMjYyLjc4OCAzNDMuMzA0IDI2Mi42NjMgMzQzLjE1OSAyNjIuNTcxQzMzOS4yMzQgMjYwLjUwNCAzMzQuODkyIDI1OS4zNDEgMzMwLjQ1NSAyNTkuMTY4QzMyOS41MzggMjU5LjE1NSAzMjkuNTk3IDI2MC40NTMgMzMwLjQ1NSAyNjAuNTY2QzMzMy41MjcgMjYwLjg4NCAzMzYuNTM0IDI2MS42NjMgMzM5LjM3MiAyNjIuODc2QzM0MC4xMTQgMjYzLjIyMiAzNDEuMTQ0IDI2My40ODMgMzQxLjUxIDI2NC4yNzRDMzQzLjMzOSAyNjcuNDU5IDMzOS44MzggMjc3LjkxMiAzMzcuNjYxIDI4Mi41NjNDMzM3LjU4MiAyODIuNzIzIDMzNy41NjcgMjgyLjkwNyAzMzcuNjE4IDI4My4wNzhDMzM3LjY2OCAyODMuMjQ5IDMzNy43ODIgMjgzLjM5NSAzMzcuOTM2IDI4My40ODdDMzM4LjA5IDI4My41NzkgMzM4LjI3MyAyODMuNjEgMzM4LjQ0OCAyODMuNTc0QzMzOC42MjQgMjgzLjUzOCAzMzguNzggMjgzLjQzNyAzMzguODg0IDI4My4yOTJDMzQxLjIxNyAyNzkuNjIxIDM0Mi43MzcgMjc1LjQ5NyAzNDMuMzQzIDI3MS4xOTVDMzQ4Ljc4IDI3Mi40MSAzNTQuMjgyIDI3My4zOSAzNTkuNzEyIDI3NC40NzZDMzY0LjkyNiAyNzUuNzMzIDM3MC4yMDggMjc2LjY4OCAzNzUuNTMzIDI3Ny4zMzVDMzc2LjI2MyAyNzcuNDAzIDM3Ni4zMjIgMjc2LjM3MSAzNzUuNzE2IDI3Ni4xODhaIiBmaWxsPSIjMTkxOTE5Ii8+CjxwYXRoIGQ9Ik00MzEuOTYxIDM0MS44NzlMMjg2LjkyNiAzNDUuOTQ0QzI4Ni42NjggMzQ1Ljk3MyAyODYuNDE3IDM0Ni4wNTQgMjg2LjE5IDM0Ni4xODNDMjg1Ljk2MyAzNDYuMzExIDI4NS43NjQgMzQ2LjQ4NCAyODUuNjA1IDM0Ni42OTJDMjg1LjQ0NSAzNDYuOSAyODUuMzI4IDM0Ny4xMzggMjg1LjI2MSAzNDcuMzkyQzI4NS4xOTQgMzQ3LjY0NiAyODUuMTc4IDM0Ny45MTEgMjg1LjIxNCAzNDguMTcyTDI4Ny44NTkgNDA3LjQwMkMyODcuOTIgNDA3Ljg2MiAyODguMTQ4IDQwOC4yODQgMjg4LjUgNDA4LjU4M0MyODguODUxIDQwOC44ODMgMjg5LjMwMSA0MDkuMDM5IDI4OS43NiA0MDkuMDIxTDQzMy43ODcgNDA0Ljk4NEM0MzQuMjc3IDQwNC45NjUgNDM0LjczOSA0MDQuNzUyIDQzNS4wNzUgNDA0LjM5MkM0MzUuNDExIDQwNC4wMzIgNDM1LjU5NSA0MDMuNTU0IDQzNS41ODYgNDAzLjA1OUw0MzMuOTAzIDM0My41OTdDNDMzLjkwNCAzNDMuMzUgNDMzLjg1MiAzNDMuMTA2IDQzMy43NTEgMzQyLjg4QzQzMy42NSAzNDIuNjU1IDQzMy41MDMgMzQyLjQ1NSA0MzMuMzE5IDM0Mi4yOTJDNDMzLjEzNSAzNDIuMTI5IDQzMi45MTggMzQyLjAwOCA0MzIuNjg0IDM0MS45MzdDNDMyLjQ1IDM0MS44NjYgNDMyLjIwNCAzNDEuODQ2IDQzMS45NjEgMzQxLjg3OVpNMzM5LjM4NCAzOTcuMzM5TDMwMy4yODYgMzk4LjM1MUMzMDIuNzY0IDM5OC4zNjEgMzAyLjI1OSAzOTguMTY2IDMwMS44NzUgMzk3LjgwOEMzMDEuNDkxIDM5Ny40NSAzMDEuMjU5IDM5Ni45NTcgMzAxLjIyNiAzOTYuNDNDMzAwLjg4MSAzODkuOTIgMjk5LjgxIDM2OS4yMDIgMjk5LjIyNiAzNTcuMDcyQzI5OS4yMTIgMzU2LjgwMSAyOTkuMjUxIDM1Ni41MyAyOTkuMzQyIDM1Ni4yNzVDMjk5LjQzMyAzNTYuMDIgMjk5LjU3NCAzNTUuNzg2IDI5OS43NTcgMzU1LjU4N0MyOTkuOTM5IDM1NS4zODggMzAwLjE1OSAzNTUuMjI5IDMwMC40MDQgMzU1LjExN0MzMDAuNjQ4IDM1NS4wMDYgMzAwLjkxMyAzNTQuOTQ2IDMwMS4xODEgMzU0Ljk0TDMzNy40MzkgMzUzLjkyM0MzMzcuOTY4IDM1My45MDUgMzM4LjQ4MiAzNTQuMDk5IDMzOC44NyAzNTQuNDYyQzMzOS4yNTggMzU0LjgyNSAzMzkuNDg5IDM1NS4zMjggMzM5LjUxMiAzNTUuODYyQzMzOS44ODYgMzY2LjI0NiAzNDEuMDM5IDM4Ny4wODEgMzQxLjM0OCAzOTUuMTg0QzM0MS4zNiAzOTUuNDU2IDM0MS4zMTggMzk1LjcyOCAzNDEuMjI1IDM5NS45ODNDMzQxLjEzMyAzOTYuMjM5IDM0MC45OTEgMzk2LjQ3NCAzNDAuODA5IDM5Ni42NzRDMzQwLjYyNiAzOTYuODc0IDM0MC40MDcgMzk3LjAzNiAzNDAuMTYyIDM5Ny4xNUMzMzkuOTE4IDM5Ny4yNjQgMzM5LjY1MyAzOTcuMzI5IDMzOS4zODQgMzk3LjMzOVpNMzUwLjYxIDM2Ni41NTZDMzUxLjcwNyAzNjUuNzc5IDM1My4wNDkgMzY1Ljg3OSAzNTMuNDc2IDM2Ni43MjFDMzUzLjY2NSAzNjcuMjcgMzUzLjY1NiAzNjcuODY4IDM1My40NTEgMzY4LjQxQzM1My4yNDYgMzY4Ljk1MyAzNTIuODU5IDM2OS40MDUgMzUyLjM1NyAzNjkuNjg4QzM1MS4yNDkgMzcwLjQ1IDM0OS45MTcgMzcwLjM2NCAzNDkuNDg4IDM2OS41MjNDMzQ4LjkzNSAzNjguNjgzIDM0OS40OTMgMzY3LjM0NyAzNTAuNjEgMzY2LjU1NlpNMzQ5LjgyMSAzNzkuOTg5QzM0OS42MjcgMzc5LjQzIDM0OS42NDMgMzc4LjgxOSAzNDkuODY1IDM3OC4yNzJDMzUwLjA4NyAzNzcuNzI1IDM1MC41MDEgMzc3LjI3OSAzNTEuMDI2IDM3Ny4wMTlDMzUyLjIwOCAzNzYuMjUyIDM1My41ODggMzc2LjMzOSAzNTQuMDU1IDM3Ny4xOEMzNTQuMjQ1IDM3Ny43MzggMzU0LjIyNyAzNzguMzQ4IDM1NC4wMDUgMzc4Ljg5NEMzNTMuNzgyIDM3OS40NCAzNTMuMzcxIDM3OS44ODUgMzUyLjg0NyAzODAuMTQ3QzM1MS43MDEgMzgwLjk1NCAzNTAuMzEzIDM4MC44NzkgMzQ5LjgyMSAzNzkuOTg5Wk0zNTMuNjgyIDM4OS42NjJDMzUyLjUwMSAzOTAuNDI5IDM1MS4xMiAzOTAuMzQyIDM1MC42NTMgMzg5LjUwMkMzNTAuNDY0IDM4OC45NDMgMzUwLjQ4MSAzODguMzM0IDM1MC43MDMgMzg3Ljc4OEMzNTAuOTI1IDM4Ny4yNDIgMzUxLjMzNiAzODYuNzk3IDM1MS44NTkgMzg2LjUzNUMzNTMuMDQxIDM4NS43NjggMzU0LjQyMSAzODUuODU1IDM1NC44ODggMzg2LjY5M0MzNTUuMDg4IDM4Ny4yNTEgMzU1LjA3NSAzODcuODY0IDM1NC44NTIgMzg4LjQxM0MzNTQuNjI5IDM4OC45NjIgMzU0LjIxMiAzODkuNDA3IDM1My42ODIgMzg5LjY2MlpNMzk1LjgyOSAzODguNzI2QzM4Mi43MTYgMzg5LjgwOCAzNjcuODg4IDM5MC4xMTggMzYyLjU4NiAzODkuNDEzQzM1Ny4yODIgMzg4LjY2NSAzNjMuNjExIDM4Ny4xODIgMzc2LjczIDM4Ni4wODFDMzg5Ljg0OSAzODQuOTc5IDQwNC42NzEgMzg0LjY5IDQwOS45NzQgMzg1LjM5NEM0MTUuMjMxIDM4Ni4xNDMgNDA4LjkwMiAzODcuNjQ2IDM5NS44MjkgMzg4LjcyNlpNMzY4LjY4NiAzNzUuNTg4QzM3NS4zNSAzNzQuNjQ5IDM4Mi45NzEgMzc0LjU3OSAzODUuNjk0IDM3NS4zNTRDMzg4LjQxOSAzNzYuMTc2IDM4NS4xOTMgMzc3LjU3IDM3OC40ODUgMzc4LjQ5MkMzNzEuODE5IDM3OS40MTMgMzY0LjIgMzc5LjUgMzYxLjQ3NyAzNzguNzIzQzM1OC43NTMgMzc3Ljk0NiAzNjEuOTc2IDM3Ni41MzIgMzY4LjY4NiAzNzUuNTg4Wk0zOTUuNzU1IDM2Ny41MzFDMzgxLjk1IDM2OC43MTIgMzY2LjI0NCAzNjkuMDkyIDM2MC42MTkgMzY4LjM5NEMzNTUuMDM2IDM2Ny42OTUgMzYxLjcyNSAzNjYuMTYxIDM3NS41MjIgMzY1QzM4OS4zMjYgMzYzLjgwMiA0MDUuMDMyIDM2My40MzkgNDEwLjY1NyAzNjQuMTM3QzQxNi4yNDEgMzY0Ljg0IDQwOS41ODkgMzY2LjM1IDM5NS43NDkgMzY3LjUzM0wzOTUuNzU1IDM2Ny41MzFaIiBmaWxsPSIjMDE2N0ZGIi8+CjxwYXRoIGQ9Ik00MzMuNzExIDMxMS4zM0wyODcuODUzIDMxNS40MThDMjg3LjA2MiAzMTUuNDQgMjg2LjQ5OSAzMTYuNTQxIDI4Ni41MzcgMzE3Ljg3OEwyODYuODkzIDMzMC40NDNDMjg2LjkzMSAzMzEuNzggMjg3LjY0IDMzMi45MyAyODguNDMyIDMzMi44MjNMNDM0LjI5MSAzMjguNzM1QzQzNS4wODEgMzI4LjcxMyA0MzUuNjQ0IDMyNy42MTIgNDM1LjYwNiAzMjYuMjc1TDQzNS4yNSAzMTMuNzFDNDM1LjEzMyAzMTIuMzc1IDQzNC41MDYgMzExLjMwOCA0MzMuNzExIDMxMS4zM1pNNDMyLjA1OCAzMjEuNzhDNDMyLjA2NSAzMjEuOTYxIDQzMi4wMzcgMzIyLjE0MiA0MzEuOTc3IDMyMi4zMTJDNDMxLjkxNiAzMjIuNDgyIDQzMS44MjQgMzIyLjYzNyA0MzEuNzA1IDMyMi43NjlDNDMxLjU4NyAzMjIuOTAxIDQzMS40NDQgMzIzLjAwNiA0MzEuMjg2IDMyMy4wNzlDNDMxLjEyOCAzMjMuMTUyIDQzMC45NTcgMzIzLjE5MSA0MzAuNzg0IDMyMy4xOTNMMjkxLjMyNSAzMjcuMTAyQzI5MS4xNTIgMzI3LjEwOCAyOTAuOTggMzI3LjA3OSAyOTAuODE4IDMyNy4wMTVDMjkwLjY1NiAzMjYuOTUxIDI5MC41MDggMzI2Ljg1NCAyOTAuMzgzIDMyNi43MjlDMjkwLjI1NyAzMjYuNjA0IDI5MC4xNTYgMzI2LjQ1NCAyOTAuMDg2IDMyNi4yODhDMjkwLjAxNiAzMjYuMTIyIDI4OS45NzkgMzI1Ljk0MyAyODkuOTc1IDMyNS43NjJMMjg5Ljg4MiAzMjIuNDYyQzI4OS44NzUgMzIyLjI4MSAyODkuOTAyIDMyMi4xIDI4OS45NjMgMzIxLjkzQzI5MC4wMjMgMzIxLjc2MSAyOTAuMTE2IDMyMS42MDUgMjkwLjIzNCAzMjEuNDc0QzI5MC4zNTIgMzIxLjM0MiAyOTAuNDk1IDMyMS4yMzcgMjkwLjY1MyAzMjEuMTY0QzI5MC44MTEgMzIxLjA5MSAyOTAuOTgxIDMyMS4wNTIgMjkxLjE1NCAzMjEuMDQ5TDQzMC42MTMgMzE3LjE0QzQzMC43ODYgMzE3LjEzMyA0MzAuOTU4IDMxNy4xNjMgNDMxLjEyIDMxNy4yMjdDNDMxLjI4MiAzMTcuMjkxIDQzMS40MyAzMTcuMzg4IDQzMS41NTYgMzE3LjUxM0M0MzEuNjgyIDMxNy42MzggNDMxLjc4MyAzMTcuNzg4IDQzMS44NTMgMzE3Ljk1NEM0MzEuOTIzIDMxOC4xMiA0MzEuOTYxIDMxOC4yOTkgNDMxLjk2NSAzMTguNDhMNDMyLjA1OCAzMjEuNzhaIiBmaWxsPSIjMDE2N0ZGIi8+CjxwYXRoIGQ9Ik05LjAwNzgxIDM1My4zNzVDOS4wMDc4MSAzODQuMTA0IDI5LjMwODYgNDEzLjc3MiA0Ny40MjA5IDQzMy4yMzFDNTguMjMyOCA0NDQuODQ5IDczLjkyNTQgNDUwIDg5LjgxNzYgNDUwSDQwMS43OTVDNDYzLjg3MSA0NTAgNTYwLjk0MyAzNTIuOTM5IDU2Mi4wNCAyOTEuMDQyQzU2Mi4xNzcgMjgzLjI3NiA1NjEuODkzIDI3NS4xMzggNTYxLjA0MiAyNjYuNTc4QzU1Mi4yNTQgMTc4LjE0MiA0OTIuNDc5IDE1MS4xMTkgNDMwLjA2NiAxMTcuNTQ5QzM2Ny42NTQgODMuOTc1MSA0MDguMDkxIDM0Ljg0NDMgMzAwLjg0OSA1LjM2NTkxQzE5My42MDQgLTI0LjExMjcgODAuMjA5NyA3My4zMzAxIDgzLjcyNTkgMTY0LjIyMkM4Ny4yNDIxIDI1NS4xMTQgOS4wMDc4MSAyNjguMjE3IDkuMDA3ODEgMzUzLjM3NVoiIGZpbGw9IiNFRkVCRkYiLz4KPHBhdGggZD0iTTQ3NS42MjggMTE2LjU2NEM0MzkuMzg2IDEwNC4yNzUgNDE2LjQzMyA2OS4yNzU3IDQwOS40ODYgNTMuMzExOEMzOTYuODAxIDE3LjE2NzMgNDMzLjk0OSAzNi4xNDMxIDQ2MC4yMjcgNjguNjczNEM0ODYuNTAxIDEwMS4yMDQgNTIwLjkzMSAxMzEuOTI2IDQ3NS42MjggMTE2LjU2NFoiIGZpbGw9IiNFRkVCRkYiLz4KPHBhdGggZD0iTTI2My45MTcgMjM3LjM1M0MyMjcuNjc1IDIyNS4wNjQgMjA0LjcyMiAxOTAuMDY1IDE5Ny43NzUgMTc0LjEwMUMxODUuMDkgMTM3Ljk1NiAyMjIuMjM4IDE1Ni45MzIgMjQ4LjUxNiAxODkuNDYyQzI3NC43OSAyMjEuOTk0IDMwOS4yMiAyNTIuNzE1IDI2My45MTcgMjM3LjM1M1oiIGZpbGw9IiNFRkVCRkYiLz4KPHBhdGggZD0iTTQ3LjM3NjIgNjYuNDM0N0w0MC41NDE3IDc1LjU1NjFDNDAuMTI1NyA3Ni4xMTEgMzkuNDQ3NSA3Ni4zNzgzIDM4Ljc4MzQgNzYuMjQ4NEwzMC4zMzU4IDc0LjU5OUMyOC41MTg1IDc0LjI0NDMgMjcuNDIyMSA3Ni42MjQzIDI4LjgyNDYgNzcuODc5N0wzNS40NjM4IDgzLjgyMThDMzUuOTQ4NSA4NC4yNTU3IDM2LjE3NzUgODQuOTIzOCAzNi4wNjYgODUuNTc5NEwzNC40MDA1IDk1LjM3NzNDMzQuMDg3NCA5Ny4yMTkzIDM2LjI2MzYgOTguMzU4OSAzNy40OTU5IDk2Ljk5ODlMNDQuMzE1NSA4OS40Njk0QzQ0LjcxNjEgODkuMDI3MiA0NS4yOTY1IDg4LjgxMzYgNDUuODc0NiA4OC44OTU2TDUzLjc2NzQgOTAuMDE1OEM1NS41NDUyIDkwLjI2NzkgNTYuNTUyMiA4Ny45NTg5IDU1LjIwMDEgODYuNzI5Nkw0OS4zMzA1IDgxLjM5MkM0OC44NTkzIDgwLjk2MzQgNDguNjM0MSA4MC4zMTE0IDQ4LjczNTIgNzkuNjY4M0w1MC41ODU5IDY3Ljg5ODhDNTAuODg4NiA2NS45NzM4IDQ4LjUyODUgNjQuODk3MiA0Ny4zNzYyIDY2LjQzNDdaTTUxMy4wMjggODMuNjgzNkw1MTIuMzE0IDg4LjgwMDNDNTEyLjI2OCA4OS4xMTE3IDUxMi4wNTMgODkuMzc5MiA1MTEuNzUxIDg5LjQ5MzRMNTA3LjkxNSA5MC45NDg0QzUwNy4wODkgOTEuMjYxMyA1MDcuMTgzIDkyLjQyNzYgNTA4LjA0NSA5Mi41NTZMNTEyLjEyMSA5My4xNjI4QzUxMi40MTcgOTMuMjA3MiA1MTIuNjYzIDkzLjQwMjYgNTEyLjc2NyA5My42NzcyTDUxNC4zMjMgOTcuNzc4MkM1MTQuNjE2IDk4LjU0OCA1MTUuNzY3IDk4LjQ0NDYgNTE1Ljk2MiA5Ny42MjgyTDUxNy4wMzYgOTMuMTE0OUM1MTcuMDk5IDkyLjg0OTkgNTE3LjI4NyA5Mi42MjY4IDUxNy41NDMgOTIuNTE1Nkw1MjEuMDMxIDkwLjk5NzhDNTIxLjgxNyA5MC42NTU3IDUyMS43MDMgODkuNTM4MyA1MjAuODY3IDg5LjQwNzRMNTE3LjI0NCA4OC44MzkxQzUxNi45NTUgODguNzkzNSA1MTYuNzEyIDg4LjYwMzEgNTE2LjYwOCA4OC4zMzU5TDUxNC42NzcgODMuNDQ2NEM1MTQuMzYzIDgyLjY0NjYgNTEzLjE1IDgyLjgyMTEgNTEzLjAyOCA4My42ODM2WiIgZmlsbD0iI0VGRUJGRiIvPgo8cGF0aCBkPSJNMTU2LjkzOCAzNTMuMzc1QzE1Ni45MzggMzg0LjEwNCAxNzcuMjM4IDQxMy43NzIgMTk1LjM1MSA0MzMuMjMxQzIwNi4xNjIgNDQ0Ljg0OSAyMjEuODU1IDQ1MCAyMzcuNzQ3IDQ1MEg1NDkuNzI1QzYxMS44IDQ1MCA3MDguODczIDM1Mi45MzkgNzA5Ljk3IDI5MS4wNDJDNzEwLjEwNyAyODMuMjc2IDcwOS44MjMgMjc1LjEzOCA3MDguOTcyIDI2Ni41NzhDNzAwLjE4MyAxNzguMTQyIDY0MC40MDggMTUxLjExOSA1NzcuOTk2IDExNy41NDlDNTE1LjU4NCA4My45NzUxIDU1Ni4wMjEgMzQuODQ0MyA0NDguNzc5IDUuMzY1OTFDMzQxLjUzNCAtMjQuMTEyNyAyMjguMTM5IDczLjMzMDEgMjMxLjY1NiAxNjQuMjIyQzIzNS4xNzIgMjU1LjExNCAxNTYuOTM4IDI2OC4yMTcgMTU2LjkzOCAzNTMuMzc1WiIgZmlsbD0iI0VGRUJGRiIvPgo8cGF0aCBkPSJNMTk1LjI5OCA2Ni40MzQ3TDE4OC40NjQgNzUuNTU2MUMxODguMDQ4IDc2LjExMSAxODcuMzY5IDc2LjM3ODMgMTg2LjcwNSA3Ni4yNDg0TDE3OC4yNTggNzQuNTk5QzE3Ni40NCA3NC4yNDQzIDE3NS4zNDQgNzYuNjI0MyAxNzYuNzQ2IDc3Ljg3OTdMMTgzLjM4NiA4My44MjE4QzE4My44NyA4NC4yNTU3IDE4NC4wOTkgODQuOTIzOCAxODMuOTg4IDg1LjU3OTRMMTgyLjMyMiA5NS4zNzczQzE4Mi4wMDkgOTcuMjE5MyAxODQuMTg2IDk4LjM1ODkgMTg1LjQxOCA5Ni45OTg5TDE5Mi4yMzcgODkuNDY5NEMxOTIuNjM4IDg5LjAyNzIgMTkzLjIxOCA4OC44MTM3IDE5My43OTcgODguODk1NkwyMDEuNjg5IDkwLjAxNThDMjAzLjQ2NyA5MC4yNjc5IDIwNC40NzQgODcuOTU4OSAyMDMuMTIyIDg2LjcyOTZMMTk3LjI1MiA4MS4zOTJDMTk2Ljc4MSA4MC45NjM0IDE5Ni41NTYgODAuMzExNCAxOTYuNjU3IDc5LjY2ODNMMTk4LjUwOCA2Ny44OTg4QzE5OC44MTEgNjUuOTczOCAxOTYuNDUgNjQuODk3MiAxOTUuMjk4IDY2LjQzNDdaTTY2MC45NSA4My42ODM2TDY2MC4yMzUgODguODAwM0M2NjAuMTkgODkuMTExNyA2NTkuOTc0IDg5LjM3OTIgNjU5LjY3MyA4OS40OTM0TDY1NS44MzcgOTAuOTQ4NEM2NTUuMDExIDkxLjI2MTMgNjU1LjEwNSA5Mi40Mjc2IDY1NS45NjYgOTIuNTU2TDY2MC4wNDMgOTMuMTYyOEM2NjAuMzM5IDkzLjIwNzIgNjYwLjU4NSA5My40MDI2IDY2MC42ODkgOTMuNjc3Mkw2NjIuMjQ0IDk3Ljc3ODJDNjYyLjUzOCA5OC41NDggNjYzLjY4OSA5OC40NDQ2IDY2My44ODQgOTcuNjI4Mkw2NjQuOTU4IDkzLjExNDlDNjY1LjAyMSA5Mi44NDk5IDY2NS4yMDkgOTIuNjI2OCA2NjUuNDY0IDkyLjUxNTZMNjY4Ljk1MyA5MC45OTc4QzY2OS43MzggOTAuNjU1NyA2NjkuNjI0IDg5LjUzODMgNjY4Ljc4OCA4OS40MDc0TDY2NS4xNjYgODguODM5MUM2NjQuODc3IDg4Ljc5MzUgNjY0LjYzNCA4OC42MDMxIDY2NC41MyA4OC4zMzU5TDY2Mi41OTkgODMuNDQ2NEM2NjIuMjg1IDgyLjY0NjYgNjYxLjA3MSA4Mi44MjExIDY2MC45NSA4My42ODM2WiIgZmlsbD0iI0VGRUJGRiIvPgo8cGF0aCBkPSJNNjA5LjIzNiA3OC4zOTU2TDYwMi40MDEgODcuNTE3QzYwMS45ODUgODguMDcyIDYwMS4zMDcgODguMzM5MiA2MDAuNjQzIDg4LjIwOTRMNTkyLjE5NSA4Ni41NTk5QzU5MC4zNzggODYuMjA1MiA1ODkuMjgxIDg4LjU4NTMgNTkwLjY4NCA4OS44NDA2TDU5Ny4zMjMgOTUuNzgyN0M1OTcuODA4IDk2LjIxNjYgNTk4LjAzNyA5Ni44ODQ4IDU5Ny45MjUgOTcuNTQwM0w1OTYuMjYgMTA3LjMzOEM1OTUuOTQ3IDEwOS4xOCA1OTguMTIzIDExMC4zMiA1OTkuMzU1IDEwOC45Nkw2MDYuMTc1IDEwMS40M0M2MDYuNTc1IDEwMC45ODggNjA3LjE1NiAxMDAuNzc1IDYwNy43MzQgMTAwLjg1N0w2MTUuNjI3IDEwMS45NzdDNjE3LjQwNSAxMDIuMjI5IDYxOC40MTIgOTkuOTE5OSA2MTcuMDU5IDk4LjY5MDVMNjExLjE5IDkzLjM1M0M2MTAuNzE5IDkyLjkyNDQgNjEwLjQ5MyA5Mi4yNzI0IDYxMC41OTUgOTEuNjI5Mkw2MTIuNDQ1IDc5Ljg1OTdDNjEyLjc0OCA3Ny45MzQ3IDYxMC4zODggNzYuODU4MSA2MDkuMjM2IDc4LjM5NTZaIiBmaWxsPSIjRUZFQkZGIi8+CjxwYXRoIGQ9Ik0xOS4xODg3IDIyNS45ODVMMTIuMzU0MiAyMzUuMTA3QzExLjkzODIgMjM1LjY2MiAxMS4yNiAyMzUuOTI5IDEwLjU5NTkgMjM1Ljc5OUwyLjE0ODMgMjM0LjE1QzAuMzMxMDQxIDIzMy43OTUgLTAuNzY1NDQ2IDIzNi4xNzUgMC42MzcwODYgMjM3LjQzTDcuMjc2MzEgMjQzLjM3M0M3Ljc2MDk3IDI0My44MDYgNy45OSAyNDQuNDc1IDcuODc4NTIgMjQ1LjEzTDYuMjEzMDIgMjU0LjkyOEM1Ljg5OTg4IDI1Ni43NyA4LjA3NjEzIDI1Ny45MSA5LjMwODQxIDI1Ni41NUwxNi4xMjggMjQ5LjAyQzE2LjUyODYgMjQ4LjU3OCAxNy4xMDkgMjQ4LjM2NCAxNy42ODcxIDI0OC40NDZMMjUuNTc5OSAyNDkuNTY3QzI3LjM1NzcgMjQ5LjgxOSAyOC4zNjQ3IDI0Ny41MSAyNy4wMTI2IDI0Ni4yOEwyMS4xNDMgMjQwLjk0M0MyMC42NzE4IDI0MC41MTQgMjAuNDQ2NiAyMzkuODYyIDIwLjU0NzcgMjM5LjIxOUwyMi4zOTg0IDIyNy40NUMyMi43MDExIDIyNS41MjUgMjAuMzQxIDIyNC40NDggMTkuMTg4NyAyMjUuOTg1WiIgZmlsbD0iI0VGRUJGRiIvPgo8cGF0aCBkPSJNMzk5LjQyNCAzNzkuMTEyQzM5My4yNTYgMzk2Ljc0OCAzODYuMjk3IDQwOC4yODcgMzY3Ljk2NyA0MTguNTAxQzMyNi4zOTkgNDQxLjY4NyAyNzcuMTk5IDQ0Mi45NDkgMjQxLjQ2NSA0MjYuNTI2QzIyMi4wMzEgNDE3LjU5OSAyMTEuMjczIDQwNi41NzQgMTk5LjA3NCAzOTEuMDg3QzE5OC42MzYgMzkwLjU0IDE5Ny43OTIgMzkxLjI2NyAxOTguMDk2IDM5MS44MTZDMjA2LjI1NCA0MDYuNTA4IDIyMC4yNjcgNDE4LjI2NCAyMzUuMDUzIDQyNi4wMzlDMjY5LjY3MyA0NDQuMjQ5IDMxOS45NCA0NDUuODUyIDM2NS4zNCA0MjIuMzkyQzM4Mi4zODUgNDEzLjU4NSAzOTYuOTU4IDM5OC44NjIgNDAwLjgzIDM3OS40NzVDNDAwLjg3OSAzNzkuMjkgNDAwLjg1MSAzNzkuMDkyIDQwMC43NTQgMzc4LjkyN0M0MDAuNjU2IDM3OC43NjIgNDAwLjQ5NiAzNzguNjQyIDQwMC4zMSAzNzguNTk0QzQwMC4yMTcgMzc4LjU3IDQwMC4xMjEgMzc4LjU2NCA0MDAuMDI3IDM3OC41NzdDMzk5LjkzMiAzNzguNTkgMzk5Ljg0MSAzNzguNjIyIDM5OS43NTkgMzc4LjY3QzM5OS41OTMgMzc4Ljc2NyAzOTkuNDcyIDM3OC45MjYgMzk5LjQyNCAzNzkuMTEyWiIgZmlsbD0iIzE5MTkxOSIvPgo8cGF0aCBkPSJNMzc2LjIxNSA0MDAuNTY1QzM3NS43MjcgNDAxLjE3MyAzNzYuMzkyIDQwMi4xOTYgMzc3LjA3IDQwMS43MjFDMzg2LjcyMSAzOTQuNTE5IDM5My4yMTcgMzgzLjg5NiAzOTUuMjA5IDM3Mi4wNTZDMzk1LjI0NiAzNzEuODk5IDM5NS4yMjEgMzcxLjczNCAzOTUuMTM5IDM3MS41OTRDMzk1LjA1OCAzNzEuNDU0IDM5NC45MjYgMzcxLjM1MSAzOTQuNzcxIDM3MS4zMDRDMzk0LjYxNiAzNzEuMjU4IDM5NC40NDggMzcxLjI3MiAzOTQuMzAzIDM3MS4zNDNDMzk0LjE1OCAzNzEuNDE1IDM5NC4wNDUgMzcxLjUzOSAzOTMuOTg5IDM3MS42OUMzODkuMTEgMzg2LjY0NCAzODQuNjc1IDM5MS4yMjMgMzc2LjIxNSA0MDAuNTY1WiIgZmlsbD0iIzE5MTkxOSIvPgo8cGF0aCBkPSJNMzg4LjI0MiAzNjguNDY3QzM3Ny44ODcgMzg3LjQ1MSAzNzYuMDc4IDM4Ni45NDQgMzY3Ljg0MSAzOTcuODI4QzM2Ny4yODkgMzk4LjU1NSAzNjguNDQgMzk5LjI3NCAzNjkuMDY0IDM5OC43NEMzNzMuNTQxIDM5NC41ODggMzc3LjQ5OSAzODkuOTE0IDM4MC44NTIgMzg0LjgxOUMzODQuNjE0IDM4MC4wNiAzODcuNTI3IDM3NC42OTMgMzg5LjQ2NSAzNjguOTUzQzM4OS40OTYgMzY4LjggMzg5LjQ3MiAzNjguNjQyIDM4OS4zOTcgMzY4LjUwNUMzODkuMzIyIDM2OC4zNjggMzg5LjIwMiAzNjguMjYxIDM4OS4wNTcgMzY4LjIwNEMzODguOTExIDM2OC4xNDYgMzg4Ljc1IDM2OC4xNDEgMzg4LjYwMSAzNjguMTg5QzM4OC40NTMgMzY4LjIzNyAzODguMzI2IDM2OC4zMzYgMzg4LjI0MiAzNjguNDY3WiIgZmlsbD0iIzE5MTkxOSIvPgo8cGF0aCBkPSJNMzU5LjI0MSAzOTQuOTFDMzYzLjYzNiAzOTEuMzU0IDM2Ny41OTMgMzg3LjI5NCAzNzEuMDI5IDM4Mi44MTNDMzc0LjU2OCAzNzkuMDAxIDM3Ny40MzggMzc0LjYyNCAzNzkuNTIgMzY5Ljg2NUMzNzkuNzc0IDM2OS4xNCAzNzguNzMgMzY4LjgzNSAzNzguMzU4IDM2OS4zNzlDMzcyLjYwMSAzNzguMjgzIDM2NS44MzggMzg2LjUwMiAzNTguMjAyIDM5My44NzZDMzU3LjQ3MSAzOTQuNTQ3IDM1OC41MTMgMzk1LjQ2MyAzNTkuMjQxIDM5NC45MVoiIGZpbGw9IiMxOTE5MTkiLz4KPHBhdGggZD0iTTQ1Ni40MjEgNzkuMjQxNUM0NTYuNTg1IDgwLjMwNjcgNDU3LjEyOCA4MS4yNzc1IDQ1Ny45NTMgODEuOTc2MkM0NTYuNzg4IDgzLjEzOSA0NTUuOTE5IDg0LjU2MjQgNDU1LjQyIDg2LjEyNzVDNDU0LjkyIDg3LjY5MjYgNDU0LjgwNSA4OS4zNTQgNDU1LjA4MiA5MC45NzI3QzQ0NC41MTUgMTAwLjI3NCA0MzUuNjM5IDExMS40MjggNDMxLjUwNCAxMjQuNzFDNDMxLjA4NiAxMjYuMDUxIDQzMi43MzQgMTI2LjcyNiA0MzMuNjQyIDEyNS45ODhDNDM1LjQ5NSAxMjQuNDI5IDQzNy42NzUgMTIzLjMwNCA0NDAuMDIyIDEyMi42OTNDNDQyLjM2OSAxMjIuMDgzIDQ0NC44MjQgMTIyLjAwMyA0NDcuMjA2IDEyMi40NkM0NTEuMjk3IDEyMy4zMzEgNDU0Ljg0NiAxMjUuNTQ4IDQ1OC44MTMgMTI2LjcxN0M0NjUuMDI0IDEyOC4zNTMgNDcxLjYyOSAxMjcuNTQ3IDQ3Ny4yNiAxMjQuNDY4QzQ3Ny40NzkgMTI0LjQ2OCA0NzYuODIzIDEyNC4wMzIgNDg5LjI5MyAxMzQuODYyQzQ5MS41NDQgMTMxLjU3OCA0OTQuOCAxMjkuMTA1IDQ5OC41NzYgMTI3LjgxQzQ5OC41NzYgMTI3LjgxIDQ4OS4yOTMgMTIxLjMwNiA0ODQuNTg5IDExOC4wODRDNDg4LjM3NCAxMTIuMzM0IDQ4OC4wNjYgMTA0LjcwMyA0NzguNzg3IDk2Ljc0NjhDNDcyLjkyOCA5MS43MjM4IDQ2Ni43MDQgODguMzk3IDQ3My4xNjcgODAuNDU2NEM0NzQuMTUxIDc5LjI0NTkgNDcyLjU1NiA3Ny41OTk4IDQ3MS41MTcgNzguNTczMUM0NzEuNDEyIDc4LjU2MzcgNDcxLjMwNyA3OC41ODQxIDQ3MS4yMTMgNzguNjMxOUM0NjYuMzU5IDgxLjg1NTMgNDYxLjY4OSA4NS4zNDQzIDQ1Ny4yMjQgODkuMDgyOEM0NTcuMTM4IDg2LjgxNSA0NTcuNzggODQuNTc4NyA0NTkuMDU4IDgyLjY5OUM0NTkuNzU5IDgyLjg2MDcgNDYwLjQ5MSA4Mi44Mzk4IDQ2MS4xODMgODIuNjM4MkM0NjEuODc0IDgyLjQzNjcgNDYyLjUwMiA4Mi4wNjEzIDQ2My4wMDUgODEuNTQ4MkM0NjMuNTA4IDgxLjAzNTIgNDYzLjg3IDgwLjQwMTggNDY0LjA1NiA3OS43MDlDNDY0LjI0MiA3OS4wMTYzIDQ2NC4yNDUgNzguMjg3NyA0NjQuMDY2IDc3LjU5MzNDNDYzLjA2NCA3My4yNzggNDU1LjY2NiA3NC4zMTQzIDQ1Ni40MjEgNzkuMjQxNVpNNDgyLjE5OCAxMDMuOTgyQzQ4My4yNDYgMTA1LjUwMiA0ODMuOTE5IDEwNy4yNDYgNDg0LjE2MyAxMDkuMDczQzQ4NC40MDcgMTEwLjkgNDg0LjIxNSAxMTIuNzU5IDQ4My42MDMgMTE0LjQ5OEM0ODEuNzM5IDExMi45MDQgNDc5Ljc4MSAxMTEuNDIyIDQ3Ny43MzkgMTEwLjA2MUM0NzUuNzI3IDEwOC41NTggNDczLjUzMSAxMDcuMzE0IDQ3MS4yMDQgMTA2LjM1OUM0NzAuNDY3IDEwNi4wNjYgNDcwLjE3NCAxMDcuMTM3IDQ3MC43MTQgMTA3LjUxM0M0NzQuNzU1IDExMC4zNDQgNDc4LjEwNSAxMTQuNDQ0IDQ4Mi4zMjEgMTE2Ljk5OEM0ODEuMDI4IDExOC44NzYgNDc5LjMzOSAxMjAuNDUyIDQ3Ny4zNzIgMTIxLjYxNkM0NzAuMjMxIDEyNS45OTkgNDYyLjQ3MSAxMjUuODA3IDQ1NC44OTQgMTIyLjU4OUM0NTEuMjc4IDEyMC43NDggNDQ3LjI4OSAxMTkuNzUxIDQ0My4yMjkgMTE5LjY3MUM0NDUuMDg4IDExNC4zMjEgNDQ4LjI1NyAxMDkuNTE3IDQ1Mi40NSAxMDUuNjkxQzQ1Mi45NCAxMDUuMjAzIDQ1Mi4yNzUgMTA0LjI0MSA0NTEuNjU2IDEwNC43MThDNDQ2LjgyOCAxMDguNDQxIDQ0MS41MTggMTEzLjY0NSA0NDAuNjYyIDExOS45NzZDNDM4LjY5MyAxMjAuMzQxIDQzNi43OTYgMTIxLjAxOCA0MzUuMDQyIDEyMS45ODFDNDQxLjE1IDEwNS4wODEgNDU1LjQ0MyA5Mi4xOTQxIDQ2OS40OTQgODEuMzc1MkM0NjMuMTcxIDkyLjM3OTIgNDc3LjIzNCA5Ni4yMjQzIDQ4Mi4xOTggMTAzLjk4MloiIGZpbGw9IiMwMTY3RkYiLz4KPHBhdGggZD0iTTQ1NC4yODMgNjYuNzc3MkM0NTQuMzYxIDY2Ljk0OTYgNDU0LjQ4OSA2Ny4wOTUgNDU0LjY1IDY3LjE5NDlDNDU0LjgxMiA2Ny4yOTQ4IDQ1NC45OTkgNjcuMzQ0NyA0NTUuMTg5IDY3LjMzODFDNDU1LjM3OSA2Ny4zMzE2IDQ1NS41NjMgNjcuMjY5IDQ1NS43MTcgNjcuMTU4MkM0NTUuODcxIDY3LjA0NzUgNDU1Ljk4OSA2Ni44OTM2IDQ1Ni4wNTUgNjYuNzE2MkM0NTcuMzc3IDYwLjg3NzEgNDU3Ljg1IDU0Ljg3OTEgNDU3LjQ1OSA0OC45MDYxQzQ1Ny40MTYgNDYuMzUyMiA0NTYuNzI2IDQxLjAwNDggNDUyLjc1NiA0MS45NzU4QzQ0OS4yNzUgNDIuODI3MSA0NDkuOCA0OC42MDM1IDQ1MC4wMDggNTEuMTU1MkM0NTAuNjgzIDU2LjUzNzYgNDUyLjEyMiA2MS43OTczIDQ1NC4yODMgNjYuNzc3MloiIGZpbGw9IiMwMTY3RkYiLz4KPHBhdGggZD0iTTQzMy42OTEgNjkuMzkzNEM0MzcuNzE5IDcxLjgyOTggNDQyLjE4MiA3MS45NDUyIDQ0Ni43NjMgNzIuMTg5SDQ0Ni44MjVDNDQ3LjExNCA3Mi4yMTQ0IDQ0Ny40MDMgNzIuMTQyIDQ0Ny42NDYgNzEuOTgzNkM0NDcuODg5IDcxLjgyNTEgNDQ4LjA3MSA3MS41ODk4IDQ0OC4xNjMgNzEuMzE1NkM0NDguMjU0IDcxLjA0MTUgNDQ4LjI1MSA3MC43NDQ2IDQ0OC4xNTIgNzAuNDcyOEM0NDguMDUzIDcwLjIwMTEgNDQ3Ljg2NSA2OS45NzA0IDQ0Ny42MTkgNjkuODE4QzQ0NS4wNjYgNjguMjExNyA0NDIuNzI2IDY2LjI5MjIgNDQwLjY1NSA2NC4xMDQ4QzQzOS4zNzcgNjIuNTgwMSA0MzcuOTIyIDYxLjIxMjYgNDM2LjMxOSA2MC4wMzExQzQzMy45OCA1OC42NjE2IDQzMC40NiA1OC42OTY1IDQyOS40MTYgNjEuNjExOEM0MjguMjYxIDY0LjgzNjQgNDMxLjE4NiA2Ny44NzU5IDQzMy42OTEgNjkuMzkzNFoiIGZpbGw9IiMwMTY3RkYiLz4KPHBhdGggZD0iTTQzNi4zNzkgOTEuMDkzN0M0MzkuMDIgODcuNzE2OCA0NDIuODA5IDgwLjk5MTIgNDQ2LjU3OSA3OS40MjE0QzQ0Ny43OTMgNzguOTE4NCA0NDcuMzczIDc2Ljk5MTUgNDQ2LjAzIDc3LjQxNjFDNDQyLjA0MyA3OC41NzYxIDQzOC4zNjkgODAuNjExOCA0MzUuMjc5IDgzLjM3MzFDNDMzLjM0NSA4NS4yMTczIDQzMC40OTQgODguNTk4NiA0MzEuNTYgOTEuNTE4M0M0MzIuNTczIDk0LjMyMjYgNDM1LjE0OCA5Mi42Njc5IDQzNi4zNzkgOTEuMDkzN1oiIGZpbGw9IiMwMTY3RkYiLz4KPHBhdGggZD0iTTQ3OS40OTggMjUzLjIxOEM0NzkuMzggMjUyLjEzIDQ3OS40OTggMjUxLjM4MyA0NzguNTIgMjUwLjkwOEM0NzYuOTQ5IDI1MC42IDQ3NS4zMzQgMjUwLjU3OSA0NzMuNzU1IDI1MC44NDdDNDYyLjUxNCAyNTAuOTY5IDQ1MS4yNzggMjUxLjQ1NSA0NDAuMDM5IDI1MS44NzlDNDM3Ljg3OSAyNDkuMDE0IDM5OC42MTkgMTk5Ljg3NSAzOTAuMjU3IDE5MS4zOTdDMzkxLjEyNiAxOTAuNDc4IDM5MS42IDE4OS4yNTggMzkxLjU3NyAxODcuOTk3QzM5MS41NTQgMTg2LjczNiAzOTEuMDM2IDE4NS41MzMgMzkwLjEzNCAxODQuNjQ3QzM4Ny4xMDIgMTgxLjc2NiAzODAuMDcgMTgxLjM2OCAzNzguODM0IDE4Ni40MDhDMzc4LjU5NCAxODcuNDM3IDM3OC42MzcgMTg4LjUxMSAzNzguOTU5IDE4OS41MTdDMzc5LjI4MiAxOTAuNTIzIDM3OS44NzEgMTkxLjQyNCAzODAuNjY2IDE5Mi4xMjRDMzY5Ljc5MiAyMDMuNzI2IDM1NS4zNTIgMjIxLjk1MiAzMzkuNDk3IDI0Mi4wMzFDMzM1LjcwOCAyNDYuODIxIDMzMS41NTUgMjUxLjUxMyAzMjguMjU2IDI1Ni42MTlDMzIxLjY2IDI1Ni45MjQgMzE1LjA2NCAyNTcuMzA3IDMwOC40NjcgMjU3LjcwOEMzMDYuMjU1IDI1Ny42ODYgMzA0LjA0NSAyNTcuODc2IDMwMS44NjkgMjU4LjI3NEMzMDAuMDM4IDI1OC43NTkgMjk5LjkzMyAyNjAuNTg2IDI5OS43MzEgMjYyLjI4N0MyOTcuNjk5IDI3OS40ODcgMzAwLjM1OSAzNTUuNjExIDMwMy43MDIgMzg0LjY0OUMzMDMuNzA3IDM4NC44OTkgMzAzLjc5MiAzODUuMTQgMzAzLjk0NyAzODUuMzM2QzMwNC4xMDEgMzg1LjUzMyAzMDQuMzE2IDM4NS42NzQgMzA0LjU1OCAzODUuNzM4QzMxOS44MzMgMzg4LjQ0NSAzMzUuMzk4IDM4OS4xNiAzNTAuODU5IDM4Ny44NjVDMzUxLjg5NiAzODcuNzk2IDM1MS45NTMgMzg2LjE3NiAzNTAuODU5IDM4Ni4yMjRDMzM1LjgyNCAzODYuOTUgMzIwLjc1NSAzODYuMDk0IDMwNS45MDEgMzgzLjY3MkMzMDEuNjc5IDM0MS40OTYgMzAwLjIxMyAyNjguODYyIDMwMi4zNTkgMjYwLjQ1M0MzMDMuNDg4IDI2MC40NTMgMzA0LjI3OCAyNjAuMjgxIDMwNS4yOTEgMjYwLjIwOUMzMDguNTkgMjU5Ljk3OSA0NzYuODcxIDI1My4wMzcgNDc3LjI5OSAyNTMuMDM3QzQ3Ni44MjMgMjU0LjkzIDQ4My42NDQgMzAyLjc2NiA0ODIuOTg4IDM3Ny4yODhDNDQ5Ljc1MyAzODEuODEyIDQyOC4yOTIgMzgwLjgyIDQwNy45MTcgMzgzLjY3MkM0MDcuMDYyIDM4My43OTIgNDA3LjI0NSAzODUuMTk2IDQwOC4xMDEgMzg1LjE5NkM0MzMuNTEgMzgzLjczNSA0NTkuMDUxIDM4Mi43NjIgNDg0LjI3IDM3OS4yMzdDNDg0LjQ5NCAzNzkuMTcgNDg0LjY5MiAzNzkuMDM0IDQ4NC44MzUgMzc4Ljg0OEM0ODQuOTc3IDM3OC42NjMgNDg1LjA1NyAzNzguNDM4IDQ4NS4wNjQgMzc4LjIwNUM0ODUuMzM3IDMzNi40NzYgNDgzLjQ3OSAyOTQuNzYgNDc5LjQ5OCAyNTMuMjE4Wk0zMzAuNDU3IDI1Ni40OTlDMzM0LjAxNyAyNTIuNDIzIDM2NS4yMTcgMjExLjA2MiAzODEuNDYgMTkyLjc5NEMzODIuNjM3IDE5My41MjUgMzg0LjAxIDE5My44ODIgMzg1LjM5NiAxOTMuODE3QzM4Ni43ODIgMTkzLjc1MSAzODguMTE1IDE5My4yNjcgMzg5LjIxOCAxOTIuNDI5QzM4OS4yMTggMTkyLjQyOSA0MzUuNDU3IDI0OS4xNDQgNDM4LjAyMSAyNTIuMDAxQzQyNi44NDQgMjUyLjQyOCAzNTUuMTM0IDI1NS4yODQgMzMwLjQ1NyAyNTYuNDk5WiIgZmlsbD0iIzI4MjgyOCIvPgo8cGF0aCBkPSJNNTU0LjgxOCAxNzAuODQ1QzU1NC4yNzcgMTY5LjE0IDU0OC43MDkgMTY1LjMxMiA1NDUuNDcxIDE2My4xODVDNTQ0LjA2IDE2Mi4yNjggNTQyLjM2NSAxNjEuODg2IDU0MC42OTQgMTYyLjEwOUM1MzkuMDI0IDE2Mi4zMzMgNTM3LjQ5IDE2My4xNDcgNTM2LjM3MiAxNjQuNDAyTDUzNS4yMTEgMTY1LjczOUM1MzQuODU0IDE2Ni4xMyA1MzQuNjU2IDE2Ni42MzkgNTM0LjY1NiAxNjcuMTY3QzUzNC42NTYgMTY3LjY5NiA1MzQuODU0IDE2OC4yMDUgNTM1LjIxMSAxNjguNTk2QzUzNy4xOCAxNzAuODE3IDU0NS4zNTggMTgwLjAyNCA1NDguMzM3IDE4MC4wMjRDNTUxLjgzMSAxODAuMDI0IDU1NS42MDMgMTczLjMxOCA1NTQuODE4IDE3MC44NDVaIiBmaWxsPSIjMDE2N0ZGIi8+CjxwYXRoIGQ9Ik00NjYuODAzIDEwMS45MTVDNDY2LjYwMiAxMDEuODY3IDQ2Ni4zOTQgMTAxLjg1OCA0NjYuMTkxIDEwMS44OUM0NjUuOTg3IDEwMS45MjIgNDY1Ljc5MSAxMDEuOTkzIDQ2NS42MTUgMTAyLjFDNDY1LjQzOSAxMDIuMjA4IDQ2NS4yODcgMTAyLjM0OSA0NjUuMTY2IDEwMi41MTVDNDY1LjA0NSAxMDIuNjgxIDQ2NC45NTggMTAyLjg3IDQ2NC45MSAxMDMuMDY5QzQ2NC44NjQgMTAzLjI0OSA0NjQuODU1IDEwMy40MzYgNDY0Ljg4MyAxMDMuNjJDNDY0LjkxIDEwMy44MDMgNDY0Ljk3NCAxMDMuOTc5IDQ2NS4wNzEgMTA0LjEzOEM0NjUuMTY4IDEwNC4yOTYgNDY1LjI5NSAxMDQuNDM0IDQ2NS40NDYgMTA0LjU0M0M0NjUuNTk3IDEwNC42NTIgNDY1Ljc2OCAxMDQuNzMgNDY1Ljk1IDEwNC43NzJDNDY2LjEzOCAxMDQuODI4IDQ2Ni4zMzYgMTA0Ljg0NiA0NjYuNTMxIDEwNC44MjZDNDY2LjcyNyAxMDQuODA1IDQ2Ni45MTcgMTA0Ljc0NyA0NjcuMDg5IDEwNC42NTRDNDY3LjI2MiAxMDQuNTYxIDQ2Ny40MTUgMTA0LjQzNCA0NjcuNTM5IDEwNC4yODJDNDY3LjY2MyAxMDQuMTMgNDY3Ljc1NSAxMDMuOTU2IDQ2Ny44MTEgMTAzLjc2OEM0NjcuODY3IDEwMy41ODEgNDY3Ljg4NiAxMDMuMzg0IDQ2Ny44NjUgMTAzLjE4OUM0NjcuODQ1IDEwMi45OTUgNDY3Ljc4NiAxMDIuODA2IDQ2Ny42OTMgMTAyLjYzNEM0NjcuNTk5IDEwMi40NjIgNDY3LjQ3MiAxMDIuMzEgNDY3LjMyIDEwMi4xODdDNDY3LjE2NyAxMDIuMDYzIDQ2Ni45OTEgMTAxLjk3MSA0NjYuODAzIDEwMS45MTVaIiBmaWxsPSIjMDE2N0ZGIi8+CjxwYXRoIGQ9Ik0zMDkuNzYyIDI2Ni43MDlDMzEyLjA2NCAyNjYuNTY2IDMxNC4zNzQgMjY2LjYyNyAzMTYuNjY1IDI2Ni44OTJDMzE3LjgyNSAyNjYuOTA3IDMxNy43NTkgMjY1LjIwMiAzMTYuNjY1IDI2NS4xMjhDMzA5LjM5MyAyNjQuNjQgMzA4LjAwMyAyNjQuMTY0IDMwNi45NTMgMjY0LjgyM0MzMDUuOTAzIDI2NS40ODMgMzA1LjkxNCAyNjYuNzA5IDMwNS44NTkgMjY3LjgwMkMzMDUuODU5IDI2OS4zODIgMzA2LjEgMjg2LjY0NiAzMDYuMjI3IDI5My42MzdDMzA2LjU0OSAzMTEuNTYxIDMwNy4zODIgMzU5LjQ5MSAzMTEuMDUxIDM3Ny41ODdDMzExLjIyNCAzNzguNDM4IDMxMi40NjkgMzc4LjA3IDMxMi4zMzUgMzc3LjIyMUMzMDkuMTA2IDM1Ni43NTQgMzA3LjgyNCAyNjguMjA5IDMwNy45MzYgMjY3LjgwMkMzMDguMjY0IDI2Ni41OTMgMzA4LjYwNyAyNjYuOTE4IDMwOS43NjIgMjY2LjcwOVoiIGZpbGw9IiMwMTY3RkYiLz4KPHBhdGggZD0iTTQ3MC4wMyAzNzIuMzYxQzQ2Ni41NCAzNzIuNjQ0IDQ0Mi4zNiAzNzQuNzk5IDQzMy43NDcgMzc1LjUyQzQyNy44ODMgMzc2LjAxMiA0MjEuOTU5IDM3Ny4wNDQgNDE2LjA5MyAzNzcuMUM0MTUuOTQ1IDM3Ny4xMSA0MTUuODA2IDM3Ny4xNzQgNDE1LjcwNSAzNzcuMjgyQzQxNS42MDMgMzc3LjM4OSA0MTUuNTQ3IDM3Ny41MzEgNDE1LjU0NyAzNzcuNjc5QzQxNS41NDcgMzc3LjgyNiA0MTUuNjAzIDM3Ny45NjggNDE1LjcwNSAzNzguMDc1QzQxNS44MDYgMzc4LjE4MyA0MTUuOTQ1IDM3OC4yNDggNDE2LjA5MyAzNzguMjU3QzQyOS41MzcgMzc4LjI4NSA0NDkuMjI2IDM3Ni41MTUgNDY5Ljg0NiAzNzQuNTU1QzQ3MS45NTcgMzc0LjQ4NyA0NzQuMDYgMzc0LjI2MyA0NzYuMTM4IDM3My44ODdDNDc4LjQ2NCAzNzMuMjkyIDQ3OC4wMTUgMzcxLjIxMSA0NzguMDMzIDM2OS4yNjdDNDc4LjA2MyAzNjUuNjE4IDQ3OC4yNzUgMzQzLjE4NyA0NzguMjc1IDMzNS41ODlDNDc4LjI3NSAzMzUuMzIzIDQ3OC4xNjkgMzM1LjA2OCA0NzcuOTggMzM0Ljg4QzQ3Ny43OTEgMzM0LjY5MiA0NzcuNTM1IDMzNC41ODYgNDc3LjI2OCAzMzQuNTg2QzQ3Ny4wMDEgMzM0LjU4NiA0NzYuNzQ1IDMzNC42OTIgNDc2LjU1NiAzMzQuODhDNDc2LjM2NyAzMzUuMDY4IDQ3Ni4yNjEgMzM1LjMyMyA0NzYuMjYxIDMzNS41ODlDNDc2LjI2MSAzNDEuNjA3IDQ3NS45MjQgMzYxLjg0OSA0NzUuODkzIDM2NS45ODNDNDc1Ljg5MyAzNjcuMDE4IDQ3Ni40NDIgMzcxLjA4OSA0NzUuNzExIDM3MS43NTdDNDc0LjkxOSAzNzIuNDggNDcxLjA3MSAzNzIuMjc2IDQ3MC4wMyAzNzIuMzYxWiIgZmlsbD0iIzAxNjdGRiIvPgo8cGF0aCBkPSJNNTM3LjkwNiAyNDEuNzI2QzUyMS42OSAyNTkuMjY2IDUwNS41IDI3Ni44NTQgNDg5LjMzNiAyOTQuNDlDNDg4Ljg0IDI5NS4wMyA0ODkuNjQgMjk1LjgyNyA0OTAuMTMgMjk1LjI4QzUwNy4xNzEgMjc4LjU2MyA1MjMuNjU5IDI2MS4xMjMgNTM5LjA1NyAyNDIuODhDNTM5LjczNSAyNDIuMDkgNTM4LjYzNyAyNDAuOTM2IDUzNy45MDYgMjQxLjcyNloiIGZpbGw9IiMwMTY3RkYiLz4KPHBhdGggZD0iTTUyMC4wMDMgMjgyLjA4OUM1MTMuOTQ1IDI4Ny4wMTQgNTA4Ljk0OCAyOTMuMjEyIDUwMy4zODkgMjk4LjYyM0M1MDIuODMzIDI5OS4xNjUgNTAzLjY0MyAyOTkuOTczIDUwNC4yNDUgMjk5LjQ3NEM1MTAuMTk3IDI5NC4zOTUgNTE1LjgyNyAyODguOTU1IDUyMS4xMDQgMjgzLjE4NEM1MjEuMjMgMjgzLjAzNSA1MjEuMjk1IDI4Mi44NDQgNTIxLjI4NiAyODIuNjVDNTIxLjI3OCAyODIuNDU2IDUyMS4xOTcgMjgyLjI3MSA1MjEuMDU4IDI4Mi4xMzRDNTIwLjkyIDI4MS45OTYgNTIwLjczNSAyODEuOTE1IDUyMC41NCAyODEuOTA3QzUyMC4zNDQgMjgxLjg5OSA1MjAuMTUzIDI4MS45NjMgNTIwLjAwMyAyODIuMDg5WiIgZmlsbD0iIzAxNjdGRiIvPgo8cGF0aCBkPSJNMjY1LjIyOCAyNjkuNzUxQzI2NS43MjkgMjY5LjE1MiAyNjUuMDQyIDI2OC4wNDQgMjY0LjMxMSAyNjguNTk0QzI1NC41NTggMjc1Ljk1OCAyNDUuOTY4IDI4NS4yMzEgMjM3LjEzIDI5My41NzlDMjI3Ljk0MSAzMDIuMjUxIDIxOC43NTIgMzEwLjkxOSAyMDkuODI2IDMxOS44MzlDMjA5Ljc2OSAzMTkuODkgMjA5LjcyNCAzMTkuOTUyIDIwOS42OTIgMzIwLjAyQzIwOS42NiAzMjAuMDg5IDIwOS42NDMgMzIwLjE2NCAyMDkuNjQxIDMyMC4yNEMyMDkuNjM5IDMyMC4zMTYgMjA5LjY1MiAzMjAuMzkxIDIwOS42ODEgMzIwLjQ2MUMyMDkuNzA5IDMyMC41MzIgMjA5Ljc1MSAzMjAuNTk2IDIwOS44MDUgMzIwLjY0OUMyMDkuODU5IDMyMC43MDMgMjA5LjkyMyAzMjAuNzQ1IDIwOS45OTQgMzIwLjc3M0MyMTAuMDY1IDMyMC44MDIgMjEwLjE0MSAzMjAuODE1IDIxMC4yMTcgMzIwLjgxM0MyMTAuMjkzIDMyMC44MTEgMjEwLjM2OCAzMjAuNzk0IDIxMC40MzcgMzIwLjc2MkMyMTAuNTA3IDMyMC43MzEgMjEwLjU2OSAzMjAuNjg1IDIxMC42MiAzMjAuNjI5QzIyMS4yNSAzMTEuMjY3IDI0MS4wMTUgMjkyLjg1OCAyNTEuMzYxIDI4My4xOEMyNTYuMjQ3IDI3OC45ODEgMjYwLjg3OCAyNzQuNDk3IDI2NS4yMjggMjY5Ljc1MVoiIGZpbGw9IiMwMTY3RkYiLz4KPHBhdGggZD0iTTI4MS41OTYgMjY4LjY1M0MyNzAuNzY2IDI3OS4xMDQgMjU5Ljc2MSAyODkuNDExIDI0OC45NzggMjk5Ljk2QzI0OC4yOTkgMzAwLjYxMyAyNDkuMjg0IDMwMS41NCAyNTAuMDE3IDMwMC45OTJDMjYxLjQwOCAyOTEuMTA0IDI3Mi4yMzYgMjgwLjU5MiAyODIuNDUxIDI2OS41MDRDMjgyLjg3OCAyNjguODk2IDI4Mi4xNTQgMjY4LjExNSAyODEuNTk2IDI2OC42NTNaIiBmaWxsPSIjMDE2N0ZGIi8+CjxwYXRoIGQ9Ik0yNzEuMTYzIDE2NS42MjJDMjc1IDE2NC43NjggMjc4LjU3OCAxNjMuMDE3IDI4MS42MDEgMTYwLjUxNEMyODEuNzkxIDE2MC4zOTYgMjgxLjk1MiAxNjAuMjM4IDI4Mi4wNzMgMTYwLjA1MUMyODIuMTk0IDE1OS44NjMgMjgyLjI3MyAxNTkuNjUyIDI4Mi4zMDIgMTU5LjQzMUMyODIuMzMxIDE1OS4yMSAyODIuMzExIDE1OC45ODYgMjgyLjI0MyAxNTguNzczQzI4Mi4xNzQgMTU4LjU2MSAyODIuMDYgMTU4LjM2NyAyODEuOTA3IDE1OC4yMDRDMjc4LjAwMiAxNTMuNjc2IDI3My44NjMgMTQ5LjM1NCAyNjkuNTA2IDE0NS4yNTZDMjY4Ljc2NSAxNDQuNjAyIDI2Ny40MjQgMTQ1LjQ0MyAyNjguMDQxIDE0Ni4zNDRDMjcxLjI3MiAxNTAuNzU0IDI3NC43OCAxNTQuOTU2IDI3OC41NDIgMTU4LjkyN0MyNzUuODU1IDE2MC42MjkgMjcyLjk5MiAxNjIuMDM4IDI3MC4yOTYgMTYzLjcxN0MyNjkuMzI1IDE2NC4zNDggMjcwLjA2OSAxNjUuODA5IDI3MS4xNjMgMTY1LjYyMloiIGZpbGw9IiMxOTE5MTkiLz4KPHBhdGggZD0iTTI1NC44OTQgMTUzLjIyQzI1Ni4zNDQgMTUxLjkyNCAyNTUuMjY2IDE0OS43NTIgMjU0LjM0NSAxNDguNTQxQzI1My4zNzMgMTQ3LjI2MSAyNTIuMzkxIDE0NS42ODIgMjUwLjYyNiAxNDUuNTYyQzI0OC4zNzkgMTQ1LjU2MiAyNDkuMDM1IDE0OS43OTMgMjUwLjUwMyAxNTEuN0MyNTEuNDU5IDE1Mi45MzcgMjUzLjI4OCAxNTQuNjU5IDI1NC44OTQgMTUzLjIyWiIgZmlsbD0iIzE5MTkxOSIvPgo8cGF0aCBkPSJNMjcyLjQ5NSAxMzQuODU5QzI2OC43NDUgMTM0Ljg1OSAyNzMuMDkyIDE0NS44MDkgMjc2LjcxMSAxNDIuNThDMjc4LjE1OSAxNDEuMjg1IDI3Ny4wNDggMTM5LjEzMyAyNzYuMTYgMTM3Ljg5OUMyNzUuMjE1IDEzNi41ODIgMjc0LjIwNiAxMzUuMDM2IDI3Mi40OTUgMTM0Ljg1OVoiIGZpbGw9IiMxOTE5MTkiLz4KPHBhdGggZD0iTTI1MS40MjMgMTM5LjQ4M0MyNTEuNTM4IDEzOS40NDggMjUxLjY0MyAxMzkuMzg1IDI1MS43MjYgMTM5LjI5OEMyNTEuODA5IDEzOS4yMTIgMjUxLjg2OSAxMzkuMTA2IDI1MS45IDEzOC45OUMyNTEuOTMxIDEzOC44NzQgMjUxLjkzMSAxMzguNzUzIDI1MS45MDEgMTM4LjYzN0MyNTEuODcxIDEzOC41MjEgMjUxLjgxMiAxMzguNDE0IDI1MS43MyAxMzguMzI3QzI1MC41NjYgMTM3LjYyMyAyNDkuMjI1IDEzNy4yNjEgMjQ3Ljg2NCAxMzcuMjgyQzI0Ni41MDIgMTM3LjMwNCAyNDUuMTc0IDEzNy43MDggMjQ0LjAzMyAxMzguNDQ5QzI0My4wNDcgMTM5LjI1MyAyNDIuMjY3IDE0MC4yNzggMjQxLjc1NyAxNDEuNDQxQzI0MS4yNDggMTQyLjYwMyAyNDEuMDIzIDE0My44NyAyNDEuMTAxIDE0NS4xMzVDMjQxLjEwOCAxNDUuMjgyIDI0MS4xNjEgMTQ1LjQyMiAyNDEuMjUzIDE0NS41MzdDMjQxLjM0NCAxNDUuNjUxIDI0MS40NjkgMTQ1LjczNSAyNDEuNjExIDE0NS43NzVDMjQxLjc1MiAxNDUuODE1IDI0MS45MDMgMTQ1LjgxMSAyNDIuMDQxIDE0NS43NjJDMjQyLjE4IDE0NS43MTIgMjQyLjI5OSAxNDUuNjIxIDI0Mi4zODMgMTQ1LjUwMUMyNDMuMyAxNDMuODYgMjQzLjU2IDE0MS44NzQgMjQ1LjA3IDE0MC42MzdDMjQ3LjA0OCAxMzkuMDIyIDI0OS4yMjIgMTM5Ljc3MSAyNTEuNDIzIDEzOS40ODNaIiBmaWxsPSIjMTkxOTE5Ii8+CjxwYXRoIGQ9Ik0yNjQuNjE2IDE3NS40NjlDMjY1LjY1NyAxODAuNDM5IDI2OS41NjUgMTg5LjEwMyAyNzUuODU1IDE4OC41MzJDMjgzLjA3NSAxODcuODc5IDI4MS40MjEgMTc3Ljg5MiAyODAuOTg1IDE3My4wM0MyODAuOTc4IDE3Mi44NzcgMjgwLjkzNyAxNzIuNzI4IDI4MC44NjYgMTcyLjU5MkMyODAuNzk1IDE3Mi40NTcgMjgwLjY5NCAxNzIuMzM5IDI4MC41NzIgMTcyLjI0NkMyODAuNDUgMTcyLjE1MyAyODAuMzA5IDE3Mi4wODggMjgwLjE1OSAxNzIuMDU1QzI4MC4wMDkgMTcyLjAyMyAyNzkuODUzIDE3Mi4wMjMgMjc5LjcwMyAxNzIuMDU3QzI3NC44MzYgMTcyLjYyNyAyNzAuMDAzIDE3My40NTkgMjY1LjIyNiAxNzQuNTVDMjY1LjEyMSAxNzQuNTYyIDI2NS4wMjEgMTc0LjU5NiAyNjQuOTMxIDE3NC42NTFDMjY0Ljg0MSAxNzQuNzA2IDI2NC43NjQgMTc0Ljc4IDI2NC43MDYgMTc0Ljg2N0MyNjQuNjQ3IDE3NC45NTUgMjY0LjYwOSAxNzUuMDU0IDI2NC41OTQgMTc1LjE1OEMyNjQuNTc4IDE3NS4yNjIgMjY0LjU4NiAxNzUuMzY4IDI2NC42MTYgMTc1LjQ2OVpNMjc5LjA5MSAxNzQuMjU0QzI3OS41ODEgMTc4LjU2OSAyODAuNDk3IDE4Ni41OTIgMjc1LjMwMyAxODYuNjUzQzI3MC4yMzQgMTg2LjcxNCAyNjcuNzkgMTc5Ljk2NyAyNjYuMzMzIDE3NS44MzJDMjcwLjYzMiAxNzUuNzg5IDI3NC45MTIgMTc1LjI1OSAyNzkuMDkxIDE3NC4yNTRaIiBmaWxsPSIjMTkxOTE5Ii8+CjxwYXRoIGQ9Ik00OTEuNzg1IDE2Mi4wMzdDNDkyLjUyIDE2MC4zOTUgNDkyLjcwNiAxNjAuMDMgNDkxLjkwNyAxNTguNTFDNDkwLjMyIDE1NS42NDEgNDg5LjU2NiAxNTIuMzkxIDQ4OS43MjggMTQ5LjEyQzQ4OS44OTEgMTQ1Ljg1IDQ5MC45NjMgMTQyLjY4OSA0OTIuODI2IDEzOS45OUM0OTQuNjg5IDEzNy4yOTIgNDk3LjI2OSAxMzUuMTYxIDUwMC4yNzkgMTMzLjgzOEM1MDMuMjg4IDEzMi41MTQgNTA2LjYwOCAxMzIuMDQ4IDUwOS44NjcgMTMyLjQ5M0M1MTAuODQ1IDEzMi42MDIgNTExLjAyNyAxMzAuOTY5IDUxMC4xMSAxMzAuNzkxQzUwNi41MzkgMTMwLjEwMiA1MDIuODQ2IDEzMC40MjQgNDk5LjQ1IDEzMS43MTlDNDk2LjA1NCAxMzMuMDE0IDQ5My4wOSAxMzUuMjMgNDkwLjg5NiAxMzguMTE3QzQ4OC43MDEgMTQxLjAwMyA0ODcuMzY0IDE0NC40NDQgNDg3LjAzNSAxNDguMDQ5QzQ4Ni43MDcgMTUxLjY1MyA0ODcuNCAxNTUuMjc3IDQ4OS4wMzcgMTU4LjUxQzQ4OS45MzIgMTYwLjI1MiA0ODkuNTgyIDE2MC44MTggNDg4LjczIDE2Mi42NDdDNDgwLjk4OCAxNzkuMjgzIDQ2MS4wMjggMTk5LjQ1NiA0MzUuMTYyIDIyOC4xODNDNDM0LjYxNSAyMjguNzkyIDQzNS40NTcgMjI5LjYzIDQzNi4wMTcgMjI5LjAzNEM0NTEuMzEgMjEyLjc1NCA0ODIuNzg2IDE4Mi4xNTEgNDkxLjc4NSAxNjIuMDM3WiIgZmlsbD0iIzE5MTkxOSIvPgo8cGF0aCBkPSJNNTA3LjQ4MSAxNTAuMzAyQzUwNy41OTkgMTUxLjE1MyA1MDguOTU2IDE1MC45MSA1MDguOTQ3IDE1MC4xMjFDNTA4Ljg3MSAxNDcuNjQ5IDUwOS4zMzQgMTQ1LjE5IDUxMC4zMDQgMTQyLjkxM0M1MTEuMjc0IDE0MC42MzYgNTEyLjcyNyAxMzguNTk1IDUxNC41NjUgMTM2LjkyOUM1MTguODI3IDEzMy4yNjUgNTIzLjk3MyAxMzMuMDMyIDUyOS4yODcgMTMzLjQ2NUM1MjkuNDU5IDEzMy40NjEgNTI5LjYyNCAxMzMuNDAxIDUyOS43NTggMTMzLjI5NUM1MjkuODkyIDEzMy4xODggNTI5Ljk4NyAxMzMuMDQgNTMwLjAyOSAxMzIuODc1QzUzMC4wNyAxMzIuNzA5IDUzMC4wNTYgMTMyLjUzNCA1MjkuOTg4IDEzMi4zNzdDNTI5LjkyIDEzMi4yMiA1MjkuODAyIDEzMi4wOSA1MjkuNjUyIDEzMi4wMDdDNTIwLjAzNSAxMjcuMzI4IDUwNS40OTQgMTM2LjE3NCA1MDcuNDgxIDE1MC4zMDJaIiBmaWxsPSIjMTkxOTE5Ii8+CjxwYXRoIGQ9Ik01MTkuOTM4IDE0My4yNTFDNTE3LjgzIDE0NS4wNyA1MTYuMjg2IDE0Ny40NDkgNTE1LjQ4NSAxNTAuMTA5QzUxNC42ODUgMTUyLjc2OSA1MTQuNjYxIDE1NS42MDEgNTE1LjQxOCAxNTguMjc0QzUxNS42MTUgMTU4LjkyNyA1MTYuNzY4IDE1OC44ODEgNTE2LjcgMTU4LjA5MUM1MTYuMzY1IDE1NS43MjYgNTE2LjU5NSAxNTMuMzE2IDUxNy4zNyAxNTEuMDU2QzUxOC4xNDUgMTQ4Ljc5NiA1MTkuNDQzIDE0Ni43NSA1MjEuMTYxIDE0NS4wODJDNTI1LjQ4MiAxNDEuMjM1IDUzMC4xMzEgMTQxLjk5MiA1MzUuMzgyIDE0Mi40NjlDNTM2LjE3NCAxNDIuNTQxIDUzNi4yNDEgMTQxLjQ4OSA1MzUuNzQ3IDE0MS4xMzJDNTMxLjIyNSAxMzcuODM2IDUyMy45IDEzOS44OTUgNTE5LjkzOCAxNDMuMjUxWiIgZmlsbD0iIzE5MTkxOSIvPgo8cGF0aCBkPSJNNTQyLjYwMiAxNTEuNTE3QzU0My4yNzUgMTUxLjU3MiA1NDMuNDU3IDE1MC42MDUgNTQyLjkwOCAxNTAuM0M1MzYuMjUgMTQ1Ljg2MyA1MjYuOTM3IDE1MS43MTEgNTI0LjU4MyAxNTguMjY1QzUyNC4zNDIgMTU4LjkzMyA1MjUuMzgxIDE1OS4yOTkgNTI1LjY3NyAxNTguNzVDNTI3LjM2OSAxNTUuNjUxIDUzMC4xMiAxNTMuMjU3IDUzMy40MzIgMTUyLjAwMUM1MzYuNDEzIDE1MS4xNTIgNTM5LjU0OCAxNTAuOTg3IDU0Mi42MDIgMTUxLjUxN1oiIGZpbGw9IiMxOTE5MTkiLz4KPHBhdGggZD0iTTU0Ny43ODkgMTU4LjgxNEM1NDcuMTQxIDE1Ny42MiA1NDYuMTMxIDE1Ni42NTkgNTQ0LjkwMyAxNTYuMDY5QzU0My42NzQgMTU1LjQ4IDU0Mi4yOSAxNTUuMjkxIDU0MC45NDcgMTU1LjUzMUM1MzcuOTI1IDE1Ni4zMjUgNTM1LjMzNyAxNTguMjY4IDUzMy43NDEgMTYwLjk0MUM1MzMuMzE4IDE2MS40OTIgNTM0LjIzOSAxNjIuMjMgNTM0LjcxOSAxNjEuNzMyQzUzNy4zNDQgMTU4Ljk5NSA1NDMuMDU2IDE1NS4yMTcgNTQ1LjgzNSAxNjAuMDI5QzU0Ni41NDQgMTYxLjI1OSA1NDguNDM2IDE2MC4xMDMgNTQ3Ljc4OSAxNTguODE0WiIgZmlsbD0iIzE5MTkxOSIvPgo8cGF0aCBkPSJNNTI3LjY0IDE3NC42NzlDNTE3LjQyOCAxOTMuNTA4IDUyMC4yMTcgMTg5LjQ4NSA1MDYuNzUxIDIwOC41OTlDNDk0LjM5IDIyNi4xNSA0ODQuNzIgMjM0LjE3MyA0NzcuOTgxIDI0Mi44ODJDNDc3LjM2OSAyNDMuNjczIDQ3OC42NTUgMjQ0LjQ2NyA0NzkuMzI1IDI0My45MTZDNDg1LjA4NyAyMzguODI2IDQ5MC40IDIzMy4yNTMgNDk1LjIwNiAyMjcuMjZDNTA4Ljg4OCAyMTEuNjQ4IDUyMC4xNSAxOTQuMDg5IDUyOC42MTggMTc1LjE2NUM1MjguNjc2IDE3NS4wMzYgNTI4LjY4MSAxNzQuODkxIDUyOC42MzQgMTc0Ljc1OUM1MjguNTg2IDE3NC42MjcgNTI4LjQ4OSAxNzQuNTE4IDUyOC4zNjMgMTc0LjQ1NkM1MjguMjM3IDE3NC4zOTMgNTI4LjA5MSAxNzQuMzgxIDUyNy45NTcgMTc0LjQyM0M1MjcuODIyIDE3NC40NjUgNTI3LjcwOSAxNzQuNTU2IDUyNy42NCAxNzQuNjc5WiIgZmlsbD0iIzE5MTkxOSIvPgo8cGF0aCBkPSJNMjYzLjg4MSAzNTQuNDg2QzI2My45NDUgMzU0LjQ0NiAyNjQgMzU0LjM5NCAyNjQuMDQ0IDM1NC4zMzNDMjY0LjA4OCAzNTQuMjcxIDI2NC4xMTkgMzU0LjIwMiAyNjQuMTM2IDM1NC4xMjlDMjY0LjE1MyAzNTQuMDU2IDI2NC4xNTYgMzUzLjk4IDI2NC4xNDMgMzUzLjkwNkMyNjQuMTMxIDM1My44MzEgMjY0LjEwNCAzNTMuNzYgMjY0LjA2MyAzNTMuNjk3QzI2NC4wMjMgMzUzLjYzMyAyNjMuOTcxIDM1My41NzggMjYzLjkxIDM1My41MzRDMjYzLjg0OCAzNTMuNDkgMjYzLjc3OCAzNTMuNDU5IDI2My43MDUgMzUzLjQ0MkMyNjMuNjMxIDM1My40MjUgMjYzLjU1NSAzNTMuNDIzIDI2My40OCAzNTMuNDM2QzI2My40MDYgMzUzLjQ0OCAyNjMuMzM0IDM1My40NzUgMjYzLjI3IDM1My41MTVDMjQ0LjcyOSAzNjQuOTY3IDIyNS41MzcgMzc1LjU3NSAyMDQuMzI2IDM4MC45OUMyMDAuNzkxIDM4MS41ODEgMTk3LjMwMSAzODIuNDE0IDE5My44ODEgMzgzLjQ4M0MxOTEuMTM0IDM3Ny40MDQgMTg4LjAyIDM3MS42MjggMTg1Ljc1OCAzNjUuMzA3QzE3OC45NSAzNDYuODUyIDE3Ny40MDcgMzI2Ljg4MyAxODEuMjk5IDMwNy42MDlDMTg2LjE2MSAyODUuOTA0IDE5OS45MTggMjY2Ljg3IDIxNi44NDkgMjUyLjc3OUMyMjguMDY2IDI0My44NDcgMjQwLjcyNyAyMzYuODggMjU0LjI5MiAyMzIuMTczQzI1NS4wODYgMjM0LjMgMjU1Ljg1NiAyMzYuNDM2IDI1Ni42MTMgMjM4LjYxNkMyNTcuMjA2IDI0MC4zMjUgMjU5LjkwOCAyMzkuNTg5IDI1OS4zMDIgMjM3Ljg4NkMyNTMuNDMyIDIyMS40MiAyNDMuNDY4IDE5Ny42NjMgMjM0Ljc0NiAxODQuMzI1QzIzNS42IDE4My43NzEgMjM2LjMxMSAxODMuMDI2IDIzNi44MjIgMTgyLjE0OEMyMzcuMzczIDE4MS4yMzYgMjM2LjAwNiAxODAuMDYyIDIzNS4yMzMgMTgwLjkzM0MyMzAuOTU4IDE4NS43NTEgMjI0LjQ4NyAxODMuMTggMjIxLjkxOCAxNzguMTM1QzIxOS44NDQgMTc0LjA2MiAyMjEuODQ4IDE2NC4xMTQgMjI4LjIxMSAxNjYuOTUxQzIyOC4yNjcgMTY2Ljk4MiAyMjguMzI5IDE2Ny4wMDMgMjI4LjM5MyAxNjcuMDExQzIyOC40NTcgMTY3LjAxOSAyMjguNTIyIDE2Ny4wMTUgMjI4LjU4NCAxNjYuOTk4QzIyOC42NDcgMTY2Ljk4MSAyMjguNzA1IDE2Ni45NTIgMjI4Ljc1NiAxNjYuOTEyQzIyOC44MDcgMTY2Ljg3MyAyMjguODUgMTY2LjgyNCAyMjguODgyIDE2Ni43NjhDMjI4LjkxNCAxNjYuNzEyIDIyOC45MzUgMTY2LjY1IDIyOC45NDMgMTY2LjU4NkMyMjguOTUxIDE2Ni41MjIgMjI4Ljk0NiAxNjYuNDU4IDIyOC45MjkgMTY2LjM5NkMyMjguOTEyIDE2Ni4zMzQgMjI4Ljg4MyAxNjYuMjc1IDIyOC44NDQgMTY2LjIyNUMyMjguODA0IDE2Ni4xNzQgMjI4Ljc1NSAxNjYuMTMxIDIyOC42OTggMTY2LjA5OUMyMjMuNDE1IDE2Mi43NTMgMjE3Ljg4IDE2OS41NSAyMTguOTg3IDE3Ni4zMTNDMjE4LjkyNSAxNzYuMjUyIDIxOC45MjUgMTc2LjE5MSAyMTguODY0IDE3Ni4xOTFDMjE2LjEwNSAxODQuNDMgMjE0Ljc4NCAxOTIuNDI3IDIwNy45OTEgMTk5LjEwN0MxOTQuMzU2IDIxMi41MTkgMTY5LjUwMiAyMjAuMjA3IDE1Ni43OTYgMjM2LjI0OUMxNDQuNTcgMjU5Ljk4MSAxMzUuMDI3IDI4OS42NjYgMTQxLjA5OCAzMTUuNzYxQzE0NC4yNzkgMzI5LjQzNiAxNTAuMzgxIDMzNi4yNDUgMTUwLjQ0MiAzMzYuMzA2QzE1MC40NzQgMzM2LjMzOCAxNTAuNTEyIDMzNi4zNjMgMTUwLjU1NSAzMzYuMzgxQzE1MC41OTcgMzM2LjM5OCAxNTAuNjQyIDMzNi40MDcgMTUwLjY4NyAzMzYuNDA3QzE1MC43MzMgMzM2LjQwNyAxNTAuNzc4IDMzNi4zOTggMTUwLjgyIDMzNi4zODFDMTUwLjg2MiAzMzYuMzYzIDE1MC45IDMzNi4zMzggMTUwLjkzMiAzMzYuMzA2QzE1Ny45NTUgMzI5LjQ0OCAxNjcuMTA1IDMyNS4xNjMgMTc2Ljg5MSAzMjQuMTQ4QzE3Ni41MTQgMzM3LjY2MiAxNzguNjA0IDM1MS4xMzMgMTgzLjA2IDM2My45MDVDMTg1LjQyIDM3MS4zODQgMTg4Ljc2OSAzNzguNTE5IDE5My4wMTcgMzg1LjEyQzE5My4xMTcgMzg1LjI3OSAxOTMuMjc1IDM4NS4zOTMgMTkzLjQ1NyAzODUuNDM4QzE5My42NCAzODUuNDgzIDE5My44MzMgMzg1LjQ1NiAxOTMuOTk1IDM4NS4zNjJDMTk3LjczOSAzODUuMTQ4IDIwMS40MzcgMzg0LjQzMiAyMDQuOTg5IDM4My4yMzVDMjMwLjI3OCAzNzYuOTMxIDI0OS4zNzMgMzYzLjM3NCAyNjMuODgxIDM1NC40ODZaIiBmaWxsPSIjMTkxOTE5Ii8+CjxwYXRoIGQ9Ik0yMDcuMzg1IDE5Ni4zMTdDMjE2Ljg2MiAxODYuMDgzIDIxMy4yMzMgMTcxLjYzMSAyMjQuNjEgMTYyLjU2OUMyMjYuMDcxIDE2MS40MDYgMjI3LjY3MiAxNjAuMzIgMjI5LjE5MSAxNTkuMjg2QzIzNy42MjEgMTQ4LjM5OSAyMzguNzIxIDEzMS4yNjQgMjM4LjkwMyAxMjYuMzM5QzI0MC40MTkgMTI1LjU4NiAyNDIuOTk4IDEyNC43MjggMjUzLjYyNCAxMTkuNjUzQzI1OS4yNzQgMTIyLjUyOCAyNjUuNTQzIDEyMy45ODggMjcxLjg4OCAxMjMuOTA3QzI3OS41ODMgMTIzLjcwNSAyODMuNzAzIDExOS43NDQgMjg4Ljg2OCAxMTQuNTQ1QzI4OS40MTUgMTEzLjk5NCAyOTAuMiAxMTQuNzIxIDI4OS45MDcgMTE1LjMzNUMyODguMDg5IDExOC45NjEgMjg1LjE4NCAxMjEuOTM0IDI4MS41OTQgMTIzLjg0NEMyODEuNSAxMjMuODY4IDI4MS40MTMgMTIzLjkxMyAyODEuMzM5IDEyMy45NzRDMjgxLjI2NSAxMjQuMDM2IDI4MS4yMDUgMTI0LjExMyAyODEuMTY1IDEyNC4yQzI4MS4xMjQgMTI0LjI4NyAyODEuMTAzIDEyNC4zODIgMjgxLjEwMyAxMjQuNDc4QzI4MS4xMDQgMTI0LjU3NSAyODEuMTI2IDEyNC42NjkgMjgxLjE2NyAxMjQuNzU2QzI5My4wODYgMTUxLjE5NyAzMDAuMTgxIDE1Ny45NDcgMjk5LjQ5IDE2OC44OUMyOTguNDUxIDE4NS4zNjMgMjgxLjMzMSAyMDAuNTE0IDI2NC43OTUgMTk4LjE4OUMyNjQuMDAxIDE5OC4wNzYgMjYzLjgyIDE5OS40MDIgMjY0LjYxNCAxOTkuNTg3QzI2OC4wODEgMjAwLjI3NiAyNzEuNjUxIDIwMC4yNjUgMjc1LjExNCAxOTkuNTU0QzI3OC41NzcgMTk4Ljg0NCAyODEuODYgMTk3LjQ0OCAyODQuNzcgMTk1LjQ1QzI4NS4zMjYgMTk5LjE3MSAyODkuODgxIDIwOC40MDkgMjkyLjY0NiAyMTAuODkxQzI5NS4wMzMgMjEyLjU3NSAyOTcuOTEgMjEzLjQzIDMwMC44MzMgMjEzLjMyM0MzMDEuNjI1IDIxMy4zODcgMzAyLjQyMiAyMTMuNDQzIDMwMy4xNTUgMjEzLjQ0M0MzMDEuMzU0IDIzMC41MzUgMjg1LjQ2OCAyNDIuNTk1IDI2Ni41NjggMjM5LjU0N0MyNjYuNDkxIDIzOS41MjYgMjY2LjQxMiAyMzkuNTIyIDI2Ni4zMzQgMjM5LjUzMkMyNjYuMjU2IDIzOS41NDMgMjY2LjE4MSAyMzkuNTY4IDI2Ni4xMTMgMjM5LjYwOEMyNjYuMDQ1IDIzOS42NDcgMjY1Ljk4NSAyMzkuNyAyNjUuOTM3IDIzOS43NjJDMjY1Ljg5IDIzOS44MjQgMjY1Ljg1NSAyMzkuODk1IDI2NS44MzUgMjM5Ljk3MUMyNjUuODE1IDI0MC4wNDcgMjY1LjgxIDI0MC4xMjYgMjY1LjgyIDI0MC4yMDNDMjY1LjgzMSAyNDAuMjgxIDI2NS44NTcgMjQwLjM1NiAyNjUuODk2IDI0MC40MjRDMjY1LjkzNiAyNDAuNDkxIDI2NS45ODggMjQwLjU1MSAyNjYuMDUxIDI0MC41OThDMjY2LjExNCAyNDAuNjQ2IDI2Ni4xODUgMjQwLjY4IDI2Ni4yNjEgMjQwLjdDMjcxLjMwOSAyNDIuMDE5IDI3Ni42MDQgMjQyLjA4NyAyODEuNjg1IDI0MC44OTlDMjg2Ljc2NSAyMzkuNzExIDI5MS40NzYgMjM3LjMwMyAyOTUuNDA1IDIzMy44ODZDMzAxLjMzNiAyMjguNTczIDMwNS4xMTUgMjIxLjI5IDMwNi4wMzQgMjEzLjQwMkMzMTQuMTU5IDIxMy40MDIgMzI0LjI5NiAyMTEuMzg4IDMzNC44NjUgMjEzLjAzNkMzNDEuMjg5IDIxMy45ODcgMzQ3LjYzNyAyMTUuMzg4IDM1My44NjIgMjE3LjIyOUMzNTQuNjU2IDIxNy40NzMgMzU1LjIwMSAyMTYuMjEgMzU0LjQxMSAyMTUuODkzQzM0NS4yMDEgMjExLjk5NyAzMzUuMzM4IDIwOS44NTUgMzI1LjMzNSAyMDkuNTc4QzMyNi41MjcgMTgxLjIyOSAzMTkuMzczIDE1My4xNSAzMDQuNzUyIDEyOC43OTFDMjk4LjU5MyAxMTguMzA2IDI5MS4xMjIgMTA4LjY0MSAyODIuNTE3IDEwMC4wMjlDMjg0LjI5OCA5MC45Mzg3IDI4NS41OCA3NC4xODY4IDI3OC4zMDEgNjcuODA1MkMyNzIuMTk3IDYyLjQ1MzQgMjY0LjMxOSA2Ny40NDU5IDI1OSA3MS40NTIxQzI1My44MTIgNzUuNTI1NiAyNDkuNDkyIDgwLjU4ODcgMjQ2LjI5NSA4Ni4zNDQ3QzIzNy4wMSA4MS42NjM1IDIyNS44OTQgODMuMjk2NSAyMTYuNjA5IDg3Ljk4NjNDMjE2LjQ5OSA4Ny4xMTk0IDIxNi4xMzIgODYuMzA0NiAyMTUuNTU1IDg1LjY0NTZDMjE0Ljk3OSA4NC45ODY1IDIxNC4yMTggODQuNTEyOSAyMTMuMzcxIDg0LjI4NUMyMTIuMjM2IDgzLjk4MzYgMjExLjA0OCA4My45NDE4IDIwOS44OTUgODQuMTYyOEMyMDguNzQyIDg0LjM4MzcgMjA3LjY1NCA4NC44NjE3IDIwNi43MTMgODUuNTYwOUMyMDQuMDIyIDg3LjYyMjcgMjAyLjAwOSA5My44ODg5IDIwNS45MTkgOTUuNjUyNUMxOTYuNjM0IDEwNC43MSAxOTAuNzA3IDExOS4wNTYgMTkzLjU4IDEzMS45NDNDMTkzLjYxNSAxMzIuMDU1IDE5My42ODggMTMyLjE1IDE5My43ODcgMTMyLjIxM0MxOTMuODg2IDEzMi4yNzYgMTk0LjAwMyAxMzIuMzAyIDE5NC4xMiAxMzIuMjg4QzE5NC4yMzYgMTMyLjI3MyAxOTQuMzQzIDEzMi4yMTkgMTk0LjQyMyAxMzIuMTM0QzE5NC41MDQgMTMyLjA0OCAxOTQuNTUxIDEzMS45MzggMTk0LjU1OCAxMzEuODIxQzE5My41MjMgMTIxLjk0OCAxOTYuMDA5IDExMi4wMjcgMjAxLjU4MSAxMDMuNzkzQzIwNy4xNTMgOTUuNTU4NiAyMTUuNDU2IDg5LjUzNiAyMjUuMDM4IDg2Ljc3NzlDMjMxLjc5NiA4NS4xMTM4IDIzOC44OTkgODUuNDkyOSAyNDUuNDQgODcuODY2NkMyNDQuMjE3IDg5Ljk5MzggMjQzLjA3IDkyLjE5MDcgMjQxLjk1NyA5NC4zNzIzQzIzNi44ODggMTA0LjMxMiAyMzIuMDYzIDExNC43OTUgMjMyLjE4NCAxMjYuMTAyQzIxNC43NTggMTMzLjU5NiAyMDkuODgzIDEzNC40OTMgMTkzLjA5MiAxMzkuNzE4QzE5Mi45OTEgMTM5Ljc0NyAxOTIuODk3IDEzOS43OTUgMTkyLjgxNSAxMzkuODZDMTkyLjczMyAxMzkuOTI0IDE5Mi42NjUgMTQwLjAwNSAxOTIuNjE0IDE0MC4wOTZDMTkyLjU2NCAxNDAuMTg3IDE5Mi41MzEgMTQwLjI4NyAxOTIuNTE5IDE0MC4zOUMxOTIuNTA3IDE0MC40OTMgMTkyLjUxNiAxNDAuNTk4IDE5Mi41NDUgMTQwLjY5OEMxOTIuNTc0IDE0MC43OTggMTkyLjYyMiAxNDAuODkyIDE5Mi42ODcgMTQwLjk3M0MxOTIuNzUyIDE0MS4wNTUgMTkyLjgzMiAxNDEuMTIzIDE5Mi45MjQgMTQxLjE3M0MxOTMuMDE1IDE0MS4yMjQgMTkzLjExNiAxNDEuMjU2IDE5My4yMiAxNDEuMjY4QzE5My4zMjQgMTQxLjI4IDE5My40MjkgMTQxLjI3MSAxOTMuNTI5IDE0MS4yNDNDMTk1LjI0MiAxNDEuMDI1IDE5Ni45NTEgMTQwLjYzNSAxOTguNjAxIDE0MC4zMzJDMTk0LjY2MyAxOTQuNDMxIDE3OS4yMSAxOTYuMzkzIDE2MC4wNDcgMjMwLjQxOUMxNzMuNjc5IDIxNi41NyAxOTQuMzIxIDIxMC40MTcgMjA3LjM4NSAxOTYuMzE3Wk0yMDYuNzc0IDk0LjkyMzFDMjA0LjQ1MyA5Mi44NTY5IDIwNS40OSA4OS4wODU5IDIwNy42OTEgODcuMzg1NEMyMTAuMTMzIDg1LjQ5NzcgMjE0LjIyNiA4NS42MjE4IDIxNC42NTUgODkuMjA3OEMyMTEuNzgzIDkwLjc1MzIgMjA5LjEzMiA5Mi42NzU1IDIwNi43NzQgOTQuOTIzMVpNMjQxLjQwOCAxMDAuNDUzQzI0NS4xNDkgOTIuNzQxNSAyNDguOTggODQuNTI2NiAyNTQuOTA3IDc4LjIwNkMyNjkuMDkgNjMuMDg0OCAyODAuOTkgNjMuOTYyMyAyODEuNDc4IDg0LjU4OThDMjgxLjU5NCA4OS44MzI4IDI4MS4xMjMgOTUuMDcyNSAyODAuMDczIDEwMC4yMTJMMjc1LjMwOCAxMDQuOTU0QzI2NC4wMDggMTEyLjM3IDI1MS41MzMgMTE3LjYxOSAyMzkuMjIgMTIzLjEyOEMyMzcuMzI1IDEyMy45NzUgMjM1LjQzMyAxMjQuODMgMjMzLjQ3OSAxMjUuNjIxQzIzNC43MTkgMTE2Ljg1NiAyMzcuMzk4IDEwOC4zNTQgMjQxLjQwOCAxMDAuNDUzWiIgZmlsbD0iIzE5MTkxOSIvPgo8cGF0aCBkPSJNMjc2LjAzNiAxMjguMzU2QzI3NC45ODggMTI3LjgxMSAyNzMuODMxIDEyNy41MDIgMjcyLjY0OSAxMjcuNDQ5QzI3MS40NjcgMTI3LjM5NyAyNzAuMjg4IDEyNy42MDMgMjY5LjE5NSAxMjguMDUzQzI2OC4yNyAxMjguNTA5IDI2Ny40NjcgMTI5LjE3NyAyNjYuODUyIDEzMC4wMDFDMjY2LjIzNiAxMzAuODI1IDI2NS44MjUgMTMxLjc4MyAyNjUuNjUzIDEzMi43OTZDMjY1LjQ2NSAxMzMuNTg0IDI2Ni42NDggMTM0LjE0MyAyNjcuMDU4IDEzMy40MDNDMjY3Ljk1NSAxMzEuNzgzIDI2OC42NTIgMTMwLjE5OCAyNzAuNTQxIDEyOS42MzRDMjcyLjI0OSAxMjkuMzU3IDI3My45OTcgMTI5LjQzOSAyNzUuNjcxIDEyOS44NzZDMjc1Ljg0MSAxMjkuODU1IDI3NiAxMjkuNzgzIDI3Ni4xMjcgMTI5LjY3QzI3Ni4yNTQgMTI5LjU1NyAyNzYuMzQ0IDEyOS40MDggMjc2LjM4NCAxMjkuMjQyQzI3Ni40MjQgMTI5LjA3NyAyNzYuNDEyIDEyOC45MDMgMjc2LjM0OSAxMjguNzQ1QzI3Ni4yODcgMTI4LjU4NyAyNzYuMTc4IDEyOC40NTEgMjc2LjAzNiAxMjguMzU2WiIgZmlsbD0iIzE5MTkxOSIvPgo8cGF0aCBkPSJNNDA4Ljc3OSAyMzYuMzE3QzQwMy42MjIgMjM0LjY5MiAzOTguMDIxIDIzMy43OTMgMzkyLjcxNCAyMzIuNjdDMzg3LjQwNiAyMzEuNTQ2IDM4Mi4wMjQgMjMwLjM2IDM3Ni42NTEgMjI5LjMyNkMzNzYuODIyIDIyNy40MDUgMzc2Ljg0MiAyMjUuNDc1IDM3Ni43MSAyMjMuNTUxQzM3Ni43MDQgMjIzLjM4MSAzNzYuNjU3IDIyMy4yMTQgMzc2LjU3MiAyMjMuMDY1QzM3Ni40ODcgMjIyLjkxNyAzNzYuMzY3IDIyMi43OTEgMzc2LjIyMiAyMjIuN0MzNzIuMjk2IDIyMC42MzMgMzY3Ljk1NSAyMTkuNDcgMzYzLjUxNyAyMTkuMjk3QzM2Mi42IDIxOS4yODQgMzYyLjY1OSAyMjAuNTgyIDM2My41MTcgMjIwLjY5NUMzNjYuNTkgMjIxLjAxMyAzNjkuNTk2IDIyMS43OTEgMzcyLjQzNSAyMjMuMDA1QzM3My4xNzYgMjIzLjM1MSAzNzQuMjA3IDIyMy42MTIgMzc0LjU3MiAyMjQuNDAzQzM3Ni40MDEgMjI3LjU4OCAzNzIuOTAxIDIzOC4wNDEgMzcwLjcyNCAyNDIuNjkyQzM3MC42NDUgMjQyLjg1MiAzNzAuNjI5IDI0My4wMzYgMzcwLjY4IDI0My4yMDdDMzcwLjczMSAyNDMuMzc4IDM3MC44NDUgMjQzLjUyNCAzNzAuOTk4IDI0My42MTZDMzcxLjE1MiAyNDMuNzA4IDM3MS4zMzUgMjQzLjczOSAzNzEuNTExIDI0My43MDNDMzcxLjY4NiAyNDMuNjY2IDM3MS44NDIgMjQzLjU2NiAzNzEuOTQ3IDI0My40MjFDMzc0LjI4IDIzOS43NSAzNzUuOCAyMzUuNjI2IDM3Ni40MDYgMjMxLjMyNEMzODEuODQyIDIzMi41MzkgMzg3LjM0NSAyMzMuNTE5IDM5Mi43NzUgMjM0LjYwNUMzOTcuOTg4IDIzNS44NjIgNDAzLjI3MSAyMzYuODE3IDQwOC41OTUgMjM3LjQ2NEM0MDkuMzI2IDIzNy41MzIgNDA5LjM4NSAyMzYuNSA0MDguNzc5IDIzNi4zMTdaIiBmaWxsPSIjMTkxOTE5Ii8+CjxwYXRoIGQ9Ik00NjUuMDI0IDMwMi4wMTJMMzE5Ljk4OSAzMDYuMDc3QzMxOS43MyAzMDYuMTA2IDMxOS40OCAzMDYuMTg3IDMxOS4yNTMgMzA2LjMxNkMzMTkuMDI2IDMwNi40NDQgMzE4LjgyNyAzMDYuNjE3IDMxOC42NjcgMzA2LjgyNUMzMTguNTA3IDMwNy4wMzIgMzE4LjM5MSAzMDcuMjcgMzE4LjMyNCAzMDcuNTI1QzMxOC4yNTcgMzA3Ljc3OSAzMTguMjQxIDMwOC4wNDQgMzE4LjI3NyAzMDguMzA0TDMyMC45MjIgMzY3LjUzNEMzMjAuOTgyIDM2Ny45OTUgMzIxLjIxMSAzNjguNDE2IDMyMS41NjIgMzY4LjcxNkMzMjEuOTE0IDM2OS4wMTUgMzIyLjM2MyAzNjkuMTcyIDMyMi44MjMgMzY5LjE1NEw0NjYuODUgMzY1LjExN0M0NjcuMzM5IDM2NS4wOTggNDY3LjgwMiAzNjQuODg1IDQ2OC4xMzggMzY0LjUyNUM0NjguNDc0IDM2NC4xNjUgNDY4LjY1NyAzNjMuNjg3IDQ2OC42NDggMzYzLjE5MUw0NjYuOTY2IDMwMy43M0M0NjYuOTY2IDMwMy40ODMgNDY2LjkxNCAzMDMuMjM4IDQ2Ni44MTMgMzAzLjAxM0M0NjYuNzEzIDMwMi43ODggNDY2LjU2NSAzMDIuNTg3IDQ2Ni4zODEgMzAyLjQyNUM0NjYuMTk3IDMwMi4yNjIgNDY1Ljk4MSAzMDIuMTQxIDQ2NS43NDcgMzAyLjA3QzQ2NS41MTMgMzAxLjk5OSA0NjUuMjY2IDMwMS45NzkgNDY1LjAyNCAzMDIuMDEyWk0zNzIuNDQ2IDM1Ny40NzJMMzM2LjM0OCAzNTguNDg0QzMzNS44MjcgMzU4LjQ5MyAzMzUuMzIxIDM1OC4yOTkgMzM0LjkzNyAzNTcuOTQxQzMzNC41NTMgMzU3LjU4MyAzMzQuMzIxIDM1Ny4wODkgMzM0LjI4OSAzNTYuNTYzQzMzMy45NDQgMzUwLjA1MyAzMzIuODcyIDMyOS4zMzUgMzMyLjI4OCAzMTcuMjA1QzMzMi4yNzQgMzE2LjkzNCAzMzIuMzE0IDMxNi42NjMgMzMyLjQwNSAzMTYuNDA4QzMzMi40OTYgMzE2LjE1MyAzMzIuNjM3IDMxNS45MTkgMzMyLjgxOSAzMTUuNzJDMzMzLjAwMiAzMTUuNTIxIDMzMy4yMjIgMzE1LjM2MSAzMzMuNDY2IDMxNS4yNUMzMzMuNzExIDMxNS4xMzkgMzMzLjk3NSAzMTUuMDc4IDMzNC4yNDQgMzE1LjA3MkwzNzAuNTAyIDMxNC4wNTZDMzcxLjAzIDMxNC4wMzggMzcxLjU0NCAzMTQuMjMyIDM3MS45MzIgMzE0LjU5NUMzNzIuMzIxIDMxNC45NTggMzcyLjU1MSAzMTUuNDYxIDM3Mi41NzQgMzE1Ljk5NUMzNzIuOTQ4IDMyNi4zNzkgMzc0LjEwMSAzNDcuMjE0IDM3NC40MTEgMzU1LjMxN0MzNzQuNDIyIDM1NS41ODkgMzc0LjM4MSAzNTUuODYgMzc0LjI4OCAzNTYuMTE2QzM3NC4xOTUgMzU2LjM3MiAzNzQuMDU0IDM1Ni42MDYgMzczLjg3MSAzNTYuODA3QzM3My42ODkgMzU3LjAwNyAzNzMuNDY5IDM1Ny4xNjkgMzczLjIyNSAzNTcuMjgzQzM3Mi45OCAzNTcuMzk3IDM3Mi43MTYgMzU3LjQ2MSAzNzIuNDQ2IDM1Ny40NzJaTTM4My42NzIgMzI2LjY4OEMzODQuNzY5IDMyNS45MTIgMzg2LjExMiAzMjYuMDEyIDM4Ni41MzkgMzI2Ljg1M0MzODYuNzI3IDMyNy40MDIgMzg2LjcxOCAzMjguMDAxIDM4Ni41MTQgMzI4LjU0M0MzODYuMzA5IDMyOS4wODYgMzg1LjkyMSAzMjkuNTM4IDM4NS40MTkgMzI5LjgyQzM4NC4zMTIgMzMwLjU4MyAzODIuOTggMzMwLjQ5NyAzODIuNTUxIDMyOS42NTVDMzgxLjk5OCAzMjguODE1IDM4Mi41NTYgMzI3LjQ4IDM4My42NzIgMzI2LjY4OFpNMzgyLjg4MyAzNDAuMTIxQzM4Mi42OSAzMzkuNTYzIDM4Mi43MDYgMzM4Ljk1MiAzODIuOTI4IDMzOC40MDVDMzgzLjE1IDMzNy44NTcgMzgzLjU2MyAzMzcuNDEyIDM4NC4wODkgMzM3LjE1MkMzODUuMjcgMzM2LjM4NSAzODYuNjUxIDMzNi40NzIgMzg3LjExOCAzMzcuMzEyQzM4Ny4zMDcgMzM3Ljg3MSAzODcuMjg5IDMzOC40ODEgMzg3LjA2NyAzMzkuMDI3QzM4Ni44NDUgMzM5LjU3MyAzODYuNDM0IDM0MC4wMTggMzg1LjkxIDM0MC4yOEMzODQuNzY0IDM0MS4wODYgMzgzLjM3NiAzNDEuMDEyIDM4Mi44ODMgMzQwLjEyMVpNMzg2Ljc0NSAzNDkuNzk1QzM4NS41NjMgMzUwLjU2MiAzODQuMTgzIDM1MC40NzUgMzgzLjcxNiAzNDkuNjM1QzM4My41MjYgMzQ5LjA3NiAzODMuNTQ0IDM0OC40NjcgMzgzLjc2NiAzNDcuOTIxQzM4My45ODggMzQ3LjM3NSAzODQuMzk4IDM0Ni45MjkgMzg0LjkyMiAzNDYuNjY3QzM4Ni4xMDMgMzQ1LjkgMzg3LjQ4MyAzNDUuOTg3IDM4Ny45NSAzNDYuODI2QzM4OC4xNSAzNDcuMzg0IDM4OC4xMzggMzQ3Ljk5NyAzODcuOTE1IDM0OC41NDZDMzg3LjY5MiAzNDkuMDk1IDM4Ny4yNzUgMzQ5LjU0IDM4Ni43NDUgMzQ5Ljc5NVpNNDI4Ljg5MSAzNDguODU5QzQxNS43NzggMzQ5Ljk0IDQwMC45NSAzNTAuMjUxIDM5NS42NDggMzQ5LjU0NkMzOTAuMzQ0IDM0OC43OTggMzk2LjY3NCAzNDcuMzE1IDQwOS43OTMgMzQ2LjIxNEM0MjIuOTExIDM0NS4xMTIgNDM3LjczNCAzNDQuODIyIDQ0My4wMzYgMzQ1LjUyN0M0NDguMjkzIDM0Ni4yNzYgNDQxLjk2NSAzNDcuNzc5IDQyOC44OTEgMzQ4Ljg1OVpNNDAxLjc0OSAzMzUuNzJDNDA4LjQxMiAzMzQuNzgyIDQxNi4wMzMgMzM0LjcxMiA0MTguNzU2IDMzNS40ODdDNDIxLjQ4MSAzMzYuMzA5IDQxOC4yNTYgMzM3LjcwMyA0MTEuNTQ3IDMzOC42MjVDNDA0Ljg4MSAzMzkuNTQ1IDM5Ny4yNjMgMzM5LjYzMyAzOTQuNTM5IDMzOC44NTZDMzkxLjgxNiAzMzguMDc5IDM5NS4wMzkgMzM2LjY2NSA0MDEuNzQ5IDMzNS43MlpNNDI4LjgxNyAzMjcuNjYzQzQxNS4wMTMgMzI4Ljg0NSAzOTkuMzA3IDMyOS4yMjQgMzkzLjY4MSAzMjguNTI2QzM4OC4wOTkgMzI3LjgyNyAzOTQuNzg4IDMyNi4yOTQgNDA4LjU4NCAzMjUuMTMzQzQyMi4zODggMzIzLjkzNSA0MzguMDk1IDMyMy41NzIgNDQzLjcyIDMyNC4yN0M0NDkuMzAzIDMyNC45NzMgNDQyLjY1MSAzMjYuNDgzIDQyOC44MTEgMzI3LjY2Nkw0MjguODE3IDMyNy42NjNaIiBmaWxsPSIjMDE2N0ZGIi8+CjxwYXRoIGQ9Ik00NjYuNzc0IDI3MS40NTlMMzIwLjkxNSAyNzUuNTQ3QzMyMC4xMjQgMjc1LjU2OSAzMTkuNTYyIDI3Ni42NyAzMTkuNiAyNzguMDA3TDMxOS45NTUgMjkwLjU3MkMzMTkuOTkzIDI5MS45MDkgMzIwLjcwMiAyOTMuMDU5IDMyMS40OTUgMjkyLjk1Mkw0NjcuMzUzIDI4OC44NjRDNDY4LjE0NCAyODguODQyIDQ2OC43MDYgMjg3Ljc0MSA0NjguNjY4IDI4Ni40MDRMNDY4LjMxMyAyNzMuODM5QzQ2OC4xOTYgMjcyLjUwNCA0NjcuNTY4IDI3MS40MzcgNDY2Ljc3NCAyNzEuNDU5Wk00NjUuMTIxIDI4MS45MDlDNDY1LjEyOCAyODIuMDkgNDY1LjEgMjgyLjI3MSA0NjUuMDM5IDI4Mi40NDFDNDY0Ljk3OSAyODIuNjExIDQ2NC44ODYgMjgyLjc2NiA0NjQuNzY4IDI4Mi44OThDNDY0LjY0OSAyODMuMDI5IDQ2NC41MDcgMjgzLjEzNSA0NjQuMzQ4IDI4My4yMDhDNDY0LjE5IDI4My4yODEgNDY0LjAyIDI4My4zMTkgNDYzLjg0NyAyODMuMzIyTDMyNC4zODcgMjg3LjIzMUMzMjQuMjE1IDI4Ny4yMzcgMzI0LjA0MyAyODcuMjA4IDMyMy44ODEgMjg3LjE0NEMzMjMuNzE5IDI4Ny4wOCAzMjMuNTcxIDI4Ni45ODMgMzIzLjQ0NSAyODYuODU4QzMyMy4zMTkgMjg2LjczMyAzMjMuMjE5IDI4Ni41ODMgMzIzLjE0OSAyODYuNDE3QzMyMy4wNzkgMjg2LjI1MSAzMjMuMDQxIDI4Ni4wNzIgMzIzLjAzOCAyODUuODkxTDMyMi45NDQgMjgyLjU5MUMzMjIuOTM3IDI4Mi40MSAzMjIuOTY1IDI4Mi4yMjkgMzIzLjAyNSAyODIuMDU5QzMyMy4wODYgMjgxLjg5IDMyMy4xNzggMjgxLjczNCAzMjMuMjk2IDI4MS42MDNDMzIzLjQxNSAyODEuNDcxIDMyMy41NTcgMjgxLjM2NiAzMjMuNzE1IDI4MS4yOTNDMzIzLjg3MyAyODEuMjIgMzI0LjA0MyAyODEuMTgxIDMyNC4yMTYgMjgxLjE3OEw0NjMuNjc2IDI3Ny4yNjlDNDYzLjg0OCAyNzcuMjYyIDQ2NC4wMjEgMjc3LjI5MiA0NjQuMTgyIDI3Ny4zNTZDNDY0LjM0NCAyNzcuNDIgNDY0LjQ5MyAyNzcuNTE3IDQ2NC42MTggMjc3LjY0MkM0NjQuNzQ0IDI3Ny43NjcgNDY0Ljg0NSAyNzcuOTE2IDQ2NC45MTUgMjc4LjA4M0M0NjQuOTg2IDI3OC4yNDkgNDY1LjAyNCAyNzguNDI4IDQ2NS4wMjcgMjc4LjYwOUw0NjUuMTIxIDI4MS45MDlaIiBmaWxsPSIjMDE2N0ZGIi8+Cjwvc3ZnPgo=");


/***/ }),

/***/ "./src/assets/images/welcome-store-banner.svg":
/*!****************************************************!*\
  !*** ./src/assets/images/welcome-store-banner.svg ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReactComponent: () => (/* binding */ SvgWelcomeStoreBanner),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _circle, _path;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

function SvgWelcomeStoreBanner(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", _extends({
    width: 60,
    height: 60,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _circle || (_circle = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
    cx: 30,
    cy: 30,
    r: 30,
    fill: "#0167FF",
    fillOpacity: 0.2
  })), _path || (_path = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M44.592 30.714a1.607 1.607 0 01-2.743 1.136l-2.567-2.567-5.794 6.128a3.12 3.12 0 01-4.427.058v.002l-.015-.015-3.671-3.668-6.309 6.31a2.144 2.144 0 01-3.032-3.032l7.142-7.14.015-.015a3.122 3.122 0 014.37 0l.015.015 3.645 3.645 5.029-5.318-2.229-2.229a1.607 1.607 0 011.136-2.743h7.826a1.607 1.607 0 011.607 1.607v7.826h.002z",
    fill: "#0167FF"
  })));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiMwMTY3RkYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDQuNTkyMSAzMC43MTQxQzQ0LjU5MTggMzEuMDMxOCA0NC40OTc0IDMxLjM0MjIgNDQuMzIwOCAzMS42MDYyQzQ0LjE0NDIgMzEuODcwMyA0My44OTMzIDMyLjA3NjEgNDMuNTk5OCAzMi4xOTc2QzQzLjMwNjMgMzIuMzE5MSA0Mi45ODM0IDMyLjM1MDkgNDIuNjcxOCAzMi4yODlDNDIuMzYwMiAzMi4yMjcxIDQyLjA3NCAzMi4wNzQzIDQxLjg0OTIgMzEuODQ5OEwzOS4yODIxIDI5LjI4MjdMMzMuNDg3OCAzNS40MTEyQzMzLjIwMTUgMzUuNzA2OCAzMi44NTk2IDM1Ljk0MjggMzIuNDgxOCAzNi4xMDU3QzMyLjEwNCAzNi4yNjg2IDMxLjY5NzcgMzYuMzU1MyAzMS4yODYzIDM2LjM2MDZDMzAuODc0OCAzNi4zNjYgMzAuNDY2NCAzNi4yOSAzMC4wODQ1IDM2LjEzN0MyOS43MDI1IDM1Ljk4NCAyOS4zNTQ2IDM1Ljc1NyAyOS4wNjA3IDM1LjQ2OTFWMzUuNDcxMkwyOS4wNDU3IDM1LjQ1NjJMMjUuMzc0OSAzMS43ODc3TDE5LjA2NjQgMzguMDk4NEMxOC42NjQzIDM4LjUwMDUgMTguMTE4OSAzOC43MjY0IDE3LjU1MDMgMzguNzI2NEMxNi45ODE3IDM4LjcyNjQgMTYuNDM2MyAzOC41MDA1IDE2LjAzNDIgMzguMDk4NEMxNS42MzIxIDM3LjY5NjMgMTUuNDA2MiAzNy4xNTEgMTUuNDA2MiAzNi41ODIzQzE1LjQwNjIgMzYuMDEzNyAxNS42MzIxIDM1LjQ2ODMgMTYuMDM0MiAzNS4wNjYyTDIzLjE3NjQgMjcuOTI2MkwyMy4xOTE0IDI3LjkxMTNDMjMuNzc0OSAyNy4zMzk3IDI0LjU1OTIgMjcuMDE5NiAyNS4zNzYgMjcuMDE5NkMyNi4xOTI4IDI3LjAxOTYgMjYuOTc3MSAyNy4zMzk3IDI3LjU2MDcgMjcuOTExM0wyNy41NzU3IDI3LjkyNjJMMzEuMjIwNyAzMS41NzEyTDM2LjI0OTkgMjYuMjUyN0wzNC4wMjE0IDI0LjAyNDFDMzMuNzk2OSAyMy43OTkzIDMzLjY0NDEgMjMuNTEzMSAzMy41ODIyIDIzLjIwMTVDMzMuNTIwMyAyMi44OSAzMy41NTIxIDIyLjU2NyAzMy42NzM2IDIyLjI3MzZDMzMuNzk1MSAyMS45ODAxIDM0LjAwMDkgMjEuNzI5MiAzNC4yNjQ5IDIxLjU1MjZDMzQuNTI5IDIxLjM3NTkgMzQuODM5NCAyMS4yODE1IDM1LjE1NzEgMjEuMjgxMkg0Mi45ODI4QzQzLjQwOSAyMS4yODEyIDQzLjgxNzggMjEuNDUwNiA0NC4xMTkyIDIxLjc1MkM0NC40MjA2IDIyLjA1MzQgNDQuNTg5OSAyMi40NjIyIDQ0LjU4OTkgMjIuODg4NFYzMC43MTQxSDQ0LjU5MjFaIiBmaWxsPSIjMDE2N0ZGIi8+Cjwvc3ZnPgo=");


/***/ }),

/***/ "./src/App.js":
/*!********************!*\
  !*** ./src/App.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _Organisms_Header__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Organisms/Header */ "./src/Organisms/Header.js");
/* harmony import */ var _Pages_Elements__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Pages/Elements */ "./src/Pages/Elements.js");
/* harmony import */ var _Pages_Home__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Pages/Home */ "./src/Pages/Home.js");
/* harmony import */ var _Pages_Image__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Pages/Image */ "./src/Pages/Image.js");
/* harmony import */ var _Pages_NotFound__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Pages/NotFound */ "./src/Pages/NotFound.js");
/* harmony import */ var _Pages_Settings__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Pages/Settings */ "./src/Pages/Settings.js");

/*import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

const Home = () => <div>Its Home</div>;
const Settings = () => <div>Its Setting</div>;
const About = () => <div>Its About</div>;

const App = () => (
  <Router basename='/wp-admin/admin.php'>
    <LoadSettingsPages />
    <div>
      <nav>
        <ul>
          <li><Link to="?page=store-banner">Home</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="?page=store-banner" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  </Router>
);

export default App;
*/








// React Router does not have any opinions about
// how you should parse URL query strings.
//
// If you use simple key=value query strings and
// you do not need to support IE 11, you can use
// the browser's built-in URLSearchParams API.
//
// If your query strings contain array or object
// syntax, you'll probably need to bring your own
// query parsing function.

// const Home = () => <div>Its Home</div>;
// const Settings = () => <div>Its Setting</div>;
// const About = () => <div>Its About</div>;
// const NotFound = () => <div>Its 404</div>;

function App() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_8__.BrowserRouter, {
    basename: "/wp-admin/admin.php"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Organisms_Header__WEBPACK_IMPORTED_MODULE_2__["default"], null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(LoadSettingsPages, null));
}

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  const {
    search
  } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_9__.useLocation)();
  return react__WEBPACK_IMPORTED_MODULE_1___default().useMemo(() => new URLSearchParams(search), [search]);
}
function LoadSettingsPages() {
  let query = useQuery();
  if (query.get("path")) {
    if (query.get("path") === 'settings') {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Pages_Settings__WEBPACK_IMPORTED_MODULE_7__["default"], null);
    } else if (query.get("path") === 'elements') {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Pages_Elements__WEBPACK_IMPORTED_MODULE_3__["default"], null);
    } else if (query.get("path") === 'image') {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Pages_Image__WEBPACK_IMPORTED_MODULE_5__["default"], {
        onSelectImage: image => console.log(image)
      });
    } else {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Pages_NotFound__WEBPACK_IMPORTED_MODULE_6__["default"], null);
    }
  } else {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Pages_Home__WEBPACK_IMPORTED_MODULE_4__["default"], null);
  }
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_8__.NavLink, {
    to: "?page=store-banner",
    className: ({
      isActive,
      isPending,
      isTransitioning
    }) => [isPending ? "pending" : "", isActive ? "current" : "", isTransitioning ? "transitioning" : ""].join(" ")
  }, "Dashboard")), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_8__.NavLink, {
    to: "?page=store-banner&path=settings",
    className: ({
      isActive,
      isPending,
      isTransitioning
    }) => [isPending ? "pending" : "", isActive ? "current" : "", isTransitioning ? "transitioning" : ""].join(" ")
  }, "Setting")), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_8__.NavLink, {
    to: "?page=store-banner&path=elements",
    className: ({
      isActive,
      isPending,
      isTransitioning
    }) => [isPending ? "pending" : "", isActive ? "current" : "", isTransitioning ? "transitioning" : ""].join(" ")
  }, "Elements")), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_8__.NavLink, {
    to: "?page=store-banner&path=image",
    className: ({
      isActive,
      isPending,
      isTransitioning
    }) => [isPending ? "pending" : "", isActive ? "current" : "", isTransitioning ? "transitioning" : ""].join(" ")
  }, "Image"))));
}

/***/ }),

/***/ "./src/Molecules/Card.js":
/*!*******************************!*\
  !*** ./src/Molecules/Card.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Card)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Cta__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Cta */ "./src/Molecules/Cta.js");
/* harmony import */ var _Imgbox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Imgbox */ "./src/Molecules/Imgbox.js");




function Card(props) {
  // console.log(props);
  const {
    className,
    header,
    body,
    footer
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: ['card-box', className ? className : ''].join(" ")
  }, header && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "card-header"
  }, header.imgBox && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Imgbox__WEBPACK_IMPORTED_MODULE_3__["default"], {
    data: header.imgBox
  }), header.cta && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Cta__WEBPACK_IMPORTED_MODULE_2__["default"], {
    data: header.cta
  }), header.html && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    dangerouslySetInnerHTML: {
      __html: header.html
    }
  })), body && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "card-body"
  }, body.imgBox && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Imgbox__WEBPACK_IMPORTED_MODULE_3__["default"], {
    data: body.imgBox
  }), body.cta && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Cta__WEBPACK_IMPORTED_MODULE_2__["default"], {
    data: body.cta
  }), body.html && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    dangerouslySetInnerHTML: {
      __html: body.html
    }
  })), footer && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "card-footer"
  }, footer.imgBox && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Imgbox__WEBPACK_IMPORTED_MODULE_3__["default"], {
    data: footer.imgBox
  }), footer.cta && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Cta__WEBPACK_IMPORTED_MODULE_2__["default"], {
    data: footer.cta
  }), footer.html && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    dangerouslySetInnerHTML: {
      __html: footer.html
    }
  })));
}

/***/ }),

/***/ "./src/Molecules/Cta.js":
/*!******************************!*\
  !*** ./src/Molecules/Cta.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cta)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


function Cta(props) {
  // console.log(props);
  const {
    className,
    title,
    content,
    btn
  } = props.data;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: ['cta-box', className ? className : ''].join(" ")
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "row align-items-center"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "col-lg-6 text-center text-lg-start"
  }, title && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
    className: "cta-title",
    dangerouslySetInnerHTML: {
      __html: title
    }
  }), content && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cta-content",
    dangerouslySetInnerHTML: {
      __html: content
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "col-lg-6 text-center text-lg-end"
  }, btn && btn.length && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "btn-group"
  }, btn.map((item, index) => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    className: ['button', item.className ? item.className : ''].join(" "),
    key: index,
    href: item.url,
    target: "_blank"
  }, item.title))))));
}

/***/ }),

/***/ "./src/Molecules/Imgbox.js":
/*!*********************************!*\
  !*** ./src/Molecules/Imgbox.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Imgbox)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Image.js");



function Imgbox(props) {
  // console.log(props)
  const {
    className,
    img,
    title,
    content,
    btn
  } = props.data;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: ['img-box', 'd-flex', className ? className : ''].join(" ")
  }, img && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "part-img"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["default"], {
    className: "img-box-image",
    fluid: "fluid",
    src: img
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "part-content"
  }, title && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
    className: "img-box-title",
    dangerouslySetInnerHTML: {
      __html: title
    }
  }), content && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "img-box-content",
    dangerouslySetInnerHTML: {
      __html: content
    }
  }), btn && btn.length && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "img-box-button-group mt-2"
  }, btn.map((item, index) => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    className: ['img-box-button', item.className ? item.className : ''].join(" "),
    key: index,
    href: item.url,
    target: "_blank"
  }, item.title)))));
}

/***/ }),

/***/ "./src/Organisms/Header.js":
/*!*********************************!*\
  !*** ./src/Organisms/Header.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Header)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Container.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Row.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Col.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Image.js");
/* harmony import */ var _assets_images_icon_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../assets/images/icon.svg */ "./src/assets/images/icon.svg");
/* harmony import */ var _assets_images_logo_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../assets/images/logo.svg */ "./src/assets/images/logo.svg");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
/* harmony import */ var _data_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../data.json */ "./src/data.json");

// import React, { Component, Suspense } from "react";







function Header() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("section", {
    className: "store-banner-header"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__["default"], {
    fluid: "fluid"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "topbar-part bg-dark-blue"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "text-center"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('You\'re Using', 'store-banner'), " ", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null, _data_json__WEBPACK_IMPORTED_MODULE_5__.name), " ", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "d-inline-block text-lite-blue"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Free Version', 'store-banner'))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__["default"], {
    fluid: "fluid"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "header-part bg-lite-blue"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_7__["default"], {
    className: "align-items-center"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_8__["default"], {
    className: "col-lg-8 left-header"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "d-flex flex-column flex-lg-row align-items-center"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_9__["default"], {
    fluid: "fluid",
    src: _assets_images_icon_svg__WEBPACK_IMPORTED_MODULE_3__["default"],
    alt: _data_json__WEBPACK_IMPORTED_MODULE_5__.name + ' - Logo',
    width: "59",
    height: "42"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_9__["default"], {
    fluid: "fluid",
    src: _assets_images_logo_svg__WEBPACK_IMPORTED_MODULE_4__["default"],
    alt: "Programme-lab-Logo",
    width: "176",
    height: "36"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(HeaderLeftNav, null))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_8__["default"], {
    className: "col-lg-4 right-header text-center text-lg-end"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: "list-inline"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    className: "list-inline-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "https://www.programmelab.com/",
    className: "leanrmore-link",
    target: "_blank"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Learn More', 'store-banner'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    className: "list-inline-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "#",
    className: "review-link"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    clipPath: "url(#clip0_3319_11057)"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M10 0C4.48598 0 0 4.48598 0 10C0 15.514 4.48598 20 10 20C15.514 20 20 15.514 20 10C20 4.48598 15.514 0 10 0ZM10 18.75C5.17523 18.75 1.25 14.8248 1.25 10C1.25 5.17523 5.17523 1.25 10 1.25C14.8248 1.25 18.75 5.17523 18.75 10C18.75 14.8248 14.8248 18.75 10 18.75ZM15.2678 13.0469C14.1751 14.9393 12.2059 16.0691 10.0002 16.0691C7.79434 16.0691 5.825 14.9393 4.73223 13.0469C4.55961 12.748 4.66199 12.3657 4.9609 12.1931C5.25988 12.0205 5.64211 12.1229 5.81465 12.4218C6.68148 13.9229 8.24617 14.8191 10.0001 14.8191C11.754 14.8191 13.3186 13.9229 14.1853 12.4218C14.3579 12.1229 14.7402 12.0205 15.0391 12.1931C15.338 12.3657 15.4404 12.7479 15.2678 13.0469ZM4.63586 7.53684C4.63586 6.8473 5.19684 6.28629 5.88641 6.28629C6.57598 6.28629 7.13695 6.84727 7.13695 7.53684C7.13695 8.22641 6.57598 8.78738 5.88641 8.78738C5.19684 8.78738 4.63586 8.22641 4.63586 7.53684ZM15.3642 7.53684C15.3642 8.22637 14.8032 8.78738 14.1136 8.78738C13.4241 8.78738 12.8631 8.22641 12.8631 7.53684C12.8631 6.84727 13.4241 6.28629 14.1136 6.28629C14.8032 6.28633 15.3642 6.8473 15.3642 7.53684Z",
    fill: "white"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("clipPath", {
    id: "clip0_3319_11057"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
    width: "20",
    height: "20",
    fill: "white"
  }))))))))))));
}

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  const {
    search
  } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_10__.useLocation)();
  return react__WEBPACK_IMPORTED_MODULE_2___default().useMemo(() => new URLSearchParams(search), [search]);
}
function HeaderLeftNav() {
  let query = useQuery();
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: "list-inline"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    className: "list-inline-item" /*onClick={(e) => { fn(e, 'welcome') }}*/
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_11__.NavLink, {
    to: "?page=store-banner",
    className: ({
      isActive
    }) => ['welcome-link', isActive && query.get("path") === null ? 'active' : ''].join(" ")
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Welcome', 'store-banner'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    className: "list-inline-item" /*onClick={(e) => { fn(e, 'settings') }}*/
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_11__.NavLink, {
    to: "?page=store-banner&path=settings",
    className: ({
      isActive
    }) => ['settings-link', isActive && query.get("path") === 'settings' ? 'active' : ''].join(" ")
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Settings', 'store-banner'))));
}
const fn = async (e, path) => {
  e.preventDefault();
  e.target.className = 'btn btn-sm btn-light disabled';
  console.log(path);
};

/***/ }),

/***/ "./src/Pages/Elements.js":
/*!*******************************!*\
  !*** ./src/Pages/Elements.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Elements)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Container.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Row.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Col.js");

// import React, { Component, Suspense } from "react";


class Elements extends react__WEBPACK_IMPORTED_MODULE_1__.Component {
  render() {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["default"], {
      className: "p-3",
      fluid: "fluid"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["default"], {
      className: "set-row"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_4__["default"], {
      className: "col-lg-4"
    }, "Col 1"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_4__["default"], null, "Col 2"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_4__["default"], null, "Col 3")));
  }
}

/***/ }),

/***/ "./src/Pages/Home.js":
/*!***************************!*\
  !*** ./src/Pages/Home.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Home)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Container.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Row.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Col.js");
/* harmony import */ var _Molecules_Card__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Molecules/Card */ "./src/Molecules/Card.js");
/* harmony import */ var _assets_images_get_5_star_support_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../assets/images/get-5-star-support.svg */ "./src/assets/images/get-5-star-support.svg");
/* harmony import */ var _assets_images_join_the_community_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../assets/images/join-the-community.svg */ "./src/assets/images/join-the-community.svg");
/* harmony import */ var _assets_images_rate_us_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../assets/images/rate-us.svg */ "./src/assets/images/rate-us.svg");
/* harmony import */ var _assets_images_welcome_feature_image_svg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../assets/images/welcome-feature-image.svg */ "./src/assets/images/welcome-feature-image.svg");
/* harmony import */ var _assets_images_welcome_store_banner_svg__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../assets/images/welcome-store-banner.svg */ "./src/assets/images/welcome-store-banner.svg");










function Home() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("section", {
    className: "settings-page-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_9__["default"], {
    fluid: "fluid"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "content-part"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_10__["default"], null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_11__["default"], {
    className: "col-lg-8 left-content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Molecules_Card__WEBPACK_IMPORTED_MODULE_3__["default"]
  // className="custom-class"      
  , {
    header: {
      imgBox: {
        className: 'gap-4',
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Welcome to Store Banner', 'store-banner'),
        content: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('We designed Store Banner to be intuitive but we do recommend learning how it works by Checking our comprehensive documentation and watching the video below. Enjoy your time with Spectra!', 'store-banner'),
        img: _assets_images_welcome_store_banner_svg__WEBPACK_IMPORTED_MODULE_8__["default"]
      }
    },
    body: {
      html: `<div class="text-center"><img class="img-fluid" src="${_assets_images_welcome_feature_image_svg__WEBPACK_IMPORTED_MODULE_7__["default"]}" /></div>`
    },
    footer: {
      cta: {
        content: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enjoyed Store Banner ? Please leave us a rating. We really appreciate your support!', 'store-banner'),
        btn: [{
          'url': '#',
          'title': (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Create New Page', 'store-banner'),
          'className': 'button-solid button-solid-blue'
        }, {
          'url': '#',
          'title': (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Visit Our Website', 'store-banner')
        }]
      }
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_11__["default"], {
    className: "col-lg-4 right-content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Molecules_Card__WEBPACK_IMPORTED_MODULE_3__["default"]
  // className="custom-class"      
  , {
    body: {
      imgBox: {
        className: 'gap-3',
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Get 5-star Support', 'store-banner'),
        content: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Need some help? Our awesome support team is here to help you with any question you have.', 'store-banner'),
        img: _assets_images_get_5_star_support_svg__WEBPACK_IMPORTED_MODULE_4__["default"],
        btn: [{
          'url': '#',
          'title': (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Get Support', 'store-banner')
        }]
      }
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Molecules_Card__WEBPACK_IMPORTED_MODULE_3__["default"]
  // className="custom-class"      
  , {
    body: {
      imgBox: {
        className: 'gap-3',
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Join the Community', 'store-banner'),
        content: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Got a question about the plugin, want to share your awesome project or just say hi? Join our wonderful community!'),
        img: _assets_images_join_the_community_svg__WEBPACK_IMPORTED_MODULE_5__["default"],
        btn: [{
          'url': '#',
          'title': (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Get Support', 'store-banner')
        }]
      }
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Molecules_Card__WEBPACK_IMPORTED_MODULE_3__["default"]
  // className="custom-class"      
  , {
    body: {
      imgBox: {
        className: 'gap-3',
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Rate Us', 'store-banner'),
        content: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('We love to hear from you, we would appreciate your every single review.', 'store-banner'),
        img: _assets_images_rate_us_svg__WEBPACK_IMPORTED_MODULE_6__["default"],
        btn: [{
          'url': '#',
          'title': (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Get Support', 'store-banner')
        }]
      }
    }
  }))))));
}
;

/***/ }),

/***/ "./src/Pages/Image.js":
/*!****************************!*\
  !*** ./src/Pages/Image.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);




const ALLOWED_MEDIA_TYPES = ['image'];
const Image = ({
  onSelectImage
}) => {
  const [mediaId, setMediaId] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(null);
  const handleSelect = media => {
    console.log('selected media:', media);
    setMediaId(media.id);
    if (onSelectImage) {
      onSelectImage(media);
    }
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "photo-uploader"
  }, mediaId, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
    onSelect: handleSelect,
    allowedTypes: ALLOWED_MEDIA_TYPES,
    value: mediaId,
    render: ({
      open
    }) => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      onClick: open
    }, "Open Media Library")
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Image);

/***/ }),

/***/ "./src/Pages/NotFound.js":
/*!*******************************!*\
  !*** ./src/Pages/NotFound.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NotFound)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


function NotFound() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "text-center"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    width: "512",
    height: "512",
    viewBox: "0 0 1550 1550",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M1519 425c-13.3 0-24-10.7-24-24V224c0-19.9-16.1-36-36-36H91c-19.9 0-36 16.1-36 36v177c0 13.3-10.7 24-24 24S7 414.3 7 401V224c0-46.3 37.7-84 84-84h1368c46.3 0 84 37.7 84 84v177c0 13.3-10.7 24-24 24z",
    fill: "#000000",
    opacity: "1",
    dataOriginal: "#000000"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M1459 1410H91c-46.3 0-84-37.7-84-84V401c0-13.3 10.7-24 24-24h1488c13.3 0 24 10.7 24 24v925c0 46.3-37.7 84-84 84zM55 425v901c0 19.9 16.1 36 36 36h1368c19.9 0 36-16.1 36-36V425zM218 317.5c-19.3 0-35-15.7-35-35s15.7-35 35-35 35 15.7 35 35-15.7 35-35 35zM356 317.5c-19.3 0-35-15.7-35-35s15.7-35 35-35 35 15.7 35 35-15.7 35-35 35zM494 317.5c-19.3 0-35-15.7-35-35s15.7-35 35-35 35 15.7 35 35-15.7 35-35 35z",
    fill: "#000000",
    opacity: "1",
    dataOriginal: "#000000"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M452.6 1128.7c-13.3 0-24-10.7-24-24v-95.5H235.1c-9 0-17.2-5-21.4-13-4.1-8-3.4-17.6 1.9-25l217.5-302.9c6.1-8.5 16.9-12 26.8-8.8s16.6 12.4 16.6 22.8v278.9h51.8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-51.8v95.5c.1 13.3-10.6 24-23.9 24zM281.9 961.2h146.7V756.9zM1239.1 1128.7c-13.3 0-24-10.7-24-24v-95.5h-193.5c-9 0-17.2-5-21.4-13-4.1-8-3.4-17.6 1.9-25l217.5-302.9c6.1-8.5 16.9-12 26.8-8.8s16.6 12.4 16.6 22.8v278.9h51.8c13.3 0 24 10.7 24 24s-10.7 24-24 24H1263v95.5c.1 13.3-10.7 24-23.9 24zm-170.7-167.5h146.7V756.9zM775 1128.7c-79.5 0-144.1-64.6-144.1-144.1V802.4c0-79.5 64.6-144.1 144.1-144.1s144.1 64.6 144.1 144.1v182.2c0 79.5-64.6 144.1-144.1 144.1zm0-422.4c-53 0-96.1 43.1-96.1 96.1v182.2c0 53 43.1 96.1 96.1 96.1s96.1-43.1 96.1-96.1V802.4c0-53-43.1-96.1-96.1-96.1z",
    fill: "#000000",
    opacity: "1",
    dataOriginal: "#000000"
  }))));
}

/***/ }),

/***/ "./src/Pages/Settings.js":
/*!*******************************!*\
  !*** ./src/Pages/Settings.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Settings)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Container.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Row.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Col.js");
/* harmony import */ var _assets_images_no_image_available_png__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../assets/images/no_image_available.png */ "./src/assets/images/no_image_available.png");


// import React, { useEffect, useState } from 'react';
// import { Card, Col, Container, Row } from 'react-bootstrap';
// const useEffect = wp.element.useState;
// const useState = wp.element.useState;
// import Logo from '../assets/images/logo.svg';






const nonce = document.getElementById('nonce-field');
function Settings(props) {
  const [option1, setOption1] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [option2, setOption2] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [options, setOptions] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [image, setImage] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    /**
     * Initialize the options fields with the data received from the REST API
     * endpoint provided by the plugin.
     */
    wp.apiFetch({
      path: '/store_banner/v1/options'
    }).then(data => {
      let options = {};
      //Set the new values of the options in the state
      setOption1(data['plugin_option_1']);
      setOption2(data['plugin_option_2']);
      setOptions(data['programmelab_store_banner']);
    });
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (Object.keys(options).length) {
      setLoading(false);
    }
  }, [options]);
  const handleOptionsChange = (key, value) => {
    setOptions(prevOptions => ({
      ...prevOptions,
      [key]: value
    }));
    // console.log(options);
  };
  const handleNestedOptionsChange = (key, subKey, value) => {
    setOptions(prevOptions => ({
      ...prevOptions,
      [key]: {
        ...prevOptions[key],
        [subKey]: value
      }
    }));
  };
  const onSelect = media => {
    setImage(media);
    if (onSelectImage) {
      onSelectImage(media);
    }
  };
  const removeImage = () => {
    setImage(null);
    if (onSelectImage) {
      onSelectImage(null);
    }
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("section", {
    className: "settings-page-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__["default"], {
    fluid: "fluid"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "content-part"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_7__["default"], {
    className: "justify-content-lg-center"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_8__["default"], {
    className: "col-lg-8"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "settings-box"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "d-flex"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "nav-area"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: "options-menu d-flex flex-column"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "#",
    className: "store-banner-nav-tab nav-tab-active"
  }, "Banner"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "#"
  }, "Product Page")), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "#"
  }, "Shop Page")), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "#"
  }, "Checkout Page")), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "#"
  }, "Cart Page")))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    className: "mt-auto"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "#",
    className: "store-banner-nav-tab"
  }, "Settings")))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "options-area d-flex flex-column"
  }, loading ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "page-loader"
  }) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "options"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "store-banner-setting-unit"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "switch-setting-unit"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "title-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, "Shop"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "hints-css hint--bottom",
    "aria-label": "Enable banner option for shop page."
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("i", {
    className: "dashicons dashicons-editor-help"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "description"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Choose a banner for the shop page that best aligns with your current marketing goals and target audience."))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "position-relative switcher"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "enable_shop_page"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "checkbox",
    name: "_enable_shop_page",
    id: "enable_shop_page",
    value: "1",
    checked: options?._enable_shop_page ? 'checked' : '',
    onChange: event => handleOptionsChange('_enable_shop_page', event.target.checked)
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("em", {
    "data-on": "on",
    "data-off": "off"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "store-banner-setting-unit store-banner-setting-sub-unit"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "image-uploader-unit"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "title-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, "Banner Image"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "hints-css hint--bottom",
    "aria-label": "Enable banner option for shop page."
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("i", {
    className: "dashicons dashicons-editor-help"
  })))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "position-relative store_banner_image"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "image-uploader"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: ['file-name', options?._shop_page_banner_internal_image?.id ? 'with-close-button' : ''].join(" ")
  }, options?._shop_page_banner_internal_image?.id ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "gallery",
    "data-fancybox": "gallery-rand",
    "data-src": options._shop_page_banner_internal_image.url
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: options._shop_page_banner_internal_image.thumbnail,
    className: "option-image"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "store-banner-remove-image",
    "data-base": _assets_images_no_image_available_png__WEBPACK_IMPORTED_MODULE_5__
  })) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "gallery"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: _assets_images_no_image_available_png__WEBPACK_IMPORTED_MODULE_5__,
    className: "option-image"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "file-detail"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "hidden",
    className: "url",
    value: options._shop_page_banner_internal_image?.url || '',
    onChange: event => handleNestedOptionsChange('_shop_page_banner_internal_image', 'url', event.target.value)
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "hidden",
    className: "thumbnail",
    value: options._shop_page_banner_internal_image?.thumbnail || '',
    onChange: event => handleNestedOptionsChange('_shop_page_banner_internal_image', 'thumbnail', event.target.value)
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "hidden",
    className: "id",
    value: options._shop_page_banner_internal_image?.id || '',
    onChange: event => handleNestedOptionsChange('_shop_page_banner_internal_image', 'id', event.target.value)
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "upload-help-text"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Size: Optional ", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), " File Support: .jpg, .jpeg, .gif, or .png.")), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "button button-primary image-uploader-button single-image-uploader-button"
  }, "Upload Image")))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, "Banner Image URL"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    value: options._shop_page_banner_internal_image?.url || '',
    onChange: event => handleNestedOptionsChange('_shop_page_banner_internal_image', 'url', event.target.value)
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, "Options 1"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    value: option1,
    onChange: event => {
      setOption1(event.target.value);
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, "Options 2"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    value: option2,
    onChange: event => {
      setOption2(event.target.value);
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "photo-uploader"
  }, error && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Notice, {
    status: "error",
    onRemove: () => setError('')
  }, error), image ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "photo-preview"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: image.url,
    alt: image.alt
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    isSecondary: true,
    onClick: removeImage
  }, "Remove Image")) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.MediaUpload, {
    onSelect: onSelect,
    allowedTypes: ['image'],
    value: image ? image.id : '',
    render: ({
      open
    }) => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
      isPrimary: true,
      onClick: open
    }, "Upload Image")
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "save-button mt-auto"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: () => {
      wp.apiFetch({
        path: '/store_banner/v1/options',
        method: 'POST',
        data: {
          'plugin_option_1': option1,
          'plugin_option_2': option2,
          'programmelab_store_banner': options
        }
      }).then(data => {
        alert('Options saved successfully!');
      });
    }
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Save settings', 'store-banner'))))))))))));
}

/***/ }),

/***/ "./node_modules/bootstrap/dist/css/bootstrap.min.css":
/*!***********************************************************!*\
  !*** ./node_modules/bootstrap/dist/css/bootstrap.min.css ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
/***/ ((module) => {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ "./node_modules/prop-types/checkPropTypes.js":
/*!***************************************************!*\
  !*** ./node_modules/prop-types/checkPropTypes.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (true) {
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};
  var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) { /**/ }
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' +
              'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (true) {
    loggedTypeFailures = {};
  }
}

module.exports = checkPropTypes;


/***/ }),

/***/ "./node_modules/prop-types/factoryWithTypeCheckers.js":
/*!************************************************************!*\
  !*** ./node_modules/prop-types/factoryWithTypeCheckers.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/react-is/index.js");
var assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");

var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");
var checkPropTypes = __webpack_require__(/*! ./checkPropTypes */ "./node_modules/prop-types/checkPropTypes.js");

var printWarning = function() {};

if (true) {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bigint: createPrimitiveTypeChecker('bigint'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message, data) {
    this.message = message;
    this.data = data && typeof data === 'object' ? data: {};
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (true) {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if ( true && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError(
          'Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'),
          {expectedType: expectedType}
        );
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!ReactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (true) {
        if (arguments.length > 1) {
          printWarning(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
       true ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      var expectedTypes = [];
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
        if (checkerResult == null) {
          return null;
        }
        if (checkerResult.data && has(checkerResult.data, 'expectedType')) {
          expectedTypes.push(checkerResult.data.expectedType);
        }
      }
      var expectedTypesMessage = (expectedTypes.length > 0) ? ', expected one of type [' + expectedTypes.join(', ') + ']': '';
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`' + expectedTypesMessage + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function invalidValidatorError(componentName, location, propFullName, key, type) {
    return new PropTypeError(
      (componentName || 'React class') + ': ' + location + ' type `' + propFullName + '.' + key + '` is invalid; ' +
      'it must be a function, usually from the `prop-types` package, but received `' + type + '`.'
    );
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (has(shapeTypes, key) && typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ "./node_modules/prop-types/index.js":
/*!******************************************!*\
  !*** ./node_modules/prop-types/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/react-is/index.js");

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(/*! ./factoryWithTypeCheckers */ "./node_modules/prop-types/factoryWithTypeCheckers.js")(ReactIs.isElement, throwOnDirectAccess);
} else {}


/***/ }),

/***/ "./node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!*************************************************************!*\
  !*** ./node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ "./node_modules/prop-types/lib/has.js":
/*!********************************************!*\
  !*** ./node_modules/prop-types/lib/has.js ***!
  \********************************************/
/***/ ((module) => {

module.exports = Function.call.bind(Object.prototype.hasOwnProperty);


/***/ }),

/***/ "./node_modules/react-bootstrap/esm/Col.js":
/*!*************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/Col.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   useCol: () => (/* binding */ useCol)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ThemeProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ThemeProvider */ "./node_modules/react-bootstrap/esm/ThemeProvider.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
"use client";





function useCol({
  as,
  bsPrefix,
  className,
  ...props
}) {
  bsPrefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_3__.useBootstrapPrefix)(bsPrefix, 'col');
  const breakpoints = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_3__.useBootstrapBreakpoints)();
  const minBreakpoint = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_3__.useBootstrapMinBreakpoint)();
  const spans = [];
  const classes = [];
  breakpoints.forEach(brkPoint => {
    const propValue = props[brkPoint];
    delete props[brkPoint];
    let span;
    let offset;
    let order;
    if (typeof propValue === 'object' && propValue != null) {
      ({
        span,
        offset,
        order
      } = propValue);
    } else {
      span = propValue;
    }
    const infix = brkPoint !== minBreakpoint ? `-${brkPoint}` : '';
    if (span) spans.push(span === true ? `${bsPrefix}${infix}` : `${bsPrefix}${infix}-${span}`);
    if (order != null) classes.push(`order${infix}-${order}`);
    if (offset != null) classes.push(`offset${infix}-${offset}`);
  });
  return [{
    ...props,
    className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(className, ...spans, ...classes)
  }, {
    as,
    bsPrefix,
    spans
  }];
}
const Col = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(
// Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
(props, ref) => {
  const [{
    className,
    ...colProps
  }, {
    as: Component = 'div',
    bsPrefix,
    spans
  }] = useCol(props);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Component, {
    ...colProps,
    ref: ref,
    className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(className, !spans.length && bsPrefix)
  });
});
Col.displayName = 'Col';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Col);

/***/ }),

/***/ "./node_modules/react-bootstrap/esm/Container.js":
/*!*******************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/Container.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ThemeProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ThemeProvider */ "./node_modules/react-bootstrap/esm/ThemeProvider.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
"use client";





const Container = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({
  bsPrefix,
  fluid = false,
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = 'div',
  className,
  ...props
}, ref) => {
  const prefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_3__.useBootstrapPrefix)(bsPrefix, 'container');
  const suffix = typeof fluid === 'string' ? `-${fluid}` : '-fluid';
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Component, {
    ref: ref,
    ...props,
    className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(className, fluid ? `${prefix}${suffix}` : prefix)
  });
});
Container.displayName = 'Container';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Container);

/***/ }),

/***/ "./node_modules/react-bootstrap/esm/Image.js":
/*!***************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/Image.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   propTypes: () => (/* binding */ propTypes)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _ThemeProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ThemeProvider */ "./node_modules/react-bootstrap/esm/ThemeProvider.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
"use client";






const propTypes = {
  /**
   * @default 'img'
   */
  bsPrefix: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
  /**
   * Sets image as fluid image.
   */
  fluid: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
  /**
   * Sets image shape as rounded.
   */
  rounded: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
  /**
   * Sets image shape as circle.
   */
  roundedCircle: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
  /**
   * Sets image shape as thumbnail.
   */
  thumbnail: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool)
};
const Image = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({
  bsPrefix,
  className,
  fluid = false,
  rounded = false,
  roundedCircle = false,
  thumbnail = false,
  ...props
}, ref) => {
  bsPrefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_4__.useBootstrapPrefix)(bsPrefix, 'img');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("img", {
    // eslint-disable-line jsx-a11y/alt-text
    ref: ref,
    ...props,
    className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(className, fluid && `${bsPrefix}-fluid`, rounded && `rounded`, roundedCircle && `rounded-circle`, thumbnail && `${bsPrefix}-thumbnail`)
  });
});
Image.displayName = 'Image';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Image);

/***/ }),

/***/ "./node_modules/react-bootstrap/esm/Row.js":
/*!*************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/Row.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ThemeProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ThemeProvider */ "./node_modules/react-bootstrap/esm/ThemeProvider.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
"use client";





const Row = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({
  bsPrefix,
  className,
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = 'div',
  ...props
}, ref) => {
  const decoratedBsPrefix = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_3__.useBootstrapPrefix)(bsPrefix, 'row');
  const breakpoints = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_3__.useBootstrapBreakpoints)();
  const minBreakpoint = (0,_ThemeProvider__WEBPACK_IMPORTED_MODULE_3__.useBootstrapMinBreakpoint)();
  const sizePrefix = `${decoratedBsPrefix}-cols`;
  const classes = [];
  breakpoints.forEach(brkPoint => {
    const propValue = props[brkPoint];
    delete props[brkPoint];
    let cols;
    if (propValue != null && typeof propValue === 'object') {
      ({
        cols
      } = propValue);
    } else {
      cols = propValue;
    }
    const infix = brkPoint !== minBreakpoint ? `-${brkPoint}` : '';
    if (cols != null) classes.push(`${sizePrefix}${infix}-${cols}`);
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Component, {
    ref: ref,
    ...props,
    className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(className, decoratedBsPrefix, ...classes)
  });
});
Row.displayName = 'Row';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Row);

/***/ }),

/***/ "./node_modules/react-bootstrap/esm/ThemeProvider.js":
/*!***********************************************************!*\
  !*** ./node_modules/react-bootstrap/esm/ThemeProvider.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_BREAKPOINTS: () => (/* binding */ DEFAULT_BREAKPOINTS),
/* harmony export */   DEFAULT_MIN_BREAKPOINT: () => (/* binding */ DEFAULT_MIN_BREAKPOINT),
/* harmony export */   ThemeConsumer: () => (/* binding */ Consumer),
/* harmony export */   createBootstrapComponent: () => (/* binding */ createBootstrapComponent),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   useBootstrapBreakpoints: () => (/* binding */ useBootstrapBreakpoints),
/* harmony export */   useBootstrapMinBreakpoint: () => (/* binding */ useBootstrapMinBreakpoint),
/* harmony export */   useBootstrapPrefix: () => (/* binding */ useBootstrapPrefix),
/* harmony export */   useIsRTL: () => (/* binding */ useIsRTL)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
"use client";




const DEFAULT_BREAKPOINTS = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];
const DEFAULT_MIN_BREAKPOINT = 'xs';
const ThemeContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext({
  prefixes: {},
  breakpoints: DEFAULT_BREAKPOINTS,
  minBreakpoint: DEFAULT_MIN_BREAKPOINT
});
const {
  Consumer,
  Provider
} = ThemeContext;
function ThemeProvider({
  prefixes = {},
  breakpoints = DEFAULT_BREAKPOINTS,
  minBreakpoint = DEFAULT_MIN_BREAKPOINT,
  dir,
  children
}) {
  const contextValue = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    prefixes: {
      ...prefixes
    },
    breakpoints,
    minBreakpoint,
    dir
  }), [prefixes, breakpoints, minBreakpoint, dir]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Provider, {
    value: contextValue,
    children: children
  });
}
function useBootstrapPrefix(prefix, defaultPrefix) {
  const {
    prefixes
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(ThemeContext);
  return prefix || prefixes[defaultPrefix] || defaultPrefix;
}
function useBootstrapBreakpoints() {
  const {
    breakpoints
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(ThemeContext);
  return breakpoints;
}
function useBootstrapMinBreakpoint() {
  const {
    minBreakpoint
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(ThemeContext);
  return minBreakpoint;
}
function useIsRTL() {
  const {
    dir
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(ThemeContext);
  return dir === 'rtl';
}
function createBootstrapComponent(Component, opts) {
  if (typeof opts === 'string') opts = {
    prefix: opts
  };
  const isClassy = Component.prototype && Component.prototype.isReactComponent;
  // If it's a functional component make sure we don't break it with a ref
  const {
    prefix,
    forwardRefAs = isClassy ? 'ref' : 'innerRef'
  } = opts;
  const Wrapped = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
    ...props
  }, ref) => {
    props[forwardRefAs] = ref;
    const bsPrefix = useBootstrapPrefix(props.bsPrefix, prefix);
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Component, {
      ...props,
      bsPrefix: bsPrefix
    });
  });
  Wrapped.displayName = `Bootstrap(${Component.displayName || Component.name})`;
  return Wrapped;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ThemeProvider);

/***/ }),

/***/ "./node_modules/react-dom/client.js":
/*!******************************************!*\
  !*** ./node_modules/react-dom/client.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) {} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ }),

/***/ "./node_modules/react-is/cjs/react-is.development.js":
/*!***********************************************************!*\
  !*** ./node_modules/react-is/cjs/react-is.development.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}


/***/ }),

/***/ "./node_modules/react-is/index.js":
/*!****************************************!*\
  !*** ./node_modules/react-is/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ "./node_modules/react-is/cjs/react-is.development.js");
}


/***/ }),

/***/ "./node_modules/react-router-dom/dist/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/react-router-dom/dist/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortedDeferredError: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.AbortedDeferredError),
/* harmony export */   Await: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.Await),
/* harmony export */   BrowserRouter: () => (/* binding */ BrowserRouter),
/* harmony export */   Form: () => (/* binding */ Form),
/* harmony export */   HashRouter: () => (/* binding */ HashRouter),
/* harmony export */   Link: () => (/* binding */ Link),
/* harmony export */   MemoryRouter: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.MemoryRouter),
/* harmony export */   NavLink: () => (/* binding */ NavLink),
/* harmony export */   Navigate: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.Navigate),
/* harmony export */   NavigationType: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.Action),
/* harmony export */   Outlet: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.Outlet),
/* harmony export */   Route: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.Route),
/* harmony export */   Router: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.Router),
/* harmony export */   RouterProvider: () => (/* binding */ RouterProvider),
/* harmony export */   Routes: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.Routes),
/* harmony export */   ScrollRestoration: () => (/* binding */ ScrollRestoration),
/* harmony export */   UNSAFE_DataRouterContext: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_DataRouterContext),
/* harmony export */   UNSAFE_DataRouterStateContext: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_DataRouterStateContext),
/* harmony export */   UNSAFE_ErrorResponseImpl: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_ErrorResponseImpl),
/* harmony export */   UNSAFE_FetchersContext: () => (/* binding */ FetchersContext),
/* harmony export */   UNSAFE_LocationContext: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_LocationContext),
/* harmony export */   UNSAFE_NavigationContext: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_NavigationContext),
/* harmony export */   UNSAFE_RouteContext: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_RouteContext),
/* harmony export */   UNSAFE_ViewTransitionContext: () => (/* binding */ ViewTransitionContext),
/* harmony export */   UNSAFE_useRouteId: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_useRouteId),
/* harmony export */   UNSAFE_useScrollRestoration: () => (/* binding */ useScrollRestoration),
/* harmony export */   createBrowserRouter: () => (/* binding */ createBrowserRouter),
/* harmony export */   createHashRouter: () => (/* binding */ createHashRouter),
/* harmony export */   createMemoryRouter: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.createMemoryRouter),
/* harmony export */   createPath: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.createPath),
/* harmony export */   createRoutesFromChildren: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.createRoutesFromChildren),
/* harmony export */   createRoutesFromElements: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.createRoutesFromElements),
/* harmony export */   createSearchParams: () => (/* binding */ createSearchParams),
/* harmony export */   defer: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.defer),
/* harmony export */   generatePath: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.generatePath),
/* harmony export */   isRouteErrorResponse: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.isRouteErrorResponse),
/* harmony export */   json: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.json),
/* harmony export */   matchPath: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.matchPath),
/* harmony export */   matchRoutes: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.matchRoutes),
/* harmony export */   parsePath: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.parsePath),
/* harmony export */   redirect: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.redirect),
/* harmony export */   redirectDocument: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.redirectDocument),
/* harmony export */   renderMatches: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.renderMatches),
/* harmony export */   resolvePath: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_2__.resolvePath),
/* harmony export */   unstable_HistoryRouter: () => (/* binding */ HistoryRouter),
/* harmony export */   unstable_usePrompt: () => (/* binding */ usePrompt),
/* harmony export */   unstable_useViewTransitionState: () => (/* binding */ useViewTransitionState),
/* harmony export */   useActionData: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.useActionData),
/* harmony export */   useAsyncError: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.useAsyncError),
/* harmony export */   useAsyncValue: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.useAsyncValue),
/* harmony export */   useBeforeUnload: () => (/* binding */ useBeforeUnload),
/* harmony export */   useBlocker: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.useBlocker),
/* harmony export */   useFetcher: () => (/* binding */ useFetcher),
/* harmony export */   useFetchers: () => (/* binding */ useFetchers),
/* harmony export */   useFormAction: () => (/* binding */ useFormAction),
/* harmony export */   useHref: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.useHref),
/* harmony export */   useInRouterContext: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.useInRouterContext),
/* harmony export */   useLinkClickHandler: () => (/* binding */ useLinkClickHandler),
/* harmony export */   useLoaderData: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.useLoaderData),
/* harmony export */   useLocation: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.useLocation),
/* harmony export */   useMatch: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.useMatch),
/* harmony export */   useMatches: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.useMatches),
/* harmony export */   useNavigate: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.useNavigate),
/* harmony export */   useNavigation: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.useNavigation),
/* harmony export */   useNavigationType: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.useNavigationType),
/* harmony export */   useOutlet: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.useOutlet),
/* harmony export */   useOutletContext: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.useOutletContext),
/* harmony export */   useParams: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.useParams),
/* harmony export */   useResolvedPath: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.useResolvedPath),
/* harmony export */   useRevalidator: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.useRevalidator),
/* harmony export */   useRouteError: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.useRouteError),
/* harmony export */   useRouteLoaderData: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.useRouteLoaderData),
/* harmony export */   useRoutes: () => (/* reexport safe */ react_router__WEBPACK_IMPORTED_MODULE_3__.useRoutes),
/* harmony export */   useSearchParams: () => (/* binding */ useSearchParams),
/* harmony export */   useSubmit: () => (/* binding */ useSubmit)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @remix-run/router */ "./node_modules/@remix-run/router/dist/router.js");
/**
 * React Router DOM v6.24.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */







function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

const defaultMethod = "get";
const defaultEncType = "application/x-www-form-urlencoded";
function isHtmlElement(object) {
  return object != null && typeof object.tagName === "string";
}
function isButtonElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "button";
}
function isFormElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "form";
}
function isInputElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "input";
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
  return event.button === 0 && (
  // Ignore everything but left clicks
  !target || target === "_self") &&
  // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event) // Ignore clicks with modifier keys
  ;
}
/**
 * Creates a URLSearchParams object using the given initializer.
 *
 * This is identical to `new URLSearchParams(init)` except it also
 * supports arrays as values in the object form of the initializer
 * instead of just strings. This is convenient when you need multiple
 * values for a given key, but don't want to use an array initializer.
 *
 * For example, instead of:
 *
 *   let searchParams = new URLSearchParams([
 *     ['sort', 'name'],
 *     ['sort', 'price']
 *   ]);
 *
 * you can do:
 *
 *   let searchParams = createSearchParams({
 *     sort: ['name', 'price']
 *   });
 */
function createSearchParams(init) {
  if (init === void 0) {
    init = "";
  }
  return new URLSearchParams(typeof init === "string" || Array.isArray(init) || init instanceof URLSearchParams ? init : Object.keys(init).reduce((memo, key) => {
    let value = init[key];
    return memo.concat(Array.isArray(value) ? value.map(v => [key, v]) : [[key, value]]);
  }, []));
}
function getSearchParamsForLocation(locationSearch, defaultSearchParams) {
  let searchParams = createSearchParams(locationSearch);
  if (defaultSearchParams) {
    // Use `defaultSearchParams.forEach(...)` here instead of iterating of
    // `defaultSearchParams.keys()` to work-around a bug in Firefox related to
    // web extensions. Relevant Bugzilla tickets:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1414602
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1023984
    defaultSearchParams.forEach((_, key) => {
      if (!searchParams.has(key)) {
        defaultSearchParams.getAll(key).forEach(value => {
          searchParams.append(key, value);
        });
      }
    });
  }
  return searchParams;
}
// One-time check for submitter support
let _formDataSupportsSubmitter = null;
function isFormDataSubmitterSupported() {
  if (_formDataSupportsSubmitter === null) {
    try {
      new FormData(document.createElement("form"),
      // @ts-expect-error if FormData supports the submitter parameter, this will throw
      0);
      _formDataSupportsSubmitter = false;
    } catch (e) {
      _formDataSupportsSubmitter = true;
    }
  }
  return _formDataSupportsSubmitter;
}
const supportedFormEncTypes = new Set(["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"]);
function getFormEncType(encType) {
  if (encType != null && !supportedFormEncTypes.has(encType)) {
     true ? (0,react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_warning)(false, "\"" + encType + "\" is not a valid `encType` for `<Form>`/`<fetcher.Form>` " + ("and will default to \"" + defaultEncType + "\"")) : 0;
    return null;
  }
  return encType;
}
function getFormSubmissionInfo(target, basename) {
  let method;
  let action;
  let encType;
  let formData;
  let body;
  if (isFormElement(target)) {
    // When grabbing the action from the element, it will have had the basename
    // prefixed to ensure non-JS scenarios work, so strip it since we'll
    // re-prefix in the router
    let attr = target.getAttribute("action");
    action = attr ? (0,react_router__WEBPACK_IMPORTED_MODULE_2__.stripBasename)(attr, basename) : null;
    method = target.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(target);
  } else if (isButtonElement(target) || isInputElement(target) && (target.type === "submit" || target.type === "image")) {
    let form = target.form;
    if (form == null) {
      throw new Error("Cannot submit a <button> or <input type=\"submit\"> without a <form>");
    }
    // <button>/<input type="submit"> may override attributes of <form>
    // When grabbing the action from the element, it will have had the basename
    // prefixed to ensure non-JS scenarios work, so strip it since we'll
    // re-prefix in the router
    let attr = target.getAttribute("formaction") || form.getAttribute("action");
    action = attr ? (0,react_router__WEBPACK_IMPORTED_MODULE_2__.stripBasename)(attr, basename) : null;
    method = target.getAttribute("formmethod") || form.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("formenctype")) || getFormEncType(form.getAttribute("enctype")) || defaultEncType;
    // Build a FormData object populated from a form and submitter
    formData = new FormData(form, target);
    // If this browser doesn't support the `FormData(el, submitter)` format,
    // then tack on the submitter value at the end.  This is a lightweight
    // solution that is not 100% spec compliant.  For complete support in older
    // browsers, consider using the `formdata-submitter-polyfill` package
    if (!isFormDataSubmitterSupported()) {
      let {
        name,
        type,
        value
      } = target;
      if (type === "image") {
        let prefix = name ? name + "." : "";
        formData.append(prefix + "x", "0");
        formData.append(prefix + "y", "0");
      } else if (name) {
        formData.append(name, value);
      }
    }
  } else if (isHtmlElement(target)) {
    throw new Error("Cannot submit element that is not <form>, <button>, or " + "<input type=\"submit|image\">");
  } else {
    method = defaultMethod;
    action = null;
    encType = defaultEncType;
    body = target;
  }
  // Send body for <Form encType="text/plain" so we encode it into text
  if (formData && encType === "text/plain") {
    body = formData;
    formData = undefined;
  }
  return {
    action,
    method: method.toLowerCase(),
    encType,
    formData,
    body
  };
}

const _excluded = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset", "unstable_viewTransition"],
  _excluded2 = ["aria-current", "caseSensitive", "className", "end", "style", "to", "unstable_viewTransition", "children"],
  _excluded3 = ["fetcherKey", "navigate", "reloadDocument", "replace", "state", "method", "action", "onSubmit", "relative", "preventScrollReset", "unstable_viewTransition"];
// HEY YOU! DON'T TOUCH THIS VARIABLE!
//
// It is replaced with the proper version at build time via a babel plugin in
// the rollup config.
//
// Export a global property onto the window for React Router detection by the
// Core Web Vitals Technology Report.  This way they can configure the `wappalyzer`
// to detect and properly classify live websites as being built with React Router:
// https://github.com/HTTPArchive/wappalyzer/blob/main/src/technologies/r.json
const REACT_ROUTER_VERSION = "6";
try {
  window.__reactRouterVersion = REACT_ROUTER_VERSION;
} catch (e) {
  // no-op
}
function createBrowserRouter(routes, opts) {
  return (0,react_router__WEBPACK_IMPORTED_MODULE_2__.createRouter)({
    basename: opts == null ? void 0 : opts.basename,
    future: _extends({}, opts == null ? void 0 : opts.future, {
      v7_prependBasename: true
    }),
    history: (0,react_router__WEBPACK_IMPORTED_MODULE_2__.createBrowserHistory)({
      window: opts == null ? void 0 : opts.window
    }),
    hydrationData: (opts == null ? void 0 : opts.hydrationData) || parseHydrationData(),
    routes,
    mapRouteProperties: react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_mapRouteProperties,
    unstable_dataStrategy: opts == null ? void 0 : opts.unstable_dataStrategy,
    unstable_patchRoutesOnMiss: opts == null ? void 0 : opts.unstable_patchRoutesOnMiss,
    window: opts == null ? void 0 : opts.window
  }).initialize();
}
function createHashRouter(routes, opts) {
  return (0,react_router__WEBPACK_IMPORTED_MODULE_2__.createRouter)({
    basename: opts == null ? void 0 : opts.basename,
    future: _extends({}, opts == null ? void 0 : opts.future, {
      v7_prependBasename: true
    }),
    history: (0,react_router__WEBPACK_IMPORTED_MODULE_2__.createHashHistory)({
      window: opts == null ? void 0 : opts.window
    }),
    hydrationData: (opts == null ? void 0 : opts.hydrationData) || parseHydrationData(),
    routes,
    mapRouteProperties: react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_mapRouteProperties,
    unstable_dataStrategy: opts == null ? void 0 : opts.unstable_dataStrategy,
    unstable_patchRoutesOnMiss: opts == null ? void 0 : opts.unstable_patchRoutesOnMiss,
    window: opts == null ? void 0 : opts.window
  }).initialize();
}
function parseHydrationData() {
  var _window;
  let state = (_window = window) == null ? void 0 : _window.__staticRouterHydrationData;
  if (state && state.errors) {
    state = _extends({}, state, {
      errors: deserializeErrors(state.errors)
    });
  }
  return state;
}
function deserializeErrors(errors) {
  if (!errors) return null;
  let entries = Object.entries(errors);
  let serialized = {};
  for (let [key, val] of entries) {
    // Hey you!  If you change this, please change the corresponding logic in
    // serializeErrors in react-router-dom/server.tsx :)
    if (val && val.__type === "RouteErrorResponse") {
      serialized[key] = new react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_ErrorResponseImpl(val.status, val.statusText, val.data, val.internal === true);
    } else if (val && val.__type === "Error") {
      // Attempt to reconstruct the right type of Error (i.e., ReferenceError)
      if (val.__subType) {
        let ErrorConstructor = window[val.__subType];
        if (typeof ErrorConstructor === "function") {
          try {
            // @ts-expect-error
            let error = new ErrorConstructor(val.message);
            // Wipe away the client-side stack trace.  Nothing to fill it in with
            // because we don't serialize SSR stack traces for security reasons
            error.stack = "";
            serialized[key] = error;
          } catch (e) {
            // no-op - fall through and create a normal Error
          }
        }
      }
      if (serialized[key] == null) {
        let error = new Error(val.message);
        // Wipe away the client-side stack trace.  Nothing to fill it in with
        // because we don't serialize SSR stack traces for security reasons
        error.stack = "";
        serialized[key] = error;
      }
    } else {
      serialized[key] = val;
    }
  }
  return serialized;
}
const ViewTransitionContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext({
  isTransitioning: false
});
if (true) {
  ViewTransitionContext.displayName = "ViewTransition";
}
const FetchersContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(new Map());
if (true) {
  FetchersContext.displayName = "Fetchers";
}
//#endregion
////////////////////////////////////////////////////////////////////////////////
//#region Components
////////////////////////////////////////////////////////////////////////////////
/**
  Webpack + React 17 fails to compile on any of the following because webpack
  complains that `startTransition` doesn't exist in `React`:
  * import { startTransition } from "react"
  * import * as React from from "react";
    "startTransition" in React ? React.startTransition(() => setState()) : setState()
  * import * as React from from "react";
    "startTransition" in React ? React["startTransition"](() => setState()) : setState()

  Moving it to a constant such as the following solves the Webpack/React 17 issue:
  * import * as React from from "react";
    const START_TRANSITION = "startTransition";
    START_TRANSITION in React ? React[START_TRANSITION](() => setState()) : setState()

  However, that introduces webpack/terser minification issues in production builds
  in React 18 where minification/obfuscation ends up removing the call of
  React.startTransition entirely from the first half of the ternary.  Grabbing
  this exported reference once up front resolves that issue.

  See https://github.com/remix-run/react-router/issues/10579
*/
const START_TRANSITION = "startTransition";
const startTransitionImpl = react__WEBPACK_IMPORTED_MODULE_0__[START_TRANSITION];
const FLUSH_SYNC = "flushSync";
const flushSyncImpl = react_dom__WEBPACK_IMPORTED_MODULE_1__[FLUSH_SYNC];
const USE_ID = "useId";
const useIdImpl = react__WEBPACK_IMPORTED_MODULE_0__[USE_ID];
function startTransitionSafe(cb) {
  if (startTransitionImpl) {
    startTransitionImpl(cb);
  } else {
    cb();
  }
}
function flushSyncSafe(cb) {
  if (flushSyncImpl) {
    flushSyncImpl(cb);
  } else {
    cb();
  }
}
class Deferred {
  constructor() {
    this.status = "pending";
    this.promise = new Promise((resolve, reject) => {
      this.resolve = value => {
        if (this.status === "pending") {
          this.status = "resolved";
          resolve(value);
        }
      };
      this.reject = reason => {
        if (this.status === "pending") {
          this.status = "rejected";
          reject(reason);
        }
      };
    });
  }
}
/**
 * Given a Remix Router instance, render the appropriate UI
 */
function RouterProvider(_ref) {
  let {
    fallbackElement,
    router,
    future
  } = _ref;
  let [state, setStateImpl] = react__WEBPACK_IMPORTED_MODULE_0__.useState(router.state);
  let [pendingState, setPendingState] = react__WEBPACK_IMPORTED_MODULE_0__.useState();
  let [vtContext, setVtContext] = react__WEBPACK_IMPORTED_MODULE_0__.useState({
    isTransitioning: false
  });
  let [renderDfd, setRenderDfd] = react__WEBPACK_IMPORTED_MODULE_0__.useState();
  let [transition, setTransition] = react__WEBPACK_IMPORTED_MODULE_0__.useState();
  let [interruption, setInterruption] = react__WEBPACK_IMPORTED_MODULE_0__.useState();
  let fetcherData = react__WEBPACK_IMPORTED_MODULE_0__.useRef(new Map());
  let {
    v7_startTransition
  } = future || {};
  let optInStartTransition = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(cb => {
    if (v7_startTransition) {
      startTransitionSafe(cb);
    } else {
      cb();
    }
  }, [v7_startTransition]);
  let setState = react__WEBPACK_IMPORTED_MODULE_0__.useCallback((newState, _ref2) => {
    let {
      deletedFetchers,
      unstable_flushSync: flushSync,
      unstable_viewTransitionOpts: viewTransitionOpts
    } = _ref2;
    deletedFetchers.forEach(key => fetcherData.current.delete(key));
    newState.fetchers.forEach((fetcher, key) => {
      if (fetcher.data !== undefined) {
        fetcherData.current.set(key, fetcher.data);
      }
    });
    let isViewTransitionUnavailable = router.window == null || router.window.document == null || typeof router.window.document.startViewTransition !== "function";
    // If this isn't a view transition or it's not available in this browser,
    // just update and be done with it
    if (!viewTransitionOpts || isViewTransitionUnavailable) {
      if (flushSync) {
        flushSyncSafe(() => setStateImpl(newState));
      } else {
        optInStartTransition(() => setStateImpl(newState));
      }
      return;
    }
    // flushSync + startViewTransition
    if (flushSync) {
      // Flush through the context to mark DOM elements as transition=ing
      flushSyncSafe(() => {
        // Cancel any pending transitions
        if (transition) {
          renderDfd && renderDfd.resolve();
          transition.skipTransition();
        }
        setVtContext({
          isTransitioning: true,
          flushSync: true,
          currentLocation: viewTransitionOpts.currentLocation,
          nextLocation: viewTransitionOpts.nextLocation
        });
      });
      // Update the DOM
      let t = router.window.document.startViewTransition(() => {
        flushSyncSafe(() => setStateImpl(newState));
      });
      // Clean up after the animation completes
      t.finished.finally(() => {
        flushSyncSafe(() => {
          setRenderDfd(undefined);
          setTransition(undefined);
          setPendingState(undefined);
          setVtContext({
            isTransitioning: false
          });
        });
      });
      flushSyncSafe(() => setTransition(t));
      return;
    }
    // startTransition + startViewTransition
    if (transition) {
      // Interrupting an in-progress transition, cancel and let everything flush
      // out, and then kick off a new transition from the interruption state
      renderDfd && renderDfd.resolve();
      transition.skipTransition();
      setInterruption({
        state: newState,
        currentLocation: viewTransitionOpts.currentLocation,
        nextLocation: viewTransitionOpts.nextLocation
      });
    } else {
      // Completed navigation update with opted-in view transitions, let 'er rip
      setPendingState(newState);
      setVtContext({
        isTransitioning: true,
        flushSync: false,
        currentLocation: viewTransitionOpts.currentLocation,
        nextLocation: viewTransitionOpts.nextLocation
      });
    }
  }, [router.window, transition, renderDfd, fetcherData, optInStartTransition]);
  // Need to use a layout effect here so we are subscribed early enough to
  // pick up on any render-driven redirects/navigations (useEffect/<Navigate>)
  react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => router.subscribe(setState), [router, setState]);
  // When we start a view transition, create a Deferred we can use for the
  // eventual "completed" render
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (vtContext.isTransitioning && !vtContext.flushSync) {
      setRenderDfd(new Deferred());
    }
  }, [vtContext]);
  // Once the deferred is created, kick off startViewTransition() to update the
  // DOM and then wait on the Deferred to resolve (indicating the DOM update has
  // happened)
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (renderDfd && pendingState && router.window) {
      let newState = pendingState;
      let renderPromise = renderDfd.promise;
      let transition = router.window.document.startViewTransition(async () => {
        optInStartTransition(() => setStateImpl(newState));
        await renderPromise;
      });
      transition.finished.finally(() => {
        setRenderDfd(undefined);
        setTransition(undefined);
        setPendingState(undefined);
        setVtContext({
          isTransitioning: false
        });
      });
      setTransition(transition);
    }
  }, [optInStartTransition, pendingState, renderDfd, router.window]);
  // When the new location finally renders and is committed to the DOM, this
  // effect will run to resolve the transition
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (renderDfd && pendingState && state.location.key === pendingState.location.key) {
      renderDfd.resolve();
    }
  }, [renderDfd, transition, state.location, pendingState]);
  // If we get interrupted with a new navigation during a transition, we skip
  // the active transition, let it cleanup, then kick it off again here
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!vtContext.isTransitioning && interruption) {
      setPendingState(interruption.state);
      setVtContext({
        isTransitioning: true,
        flushSync: false,
        currentLocation: interruption.currentLocation,
        nextLocation: interruption.nextLocation
      });
      setInterruption(undefined);
    }
  }, [vtContext.isTransitioning, interruption]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
     true ? (0,react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_warning)(fallbackElement == null || !router.future.v7_partialHydration, "`<RouterProvider fallbackElement>` is deprecated when using " + "`v7_partialHydration`, use a `HydrateFallback` component instead") : 0;
    // Only log this once on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let navigator = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    return {
      createHref: router.createHref,
      encodeLocation: router.encodeLocation,
      go: n => router.navigate(n),
      push: (to, state, opts) => router.navigate(to, {
        state,
        preventScrollReset: opts == null ? void 0 : opts.preventScrollReset
      }),
      replace: (to, state, opts) => router.navigate(to, {
        replace: true,
        state,
        preventScrollReset: opts == null ? void 0 : opts.preventScrollReset
      })
    };
  }, [router]);
  let basename = router.basename || "/";
  let dataRouterContext = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    router,
    navigator,
    static: false,
    basename
  }), [router, navigator, basename]);
  // The fragment and {null} here are important!  We need them to keep React 18's
  // useId happy when we are server-rendering since we may have a <script> here
  // containing the hydrated server-side staticContext (from StaticRouterProvider).
  // useId relies on the component tree structure to generate deterministic id's
  // so we need to ensure it remains the same on the client even though
  // we don't need the <script> tag
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_DataRouterContext.Provider, {
    value: dataRouterContext
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_DataRouterStateContext.Provider, {
    value: state
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(FetchersContext.Provider, {
    value: fetcherData.current
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(ViewTransitionContext.Provider, {
    value: vtContext
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router__WEBPACK_IMPORTED_MODULE_3__.Router, {
    basename: basename,
    location: state.location,
    navigationType: state.historyAction,
    navigator: navigator,
    future: {
      v7_relativeSplatPath: router.future.v7_relativeSplatPath
    }
  }, state.initialized || router.future.v7_partialHydration ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(DataRoutes, {
    routes: router.routes,
    future: router.future,
    state: state
  }) : fallbackElement))))), null);
}
function DataRoutes(_ref3) {
  let {
    routes,
    future,
    state
  } = _ref3;
  return (0,react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_useRoutesImpl)(routes, undefined, state, future);
}
/**
 * A `<Router>` for use in web browsers. Provides the cleanest URLs.
 */
function BrowserRouter(_ref4) {
  let {
    basename,
    children,
    future,
    window
  } = _ref4;
  let historyRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef();
  if (historyRef.current == null) {
    historyRef.current = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.createBrowserHistory)({
      window,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = react__WEBPACK_IMPORTED_MODULE_0__.useState({
    action: history.action,
    location: history.location
  });
  let {
    v7_startTransition
  } = future || {};
  let setState = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(newState => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router__WEBPACK_IMPORTED_MODULE_3__.Router, {
    basename: basename,
    children: children,
    location: state.location,
    navigationType: state.action,
    navigator: history,
    future: future
  });
}
/**
 * A `<Router>` for use in web browsers. Stores the location in the hash
 * portion of the URL so it is not sent to the server.
 */
function HashRouter(_ref5) {
  let {
    basename,
    children,
    future,
    window
  } = _ref5;
  let historyRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef();
  if (historyRef.current == null) {
    historyRef.current = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.createHashHistory)({
      window,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = react__WEBPACK_IMPORTED_MODULE_0__.useState({
    action: history.action,
    location: history.location
  });
  let {
    v7_startTransition
  } = future || {};
  let setState = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(newState => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router__WEBPACK_IMPORTED_MODULE_3__.Router, {
    basename: basename,
    children: children,
    location: state.location,
    navigationType: state.action,
    navigator: history,
    future: future
  });
}
/**
 * A `<Router>` that accepts a pre-instantiated history object. It's important
 * to note that using your own history object is highly discouraged and may add
 * two versions of the history library to your bundles unless you use the same
 * version of the history library that React Router uses internally.
 */
function HistoryRouter(_ref6) {
  let {
    basename,
    children,
    future,
    history
  } = _ref6;
  let [state, setStateImpl] = react__WEBPACK_IMPORTED_MODULE_0__.useState({
    action: history.action,
    location: history.location
  });
  let {
    v7_startTransition
  } = future || {};
  let setState = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(newState => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router__WEBPACK_IMPORTED_MODULE_3__.Router, {
    basename: basename,
    children: children,
    location: state.location,
    navigationType: state.action,
    navigator: history,
    future: future
  });
}
if (true) {
  HistoryRouter.displayName = "unstable_HistoryRouter";
}
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
/**
 * The public API for rendering a history-aware `<a>`.
 */
const Link = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(function LinkWithRef(_ref7, ref) {
  let {
      onClick,
      relative,
      reloadDocument,
      replace,
      state,
      target,
      to,
      preventScrollReset,
      unstable_viewTransition
    } = _ref7,
    rest = _objectWithoutPropertiesLoose(_ref7, _excluded);
  let {
    basename
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_NavigationContext);
  // Rendered into <a href> for absolute URLs
  let absoluteHref;
  let isExternal = false;
  if (typeof to === "string" && ABSOLUTE_URL_REGEX.test(to)) {
    // Render the absolute href server- and client-side
    absoluteHref = to;
    // Only check for external origins client-side
    if (isBrowser) {
      try {
        let currentUrl = new URL(window.location.href);
        let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
        let path = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.stripBasename)(targetUrl.pathname, basename);
        if (targetUrl.origin === currentUrl.origin && path != null) {
          // Strip the protocol/origin/basename for same-origin absolute URLs
          to = path + targetUrl.search + targetUrl.hash;
        } else {
          isExternal = true;
        }
      } catch (e) {
        // We can't do external URL detection without a valid URL
         true ? (0,react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_warning)(false, "<Link to=\"" + to + "\"> contains an invalid URL which will probably break " + "when clicked - please update to a valid URL path.") : 0;
      }
    }
  }
  // Rendered into <a href> for relative URLs
  let href = (0,react_router__WEBPACK_IMPORTED_MODULE_3__.useHref)(to, {
    relative
  });
  let internalOnClick = useLinkClickHandler(to, {
    replace,
    state,
    target,
    preventScrollReset,
    relative,
    unstable_viewTransition
  });
  function handleClick(event) {
    if (onClick) onClick(event);
    if (!event.defaultPrevented) {
      internalOnClick(event);
    }
  }
  return (
    /*#__PURE__*/
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", _extends({}, rest, {
      href: absoluteHref || href,
      onClick: isExternal || reloadDocument ? onClick : handleClick,
      ref: ref,
      target: target
    }))
  );
});
if (true) {
  Link.displayName = "Link";
}
/**
 * A `<Link>` wrapper that knows if it's "active" or not.
 */
const NavLink = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(function NavLinkWithRef(_ref8, ref) {
  let {
      "aria-current": ariaCurrentProp = "page",
      caseSensitive = false,
      className: classNameProp = "",
      end = false,
      style: styleProp,
      to,
      unstable_viewTransition,
      children
    } = _ref8,
    rest = _objectWithoutPropertiesLoose(_ref8, _excluded2);
  let path = (0,react_router__WEBPACK_IMPORTED_MODULE_3__.useResolvedPath)(to, {
    relative: rest.relative
  });
  let location = (0,react_router__WEBPACK_IMPORTED_MODULE_3__.useLocation)();
  let routerState = react__WEBPACK_IMPORTED_MODULE_0__.useContext(react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_DataRouterStateContext);
  let {
    navigator,
    basename
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_NavigationContext);
  let isTransitioning = routerState != null &&
  // Conditional usage is OK here because the usage of a data router is static
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useViewTransitionState(path) && unstable_viewTransition === true;
  let toPathname = navigator.encodeLocation ? navigator.encodeLocation(path).pathname : path.pathname;
  let locationPathname = location.pathname;
  let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;
  if (!caseSensitive) {
    locationPathname = locationPathname.toLowerCase();
    nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
    toPathname = toPathname.toLowerCase();
  }
  if (nextLocationPathname && basename) {
    nextLocationPathname = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.stripBasename)(nextLocationPathname, basename) || nextLocationPathname;
  }
  // If the `to` has a trailing slash, look at that exact spot.  Otherwise,
  // we're looking for a slash _after_ what's in `to`.  For example:
  //
  // <NavLink to="/users"> and <NavLink to="/users/">
  // both want to look for a / at index 6 to match URL `/users/matt`
  const endSlashPosition = toPathname !== "/" && toPathname.endsWith("/") ? toPathname.length - 1 : toPathname.length;
  let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(endSlashPosition) === "/";
  let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(toPathname.length) === "/");
  let renderProps = {
    isActive,
    isPending,
    isTransitioning
  };
  let ariaCurrent = isActive ? ariaCurrentProp : undefined;
  let className;
  if (typeof classNameProp === "function") {
    className = classNameProp(renderProps);
  } else {
    // If the className prop is not a function, we use a default `active`
    // class for <NavLink />s that are active. In v5 `active` was the default
    // value for `activeClassName`, but we are removing that API and can still
    // use the old default behavior for a cleaner upgrade path and keep the
    // simple styling rules working as they currently do.
    className = [classNameProp, isActive ? "active" : null, isPending ? "pending" : null, isTransitioning ? "transitioning" : null].filter(Boolean).join(" ");
  }
  let style = typeof styleProp === "function" ? styleProp(renderProps) : styleProp;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Link, _extends({}, rest, {
    "aria-current": ariaCurrent,
    className: className,
    ref: ref,
    style: style,
    to: to,
    unstable_viewTransition: unstable_viewTransition
  }), typeof children === "function" ? children(renderProps) : children);
});
if (true) {
  NavLink.displayName = "NavLink";
}
/**
 * A `@remix-run/router`-aware `<form>`. It behaves like a normal form except
 * that the interaction with the server is with `fetch` instead of new document
 * requests, allowing components to add nicer UX to the page as the form is
 * submitted and returns with data.
 */
const Form = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((_ref9, forwardedRef) => {
  let {
      fetcherKey,
      navigate,
      reloadDocument,
      replace,
      state,
      method = defaultMethod,
      action,
      onSubmit,
      relative,
      preventScrollReset,
      unstable_viewTransition
    } = _ref9,
    props = _objectWithoutPropertiesLoose(_ref9, _excluded3);
  let submit = useSubmit();
  let formAction = useFormAction(action, {
    relative
  });
  let formMethod = method.toLowerCase() === "get" ? "get" : "post";
  let submitHandler = event => {
    onSubmit && onSubmit(event);
    if (event.defaultPrevented) return;
    event.preventDefault();
    let submitter = event.nativeEvent.submitter;
    let submitMethod = (submitter == null ? void 0 : submitter.getAttribute("formmethod")) || method;
    submit(submitter || event.currentTarget, {
      fetcherKey,
      method: submitMethod,
      navigate,
      replace,
      state,
      relative,
      preventScrollReset,
      unstable_viewTransition
    });
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("form", _extends({
    ref: forwardedRef,
    method: formMethod,
    action: formAction,
    onSubmit: reloadDocument ? onSubmit : submitHandler
  }, props));
});
if (true) {
  Form.displayName = "Form";
}
/**
 * This component will emulate the browser's scroll restoration on location
 * changes.
 */
function ScrollRestoration(_ref10) {
  let {
    getKey,
    storageKey
  } = _ref10;
  useScrollRestoration({
    getKey,
    storageKey
  });
  return null;
}
if (true) {
  ScrollRestoration.displayName = "ScrollRestoration";
}
//#endregion
////////////////////////////////////////////////////////////////////////////////
//#region Hooks
////////////////////////////////////////////////////////////////////////////////
var DataRouterHook;
(function (DataRouterHook) {
  DataRouterHook["UseScrollRestoration"] = "useScrollRestoration";
  DataRouterHook["UseSubmit"] = "useSubmit";
  DataRouterHook["UseSubmitFetcher"] = "useSubmitFetcher";
  DataRouterHook["UseFetcher"] = "useFetcher";
  DataRouterHook["useViewTransitionState"] = "useViewTransitionState";
})(DataRouterHook || (DataRouterHook = {}));
var DataRouterStateHook;
(function (DataRouterStateHook) {
  DataRouterStateHook["UseFetcher"] = "useFetcher";
  DataRouterStateHook["UseFetchers"] = "useFetchers";
  DataRouterStateHook["UseScrollRestoration"] = "useScrollRestoration";
})(DataRouterStateHook || (DataRouterStateHook = {}));
// Internal hooks
function getDataRouterConsoleError(hookName) {
  return hookName + " must be used within a data router.  See https://reactrouter.com/routers/picking-a-router.";
}
function useDataRouterContext(hookName) {
  let ctx = react__WEBPACK_IMPORTED_MODULE_0__.useContext(react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_DataRouterContext);
  !ctx ?  true ? (0,react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_invariant)(false, getDataRouterConsoleError(hookName)) : 0 : void 0;
  return ctx;
}
function useDataRouterState(hookName) {
  let state = react__WEBPACK_IMPORTED_MODULE_0__.useContext(react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_DataRouterStateContext);
  !state ?  true ? (0,react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_invariant)(false, getDataRouterConsoleError(hookName)) : 0 : void 0;
  return state;
}
// External hooks
/**
 * Handles the click behavior for router `<Link>` components. This is useful if
 * you need to create custom `<Link>` components with the same click behavior we
 * use in our exported `<Link>`.
 */
function useLinkClickHandler(to, _temp) {
  let {
    target,
    replace: replaceProp,
    state,
    preventScrollReset,
    relative,
    unstable_viewTransition
  } = _temp === void 0 ? {} : _temp;
  let navigate = (0,react_router__WEBPACK_IMPORTED_MODULE_3__.useNavigate)();
  let location = (0,react_router__WEBPACK_IMPORTED_MODULE_3__.useLocation)();
  let path = (0,react_router__WEBPACK_IMPORTED_MODULE_3__.useResolvedPath)(to, {
    relative
  });
  return react__WEBPACK_IMPORTED_MODULE_0__.useCallback(event => {
    if (shouldProcessLinkClick(event, target)) {
      event.preventDefault();
      // If the URL hasn't changed, a regular <a> will do a replace instead of
      // a push, so do the same here unless the replace prop is explicitly set
      let replace = replaceProp !== undefined ? replaceProp : (0,react_router__WEBPACK_IMPORTED_MODULE_2__.createPath)(location) === (0,react_router__WEBPACK_IMPORTED_MODULE_2__.createPath)(path);
      navigate(to, {
        replace,
        state,
        preventScrollReset,
        relative,
        unstable_viewTransition
      });
    }
  }, [location, navigate, path, replaceProp, state, target, to, preventScrollReset, relative, unstable_viewTransition]);
}
/**
 * A convenient wrapper for reading and writing search parameters via the
 * URLSearchParams interface.
 */
function useSearchParams(defaultInit) {
   true ? (0,react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_warning)(typeof URLSearchParams !== "undefined", "You cannot use the `useSearchParams` hook in a browser that does not " + "support the URLSearchParams API. If you need to support Internet " + "Explorer 11, we recommend you load a polyfill such as " + "https://github.com/ungap/url-search-params\n\n" + "If you're unsure how to load polyfills, we recommend you check out " + "https://polyfill.io/v3/ which provides some recommendations about how " + "to load polyfills only for users that need them, instead of for every " + "user.") : 0;
  let defaultSearchParamsRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(createSearchParams(defaultInit));
  let hasSetSearchParamsRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  let location = (0,react_router__WEBPACK_IMPORTED_MODULE_3__.useLocation)();
  let searchParams = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() =>
  // Only merge in the defaults if we haven't yet called setSearchParams.
  // Once we call that we want those to take precedence, otherwise you can't
  // remove a param with setSearchParams({}) if it has an initial value
  getSearchParamsForLocation(location.search, hasSetSearchParamsRef.current ? null : defaultSearchParamsRef.current), [location.search]);
  let navigate = (0,react_router__WEBPACK_IMPORTED_MODULE_3__.useNavigate)();
  let setSearchParams = react__WEBPACK_IMPORTED_MODULE_0__.useCallback((nextInit, navigateOptions) => {
    const newSearchParams = createSearchParams(typeof nextInit === "function" ? nextInit(searchParams) : nextInit);
    hasSetSearchParamsRef.current = true;
    navigate("?" + newSearchParams, navigateOptions);
  }, [navigate, searchParams]);
  return [searchParams, setSearchParams];
}
function validateClientSideSubmission() {
  if (typeof document === "undefined") {
    throw new Error("You are calling submit during the server render. " + "Try calling submit within a `useEffect` or callback instead.");
  }
}
let fetcherId = 0;
let getUniqueFetcherId = () => "__" + String(++fetcherId) + "__";
/**
 * Returns a function that may be used to programmatically submit a form (or
 * some arbitrary data) to the server.
 */
function useSubmit() {
  let {
    router
  } = useDataRouterContext(DataRouterHook.UseSubmit);
  let {
    basename
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_NavigationContext);
  let currentRouteId = (0,react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_useRouteId)();
  return react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (target, options) {
    if (options === void 0) {
      options = {};
    }
    validateClientSideSubmission();
    let {
      action,
      method,
      encType,
      formData,
      body
    } = getFormSubmissionInfo(target, basename);
    if (options.navigate === false) {
      let key = options.fetcherKey || getUniqueFetcherId();
      router.fetch(key, currentRouteId, options.action || action, {
        preventScrollReset: options.preventScrollReset,
        formData,
        body,
        formMethod: options.method || method,
        formEncType: options.encType || encType,
        unstable_flushSync: options.unstable_flushSync
      });
    } else {
      router.navigate(options.action || action, {
        preventScrollReset: options.preventScrollReset,
        formData,
        body,
        formMethod: options.method || method,
        formEncType: options.encType || encType,
        replace: options.replace,
        state: options.state,
        fromRouteId: currentRouteId,
        unstable_flushSync: options.unstable_flushSync,
        unstable_viewTransition: options.unstable_viewTransition
      });
    }
  }, [router, basename, currentRouteId]);
}
// v7: Eventually we should deprecate this entirely in favor of using the
// router method directly?
function useFormAction(action, _temp2) {
  let {
    relative
  } = _temp2 === void 0 ? {} : _temp2;
  let {
    basename
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_NavigationContext);
  let routeContext = react__WEBPACK_IMPORTED_MODULE_0__.useContext(react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_RouteContext);
  !routeContext ?  true ? (0,react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_invariant)(false, "useFormAction must be used inside a RouteContext") : 0 : void 0;
  let [match] = routeContext.matches.slice(-1);
  // Shallow clone path so we can modify it below, otherwise we modify the
  // object referenced by useMemo inside useResolvedPath
  let path = _extends({}, (0,react_router__WEBPACK_IMPORTED_MODULE_3__.useResolvedPath)(action ? action : ".", {
    relative
  }));
  // If no action was specified, browsers will persist current search params
  // when determining the path, so match that behavior
  // https://github.com/remix-run/remix/issues/927
  let location = (0,react_router__WEBPACK_IMPORTED_MODULE_3__.useLocation)();
  if (action == null) {
    // Safe to write to this directly here since if action was undefined, we
    // would have called useResolvedPath(".") which will never include a search
    path.search = location.search;
    // When grabbing search params from the URL, remove any included ?index param
    // since it might not apply to our contextual route.  We add it back based
    // on match.route.index below
    let params = new URLSearchParams(path.search);
    if (params.has("index") && params.get("index") === "") {
      params.delete("index");
      path.search = params.toString() ? "?" + params.toString() : "";
    }
  }
  if ((!action || action === ".") && match.route.index) {
    path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
  }
  // If we're operating within a basename, prepend it to the pathname prior
  // to creating the form action.  If this is a root navigation, then just use
  // the raw basename which allows the basename to have full control over the
  // presence of a trailing slash on root actions
  if (basename !== "/") {
    path.pathname = path.pathname === "/" ? basename : (0,react_router__WEBPACK_IMPORTED_MODULE_2__.joinPaths)([basename, path.pathname]);
  }
  return (0,react_router__WEBPACK_IMPORTED_MODULE_2__.createPath)(path);
}
// TODO: (v7) Change the useFetcher generic default from `any` to `unknown`
/**
 * Interacts with route loaders and actions without causing a navigation. Great
 * for any interaction that stays on the same page.
 */
function useFetcher(_temp3) {
  var _route$matches;
  let {
    key
  } = _temp3 === void 0 ? {} : _temp3;
  let {
    router
  } = useDataRouterContext(DataRouterHook.UseFetcher);
  let state = useDataRouterState(DataRouterStateHook.UseFetcher);
  let fetcherData = react__WEBPACK_IMPORTED_MODULE_0__.useContext(FetchersContext);
  let route = react__WEBPACK_IMPORTED_MODULE_0__.useContext(react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_RouteContext);
  let routeId = (_route$matches = route.matches[route.matches.length - 1]) == null ? void 0 : _route$matches.route.id;
  !fetcherData ?  true ? (0,react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_invariant)(false, "useFetcher must be used inside a FetchersContext") : 0 : void 0;
  !route ?  true ? (0,react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_invariant)(false, "useFetcher must be used inside a RouteContext") : 0 : void 0;
  !(routeId != null) ?  true ? (0,react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_invariant)(false, "useFetcher can only be used on routes that contain a unique \"id\"") : 0 : void 0;
  // Fetcher key handling
  // OK to call conditionally to feature detect `useId`
  // eslint-disable-next-line react-hooks/rules-of-hooks
  let defaultKey = useIdImpl ? useIdImpl() : "";
  let [fetcherKey, setFetcherKey] = react__WEBPACK_IMPORTED_MODULE_0__.useState(key || defaultKey);
  if (key && key !== fetcherKey) {
    setFetcherKey(key);
  } else if (!fetcherKey) {
    // We will only fall through here when `useId` is not available
    setFetcherKey(getUniqueFetcherId());
  }
  // Registration/cleanup
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    router.getFetcher(fetcherKey);
    return () => {
      // Tell the router we've unmounted - if v7_fetcherPersist is enabled this
      // will not delete immediately but instead queue up a delete after the
      // fetcher returns to an `idle` state
      router.deleteFetcher(fetcherKey);
    };
  }, [router, fetcherKey]);
  // Fetcher additions
  let load = react__WEBPACK_IMPORTED_MODULE_0__.useCallback((href, opts) => {
    !routeId ?  true ? (0,react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_invariant)(false, "No routeId available for fetcher.load()") : 0 : void 0;
    router.fetch(fetcherKey, routeId, href, opts);
  }, [fetcherKey, routeId, router]);
  let submitImpl = useSubmit();
  let submit = react__WEBPACK_IMPORTED_MODULE_0__.useCallback((target, opts) => {
    submitImpl(target, _extends({}, opts, {
      navigate: false,
      fetcherKey
    }));
  }, [fetcherKey, submitImpl]);
  let FetcherForm = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    let FetcherForm = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, ref) => {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Form, _extends({}, props, {
        navigate: false,
        fetcherKey: fetcherKey,
        ref: ref
      }));
    });
    if (true) {
      FetcherForm.displayName = "fetcher.Form";
    }
    return FetcherForm;
  }, [fetcherKey]);
  // Exposed FetcherWithComponents
  let fetcher = state.fetchers.get(fetcherKey) || react_router__WEBPACK_IMPORTED_MODULE_2__.IDLE_FETCHER;
  let data = fetcherData.get(fetcherKey);
  let fetcherWithComponents = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => _extends({
    Form: FetcherForm,
    submit,
    load
  }, fetcher, {
    data
  }), [FetcherForm, submit, load, fetcher, data]);
  return fetcherWithComponents;
}
/**
 * Provides all fetchers currently on the page. Useful for layouts and parent
 * routes that need to provide pending/optimistic UI regarding the fetch.
 */
function useFetchers() {
  let state = useDataRouterState(DataRouterStateHook.UseFetchers);
  return Array.from(state.fetchers.entries()).map(_ref11 => {
    let [key, fetcher] = _ref11;
    return _extends({}, fetcher, {
      key
    });
  });
}
const SCROLL_RESTORATION_STORAGE_KEY = "react-router-scroll-positions";
let savedScrollPositions = {};
/**
 * When rendered inside a RouterProvider, will restore scroll positions on navigations
 */
function useScrollRestoration(_temp4) {
  let {
    getKey,
    storageKey
  } = _temp4 === void 0 ? {} : _temp4;
  let {
    router
  } = useDataRouterContext(DataRouterHook.UseScrollRestoration);
  let {
    restoreScrollPosition,
    preventScrollReset
  } = useDataRouterState(DataRouterStateHook.UseScrollRestoration);
  let {
    basename
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(react_router__WEBPACK_IMPORTED_MODULE_3__.UNSAFE_NavigationContext);
  let location = (0,react_router__WEBPACK_IMPORTED_MODULE_3__.useLocation)();
  let matches = (0,react_router__WEBPACK_IMPORTED_MODULE_3__.useMatches)();
  let navigation = (0,react_router__WEBPACK_IMPORTED_MODULE_3__.useNavigation)();
  // Trigger manual scroll restoration while we're active
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, []);
  // Save positions on pagehide
  usePageHide(react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
    if (navigation.state === "idle") {
      let key = (getKey ? getKey(location, matches) : null) || location.key;
      savedScrollPositions[key] = window.scrollY;
    }
    try {
      sessionStorage.setItem(storageKey || SCROLL_RESTORATION_STORAGE_KEY, JSON.stringify(savedScrollPositions));
    } catch (error) {
       true ? (0,react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_warning)(false, "Failed to save scroll positions in sessionStorage, <ScrollRestoration /> will not work properly (" + error + ").") : 0;
    }
    window.history.scrollRestoration = "auto";
  }, [storageKey, getKey, navigation.state, location, matches]));
  // Read in any saved scroll locations
  if (typeof document !== "undefined") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => {
      try {
        let sessionPositions = sessionStorage.getItem(storageKey || SCROLL_RESTORATION_STORAGE_KEY);
        if (sessionPositions) {
          savedScrollPositions = JSON.parse(sessionPositions);
        }
      } catch (e) {
        // no-op, use default empty object
      }
    }, [storageKey]);
    // Enable scroll restoration in the router
    // eslint-disable-next-line react-hooks/rules-of-hooks
    react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => {
      let getKeyWithoutBasename = getKey && basename !== "/" ? (location, matches) => getKey( // Strip the basename to match useLocation()
      _extends({}, location, {
        pathname: (0,react_router__WEBPACK_IMPORTED_MODULE_2__.stripBasename)(location.pathname, basename) || location.pathname
      }), matches) : getKey;
      let disableScrollRestoration = router == null ? void 0 : router.enableScrollRestoration(savedScrollPositions, () => window.scrollY, getKeyWithoutBasename);
      return () => disableScrollRestoration && disableScrollRestoration();
    }, [router, basename, getKey]);
    // Restore scrolling when state.restoreScrollPosition changes
    // eslint-disable-next-line react-hooks/rules-of-hooks
    react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => {
      // Explicit false means don't do anything (used for submissions)
      if (restoreScrollPosition === false) {
        return;
      }
      // been here before, scroll to it
      if (typeof restoreScrollPosition === "number") {
        window.scrollTo(0, restoreScrollPosition);
        return;
      }
      // try to scroll to the hash
      if (location.hash) {
        let el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (el) {
          el.scrollIntoView();
          return;
        }
      }
      // Don't reset if this navigation opted out
      if (preventScrollReset === true) {
        return;
      }
      // otherwise go to the top on new locations
      window.scrollTo(0, 0);
    }, [location, restoreScrollPosition, preventScrollReset]);
  }
}
/**
 * Setup a callback to be fired on the window's `beforeunload` event. This is
 * useful for saving some data to `window.localStorage` just before the page
 * refreshes.
 *
 * Note: The `callback` argument should be a function created with
 * `React.useCallback()`.
 */
function useBeforeUnload(callback, options) {
  let {
    capture
  } = options || {};
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    let opts = capture != null ? {
      capture
    } : undefined;
    window.addEventListener("beforeunload", callback, opts);
    return () => {
      window.removeEventListener("beforeunload", callback, opts);
    };
  }, [callback, capture]);
}
/**
 * Setup a callback to be fired on the window's `pagehide` event. This is
 * useful for saving some data to `window.localStorage` just before the page
 * refreshes.  This event is better supported than beforeunload across browsers.
 *
 * Note: The `callback` argument should be a function created with
 * `React.useCallback()`.
 */
function usePageHide(callback, options) {
  let {
    capture
  } = options || {};
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    let opts = capture != null ? {
      capture
    } : undefined;
    window.addEventListener("pagehide", callback, opts);
    return () => {
      window.removeEventListener("pagehide", callback, opts);
    };
  }, [callback, capture]);
}
/**
 * Wrapper around useBlocker to show a window.confirm prompt to users instead
 * of building a custom UI with useBlocker.
 *
 * Warning: This has *a lot of rough edges* and behaves very differently (and
 * very incorrectly in some cases) across browsers if user click addition
 * back/forward navigations while the confirm is open.  Use at your own risk.
 */
function usePrompt(_ref12) {
  let {
    when,
    message
  } = _ref12;
  let blocker = (0,react_router__WEBPACK_IMPORTED_MODULE_3__.useBlocker)(when);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (blocker.state === "blocked") {
      let proceed = window.confirm(message);
      if (proceed) {
        // This timeout is needed to avoid a weird "race" on POP navigations
        // between the `window.history` revert navigation and the result of
        // `window.confirm`
        setTimeout(blocker.proceed, 0);
      } else {
        blocker.reset();
      }
    }
  }, [blocker, message]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (blocker.state === "blocked" && !when) {
      blocker.reset();
    }
  }, [blocker, when]);
}
/**
 * Return a boolean indicating if there is an active view transition to the
 * given href.  You can use this value to render CSS classes or viewTransitionName
 * styles onto your elements
 *
 * @param href The destination href
 * @param [opts.relative] Relative routing type ("route" | "path")
 */
function useViewTransitionState(to, opts) {
  if (opts === void 0) {
    opts = {};
  }
  let vtContext = react__WEBPACK_IMPORTED_MODULE_0__.useContext(ViewTransitionContext);
  !(vtContext != null) ?  true ? (0,react_router__WEBPACK_IMPORTED_MODULE_2__.UNSAFE_invariant)(false, "`unstable_useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  " + "Did you accidentally import `RouterProvider` from `react-router`?") : 0 : void 0;
  let {
    basename
  } = useDataRouterContext(DataRouterHook.useViewTransitionState);
  let path = (0,react_router__WEBPACK_IMPORTED_MODULE_3__.useResolvedPath)(to, {
    relative: opts.relative
  });
  if (!vtContext.isTransitioning) {
    return false;
  }
  let currentPath = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.stripBasename)(vtContext.currentLocation.pathname, basename) || vtContext.currentLocation.pathname;
  let nextPath = (0,react_router__WEBPACK_IMPORTED_MODULE_2__.stripBasename)(vtContext.nextLocation.pathname, basename) || vtContext.nextLocation.pathname;
  // Transition is active if we're going to or coming from the indicated
  // destination.  This ensures that other PUSH navigations that reverse
  // an indicated transition apply.  I.e., on the list view you have:
  //
  //   <NavLink to="/details/1" unstable_viewTransition>
  //
  // If you click the breadcrumb back to the list view:
  //
  //   <NavLink to="/list" unstable_viewTransition>
  //
  // We should apply the transition because it's indicated as active going
  // from /list -> /details/1 and therefore should be active on the reverse
  // (even though this isn't strictly a POP reverse)
  return (0,react_router__WEBPACK_IMPORTED_MODULE_2__.matchPath)(path.pathname, nextPath) != null || (0,react_router__WEBPACK_IMPORTED_MODULE_2__.matchPath)(path.pathname, currentPath) != null;
}
//#endregion


//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/react-router/dist/index.js":
/*!*************************************************!*\
  !*** ./node_modules/react-router/dist/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortedDeferredError: () => (/* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.AbortedDeferredError),
/* harmony export */   Await: () => (/* binding */ Await),
/* harmony export */   MemoryRouter: () => (/* binding */ MemoryRouter),
/* harmony export */   Navigate: () => (/* binding */ Navigate),
/* harmony export */   NavigationType: () => (/* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.Action),
/* harmony export */   Outlet: () => (/* binding */ Outlet),
/* harmony export */   Route: () => (/* binding */ Route),
/* harmony export */   Router: () => (/* binding */ Router),
/* harmony export */   RouterProvider: () => (/* binding */ RouterProvider),
/* harmony export */   Routes: () => (/* binding */ Routes),
/* harmony export */   UNSAFE_DataRouterContext: () => (/* binding */ DataRouterContext),
/* harmony export */   UNSAFE_DataRouterStateContext: () => (/* binding */ DataRouterStateContext),
/* harmony export */   UNSAFE_LocationContext: () => (/* binding */ LocationContext),
/* harmony export */   UNSAFE_NavigationContext: () => (/* binding */ NavigationContext),
/* harmony export */   UNSAFE_RouteContext: () => (/* binding */ RouteContext),
/* harmony export */   UNSAFE_mapRouteProperties: () => (/* binding */ mapRouteProperties),
/* harmony export */   UNSAFE_useRouteId: () => (/* binding */ useRouteId),
/* harmony export */   UNSAFE_useRoutesImpl: () => (/* binding */ useRoutesImpl),
/* harmony export */   createMemoryRouter: () => (/* binding */ createMemoryRouter),
/* harmony export */   createPath: () => (/* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.createPath),
/* harmony export */   createRoutesFromChildren: () => (/* binding */ createRoutesFromChildren),
/* harmony export */   createRoutesFromElements: () => (/* binding */ createRoutesFromChildren),
/* harmony export */   defer: () => (/* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.defer),
/* harmony export */   generatePath: () => (/* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.generatePath),
/* harmony export */   isRouteErrorResponse: () => (/* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.isRouteErrorResponse),
/* harmony export */   json: () => (/* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.json),
/* harmony export */   matchPath: () => (/* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.matchPath),
/* harmony export */   matchRoutes: () => (/* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.matchRoutes),
/* harmony export */   parsePath: () => (/* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.parsePath),
/* harmony export */   redirect: () => (/* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.redirect),
/* harmony export */   redirectDocument: () => (/* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.redirectDocument),
/* harmony export */   renderMatches: () => (/* binding */ renderMatches),
/* harmony export */   resolvePath: () => (/* reexport safe */ _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.resolvePath),
/* harmony export */   useActionData: () => (/* binding */ useActionData),
/* harmony export */   useAsyncError: () => (/* binding */ useAsyncError),
/* harmony export */   useAsyncValue: () => (/* binding */ useAsyncValue),
/* harmony export */   useBlocker: () => (/* binding */ useBlocker),
/* harmony export */   useHref: () => (/* binding */ useHref),
/* harmony export */   useInRouterContext: () => (/* binding */ useInRouterContext),
/* harmony export */   useLoaderData: () => (/* binding */ useLoaderData),
/* harmony export */   useLocation: () => (/* binding */ useLocation),
/* harmony export */   useMatch: () => (/* binding */ useMatch),
/* harmony export */   useMatches: () => (/* binding */ useMatches),
/* harmony export */   useNavigate: () => (/* binding */ useNavigate),
/* harmony export */   useNavigation: () => (/* binding */ useNavigation),
/* harmony export */   useNavigationType: () => (/* binding */ useNavigationType),
/* harmony export */   useOutlet: () => (/* binding */ useOutlet),
/* harmony export */   useOutletContext: () => (/* binding */ useOutletContext),
/* harmony export */   useParams: () => (/* binding */ useParams),
/* harmony export */   useResolvedPath: () => (/* binding */ useResolvedPath),
/* harmony export */   useRevalidator: () => (/* binding */ useRevalidator),
/* harmony export */   useRouteError: () => (/* binding */ useRouteError),
/* harmony export */   useRouteLoaderData: () => (/* binding */ useRouteLoaderData),
/* harmony export */   useRoutes: () => (/* binding */ useRoutes)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _remix_run_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @remix-run/router */ "./node_modules/@remix-run/router/dist/router.js");
/**
 * React Router v6.24.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */




function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

// Create react-specific types from the agnostic types in @remix-run/router to
// export from react-router
const DataRouterContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
if (true) {
  DataRouterContext.displayName = "DataRouter";
}
const DataRouterStateContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
if (true) {
  DataRouterStateContext.displayName = "DataRouterState";
}
const AwaitContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
if (true) {
  AwaitContext.displayName = "Await";
}

/**
 * A Navigator is a "location changer"; it's how you get to different locations.
 *
 * Every history instance conforms to the Navigator interface, but the
 * distinction is useful primarily when it comes to the low-level `<Router>` API
 * where both the location and a navigator must be provided separately in order
 * to avoid "tearing" that may occur in a suspense-enabled app if the action
 * and/or location were to be read directly from the history instance.
 */

const NavigationContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
if (true) {
  NavigationContext.displayName = "Navigation";
}
const LocationContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
if (true) {
  LocationContext.displayName = "Location";
}
const RouteContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext({
  outlet: null,
  matches: [],
  isDataRoute: false
});
if (true) {
  RouteContext.displayName = "Route";
}
const RouteErrorContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
if (true) {
  RouteErrorContext.displayName = "RouteError";
}

/**
 * Returns the full href for the given "to" value. This is useful for building
 * custom links that are also accessible and preserve right-click behavior.
 *
 * @see https://reactrouter.com/hooks/use-href
 */
function useHref(to, _temp) {
  let {
    relative
  } = _temp === void 0 ? {} : _temp;
  !useInRouterContext() ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, // TODO: This error is probably because they somehow have 2 versions of the
  // router loaded. We can help them understand how to avoid that.
  "useHref() may be used only in the context of a <Router> component.") : 0 : void 0;
  let {
    basename,
    navigator
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
  let {
    hash,
    pathname,
    search
  } = useResolvedPath(to, {
    relative
  });
  let joinedPathname = pathname;

  // If we're operating within a basename, prepend it to the pathname prior
  // to creating the href.  If this is a root navigation, then just use the raw
  // basename which allows the basename to have full control over the presence
  // of a trailing slash on root links
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.joinPaths)([basename, pathname]);
  }
  return navigator.createHref({
    pathname: joinedPathname,
    search,
    hash
  });
}

/**
 * Returns true if this component is a descendant of a `<Router>`.
 *
 * @see https://reactrouter.com/hooks/use-in-router-context
 */
function useInRouterContext() {
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(LocationContext) != null;
}

/**
 * Returns the current location object, which represents the current URL in web
 * browsers.
 *
 * Note: If you're using this it may mean you're doing some of your own
 * "routing" in your app, and we'd like to know what your use case is. We may
 * be able to provide something higher-level to better suit your needs.
 *
 * @see https://reactrouter.com/hooks/use-location
 */
function useLocation() {
  !useInRouterContext() ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, // TODO: This error is probably because they somehow have 2 versions of the
  // router loaded. We can help them understand how to avoid that.
  "useLocation() may be used only in the context of a <Router> component.") : 0 : void 0;
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(LocationContext).location;
}

/**
 * Returns the current navigation action which describes how the router came to
 * the current location, either by a pop, push, or replace on the history stack.
 *
 * @see https://reactrouter.com/hooks/use-navigation-type
 */
function useNavigationType() {
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(LocationContext).navigationType;
}

/**
 * Returns a PathMatch object if the given pattern matches the current URL.
 * This is useful for components that need to know "active" state, e.g.
 * `<NavLink>`.
 *
 * @see https://reactrouter.com/hooks/use-match
 */
function useMatch(pattern) {
  !useInRouterContext() ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, // TODO: This error is probably because they somehow have 2 versions of the
  // router loaded. We can help them understand how to avoid that.
  "useMatch() may be used only in the context of a <Router> component.") : 0 : void 0;
  let {
    pathname
  } = useLocation();
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.matchPath)(pattern, pathname), [pathname, pattern]);
}

/**
 * The interface for the navigate() function returned from useNavigate().
 */

const navigateEffectWarning = "You should call navigate() in a React.useEffect(), not when " + "your component is first rendered.";

// Mute warnings for calls to useNavigate in SSR environments
function useIsomorphicLayoutEffect(cb) {
  let isStatic = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext).static;
  if (!isStatic) {
    // We should be able to get rid of this once react 18.3 is released
    // See: https://github.com/facebook/react/pull/26395
    // eslint-disable-next-line react-hooks/rules-of-hooks
    react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(cb);
  }
}

/**
 * Returns an imperative method for changing the location. Used by `<Link>`s, but
 * may also be used by other elements to change the location.
 *
 * @see https://reactrouter.com/hooks/use-navigate
 */
function useNavigate() {
  let {
    isDataRoute
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  // Conditional usage is OK here because the usage of a data router is static
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  !useInRouterContext() ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, // TODO: This error is probably because they somehow have 2 versions of the
  // router loaded. We can help them understand how to avoid that.
  "useNavigate() may be used only in the context of a <Router> component.") : 0 : void 0;
  let dataRouterContext = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterContext);
  let {
    basename,
    future,
    navigator
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
  let {
    matches
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify((0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_getResolveToMatches)(matches, future.v7_relativeSplatPath));
  let activeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (to, options) {
    if (options === void 0) {
      options = {};
    }
     true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(activeRef.current, navigateEffectWarning) : 0;

    // Short circuit here since if this happens on first render the navigate
    // is useless because we haven't wired up our history listener yet
    if (!activeRef.current) return;
    if (typeof to === "number") {
      navigator.go(to);
      return;
    }
    let path = (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.resolveTo)(to, JSON.parse(routePathnamesJson), locationPathname, options.relative === "path");

    // If we're operating within a basename, prepend it to the pathname prior
    // to handing off to history (but only if we're not in a data router,
    // otherwise it'll prepend the basename inside of the router).
    // If this is a root navigation, then we navigate to the raw basename
    // which allows the basename to have full control over the presence of a
    // trailing slash on root links
    if (dataRouterContext == null && basename !== "/") {
      path.pathname = path.pathname === "/" ? basename : (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.joinPaths)([basename, path.pathname]);
    }
    (!!options.replace ? navigator.replace : navigator.push)(path, options.state, options);
  }, [basename, navigator, routePathnamesJson, locationPathname, dataRouterContext]);
  return navigate;
}
const OutletContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);

/**
 * Returns the context (if provided) for the child route at this level of the route
 * hierarchy.
 * @see https://reactrouter.com/hooks/use-outlet-context
 */
function useOutletContext() {
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(OutletContext);
}

/**
 * Returns the element for the child route at this level of the route
 * hierarchy. Used internally by `<Outlet>` to render child routes.
 *
 * @see https://reactrouter.com/hooks/use-outlet
 */
function useOutlet(context) {
  let outlet = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext).outlet;
  if (outlet) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(OutletContext.Provider, {
      value: context
    }, outlet);
  }
  return outlet;
}

/**
 * Returns an object of key/value pairs of the dynamic params from the current
 * URL that were matched by the route path.
 *
 * @see https://reactrouter.com/hooks/use-params
 */
function useParams() {
  let {
    matches
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  let routeMatch = matches[matches.length - 1];
  return routeMatch ? routeMatch.params : {};
}

/**
 * Resolves the pathname of the given `to` value against the current location.
 *
 * @see https://reactrouter.com/hooks/use-resolved-path
 */
function useResolvedPath(to, _temp2) {
  let {
    relative
  } = _temp2 === void 0 ? {} : _temp2;
  let {
    future
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
  let {
    matches
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify((0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_getResolveToMatches)(matches, future.v7_relativeSplatPath));
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.resolveTo)(to, JSON.parse(routePathnamesJson), locationPathname, relative === "path"), [to, routePathnamesJson, locationPathname, relative]);
}

/**
 * Returns the element of the route that matched the current location, prepared
 * with the correct context to render the remainder of the route tree. Route
 * elements in the tree must render an `<Outlet>` to render their child route's
 * element.
 *
 * @see https://reactrouter.com/hooks/use-routes
 */
function useRoutes(routes, locationArg) {
  return useRoutesImpl(routes, locationArg);
}

// Internal implementation with accept optional param for RouterProvider usage
function useRoutesImpl(routes, locationArg, dataRouterState, future) {
  !useInRouterContext() ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, // TODO: This error is probably because they somehow have 2 versions of the
  // router loaded. We can help them understand how to avoid that.
  "useRoutes() may be used only in the context of a <Router> component.") : 0 : void 0;
  let {
    navigator
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
  let {
    matches: parentMatches
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  let parentPathname = routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  let parentRoute = routeMatch && routeMatch.route;
  if (true) {
    // You won't get a warning about 2 different <Routes> under a <Route>
    // without a trailing *, but this is a best-effort warning anyway since we
    // cannot even give the warning unless they land at the parent route.
    //
    // Example:
    //
    // <Routes>
    //   {/* This route path MUST end with /* because otherwise
    //       it will never match /blog/post/123 */}
    //   <Route path="blog" element={<Blog />} />
    //   <Route path="blog/feed" element={<BlogFeed />} />
    // </Routes>
    //
    // function Blog() {
    //   return (
    //     <Routes>
    //       <Route path="post/:id" element={<Post />} />
    //     </Routes>
    //   );
    // }
    let parentPath = parentRoute && parentRoute.path || "";
    warningOnce(parentPathname, !parentRoute || parentPath.endsWith("*"), "You rendered descendant <Routes> (or called `useRoutes()`) at " + ("\"" + parentPathname + "\" (under <Route path=\"" + parentPath + "\">) but the ") + "parent route path has no trailing \"*\". This means if you navigate " + "deeper, the parent won't match anymore and therefore the child " + "routes will never render.\n\n" + ("Please change the parent <Route path=\"" + parentPath + "\"> to <Route ") + ("path=\"" + (parentPath === "/" ? "*" : parentPath + "/*") + "\">."));
  }
  let locationFromContext = useLocation();
  let location;
  if (locationArg) {
    var _parsedLocationArg$pa;
    let parsedLocationArg = typeof locationArg === "string" ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.parsePath)(locationArg) : locationArg;
    !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, "When overriding the location using `<Routes location>` or `useRoutes(routes, location)`, " + "the location pathname must begin with the portion of the URL pathname that was " + ("matched by all parent routes. The current pathname base is \"" + parentPathnameBase + "\" ") + ("but pathname \"" + parsedLocationArg.pathname + "\" was given in the `location` prop.")) : 0 : void 0;
    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }
  let pathname = location.pathname || "/";
  let remainingPathname = pathname;
  if (parentPathnameBase !== "/") {
    // Determine the remaining pathname by removing the # of URL segments the
    // parentPathnameBase has, instead of removing based on character count.
    // This is because we can't guarantee that incoming/outgoing encodings/
    // decodings will match exactly.
    // We decode paths before matching on a per-segment basis with
    // decodeURIComponent(), but we re-encode pathnames via `new URL()` so they
    // match what `window.location.pathname` would reflect.  Those don't 100%
    // align when it comes to encoded URI characters such as % and &.
    //
    // So we may end up with:
    //   pathname:           "/descendant/a%25b/match"
    //   parentPathnameBase: "/descendant/a%b"
    //
    // And the direct substring removal approach won't work :/
    let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
    let segments = pathname.replace(/^\//, "").split("/");
    remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
  }
  let matches = (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.matchRoutes)(routes, {
    pathname: remainingPathname
  });
  if (true) {
     true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(parentRoute || matches != null, "No routes matched location \"" + location.pathname + location.search + location.hash + "\" ") : 0;
     true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(matches == null || matches[matches.length - 1].route.element !== undefined || matches[matches.length - 1].route.Component !== undefined || matches[matches.length - 1].route.lazy !== undefined, "Matched leaf route at location \"" + location.pathname + location.search + location.hash + "\" " + "does not have an element or Component. This means it will render an <Outlet /> with a " + "null value by default resulting in an \"empty\" page.") : 0;
  }
  let renderedMatches = _renderMatches(matches && matches.map(match => Object.assign({}, match, {
    params: Object.assign({}, parentParams, match.params),
    pathname: (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.joinPaths)([parentPathnameBase,
    // Re-encode pathnames that were decoded inside matchRoutes
    navigator.encodeLocation ? navigator.encodeLocation(match.pathname).pathname : match.pathname]),
    pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.joinPaths)([parentPathnameBase,
    // Re-encode pathnames that were decoded inside matchRoutes
    navigator.encodeLocation ? navigator.encodeLocation(match.pathnameBase).pathname : match.pathnameBase])
  })), parentMatches, dataRouterState, future);

  // When a user passes in a `locationArg`, the associated routes need to
  // be wrapped in a new `LocationContext.Provider` in order for `useLocation`
  // to use the scoped location instead of the global location.
  if (locationArg && renderedMatches) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(LocationContext.Provider, {
      value: {
        location: _extends({
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default"
        }, location),
        navigationType: _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.Action.Pop
      }
    }, renderedMatches);
  }
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.isRouteErrorResponse)(error) ? error.status + " " + error.statusText : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = {
    padding: "0.5rem",
    backgroundColor: lightgrey
  };
  let codeStyles = {
    padding: "2px 4px",
    backgroundColor: lightgrey
  };
  let devInfo = null;
  if (true) {
    console.error("Error handled by React Router default ErrorBoundary:", error);
    devInfo = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "\uD83D\uDCBF Hey developer \uD83D\uDC4B"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("code", {
      style: codeStyles
    }, "ErrorBoundary"), " or", " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("code", {
      style: codeStyles
    }, "errorElement"), " prop on your route."));
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", null, "Unexpected Application Error!"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", {
    style: {
      fontStyle: "italic"
    }
  }, message), stack ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("pre", {
    style: preStyles
  }, stack) : null, devInfo);
}
const defaultErrorElement = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultErrorComponent, null);
class RenderErrorBoundary extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error: error
    };
  }
  static getDerivedStateFromProps(props, state) {
    // When we get into an error state, the user will likely click "back" to the
    // previous page that didn't have an error. Because this wraps the entire
    // application, that will have no effect--the error page continues to display.
    // This gives us a mechanism to recover from the error when the location changes.
    //
    // Whether we're in an error state or not, we update the location in state
    // so that when we are in an error state, it gets reset when a new location
    // comes in and the user recovers from the error.
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }

    // If we're not changing locations, preserve the location but still surface
    // any new errors that may come through. We retain the existing error, we do
    // this because the error provided from the app state may be cleared without
    // the location changing.
    return {
      error: props.error !== undefined ? props.error : state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Router caught the following error during render", error, errorInfo);
  }
  render() {
    return this.state.error !== undefined ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(RouteContext.Provider, {
      value: this.props.routeContext
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(RouteErrorContext.Provider, {
      value: this.state.error,
      children: this.props.component
    })) : this.props.children;
  }
}
function RenderedRoute(_ref) {
  let {
    routeContext,
    match,
    children
  } = _ref;
  let dataRouterContext = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterContext);

  // Track how deep we got in our render pass to emulate SSR componentDidCatch
  // in a DataStaticRouter
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(RouteContext.Provider, {
    value: routeContext
  }, children);
}
function _renderMatches(matches, parentMatches, dataRouterState, future) {
  var _dataRouterState2;
  if (parentMatches === void 0) {
    parentMatches = [];
  }
  if (dataRouterState === void 0) {
    dataRouterState = null;
  }
  if (future === void 0) {
    future = null;
  }
  if (matches == null) {
    var _dataRouterState;
    if ((_dataRouterState = dataRouterState) != null && _dataRouterState.errors) {
      // Don't bail if we have data router errors so we can render them in the
      // boundary.  Use the pre-matched (or shimmed) matches
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;

  // If we have data errors, trim matches to the highest error boundary
  let errors = (_dataRouterState2 = dataRouterState) == null ? void 0 : _dataRouterState2.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex(m => m.route.id && (errors == null ? void 0 : errors[m.route.id]) !== undefined);
    !(errorIndex >= 0) ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, "Could not find a matching route for errors on route IDs: " + Object.keys(errors).join(",")) : 0 : void 0;
    renderedMatches = renderedMatches.slice(0, Math.min(renderedMatches.length, errorIndex + 1));
  }

  // If we're in a partial hydration mode, detect if we need to render down to
  // a given HydrateFallback while we load the rest of the hydration data
  let renderFallback = false;
  let fallbackIndex = -1;
  if (dataRouterState && future && future.v7_partialHydration) {
    for (let i = 0; i < renderedMatches.length; i++) {
      let match = renderedMatches[i];
      // Track the deepest fallback up until the first route without data
      if (match.route.HydrateFallback || match.route.hydrateFallbackElement) {
        fallbackIndex = i;
      }
      if (match.route.id) {
        let {
          loaderData,
          errors
        } = dataRouterState;
        let needsToRunLoader = match.route.loader && loaderData[match.route.id] === undefined && (!errors || errors[match.route.id] === undefined);
        if (match.route.lazy || needsToRunLoader) {
          // We found the first route that's not ready to render (waiting on
          // lazy, or has a loader that hasn't run yet).  Flag that we need to
          // render a fallback and render up until the appropriate fallback
          renderFallback = true;
          if (fallbackIndex >= 0) {
            renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
          } else {
            renderedMatches = [renderedMatches[0]];
          }
          break;
        }
      }
    }
  }
  return renderedMatches.reduceRight((outlet, match, index) => {
    // Only data routers handle errors/fallbacks
    let error;
    let shouldRenderHydrateFallback = false;
    let errorElement = null;
    let hydrateFallbackElement = null;
    if (dataRouterState) {
      error = errors && match.route.id ? errors[match.route.id] : undefined;
      errorElement = match.route.errorElement || defaultErrorElement;
      if (renderFallback) {
        if (fallbackIndex < 0 && index === 0) {
          warningOnce("route-fallback", false, "No `HydrateFallback` element provided to render during initial hydration");
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = null;
        } else if (fallbackIndex === index) {
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = match.route.hydrateFallbackElement || null;
        }
      }
    }
    let matches = parentMatches.concat(renderedMatches.slice(0, index + 1));
    let getChildren = () => {
      let children;
      if (error) {
        children = errorElement;
      } else if (shouldRenderHydrateFallback) {
        children = hydrateFallbackElement;
      } else if (match.route.Component) {
        // Note: This is a de-optimized path since React won't re-use the
        // ReactElement since it's identity changes with each new
        // React.createElement call.  We keep this so folks can use
        // `<Route Component={...}>` in `<Routes>` but generally `Component`
        // usage is only advised in `RouterProvider` when we can convert it to
        // `element` ahead of time.
        children = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(match.route.Component, null);
      } else if (match.route.element) {
        children = match.route.element;
      } else {
        children = outlet;
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(RenderedRoute, {
        match: match,
        routeContext: {
          outlet,
          matches,
          isDataRoute: dataRouterState != null
        },
        children: children
      });
    };
    // Only wrap in an error boundary within data router usages when we have an
    // ErrorBoundary/errorElement on this route.  Otherwise let it bubble up to
    // an ancestor ErrorBoundary/errorElement
    return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(RenderErrorBoundary, {
      location: dataRouterState.location,
      revalidation: dataRouterState.revalidation,
      component: errorElement,
      error: error,
      children: getChildren(),
      routeContext: {
        outlet: null,
        matches,
        isDataRoute: true
      }
    }) : getChildren();
  }, null);
}
var DataRouterHook = /*#__PURE__*/function (DataRouterHook) {
  DataRouterHook["UseBlocker"] = "useBlocker";
  DataRouterHook["UseRevalidator"] = "useRevalidator";
  DataRouterHook["UseNavigateStable"] = "useNavigate";
  return DataRouterHook;
}(DataRouterHook || {});
var DataRouterStateHook = /*#__PURE__*/function (DataRouterStateHook) {
  DataRouterStateHook["UseBlocker"] = "useBlocker";
  DataRouterStateHook["UseLoaderData"] = "useLoaderData";
  DataRouterStateHook["UseActionData"] = "useActionData";
  DataRouterStateHook["UseRouteError"] = "useRouteError";
  DataRouterStateHook["UseNavigation"] = "useNavigation";
  DataRouterStateHook["UseRouteLoaderData"] = "useRouteLoaderData";
  DataRouterStateHook["UseMatches"] = "useMatches";
  DataRouterStateHook["UseRevalidator"] = "useRevalidator";
  DataRouterStateHook["UseNavigateStable"] = "useNavigate";
  DataRouterStateHook["UseRouteId"] = "useRouteId";
  return DataRouterStateHook;
}(DataRouterStateHook || {});
function getDataRouterConsoleError(hookName) {
  return hookName + " must be used within a data router.  See https://reactrouter.com/routers/picking-a-router.";
}
function useDataRouterContext(hookName) {
  let ctx = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterContext);
  !ctx ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, getDataRouterConsoleError(hookName)) : 0 : void 0;
  return ctx;
}
function useDataRouterState(hookName) {
  let state = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterStateContext);
  !state ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, getDataRouterConsoleError(hookName)) : 0 : void 0;
  return state;
}
function useRouteContext(hookName) {
  let route = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  !route ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, getDataRouterConsoleError(hookName)) : 0 : void 0;
  return route;
}

// Internal version with hookName-aware debugging
function useCurrentRouteId(hookName) {
  let route = useRouteContext(hookName);
  let thisRoute = route.matches[route.matches.length - 1];
  !thisRoute.route.id ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, hookName + " can only be used on routes that contain a unique \"id\"") : 0 : void 0;
  return thisRoute.route.id;
}

/**
 * Returns the ID for the nearest contextual route
 */
function useRouteId() {
  return useCurrentRouteId(DataRouterStateHook.UseRouteId);
}

/**
 * Returns the current navigation, defaulting to an "idle" navigation when
 * no navigation is in progress
 */
function useNavigation() {
  let state = useDataRouterState(DataRouterStateHook.UseNavigation);
  return state.navigation;
}

/**
 * Returns a revalidate function for manually triggering revalidation, as well
 * as the current state of any manual revalidations
 */
function useRevalidator() {
  let dataRouterContext = useDataRouterContext(DataRouterHook.UseRevalidator);
  let state = useDataRouterState(DataRouterStateHook.UseRevalidator);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    revalidate: dataRouterContext.router.revalidate,
    state: state.revalidation
  }), [dataRouterContext.router.revalidate, state.revalidation]);
}

/**
 * Returns the active route matches, useful for accessing loaderData for
 * parent/child routes or the route "handle" property
 */
function useMatches() {
  let {
    matches,
    loaderData
  } = useDataRouterState(DataRouterStateHook.UseMatches);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => matches.map(m => (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_convertRouteMatchToUiMatch)(m, loaderData)), [matches, loaderData]);
}

/**
 * Returns the loader data for the nearest ancestor Route loader
 */
function useLoaderData() {
  let state = useDataRouterState(DataRouterStateHook.UseLoaderData);
  let routeId = useCurrentRouteId(DataRouterStateHook.UseLoaderData);
  if (state.errors && state.errors[routeId] != null) {
    console.error("You cannot `useLoaderData` in an errorElement (routeId: " + routeId + ")");
    return undefined;
  }
  return state.loaderData[routeId];
}

/**
 * Returns the loaderData for the given routeId
 */
function useRouteLoaderData(routeId) {
  let state = useDataRouterState(DataRouterStateHook.UseRouteLoaderData);
  return state.loaderData[routeId];
}

/**
 * Returns the action data for the nearest ancestor Route action
 */
function useActionData() {
  let state = useDataRouterState(DataRouterStateHook.UseActionData);
  let routeId = useCurrentRouteId(DataRouterStateHook.UseLoaderData);
  return state.actionData ? state.actionData[routeId] : undefined;
}

/**
 * Returns the nearest ancestor Route error, which could be a loader/action
 * error or a render error.  This is intended to be called from your
 * ErrorBoundary/errorElement to display a proper error message.
 */
function useRouteError() {
  var _state$errors;
  let error = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteErrorContext);
  let state = useDataRouterState(DataRouterStateHook.UseRouteError);
  let routeId = useCurrentRouteId(DataRouterStateHook.UseRouteError);

  // If this was a render error, we put it in a RouteError context inside
  // of RenderErrorBoundary
  if (error !== undefined) {
    return error;
  }

  // Otherwise look for errors from our data router state
  return (_state$errors = state.errors) == null ? void 0 : _state$errors[routeId];
}

/**
 * Returns the happy-path data from the nearest ancestor `<Await />` value
 */
function useAsyncValue() {
  let value = react__WEBPACK_IMPORTED_MODULE_0__.useContext(AwaitContext);
  return value == null ? void 0 : value._data;
}

/**
 * Returns the error from the nearest ancestor `<Await />` value
 */
function useAsyncError() {
  let value = react__WEBPACK_IMPORTED_MODULE_0__.useContext(AwaitContext);
  return value == null ? void 0 : value._error;
}
let blockerId = 0;

/**
 * Allow the application to block navigations within the SPA and present the
 * user a confirmation dialog to confirm the navigation.  Mostly used to avoid
 * using half-filled form data.  This does not handle hard-reloads or
 * cross-origin navigations.
 */
function useBlocker(shouldBlock) {
  let {
    router,
    basename
  } = useDataRouterContext(DataRouterHook.UseBlocker);
  let state = useDataRouterState(DataRouterStateHook.UseBlocker);
  let [blockerKey, setBlockerKey] = react__WEBPACK_IMPORTED_MODULE_0__.useState("");
  let blockerFunction = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(arg => {
    if (typeof shouldBlock !== "function") {
      return !!shouldBlock;
    }
    if (basename === "/") {
      return shouldBlock(arg);
    }

    // If they provided us a function and we've got an active basename, strip
    // it from the locations we expose to the user to match the behavior of
    // useLocation
    let {
      currentLocation,
      nextLocation,
      historyAction
    } = arg;
    return shouldBlock({
      currentLocation: _extends({}, currentLocation, {
        pathname: (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.stripBasename)(currentLocation.pathname, basename) || currentLocation.pathname
      }),
      nextLocation: _extends({}, nextLocation, {
        pathname: (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.stripBasename)(nextLocation.pathname, basename) || nextLocation.pathname
      }),
      historyAction
    });
  }, [basename, shouldBlock]);

  // This effect is in charge of blocker key assignment and deletion (which is
  // tightly coupled to the key)
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    let key = String(++blockerId);
    setBlockerKey(key);
    return () => router.deleteBlocker(key);
  }, [router]);

  // This effect handles assigning the blockerFunction.  This is to handle
  // unstable blocker function identities, and happens only after the prior
  // effect so we don't get an orphaned blockerFunction in the router with a
  // key of "".  Until then we just have the IDLE_BLOCKER.
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (blockerKey !== "") {
      router.getBlocker(blockerKey, blockerFunction);
    }
  }, [router, blockerKey, blockerFunction]);

  // Prefer the blocker from `state` not `router.state` since DataRouterContext
  // is memoized so this ensures we update on blocker state updates
  return blockerKey && state.blockers.has(blockerKey) ? state.blockers.get(blockerKey) : _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.IDLE_BLOCKER;
}

/**
 * Stable version of useNavigate that is used when we are in the context of
 * a RouterProvider.
 */
function useNavigateStable() {
  let {
    router
  } = useDataRouterContext(DataRouterHook.UseNavigateStable);
  let id = useCurrentRouteId(DataRouterStateHook.UseNavigateStable);
  let activeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (to, options) {
    if (options === void 0) {
      options = {};
    }
     true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(activeRef.current, navigateEffectWarning) : 0;

    // Short circuit here since if this happens on first render the navigate
    // is useless because we haven't wired up our router subscriber yet
    if (!activeRef.current) return;
    if (typeof to === "number") {
      router.navigate(to);
    } else {
      router.navigate(to, _extends({
        fromRouteId: id
      }, options));
    }
  }, [router, id]);
  return navigate;
}
const alreadyWarned = {};
function warningOnce(key, cond, message) {
  if (!cond && !alreadyWarned[key]) {
    alreadyWarned[key] = true;
     true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(false, message) : 0;
  }
}

/**
  Webpack + React 17 fails to compile on any of the following because webpack
  complains that `startTransition` doesn't exist in `React`:
  * import { startTransition } from "react"
  * import * as React from from "react";
    "startTransition" in React ? React.startTransition(() => setState()) : setState()
  * import * as React from from "react";
    "startTransition" in React ? React["startTransition"](() => setState()) : setState()

  Moving it to a constant such as the following solves the Webpack/React 17 issue:
  * import * as React from from "react";
    const START_TRANSITION = "startTransition";
    START_TRANSITION in React ? React[START_TRANSITION](() => setState()) : setState()

  However, that introduces webpack/terser minification issues in production builds
  in React 18 where minification/obfuscation ends up removing the call of
  React.startTransition entirely from the first half of the ternary.  Grabbing
  this exported reference once up front resolves that issue.

  See https://github.com/remix-run/react-router/issues/10579
*/
const START_TRANSITION = "startTransition";
const startTransitionImpl = react__WEBPACK_IMPORTED_MODULE_0__[START_TRANSITION];

/**
 * Given a Remix Router instance, render the appropriate UI
 */
function RouterProvider(_ref) {
  let {
    fallbackElement,
    router,
    future
  } = _ref;
  let [state, setStateImpl] = react__WEBPACK_IMPORTED_MODULE_0__.useState(router.state);
  let {
    v7_startTransition
  } = future || {};
  let setState = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(newState => {
    if (v7_startTransition && startTransitionImpl) {
      startTransitionImpl(() => setStateImpl(newState));
    } else {
      setStateImpl(newState);
    }
  }, [setStateImpl, v7_startTransition]);

  // Need to use a layout effect here so we are subscribed early enough to
  // pick up on any render-driven redirects/navigations (useEffect/<Navigate>)
  react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => router.subscribe(setState), [router, setState]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
     true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(fallbackElement == null || !router.future.v7_partialHydration, "`<RouterProvider fallbackElement>` is deprecated when using " + "`v7_partialHydration`, use a `HydrateFallback` component instead") : 0;
    // Only log this once on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let navigator = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    return {
      createHref: router.createHref,
      encodeLocation: router.encodeLocation,
      go: n => router.navigate(n),
      push: (to, state, opts) => router.navigate(to, {
        state,
        preventScrollReset: opts == null ? void 0 : opts.preventScrollReset
      }),
      replace: (to, state, opts) => router.navigate(to, {
        replace: true,
        state,
        preventScrollReset: opts == null ? void 0 : opts.preventScrollReset
      })
    };
  }, [router]);
  let basename = router.basename || "/";
  let dataRouterContext = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    router,
    navigator,
    static: false,
    basename
  }), [router, navigator, basename]);

  // The fragment and {null} here are important!  We need them to keep React 18's
  // useId happy when we are server-rendering since we may have a <script> here
  // containing the hydrated server-side staticContext (from StaticRouterProvider).
  // useId relies on the component tree structure to generate deterministic id's
  // so we need to ensure it remains the same on the client even though
  // we don't need the <script> tag
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(DataRouterContext.Provider, {
    value: dataRouterContext
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(DataRouterStateContext.Provider, {
    value: state
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Router, {
    basename: basename,
    location: state.location,
    navigationType: state.historyAction,
    navigator: navigator,
    future: {
      v7_relativeSplatPath: router.future.v7_relativeSplatPath
    }
  }, state.initialized || router.future.v7_partialHydration ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(DataRoutes, {
    routes: router.routes,
    future: router.future,
    state: state
  }) : fallbackElement))), null);
}
function DataRoutes(_ref2) {
  let {
    routes,
    future,
    state
  } = _ref2;
  return useRoutesImpl(routes, undefined, state, future);
}
/**
 * A `<Router>` that stores all entries in memory.
 *
 * @see https://reactrouter.com/router-components/memory-router
 */
function MemoryRouter(_ref3) {
  let {
    basename,
    children,
    initialEntries,
    initialIndex,
    future
  } = _ref3;
  let historyRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef();
  if (historyRef.current == null) {
    historyRef.current = (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.createMemoryHistory)({
      initialEntries,
      initialIndex,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = react__WEBPACK_IMPORTED_MODULE_0__.useState({
    action: history.action,
    location: history.location
  });
  let {
    v7_startTransition
  } = future || {};
  let setState = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(newState => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Router, {
    basename: basename,
    children: children,
    location: state.location,
    navigationType: state.action,
    navigator: history,
    future: future
  });
}
/**
 * Changes the current location.
 *
 * Note: This API is mostly useful in React.Component subclasses that are not
 * able to use hooks. In functional components, we recommend you use the
 * `useNavigate` hook instead.
 *
 * @see https://reactrouter.com/components/navigate
 */
function Navigate(_ref4) {
  let {
    to,
    replace,
    state,
    relative
  } = _ref4;
  !useInRouterContext() ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, // TODO: This error is probably because they somehow have 2 versions of
  // the router loaded. We can help them understand how to avoid that.
  "<Navigate> may be used only in the context of a <Router> component.") : 0 : void 0;
  let {
    future,
    static: isStatic
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
   true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(!isStatic, "<Navigate> must not be used on the initial render in a <StaticRouter>. " + "This is a no-op, but you should modify your code so the <Navigate> is " + "only ever rendered in response to some user interaction or state change.") : 0;
  let {
    matches
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let navigate = useNavigate();

  // Resolve the path outside of the effect so that when effects run twice in
  // StrictMode they navigate to the same place
  let path = (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.resolveTo)(to, (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_getResolveToMatches)(matches, future.v7_relativeSplatPath), locationPathname, relative === "path");
  let jsonPath = JSON.stringify(path);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => navigate(JSON.parse(jsonPath), {
    replace,
    state,
    relative
  }), [navigate, jsonPath, relative, replace, state]);
  return null;
}
/**
 * Renders the child route's element, if there is one.
 *
 * @see https://reactrouter.com/components/outlet
 */
function Outlet(props) {
  return useOutlet(props.context);
}
/**
 * Declares an element that should be rendered at a certain URL path.
 *
 * @see https://reactrouter.com/components/route
 */
function Route(_props) {
   true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, "A <Route> is only ever to be used as the child of <Routes> element, " + "never rendered directly. Please wrap your <Route> in a <Routes>.") : 0 ;
}
/**
 * Provides location context for the rest of the app.
 *
 * Note: You usually won't render a `<Router>` directly. Instead, you'll render a
 * router that is more specific to your environment such as a `<BrowserRouter>`
 * in web browsers or a `<StaticRouter>` for server rendering.
 *
 * @see https://reactrouter.com/router-components/router
 */
function Router(_ref5) {
  let {
    basename: basenameProp = "/",
    children = null,
    location: locationProp,
    navigationType = _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.Action.Pop,
    navigator,
    static: staticProp = false,
    future
  } = _ref5;
  !!useInRouterContext() ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, "You cannot render a <Router> inside another <Router>." + " You should never have more than one in your app.") : 0 : void 0;

  // Preserve trailing slashes on basename, so we can let the user control
  // the enforcement of trailing slashes throughout the app
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    basename,
    navigator,
    static: staticProp,
    future: _extends({
      v7_relativeSplatPath: false
    }, future)
  }), [basename, future, navigator, staticProp]);
  if (typeof locationProp === "string") {
    locationProp = (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.parsePath)(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    let trailingPathname = (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.stripBasename)(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search, hash, state, key, navigationType]);
   true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(locationContext != null, "<Router basename=\"" + basename + "\"> is not able to match the URL " + ("\"" + pathname + search + hash + "\" because it does not start with the ") + "basename, so the <Router> won't render anything.") : 0;
  if (locationContext == null) {
    return null;
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(NavigationContext.Provider, {
    value: navigationContext
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(LocationContext.Provider, {
    children: children,
    value: locationContext
  }));
}
/**
 * A container for a nested tree of `<Route>` elements that renders the branch
 * that best matches the current location.
 *
 * @see https://reactrouter.com/components/routes
 */
function Routes(_ref6) {
  let {
    children,
    location
  } = _ref6;
  return useRoutes(createRoutesFromChildren(children), location);
}
/**
 * Component to use for rendering lazily loaded data from returning defer()
 * in a loader function
 */
function Await(_ref7) {
  let {
    children,
    errorElement,
    resolve
  } = _ref7;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(AwaitErrorBoundary, {
    resolve: resolve,
    errorElement: errorElement
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(ResolveAwait, null, children));
}
var AwaitRenderStatus = /*#__PURE__*/function (AwaitRenderStatus) {
  AwaitRenderStatus[AwaitRenderStatus["pending"] = 0] = "pending";
  AwaitRenderStatus[AwaitRenderStatus["success"] = 1] = "success";
  AwaitRenderStatus[AwaitRenderStatus["error"] = 2] = "error";
  return AwaitRenderStatus;
}(AwaitRenderStatus || {});
const neverSettledPromise = new Promise(() => {});
class AwaitErrorBoundary extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("<Await> caught the following error during render", error, errorInfo);
  }
  render() {
    let {
      children,
      errorElement,
      resolve
    } = this.props;
    let promise = null;
    let status = AwaitRenderStatus.pending;
    if (!(resolve instanceof Promise)) {
      // Didn't get a promise - provide as a resolved promise
      status = AwaitRenderStatus.success;
      promise = Promise.resolve();
      Object.defineProperty(promise, "_tracked", {
        get: () => true
      });
      Object.defineProperty(promise, "_data", {
        get: () => resolve
      });
    } else if (this.state.error) {
      // Caught a render error, provide it as a rejected promise
      status = AwaitRenderStatus.error;
      let renderError = this.state.error;
      promise = Promise.reject().catch(() => {}); // Avoid unhandled rejection warnings
      Object.defineProperty(promise, "_tracked", {
        get: () => true
      });
      Object.defineProperty(promise, "_error", {
        get: () => renderError
      });
    } else if (resolve._tracked) {
      // Already tracked promise - check contents
      promise = resolve;
      status = "_error" in promise ? AwaitRenderStatus.error : "_data" in promise ? AwaitRenderStatus.success : AwaitRenderStatus.pending;
    } else {
      // Raw (untracked) promise - track it
      status = AwaitRenderStatus.pending;
      Object.defineProperty(resolve, "_tracked", {
        get: () => true
      });
      promise = resolve.then(data => Object.defineProperty(resolve, "_data", {
        get: () => data
      }), error => Object.defineProperty(resolve, "_error", {
        get: () => error
      }));
    }
    if (status === AwaitRenderStatus.error && promise._error instanceof _remix_run_router__WEBPACK_IMPORTED_MODULE_1__.AbortedDeferredError) {
      // Freeze the UI by throwing a never resolved promise
      throw neverSettledPromise;
    }
    if (status === AwaitRenderStatus.error && !errorElement) {
      // No errorElement, throw to the nearest route-level error boundary
      throw promise._error;
    }
    if (status === AwaitRenderStatus.error) {
      // Render via our errorElement
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(AwaitContext.Provider, {
        value: promise,
        children: errorElement
      });
    }
    if (status === AwaitRenderStatus.success) {
      // Render children with resolved value
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(AwaitContext.Provider, {
        value: promise,
        children: children
      });
    }

    // Throw to the suspense boundary
    throw promise;
  }
}

/**
 * @private
 * Indirection to leverage useAsyncValue for a render-prop API on `<Await>`
 */
function ResolveAwait(_ref8) {
  let {
    children
  } = _ref8;
  let data = useAsyncValue();
  let toRender = typeof children === "function" ? children(data) : children;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, toRender);
}

///////////////////////////////////////////////////////////////////////////////
// UTILS
///////////////////////////////////////////////////////////////////////////////

/**
 * Creates a route config from a React "children" object, which is usually
 * either a `<Route>` element or an array of them. Used internally by
 * `<Routes>` to create a route config from its children.
 *
 * @see https://reactrouter.com/utils/create-routes-from-children
 */
function createRoutesFromChildren(children, parentPath) {
  if (parentPath === void 0) {
    parentPath = [];
  }
  let routes = [];
  react__WEBPACK_IMPORTED_MODULE_0__.Children.forEach(children, (element, index) => {
    if (! /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(element)) {
      // Ignore non-elements. This allows people to more easily inline
      // conditionals in their route config.
      return;
    }
    let treePath = [...parentPath, index];
    if (element.type === react__WEBPACK_IMPORTED_MODULE_0__.Fragment) {
      // Transparently support React.Fragment and its children.
      routes.push.apply(routes, createRoutesFromChildren(element.props.children, treePath));
      return;
    }
    !(element.type === Route) ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, "[" + (typeof element.type === "string" ? element.type : element.type.name) + "] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>") : 0 : void 0;
    !(!element.props.index || !element.props.children) ?  true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_invariant)(false, "An index route cannot have child routes.") : 0 : void 0;
    let route = {
      id: element.props.id || treePath.join("-"),
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      Component: element.props.Component,
      index: element.props.index,
      path: element.props.path,
      loader: element.props.loader,
      action: element.props.action,
      errorElement: element.props.errorElement,
      ErrorBoundary: element.props.ErrorBoundary,
      hasErrorBoundary: element.props.ErrorBoundary != null || element.props.errorElement != null,
      shouldRevalidate: element.props.shouldRevalidate,
      handle: element.props.handle,
      lazy: element.props.lazy
    };
    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children, treePath);
    }
    routes.push(route);
  });
  return routes;
}

/**
 * Renders the result of `matchRoutes()` into a React element.
 */
function renderMatches(matches) {
  return _renderMatches(matches);
}

function mapRouteProperties(route) {
  let updates = {
    // Note: this check also occurs in createRoutesFromChildren so update
    // there if you change this -- please and thank you!
    hasErrorBoundary: route.ErrorBoundary != null || route.errorElement != null
  };
  if (route.Component) {
    if (true) {
      if (route.element) {
         true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(false, "You should not include both `Component` and `element` on your route - " + "`Component` will be used.") : 0;
      }
    }
    Object.assign(updates, {
      element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(route.Component),
      Component: undefined
    });
  }
  if (route.HydrateFallback) {
    if (true) {
      if (route.hydrateFallbackElement) {
         true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(false, "You should not include both `HydrateFallback` and `hydrateFallbackElement` on your route - " + "`HydrateFallback` will be used.") : 0;
      }
    }
    Object.assign(updates, {
      hydrateFallbackElement: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(route.HydrateFallback),
      HydrateFallback: undefined
    });
  }
  if (route.ErrorBoundary) {
    if (true) {
      if (route.errorElement) {
         true ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.UNSAFE_warning)(false, "You should not include both `ErrorBoundary` and `errorElement` on your route - " + "`ErrorBoundary` will be used.") : 0;
      }
    }
    Object.assign(updates, {
      errorElement: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(route.ErrorBoundary),
      ErrorBoundary: undefined
    });
  }
  return updates;
}
function createMemoryRouter(routes, opts) {
  return (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.createRouter)({
    basename: opts == null ? void 0 : opts.basename,
    future: _extends({}, opts == null ? void 0 : opts.future, {
      v7_prependBasename: true
    }),
    history: (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__.createMemoryHistory)({
      initialEntries: opts == null ? void 0 : opts.initialEntries,
      initialIndex: opts == null ? void 0 : opts.initialIndex
    }),
    hydrationData: opts == null ? void 0 : opts.hydrationData,
    routes,
    mapRouteProperties,
    unstable_dataStrategy: opts == null ? void 0 : opts.unstable_dataStrategy,
    unstable_patchRoutesOnMiss: opts == null ? void 0 : opts.unstable_patchRoutesOnMiss
  }).initialize();
}


//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/react/cjs/react-jsx-runtime.development.js":
/*!*****************************************************************!*\
  !*** ./node_modules/react/cjs/react-jsx-runtime.development.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (true) {
  (function() {
'use strict';

var React = __webpack_require__(/*! react */ "react");

// ATTENTION
// When adding new symbols to this file,
// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
// The Symbol used to tag the ReactElement-like types.
var REACT_ELEMENT_TYPE = Symbol.for('react.element');
var REACT_PORTAL_TYPE = Symbol.for('react.portal');
var REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
var REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode');
var REACT_PROFILER_TYPE = Symbol.for('react.profiler');
var REACT_PROVIDER_TYPE = Symbol.for('react.provider');
var REACT_CONTEXT_TYPE = Symbol.for('react.context');
var REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
var REACT_SUSPENSE_TYPE = Symbol.for('react.suspense');
var REACT_SUSPENSE_LIST_TYPE = Symbol.for('react.suspense_list');
var REACT_MEMO_TYPE = Symbol.for('react.memo');
var REACT_LAZY_TYPE = Symbol.for('react.lazy');
var REACT_OFFSCREEN_TYPE = Symbol.for('react.offscreen');
var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';
function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable !== 'object') {
    return null;
  }

  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }

  return null;
}

var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

function error(format) {
  {
    {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      printWarning('error', format, args);
    }
  }
}

function printWarning(level, format, args) {
  // When changing this logic, you might want to also
  // update consoleWithStackDev.www.js as well.
  {
    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
    var stack = ReactDebugCurrentFrame.getStackAddendum();

    if (stack !== '') {
      format += '%s';
      args = args.concat([stack]);
    } // eslint-disable-next-line react-internal/safe-string-coercion


    var argsWithFormat = args.map(function (item) {
      return String(item);
    }); // Careful: RN currently depends on this prefix

    argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
    // breaks IE9: https://github.com/facebook/react/issues/13610
    // eslint-disable-next-line react-internal/no-production-logging

    Function.prototype.apply.call(console[level], console, argsWithFormat);
  }
}

// -----------------------------------------------------------------------------

var enableScopeAPI = false; // Experimental Create Event Handle API.
var enableCacheElement = false;
var enableTransitionTracing = false; // No known bugs, but needs performance testing

var enableLegacyHidden = false; // Enables unstable_avoidThisFallback feature in Fiber
// stuff. Intended to enable React core members to more easily debug scheduling
// issues in DEV builds.

var enableDebugTracing = false; // Track which Fiber(s) schedule render work.

var REACT_MODULE_REFERENCE;

{
  REACT_MODULE_REFERENCE = Symbol.for('react.module.reference');
}

function isValidElementType(type) {
  if (typeof type === 'string' || typeof type === 'function') {
    return true;
  } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).


  if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing  || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden  || type === REACT_OFFSCREEN_TYPE || enableScopeAPI  || enableCacheElement  || enableTransitionTracing ) {
    return true;
  }

  if (typeof type === 'object' && type !== null) {
    if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
    // types supported by any Flight configuration anywhere since
    // we don't know which Flight build this will end up being used
    // with.
    type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== undefined) {
      return true;
    }
  }

  return false;
}

function getWrappedName(outerType, innerType, wrapperName) {
  var displayName = outerType.displayName;

  if (displayName) {
    return displayName;
  }

  var functionName = innerType.displayName || innerType.name || '';
  return functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName;
} // Keep in sync with react-reconciler/getComponentNameFromFiber


function getContextName(type) {
  return type.displayName || 'Context';
} // Note that the reconciler package should generally prefer to use getComponentNameFromFiber() instead.


function getComponentNameFromType(type) {
  if (type == null) {
    // Host root, text node or just invalid type.
    return null;
  }

  {
    if (typeof type.tag === 'number') {
      error('Received an unexpected object in getComponentNameFromType(). ' + 'This is likely a bug in React. Please file an issue.');
    }
  }

  if (typeof type === 'function') {
    return type.displayName || type.name || null;
  }

  if (typeof type === 'string') {
    return type;
  }

  switch (type) {
    case REACT_FRAGMENT_TYPE:
      return 'Fragment';

    case REACT_PORTAL_TYPE:
      return 'Portal';

    case REACT_PROFILER_TYPE:
      return 'Profiler';

    case REACT_STRICT_MODE_TYPE:
      return 'StrictMode';

    case REACT_SUSPENSE_TYPE:
      return 'Suspense';

    case REACT_SUSPENSE_LIST_TYPE:
      return 'SuspenseList';

  }

  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_CONTEXT_TYPE:
        var context = type;
        return getContextName(context) + '.Consumer';

      case REACT_PROVIDER_TYPE:
        var provider = type;
        return getContextName(provider._context) + '.Provider';

      case REACT_FORWARD_REF_TYPE:
        return getWrappedName(type, type.render, 'ForwardRef');

      case REACT_MEMO_TYPE:
        var outerName = type.displayName || null;

        if (outerName !== null) {
          return outerName;
        }

        return getComponentNameFromType(type.type) || 'Memo';

      case REACT_LAZY_TYPE:
        {
          var lazyComponent = type;
          var payload = lazyComponent._payload;
          var init = lazyComponent._init;

          try {
            return getComponentNameFromType(init(payload));
          } catch (x) {
            return null;
          }
        }

      // eslint-disable-next-line no-fallthrough
    }
  }

  return null;
}

var assign = Object.assign;

// Helpers to patch console.logs to avoid logging during side-effect free
// replaying on render function. This currently only patches the object
// lazily which won't cover if the log function was extracted eagerly.
// We could also eagerly patch the method.
var disabledDepth = 0;
var prevLog;
var prevInfo;
var prevWarn;
var prevError;
var prevGroup;
var prevGroupCollapsed;
var prevGroupEnd;

function disabledLog() {}

disabledLog.__reactDisabledLog = true;
function disableLogs() {
  {
    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      prevLog = console.log;
      prevInfo = console.info;
      prevWarn = console.warn;
      prevError = console.error;
      prevGroup = console.group;
      prevGroupCollapsed = console.groupCollapsed;
      prevGroupEnd = console.groupEnd; // https://github.com/facebook/react/issues/19099

      var props = {
        configurable: true,
        enumerable: true,
        value: disabledLog,
        writable: true
      }; // $FlowFixMe Flow thinks console is immutable.

      Object.defineProperties(console, {
        info: props,
        log: props,
        warn: props,
        error: props,
        group: props,
        groupCollapsed: props,
        groupEnd: props
      });
      /* eslint-enable react-internal/no-production-logging */
    }

    disabledDepth++;
  }
}
function reenableLogs() {
  {
    disabledDepth--;

    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      var props = {
        configurable: true,
        enumerable: true,
        writable: true
      }; // $FlowFixMe Flow thinks console is immutable.

      Object.defineProperties(console, {
        log: assign({}, props, {
          value: prevLog
        }),
        info: assign({}, props, {
          value: prevInfo
        }),
        warn: assign({}, props, {
          value: prevWarn
        }),
        error: assign({}, props, {
          value: prevError
        }),
        group: assign({}, props, {
          value: prevGroup
        }),
        groupCollapsed: assign({}, props, {
          value: prevGroupCollapsed
        }),
        groupEnd: assign({}, props, {
          value: prevGroupEnd
        })
      });
      /* eslint-enable react-internal/no-production-logging */
    }

    if (disabledDepth < 0) {
      error('disabledDepth fell below zero. ' + 'This is a bug in React. Please file an issue.');
    }
  }
}

var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
var prefix;
function describeBuiltInComponentFrame(name, source, ownerFn) {
  {
    if (prefix === undefined) {
      // Extract the VM specific prefix used by each line.
      try {
        throw Error();
      } catch (x) {
        var match = x.stack.trim().match(/\n( *(at )?)/);
        prefix = match && match[1] || '';
      }
    } // We use the prefix to ensure our stacks line up with native stack frames.


    return '\n' + prefix + name;
  }
}
var reentry = false;
var componentFrameCache;

{
  var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
  componentFrameCache = new PossiblyWeakMap();
}

function describeNativeComponentFrame(fn, construct) {
  // If something asked for a stack inside a fake render, it should get ignored.
  if ( !fn || reentry) {
    return '';
  }

  {
    var frame = componentFrameCache.get(fn);

    if (frame !== undefined) {
      return frame;
    }
  }

  var control;
  reentry = true;
  var previousPrepareStackTrace = Error.prepareStackTrace; // $FlowFixMe It does accept undefined.

  Error.prepareStackTrace = undefined;
  var previousDispatcher;

  {
    previousDispatcher = ReactCurrentDispatcher.current; // Set the dispatcher in DEV because this might be call in the render function
    // for warnings.

    ReactCurrentDispatcher.current = null;
    disableLogs();
  }

  try {
    // This should throw.
    if (construct) {
      // Something should be setting the props in the constructor.
      var Fake = function () {
        throw Error();
      }; // $FlowFixMe


      Object.defineProperty(Fake.prototype, 'props', {
        set: function () {
          // We use a throwing setter instead of frozen or non-writable props
          // because that won't throw in a non-strict mode function.
          throw Error();
        }
      });

      if (typeof Reflect === 'object' && Reflect.construct) {
        // We construct a different control for this case to include any extra
        // frames added by the construct call.
        try {
          Reflect.construct(Fake, []);
        } catch (x) {
          control = x;
        }

        Reflect.construct(fn, [], Fake);
      } else {
        try {
          Fake.call();
        } catch (x) {
          control = x;
        }

        fn.call(Fake.prototype);
      }
    } else {
      try {
        throw Error();
      } catch (x) {
        control = x;
      }

      fn();
    }
  } catch (sample) {
    // This is inlined manually because closure doesn't do it for us.
    if (sample && control && typeof sample.stack === 'string') {
      // This extracts the first frame from the sample that isn't also in the control.
      // Skipping one frame that we assume is the frame that calls the two.
      var sampleLines = sample.stack.split('\n');
      var controlLines = control.stack.split('\n');
      var s = sampleLines.length - 1;
      var c = controlLines.length - 1;

      while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
        // We expect at least one stack frame to be shared.
        // Typically this will be the root most one. However, stack frames may be
        // cut off due to maximum stack limits. In this case, one maybe cut off
        // earlier than the other. We assume that the sample is longer or the same
        // and there for cut off earlier. So we should find the root most frame in
        // the sample somewhere in the control.
        c--;
      }

      for (; s >= 1 && c >= 0; s--, c--) {
        // Next we find the first one that isn't the same which should be the
        // frame that called our sample function and the control.
        if (sampleLines[s] !== controlLines[c]) {
          // In V8, the first line is describing the message but other VMs don't.
          // If we're about to return the first line, and the control is also on the same
          // line, that's a pretty good indicator that our sample threw at same line as
          // the control. I.e. before we entered the sample frame. So we ignore this result.
          // This can happen if you passed a class to function component, or non-function.
          if (s !== 1 || c !== 1) {
            do {
              s--;
              c--; // We may still have similar intermediate frames from the construct call.
              // The next one that isn't the same should be our match though.

              if (c < 0 || sampleLines[s] !== controlLines[c]) {
                // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
                var _frame = '\n' + sampleLines[s].replace(' at new ', ' at '); // If our component frame is labeled "<anonymous>"
                // but we have a user-provided "displayName"
                // splice it in to make the stack more readable.


                if (fn.displayName && _frame.includes('<anonymous>')) {
                  _frame = _frame.replace('<anonymous>', fn.displayName);
                }

                {
                  if (typeof fn === 'function') {
                    componentFrameCache.set(fn, _frame);
                  }
                } // Return the line we found.


                return _frame;
              }
            } while (s >= 1 && c >= 0);
          }

          break;
        }
      }
    }
  } finally {
    reentry = false;

    {
      ReactCurrentDispatcher.current = previousDispatcher;
      reenableLogs();
    }

    Error.prepareStackTrace = previousPrepareStackTrace;
  } // Fallback to just using the name if we couldn't make it throw.


  var name = fn ? fn.displayName || fn.name : '';
  var syntheticFrame = name ? describeBuiltInComponentFrame(name) : '';

  {
    if (typeof fn === 'function') {
      componentFrameCache.set(fn, syntheticFrame);
    }
  }

  return syntheticFrame;
}
function describeFunctionComponentFrame(fn, source, ownerFn) {
  {
    return describeNativeComponentFrame(fn, false);
  }
}

function shouldConstruct(Component) {
  var prototype = Component.prototype;
  return !!(prototype && prototype.isReactComponent);
}

function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {

  if (type == null) {
    return '';
  }

  if (typeof type === 'function') {
    {
      return describeNativeComponentFrame(type, shouldConstruct(type));
    }
  }

  if (typeof type === 'string') {
    return describeBuiltInComponentFrame(type);
  }

  switch (type) {
    case REACT_SUSPENSE_TYPE:
      return describeBuiltInComponentFrame('Suspense');

    case REACT_SUSPENSE_LIST_TYPE:
      return describeBuiltInComponentFrame('SuspenseList');
  }

  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_FORWARD_REF_TYPE:
        return describeFunctionComponentFrame(type.render);

      case REACT_MEMO_TYPE:
        // Memo may contain any component type so we recursively resolve it.
        return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);

      case REACT_LAZY_TYPE:
        {
          var lazyComponent = type;
          var payload = lazyComponent._payload;
          var init = lazyComponent._init;

          try {
            // Lazy may contain any component type so we recursively resolve it.
            return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
          } catch (x) {}
        }
    }
  }

  return '';
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

var loggedTypeFailures = {};
var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;

function setCurrentlyValidatingElement(element) {
  {
    if (element) {
      var owner = element._owner;
      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
      ReactDebugCurrentFrame.setExtraStackFrame(stack);
    } else {
      ReactDebugCurrentFrame.setExtraStackFrame(null);
    }
  }
}

function checkPropTypes(typeSpecs, values, location, componentName, element) {
  {
    // $FlowFixMe This is okay but Flow doesn't know it.
    var has = Function.call.bind(hasOwnProperty);

    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error$1 = void 0; // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.

        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            // eslint-disable-next-line react-internal/prod-error-codes
            var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
            err.name = 'Invariant Violation';
            throw err;
          }

          error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED');
        } catch (ex) {
          error$1 = ex;
        }

        if (error$1 && !(error$1 instanceof Error)) {
          setCurrentlyValidatingElement(element);

          error('%s: type specification of %s' + ' `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error$1);

          setCurrentlyValidatingElement(null);
        }

        if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error$1.message] = true;
          setCurrentlyValidatingElement(element);

          error('Failed %s type: %s', location, error$1.message);

          setCurrentlyValidatingElement(null);
        }
      }
    }
  }
}

var isArrayImpl = Array.isArray; // eslint-disable-next-line no-redeclare

function isArray(a) {
  return isArrayImpl(a);
}

/*
 * The `'' + value` pattern (used in in perf-sensitive code) throws for Symbol
 * and Temporal.* types. See https://github.com/facebook/react/pull/22064.
 *
 * The functions in this module will throw an easier-to-understand,
 * easier-to-debug exception with a clear errors message message explaining the
 * problem. (Instead of a confusing exception thrown inside the implementation
 * of the `value` object).
 */
// $FlowFixMe only called in DEV, so void return is not possible.
function typeName(value) {
  {
    // toStringTag is needed for namespaced types like Temporal.Instant
    var hasToStringTag = typeof Symbol === 'function' && Symbol.toStringTag;
    var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || 'Object';
    return type;
  }
} // $FlowFixMe only called in DEV, so void return is not possible.


function willCoercionThrow(value) {
  {
    try {
      testStringCoercion(value);
      return false;
    } catch (e) {
      return true;
    }
  }
}

function testStringCoercion(value) {
  // If you ended up here by following an exception call stack, here's what's
  // happened: you supplied an object or symbol value to React (as a prop, key,
  // DOM attribute, CSS property, string ref, etc.) and when React tried to
  // coerce it to a string using `'' + value`, an exception was thrown.
  //
  // The most common types that will cause this exception are `Symbol` instances
  // and Temporal objects like `Temporal.Instant`. But any object that has a
  // `valueOf` or `[Symbol.toPrimitive]` method that throws will also cause this
  // exception. (Library authors do this to prevent users from using built-in
  // numeric operators like `+` or comparison operators like `>=` because custom
  // methods are needed to perform accurate arithmetic or comparison.)
  //
  // To fix the problem, coerce this object or symbol value to a string before
  // passing it to React. The most reliable way is usually `String(value)`.
  //
  // To find which value is throwing, check the browser or debugger console.
  // Before this exception was thrown, there should be `console.error` output
  // that shows the type (Symbol, Temporal.PlainDate, etc.) that caused the
  // problem and how that type was used: key, atrribute, input value prop, etc.
  // In most cases, this console output also shows the component and its
  // ancestor components where the exception happened.
  //
  // eslint-disable-next-line react-internal/safe-string-coercion
  return '' + value;
}
function checkKeyStringCoercion(value) {
  {
    if (willCoercionThrow(value)) {
      error('The provided key is an unsupported type %s.' + ' This value must be coerced to a string before before using it here.', typeName(value));

      return testStringCoercion(value); // throw (to help callers find troubleshooting comments)
    }
  }
}

var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};
var specialPropKeyWarningShown;
var specialPropRefWarningShown;
var didWarnAboutStringRefs;

{
  didWarnAboutStringRefs = {};
}

function hasValidRef(config) {
  {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.ref !== undefined;
}

function hasValidKey(config) {
  {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.key !== undefined;
}

function warnIfStringRefCannotBeAutoConverted(config, self) {
  {
    if (typeof config.ref === 'string' && ReactCurrentOwner.current && self && ReactCurrentOwner.current.stateNode !== self) {
      var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);

      if (!didWarnAboutStringRefs[componentName]) {
        error('Component "%s" contains the string ref "%s". ' + 'Support for string refs will be removed in a future major release. ' + 'This case cannot be automatically converted to an arrow function. ' + 'We ask you to manually fix this case by using useRef() or createRef() instead. ' + 'Learn more about using refs safely here: ' + 'https://reactjs.org/link/strict-mode-string-ref', getComponentNameFromType(ReactCurrentOwner.current.type), config.ref);

        didWarnAboutStringRefs[componentName] = true;
      }
    }
  }
}

function defineKeyPropWarningGetter(props, displayName) {
  {
    var warnAboutAccessingKey = function () {
      if (!specialPropKeyWarningShown) {
        specialPropKeyWarningShown = true;

        error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
      }
    };

    warnAboutAccessingKey.isReactWarning = true;
    Object.defineProperty(props, 'key', {
      get: warnAboutAccessingKey,
      configurable: true
    });
  }
}

function defineRefPropWarningGetter(props, displayName) {
  {
    var warnAboutAccessingRef = function () {
      if (!specialPropRefWarningShown) {
        specialPropRefWarningShown = true;

        error('%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
      }
    };

    warnAboutAccessingRef.isReactWarning = true;
    Object.defineProperty(props, 'ref', {
      get: warnAboutAccessingRef,
      configurable: true
    });
  }
}
/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, instanceof check
 * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @internal
 */


var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,
    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,
    // Record the component responsible for creating this element.
    _owner: owner
  };

  {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.

    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    }); // self and source are DEV only properties.

    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self
    }); // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.

    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source
    });

    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};
/**
 * https://github.com/reactjs/rfcs/pull/107
 * @param {*} type
 * @param {object} props
 * @param {string} key
 */

function jsxDEV(type, config, maybeKey, source, self) {
  {
    var propName; // Reserved names are extracted

    var props = {};
    var key = null;
    var ref = null; // Currently, key can be spread in as a prop. This causes a potential
    // issue if key is also explicitly declared (ie. <div {...props} key="Hi" />
    // or <div key="Hi" {...props} /> ). We want to deprecate key spread,
    // but as an intermediary step, we will use jsxDEV for everything except
    // <div {...props} key="Hi" />, because we aren't currently able to tell if
    // key is explicitly declared to be undefined or not.

    if (maybeKey !== undefined) {
      {
        checkKeyStringCoercion(maybeKey);
      }

      key = '' + maybeKey;
    }

    if (hasValidKey(config)) {
      {
        checkKeyStringCoercion(config.key);
      }

      key = '' + config.key;
    }

    if (hasValidRef(config)) {
      ref = config.ref;
      warnIfStringRefCannotBeAutoConverted(config, self);
    } // Remaining properties are added to a new props object


    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    } // Resolve default props


    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;

      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }

    if (key || ref) {
      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }

      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }

    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
  }
}

var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;

function setCurrentlyValidatingElement$1(element) {
  {
    if (element) {
      var owner = element._owner;
      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
      ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
    } else {
      ReactDebugCurrentFrame$1.setExtraStackFrame(null);
    }
  }
}

var propTypesMisspellWarningShown;

{
  propTypesMisspellWarningShown = false;
}
/**
 * Verifies the object is a ReactElement.
 * See https://reactjs.org/docs/react-api.html#isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a ReactElement.
 * @final
 */


function isValidElement(object) {
  {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }
}

function getDeclarationErrorAddendum() {
  {
    if (ReactCurrentOwner$1.current) {
      var name = getComponentNameFromType(ReactCurrentOwner$1.current.type);

      if (name) {
        return '\n\nCheck the render method of `' + name + '`.';
      }
    }

    return '';
  }
}

function getSourceInfoErrorAddendum(source) {
  {
    if (source !== undefined) {
      var fileName = source.fileName.replace(/^.*[\\\/]/, '');
      var lineNumber = source.lineNumber;
      return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
    }

    return '';
  }
}
/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */


var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  {
    var info = getDeclarationErrorAddendum();

    if (!info) {
      var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;

      if (parentName) {
        info = "\n\nCheck the top-level render call using <" + parentName + ">.";
      }
    }

    return info;
  }
}
/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */


function validateExplicitKey(element, parentType) {
  {
    if (!element._store || element._store.validated || element.key != null) {
      return;
    }

    element._store.validated = true;
    var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

    if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
      return;
    }

    ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
    // property, it may be the creator of the child that's responsible for
    // assigning it a key.

    var childOwner = '';

    if (element && element._owner && element._owner !== ReactCurrentOwner$1.current) {
      // Give the component that originally created this child.
      childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
    }

    setCurrentlyValidatingElement$1(element);

    error('Each child in a list should have a unique "key" prop.' + '%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);

    setCurrentlyValidatingElement$1(null);
  }
}
/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */


function validateChildKeys(node, parentType) {
  {
    if (typeof node !== 'object') {
      return;
    }

    if (isArray(node)) {
      for (var i = 0; i < node.length; i++) {
        var child = node[i];

        if (isValidElement(child)) {
          validateExplicitKey(child, parentType);
        }
      }
    } else if (isValidElement(node)) {
      // This element was passed in a valid location.
      if (node._store) {
        node._store.validated = true;
      }
    } else if (node) {
      var iteratorFn = getIteratorFn(node);

      if (typeof iteratorFn === 'function') {
        // Entry iterators used to provide implicit keys,
        // but now we print a separate warning for them later.
        if (iteratorFn !== node.entries) {
          var iterator = iteratorFn.call(node);
          var step;

          while (!(step = iterator.next()).done) {
            if (isValidElement(step.value)) {
              validateExplicitKey(step.value, parentType);
            }
          }
        }
      }
    }
  }
}
/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */


function validatePropTypes(element) {
  {
    var type = element.type;

    if (type === null || type === undefined || typeof type === 'string') {
      return;
    }

    var propTypes;

    if (typeof type === 'function') {
      propTypes = type.propTypes;
    } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
    // Inner props are checked in the reconciler.
    type.$$typeof === REACT_MEMO_TYPE)) {
      propTypes = type.propTypes;
    } else {
      return;
    }

    if (propTypes) {
      // Intentionally inside to avoid triggering lazy initializers:
      var name = getComponentNameFromType(type);
      checkPropTypes(propTypes, element.props, 'prop', name, element);
    } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
      propTypesMisspellWarningShown = true; // Intentionally inside to avoid triggering lazy initializers:

      var _name = getComponentNameFromType(type);

      error('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', _name || 'Unknown');
    }

    if (typeof type.getDefaultProps === 'function' && !type.getDefaultProps.isReactClassApproved) {
      error('getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
    }
  }
}
/**
 * Given a fragment, validate that it can only be provided with fragment props
 * @param {ReactElement} fragment
 */


function validateFragmentProps(fragment) {
  {
    var keys = Object.keys(fragment.props);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (key !== 'children' && key !== 'key') {
        setCurrentlyValidatingElement$1(fragment);

        error('Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);

        setCurrentlyValidatingElement$1(null);
        break;
      }
    }

    if (fragment.ref !== null) {
      setCurrentlyValidatingElement$1(fragment);

      error('Invalid attribute `ref` supplied to `React.Fragment`.');

      setCurrentlyValidatingElement$1(null);
    }
  }
}

var didWarnAboutKeySpread = {};
function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
  {
    var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.

    if (!validType) {
      var info = '';

      if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
        info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
      }

      var sourceInfo = getSourceInfoErrorAddendum(source);

      if (sourceInfo) {
        info += sourceInfo;
      } else {
        info += getDeclarationErrorAddendum();
      }

      var typeString;

      if (type === null) {
        typeString = 'null';
      } else if (isArray(type)) {
        typeString = 'array';
      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
        typeString = "<" + (getComponentNameFromType(type.type) || 'Unknown') + " />";
        info = ' Did you accidentally export a JSX literal instead of a component?';
      } else {
        typeString = typeof type;
      }

      error('React.jsx: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
    }

    var element = jsxDEV(type, props, key, source, self); // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.

    if (element == null) {
      return element;
    } // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)


    if (validType) {
      var children = props.children;

      if (children !== undefined) {
        if (isStaticChildren) {
          if (isArray(children)) {
            for (var i = 0; i < children.length; i++) {
              validateChildKeys(children[i], type);
            }

            if (Object.freeze) {
              Object.freeze(children);
            }
          } else {
            error('React.jsx: Static children should always be an array. ' + 'You are likely explicitly calling React.jsxs or React.jsxDEV. ' + 'Use the Babel transform instead.');
          }
        } else {
          validateChildKeys(children, type);
        }
      }
    }

    {
      if (hasOwnProperty.call(props, 'key')) {
        var componentName = getComponentNameFromType(type);
        var keys = Object.keys(props).filter(function (k) {
          return k !== 'key';
        });
        var beforeExample = keys.length > 0 ? '{key: someKey, ' + keys.join(': ..., ') + ': ...}' : '{key: someKey}';

        if (!didWarnAboutKeySpread[componentName + beforeExample]) {
          var afterExample = keys.length > 0 ? '{' + keys.join(': ..., ') + ': ...}' : '{}';

          error('A props object containing a "key" prop is being spread into JSX:\n' + '  let props = %s;\n' + '  <%s {...props} />\n' + 'React keys must be passed directly to JSX without using spread:\n' + '  let props = %s;\n' + '  <%s key={someKey} {...props} />', beforeExample, componentName, afterExample, componentName);

          didWarnAboutKeySpread[componentName + beforeExample] = true;
        }
      }
    }

    if (type === REACT_FRAGMENT_TYPE) {
      validateFragmentProps(element);
    } else {
      validatePropTypes(element);
    }

    return element;
  }
} // These two functions exist to still get child warnings in dev
// even with the prod transform. This means that jsxDEV is purely
// opt-in behavior for better messages but that we won't stop
// giving you warnings if you use production apis.

function jsxWithValidationStatic(type, props, key) {
  {
    return jsxWithValidation(type, props, key, true);
  }
}
function jsxWithValidationDynamic(type, props, key) {
  {
    return jsxWithValidation(type, props, key, false);
  }
}

var jsx =  jsxWithValidationDynamic ; // we may want to special case jsxs internally to take advantage of static children.
// for now we can ship identical prod functions

var jsxs =  jsxWithValidationStatic ;

exports.Fragment = REACT_FRAGMENT_TYPE;
exports.jsx = jsx;
exports.jsxs = jsxs;
  })();
}


/***/ }),

/***/ "./node_modules/react/jsx-runtime.js":
/*!*******************************************!*\
  !*** ./node_modules/react/jsx-runtime.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-jsx-runtime.development.js */ "./node_modules/react/cjs/react-jsx-runtime.development.js");
}


/***/ }),

/***/ "./src/assets/images/no_image_available.png":
/*!**************************************************!*\
  !*** ./src/assets/images/no_image_available.png ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "images/no_image_available.34ed1422.png";

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = window["ReactDOM"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (arg) {
				classes = appendClass(classes, parseValue(arg));
			}
		}

		return classes;
	}

	function parseValue (arg) {
		if (typeof arg === 'string' || typeof arg === 'number') {
			return arg;
		}

		if (typeof arg !== 'object') {
			return '';
		}

		if (Array.isArray(arg)) {
			return classNames.apply(null, arg);
		}

		if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
			return arg.toString();
		}

		var classes = '';

		for (var key in arg) {
			if (hasOwn.call(arg, key) && arg[key]) {
				classes = appendClass(classes, key);
			}
		}

		return classes;
	}

	function appendClass (value, newClass) {
		if (!newClass) {
			return value;
		}
	
		if (value) {
			return value + ' ' + newClass;
		}
	
		return value + newClass;
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "./src/data.json":
/*!***********************!*\
  !*** ./src/data.json ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"name":"Store Banner","version":"1.0.0"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var bootstrap_dist_css_bootstrap_min_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bootstrap/dist/css/bootstrap.min.css */ "./node_modules/bootstrap/dist/css/bootstrap.min.css");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./App */ "./src/App.js");

const {
  render
} = wp.element;
// import ReactDOM from 'react-dom';




/*
if (document.getElementById('store-banner-settings')) {
  render(<App/>, document.getElementById('store-banner-settings'));
}
*/

/*ReactDOM.render(<App />, document.getElementById('store-banner-settings'));*/
if (document.getElementById('store-banner-settings')) {
  const container = document.getElementById('store-banner-settings');
  const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_3__.createRoot)(container);
  root.render((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_App__WEBPACK_IMPORTED_MODULE_4__["default"], null));
}
})();

/******/ })()
;
//# sourceMappingURL=index.js.map