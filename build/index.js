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
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _Organisms_Header__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Organisms/Header */ "./src/Organisms/Header.js");
/* harmony import */ var _Pages_Elements__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Pages/Elements */ "./src/Pages/Elements.js");
/* harmony import */ var _Pages_Home__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Pages/Home */ "./src/Pages/Home.js");
/* harmony import */ var _Pages_NotFound__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Pages/NotFound */ "./src/Pages/NotFound.js");
/* harmony import */ var _Pages_Settings__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Pages/Settings */ "./src/Pages/Settings.js");

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
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_7__.BrowserRouter, {
    basename: "/wp-admin/admin.php"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Organisms_Header__WEBPACK_IMPORTED_MODULE_2__["default"], null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(LoadSettingsPages, null));
}

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  const {
    search
  } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_8__.useLocation)();
  return react__WEBPACK_IMPORTED_MODULE_1___default().useMemo(() => new URLSearchParams(search), [search]);
}
function LoadSettingsPages() {
  let query = useQuery();
  if (query.get("path")) {
    if (query.get("path") === 'settings') {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Pages_Settings__WEBPACK_IMPORTED_MODULE_6__["default"], null);
    } else if (query.get("path") === 'elements') {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Pages_Elements__WEBPACK_IMPORTED_MODULE_3__["default"], null);
    } else {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Pages_NotFound__WEBPACK_IMPORTED_MODULE_5__["default"], null);
    }
  } else {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Pages_Home__WEBPACK_IMPORTED_MODULE_4__["default"], null);
  }
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_7__.NavLink, {
    to: "?page=store-banner",
    className: ({
      isActive,
      isPending,
      isTransitioning
    }) => [isPending ? "pending" : "", isActive ? "current" : "", isTransitioning ? "transitioning" : ""].join(" ")
  }, "Dashboard")), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_7__.NavLink, {
    to: "?page=store-banner&path=settings",
    className: ({
      isActive,
      isPending,
      isTransitioning
    }) => [isPending ? "pending" : "", isActive ? "current" : "", isTransitioning ? "transitioning" : ""].join(" ")
  }, "Setting")), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_7__.NavLink, {
    to: "?page=store-banner&path=elements",
    className: ({
      isActive,
      isPending,
      isTransitioning
    }) => [isPending ? "pending" : "", isActive ? "current" : "", isTransitioning ? "transitioning" : ""].join(" ")
  }, "Elements"))));
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
    className: "list-inline-item",
    onClick: e => {
      fn(e, 'welcome');
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_router_dom__WEBPACK_IMPORTED_MODULE_11__.NavLink, {
    to: "?page=store-banner",
    className: ({
      isActive
    }) => ['welcome-link', isActive && query.get("path") === null ? 'active' : ''].join(" ")
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Welcome', 'store-banner'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    className: "list-inline-item",
    onClick: e => {
      fn(e, 'settings');
    }
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
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Container.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Row.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Col.js");
/* harmony import */ var _data_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../data.json */ "./src/data.json");





const useEffect = wp.element.useState;
const useState = wp.element.useState;
const nonce = document.getElementById('nonce-field');
function Home() {
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  useEffect(() => {
    /**
     * Initialize the options fields with the data received from the REST API
     * endpoint provided by the plugin.
     */
    wp.apiFetch({
      path: '/react-settings-page/v1/options'
    }).then(data => {
      let options = {};

      //Set the new values of the options in the state
      setOption1(data['plugin_option_1']);
      setOption2(data['plugin_option_2']);
    });
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("section", {
    className: "settings-page-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_4__["default"], {
    fluid: "fluid"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "content-part"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_5__["default"], null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__["default"], {
    className: "col-lg-8 left-content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "card-box"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "card-header"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "img-box d-flex gap-4"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "part-img"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    width: "60",
    height: "60",
    viewBox: "0 0 60 60",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
    cx: "30",
    cy: "30",
    r: "30",
    fill: "#0167FF",
    fillOpacity: "0.2"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M44.5921 30.7122C44.5918 31.0298 44.4974 31.3403 44.3208 31.6043C44.1442 31.8683 43.8933 32.0741 43.5998 32.1956C43.3063 32.3172 42.9834 32.349 42.6718 32.2871C42.3602 32.2252 42.074 32.0723 41.8492 31.8479L39.2821 29.2807L33.4878 35.4093C33.2015 35.7048 32.8596 35.9408 32.4818 36.1037C32.104 36.2667 31.6977 36.3533 31.2863 36.3587C30.8748 36.3641 30.4664 36.2881 30.0845 36.1351C29.7025 35.9821 29.3546 35.7551 29.0607 35.4672V35.4693L29.0457 35.4543L25.3749 31.7857L19.0664 38.0964C18.6643 38.4985 18.1189 38.7244 17.5503 38.7244C16.9817 38.7244 16.4363 38.4985 16.0342 38.0964C15.6321 37.6944 15.4062 37.149 15.4062 36.5804C15.4062 36.0117 15.6321 35.4664 16.0342 35.0643L23.1764 27.9243L23.1914 27.9093C23.7749 27.3378 24.5592 27.0177 25.376 27.0177C26.1928 27.0177 26.9771 27.3378 27.5607 27.9093L27.5757 27.9243L31.2207 31.5693L36.2499 26.2507L34.0214 24.0222C33.7969 23.7974 33.6441 23.5112 33.5822 23.1996C33.5203 22.888 33.5521 22.5651 33.6736 22.2716C33.7951 21.9781 34.0009 21.7272 34.2649 21.5506C34.529 21.374 34.8394 21.2796 35.1571 21.2793H42.9828C43.409 21.2793 43.8178 21.4486 44.1192 21.75C44.4206 22.0514 44.5899 22.4602 44.5899 22.8864V30.7122H44.5921Z",
    fill: "#0167FF"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "part-content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Welcome to', 'store-banner'), " ", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null, _data_json__WEBPACK_IMPORTED_MODULE_3__.name)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('We designed Store Banner to be intuitive but we do recommend learning how it works by Checking our comprehensive documentation and watching the video below. Enjoy your time with Spectra!', 'store-banner'))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "card-body"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "text-center"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    width: "710",
    height: "450",
    viewBox: "0 0 710 450",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M423.359 119.113C423.522 120.178 424.066 121.149 424.89 121.847C423.725 123.01 422.857 124.434 422.357 125.999C421.858 127.564 421.742 129.225 422.02 130.844C411.453 140.145 402.577 151.299 398.442 164.581C398.024 165.922 399.671 166.597 400.579 165.859C402.432 164.3 404.612 163.175 406.959 162.564C409.307 161.954 411.762 161.874 414.144 162.332C418.235 163.202 421.784 165.419 425.75 166.588C431.961 168.224 438.567 167.419 444.198 164.339C444.417 164.339 443.76 163.904 456.231 174.733C458.482 171.449 461.737 168.976 465.514 167.681C465.514 167.681 456.231 161.178 451.527 157.955C455.312 152.205 455.003 144.574 445.725 136.618C439.866 131.595 433.642 128.268 440.104 120.328C441.089 119.117 439.494 117.471 438.455 118.444C438.35 118.435 438.244 118.455 438.151 118.503C433.297 121.726 428.627 125.215 424.162 128.954C424.075 126.686 424.717 124.45 425.995 122.57C426.697 122.732 427.429 122.711 428.12 122.509C428.812 122.308 429.439 121.932 429.942 121.419C430.446 120.906 430.808 120.273 430.993 119.58C431.179 118.887 431.182 118.159 431.003 117.464C430.001 113.149 422.604 114.185 423.359 119.113ZM449.136 143.853C450.183 145.373 450.857 147.117 451.101 148.944C451.345 150.771 451.153 152.63 450.54 154.369C448.676 152.775 446.718 151.293 444.677 149.932C442.664 148.429 440.468 147.185 438.142 146.231C437.405 145.937 437.111 147.008 437.652 147.385C441.693 150.215 445.042 154.315 449.258 156.869C447.965 158.748 446.276 160.323 444.309 161.487C437.168 165.87 429.408 165.678 421.832 162.46C418.216 160.619 414.227 159.622 410.166 159.542C412.026 154.192 415.195 149.388 419.388 145.562C419.878 145.074 419.213 144.112 418.594 144.589C413.765 148.312 408.455 153.516 407.6 159.847C405.631 160.213 403.733 160.89 401.979 161.853C408.088 144.953 422.381 132.065 436.431 121.246C430.108 132.25 444.172 136.095 449.136 143.853Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M421.22 106.648C421.298 106.821 421.426 106.966 421.588 107.066C421.749 107.166 421.937 107.216 422.127 107.209C422.317 107.203 422.5 107.14 422.655 107.029C422.809 106.919 422.926 106.765 422.992 106.587C424.315 100.748 424.788 94.7502 424.397 88.7772C424.353 86.2232 423.664 80.8759 419.693 81.8469C416.212 82.6982 416.737 88.4745 416.945 91.0263C417.62 96.4087 419.06 101.668 421.22 106.648Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M400.629 109.265C404.656 111.701 409.12 111.816 413.701 112.06H413.762C414.051 112.086 414.341 112.013 414.583 111.855C414.826 111.696 415.008 111.461 415.1 111.187C415.192 110.913 415.188 110.616 415.089 110.344C414.991 110.072 414.803 109.841 414.556 109.689C412.003 108.083 409.664 106.163 407.592 103.976C406.315 102.451 404.859 101.084 403.256 99.9022C400.917 98.5327 397.397 98.5676 396.354 101.483C395.198 104.707 398.124 107.747 400.629 109.265Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M403.317 130.965C405.958 127.588 409.747 120.862 413.516 119.292C414.731 118.79 414.311 116.863 412.967 117.287C408.981 118.447 405.307 120.483 402.216 123.244C400.282 125.088 397.432 128.47 398.497 131.389C399.51 134.194 402.085 132.539 403.317 130.965Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M446.436 293.089C446.318 292.001 446.436 291.254 445.458 290.779C443.886 290.471 442.272 290.45 440.693 290.718C429.452 290.84 418.215 291.326 406.976 291.75C404.817 288.885 365.556 239.746 357.194 231.268C358.063 230.349 358.537 229.129 358.514 227.868C358.491 226.607 357.974 225.405 357.072 224.518C354.04 221.638 347.008 221.239 345.772 226.28C345.531 227.308 345.574 228.382 345.897 229.388C346.219 230.394 346.809 231.295 347.603 231.995C336.73 243.598 322.29 261.824 306.435 281.902C302.645 286.692 298.493 291.384 295.194 296.49C288.597 296.795 282.001 297.178 275.405 297.579C273.192 297.557 270.983 297.747 268.806 298.145C266.975 298.63 266.87 300.457 266.669 302.158C264.636 319.358 267.297 395.482 270.64 424.521C270.644 424.77 270.73 425.011 270.884 425.207C271.039 425.404 271.253 425.545 271.495 425.609C286.77 428.316 302.335 429.032 317.796 427.736C318.833 427.667 318.89 426.047 317.796 426.095C302.762 426.821 287.692 425.965 272.839 423.543C268.616 381.367 267.15 308.733 269.296 300.324C270.425 300.324 271.215 300.152 272.228 300.08C275.527 299.85 443.808 292.909 444.237 292.909C443.76 294.801 450.582 342.638 449.925 417.159C416.69 421.684 395.23 420.691 374.855 423.543C373.999 423.663 374.183 425.067 375.038 425.067C400.448 423.606 425.988 422.633 451.207 419.108C451.432 419.041 451.629 418.905 451.772 418.72C451.915 418.534 451.995 418.309 452.002 418.076C452.274 376.347 450.417 334.631 446.436 293.089ZM297.395 296.37C300.954 292.295 332.155 250.933 348.397 232.665C349.574 233.396 350.948 233.753 352.334 233.688C353.72 233.622 355.053 233.138 356.155 232.3C356.155 232.3 402.395 289.016 404.959 291.872C393.781 292.299 322.071 295.155 297.395 296.37Z",
    fill: "#282828"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M521.755 210.72C521.215 209.015 515.647 205.187 512.409 203.06C510.998 202.143 509.302 201.761 507.632 201.984C505.961 202.208 504.427 203.022 503.31 204.277L502.148 205.614C501.791 206.005 501.594 206.514 501.594 207.042C501.594 207.571 501.791 208.08 502.148 208.471C504.117 210.692 512.295 219.899 515.275 219.899C518.769 219.899 522.541 213.193 521.755 210.72Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M433.74 141.786C433.54 141.738 433.332 141.729 433.128 141.761C432.924 141.793 432.729 141.864 432.553 141.972C432.377 142.079 432.224 142.22 432.103 142.386C431.982 142.552 431.895 142.741 431.848 142.94C431.802 143.12 431.793 143.307 431.82 143.491C431.848 143.674 431.912 143.85 432.008 144.009C432.105 144.167 432.233 144.305 432.384 144.414C432.534 144.523 432.706 144.601 432.887 144.643C433.076 144.699 433.273 144.717 433.469 144.697C433.664 144.676 433.854 144.618 434.027 144.525C434.2 144.432 434.353 144.305 434.476 144.154C434.6 144.002 434.693 143.827 434.749 143.639C434.805 143.452 434.823 143.255 434.803 143.06C434.783 142.866 434.724 142.677 434.63 142.505C434.537 142.333 434.41 142.181 434.257 142.058C434.104 141.934 433.929 141.842 433.74 141.786Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M276.7 306.58C279.002 306.437 281.312 306.498 283.603 306.763C284.762 306.778 284.696 305.073 283.603 304.999C276.33 304.511 274.941 304.035 273.891 304.694C272.841 305.354 272.852 306.58 272.797 307.673C272.797 309.254 273.038 326.517 273.164 333.508C273.486 351.432 274.32 399.362 277.989 417.458C278.161 418.309 279.406 417.941 279.273 417.092C276.044 396.625 274.762 308.08 274.873 307.673C275.201 306.465 275.545 306.789 276.7 306.58Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M436.967 412.232C433.477 412.515 409.298 414.67 400.684 415.391C394.821 415.883 388.896 416.915 383.031 416.972C382.883 416.981 382.744 417.045 382.642 417.153C382.541 417.26 382.484 417.402 382.484 417.55C382.484 417.697 382.541 417.839 382.642 417.946C382.744 418.054 382.883 418.119 383.031 418.128C396.475 418.156 416.163 416.386 436.783 414.426C438.894 414.358 440.997 414.134 443.075 413.758C445.401 413.164 444.953 411.082 444.97 409.138C445.001 405.489 445.213 383.058 445.213 375.46C445.213 375.194 445.107 374.939 444.918 374.751C444.729 374.563 444.473 374.457 444.205 374.457C443.938 374.457 443.682 374.563 443.493 374.751C443.304 374.939 443.198 375.194 443.198 375.46C443.198 381.478 442.861 401.72 442.83 405.854C442.83 406.889 443.38 410.96 442.649 411.629C441.857 412.351 438.008 412.147 436.967 412.232Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M504.843 281.595C488.627 299.135 472.437 316.723 456.274 334.359C455.777 334.899 456.578 335.696 457.068 335.15C474.109 318.432 490.596 300.992 505.994 282.749C506.672 281.959 505.574 280.805 504.843 281.595Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M486.941 321.96C480.883 326.885 475.886 333.083 470.327 338.494C469.771 339.036 470.58 339.844 471.182 339.345C477.134 334.266 482.765 328.826 488.041 323.055C488.167 322.906 488.232 322.716 488.224 322.521C488.216 322.327 488.134 322.143 487.996 322.005C487.858 321.867 487.673 321.786 487.477 321.778C487.282 321.77 487.091 321.835 486.941 321.96Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M232.165 309.62C232.666 309.021 231.979 307.913 231.249 308.464C221.495 315.827 212.906 325.1 204.067 333.448C194.878 342.12 185.689 350.788 176.763 359.708C176.707 359.759 176.661 359.821 176.629 359.89C176.598 359.959 176.58 360.033 176.578 360.109C176.576 360.185 176.59 360.26 176.618 360.331C176.647 360.401 176.689 360.465 176.743 360.519C176.797 360.572 176.861 360.614 176.932 360.643C177.002 360.671 177.078 360.684 177.154 360.682C177.231 360.68 177.306 360.663 177.375 360.632C177.444 360.6 177.506 360.555 177.557 360.498C188.188 351.136 207.953 332.727 218.299 323.049C223.185 318.851 227.815 314.366 232.165 309.62Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M248.533 308.524C237.704 318.975 226.699 329.282 215.915 339.831C215.237 340.484 216.221 341.411 216.954 340.863C228.346 330.975 239.174 320.463 249.389 309.375C249.815 308.768 249.091 307.986 248.533 308.524Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M238.1 205.491C241.938 204.637 245.515 202.886 248.538 200.383C248.728 200.265 248.89 200.107 249.011 199.92C249.132 199.733 249.21 199.521 249.239 199.3C249.269 199.079 249.248 198.855 249.18 198.643C249.112 198.43 248.997 198.236 248.844 198.073C244.94 193.546 240.801 189.224 236.444 185.125C235.702 184.472 234.361 185.312 234.978 186.213C238.21 190.623 241.717 194.825 245.48 198.796C242.793 200.499 239.929 201.907 237.234 203.586C236.262 204.217 237.006 205.678 238.1 205.491Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M221.831 193.089C223.282 191.794 222.203 189.621 221.282 188.41C220.311 187.13 219.329 185.551 217.563 185.432C215.316 185.432 215.972 189.662 217.44 191.569C218.397 192.806 220.226 194.528 221.831 193.089Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M239.433 174.73C235.683 174.73 240.03 185.68 243.648 182.451C245.097 181.156 243.985 179.004 243.097 177.77C242.152 176.453 241.143 174.907 239.433 174.73Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M218.361 179.352C218.476 179.317 218.58 179.254 218.663 179.167C218.747 179.081 218.807 178.975 218.837 178.859C218.868 178.743 218.869 178.622 218.839 178.506C218.809 178.39 218.75 178.283 218.667 178.196C217.503 177.492 216.163 177.13 214.801 177.151C213.439 177.173 212.111 177.577 210.97 178.318C209.985 179.122 209.205 180.147 208.695 181.31C208.185 182.472 207.96 183.739 208.039 185.005C208.046 185.151 208.099 185.291 208.19 185.406C208.282 185.52 208.407 185.604 208.548 185.644C208.69 185.685 208.84 185.68 208.979 185.631C209.117 185.582 209.237 185.491 209.321 185.37C210.237 183.729 210.498 181.743 212.007 180.506C213.985 178.891 216.16 179.64 218.361 179.352Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M231.553 215.338C232.595 220.308 236.502 228.972 242.792 228.401C250.012 227.748 248.358 217.761 247.923 212.899C247.916 212.746 247.875 212.597 247.804 212.461C247.732 212.326 247.632 212.208 247.51 212.115C247.388 212.022 247.246 211.957 247.096 211.925C246.946 211.892 246.791 211.892 246.641 211.926C241.773 212.496 236.941 213.328 232.164 214.419C232.059 214.431 231.958 214.465 231.868 214.52C231.778 214.575 231.701 214.649 231.643 214.737C231.585 214.824 231.547 214.923 231.531 215.027C231.516 215.131 231.523 215.237 231.553 215.338ZM246.028 214.123C246.518 218.438 247.435 226.461 242.241 226.522C237.172 226.583 234.728 219.836 233.271 215.701C237.57 215.658 241.85 215.129 246.028 214.123Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M458.722 201.906C459.457 200.264 459.643 199.899 458.845 198.379C457.258 195.511 456.504 192.26 456.666 188.99C456.828 185.719 457.901 182.558 459.764 179.86C461.627 177.161 464.207 175.031 467.216 173.707C470.225 172.383 473.545 171.918 476.805 172.363C477.783 172.472 477.964 170.839 477.047 170.66C473.477 169.972 469.784 170.293 466.388 171.588C462.991 172.883 460.028 175.099 457.833 177.986C455.639 180.872 454.302 184.313 453.973 187.918C453.644 191.522 454.338 195.147 455.974 198.379C456.869 200.121 456.519 200.687 455.668 202.516C447.925 219.152 427.966 239.325 402.099 268.052C401.552 268.661 402.395 269.5 402.955 268.903C418.247 252.624 449.724 222.02 458.722 201.906Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M474.418 190.173C474.537 191.025 475.893 190.781 475.884 189.993C475.809 187.52 476.272 185.061 477.242 182.784C478.211 180.507 479.665 178.466 481.503 176.8C485.764 173.136 490.91 172.903 496.224 173.336C496.396 173.332 496.562 173.272 496.696 173.166C496.83 173.059 496.925 172.911 496.966 172.746C497.008 172.58 496.993 172.405 496.925 172.248C496.857 172.092 496.739 171.961 496.59 171.878C486.972 167.199 472.432 176.045 474.418 190.173Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M486.875 183.122C484.767 184.941 483.223 187.32 482.423 189.98C481.622 192.64 481.599 195.472 482.355 198.145C482.552 198.798 483.705 198.752 483.637 197.962C483.303 195.597 483.532 193.188 484.307 190.928C485.082 188.667 486.381 186.621 488.098 184.953C492.419 181.106 497.068 181.863 502.319 182.34C503.111 182.412 503.179 181.36 502.684 181.003C498.162 177.707 490.837 179.767 486.875 183.122Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M509.539 191.388C510.213 191.443 510.395 190.476 509.845 190.171C503.188 185.734 493.874 191.582 491.52 198.136C491.28 198.804 492.319 199.17 492.614 198.621C494.307 195.522 497.058 193.128 500.37 191.872C503.35 191.023 506.485 190.858 509.539 191.388Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M514.726 198.685C514.079 197.491 513.069 196.53 511.84 195.94C510.612 195.351 509.227 195.162 507.885 195.402C504.863 196.196 502.275 198.139 500.678 200.813C500.256 201.363 501.177 202.102 501.656 201.603C504.282 198.866 509.994 195.089 512.772 199.9C513.481 201.13 515.374 199.974 514.726 198.685Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M494.578 214.548C484.365 233.377 487.155 229.354 473.689 248.468C461.327 266.019 451.657 274.042 444.919 282.751C444.306 283.542 445.593 284.336 446.262 283.786C452.024 278.695 457.337 273.123 462.143 267.129C475.826 251.517 487.087 233.958 495.556 215.034C495.613 214.906 495.619 214.76 495.571 214.628C495.524 214.496 495.427 214.387 495.301 214.325C495.174 214.262 495.029 214.25 494.894 214.292C494.76 214.334 494.646 214.425 494.578 214.548Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M230.818 394.359C230.882 394.319 230.938 394.267 230.982 394.206C231.026 394.145 231.057 394.075 231.074 394.002C231.091 393.929 231.093 393.853 231.081 393.779C231.068 393.704 231.041 393.633 231.001 393.57C230.961 393.506 230.909 393.451 230.847 393.407C230.786 393.363 230.716 393.332 230.642 393.315C230.569 393.298 230.492 393.296 230.418 393.309C230.343 393.321 230.272 393.348 230.208 393.388C211.666 404.84 192.475 415.448 171.264 420.863C167.729 421.454 164.239 422.287 160.819 423.356C158.071 417.277 154.958 411.501 152.696 405.18C145.887 386.725 144.344 366.756 148.237 347.482C153.098 325.777 166.855 306.743 183.787 292.652C195.003 283.72 207.665 276.753 221.229 272.046C222.023 274.173 222.793 276.309 223.55 278.489C224.143 280.198 226.845 279.462 226.239 277.759C220.369 261.293 210.406 237.536 201.683 224.198C202.537 223.644 203.248 222.899 203.759 222.021C204.311 221.109 202.943 219.935 202.171 220.806C197.896 225.624 191.424 223.053 188.856 218.008C186.782 213.935 188.786 203.987 195.148 206.824C195.204 206.856 195.266 206.876 195.33 206.884C195.394 206.892 195.46 206.888 195.522 206.871C195.584 206.854 195.643 206.825 195.694 206.785C195.745 206.746 195.788 206.697 195.82 206.641C195.852 206.585 195.872 206.523 195.881 206.459C195.889 206.396 195.884 206.331 195.867 206.269C195.85 206.207 195.821 206.148 195.781 206.098C195.741 206.047 195.692 206.004 195.636 205.972C190.352 202.626 184.817 209.423 185.924 216.186C185.863 216.125 185.863 216.064 185.802 216.064C183.043 224.303 181.721 232.3 174.928 238.98C161.294 252.392 136.44 260.08 123.733 276.122C111.508 299.854 101.964 329.539 108.035 355.634C111.217 369.309 117.318 376.118 117.38 376.179C117.412 376.211 117.45 376.236 117.492 376.254C117.534 376.271 117.579 376.28 117.625 376.28C117.67 376.28 117.715 376.271 117.757 376.254C117.799 376.236 117.838 376.211 117.87 376.179C124.892 369.321 134.043 365.036 143.828 364.021C143.451 377.535 145.542 391.006 149.998 403.778C152.358 411.257 155.706 418.392 159.955 424.993C160.054 425.152 160.212 425.266 160.395 425.311C160.577 425.356 160.77 425.329 160.933 425.235C164.677 425.021 168.375 424.305 171.926 423.108C197.216 416.805 216.311 403.247 230.818 394.359Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M174.322 236.188C183.8 225.955 180.17 211.502 191.547 202.44C193.008 201.277 194.61 200.191 196.128 199.157C204.558 188.27 205.659 171.135 205.84 166.21C207.356 165.457 209.936 164.599 220.562 159.524C226.212 162.399 232.481 163.859 238.826 163.778C246.52 163.576 250.64 159.615 255.806 154.416C256.353 153.865 257.138 154.592 256.845 155.206C255.027 158.832 252.122 161.805 248.531 163.715C248.438 163.739 248.351 163.784 248.277 163.845C248.203 163.907 248.143 163.984 248.102 164.071C248.061 164.158 248.041 164.253 248.041 164.35C248.041 164.446 248.063 164.54 248.104 164.627C260.024 191.068 267.119 197.818 266.427 208.761C265.388 225.234 248.269 240.386 231.733 238.06C230.939 237.947 230.757 239.273 231.551 239.458C235.018 240.147 238.589 240.136 242.051 239.426C245.514 238.715 248.798 237.319 251.708 235.321C252.264 239.042 256.819 248.28 259.584 250.762C261.97 252.446 264.847 253.301 267.771 253.194C268.563 253.258 269.359 253.314 270.092 253.314C268.291 270.406 252.406 282.466 233.505 279.418C233.429 279.398 233.35 279.393 233.272 279.403C233.194 279.414 233.118 279.439 233.05 279.479C232.982 279.518 232.923 279.571 232.875 279.633C232.827 279.695 232.792 279.766 232.772 279.842C232.752 279.918 232.747 279.997 232.758 280.075C232.768 280.152 232.794 280.227 232.834 280.295C232.873 280.363 232.926 280.422 232.989 280.469C233.051 280.517 233.123 280.552 233.199 280.572C238.247 281.89 243.542 281.958 248.622 280.77C253.702 279.582 258.413 277.174 262.343 273.757C268.274 268.444 272.053 261.161 272.971 253.273C281.097 253.273 291.233 251.259 301.802 252.907C308.226 253.858 314.574 255.259 320.799 257.101C321.593 257.344 322.138 256.082 321.348 255.764C312.138 251.868 302.276 249.727 292.272 249.45C293.464 221.1 286.311 193.021 271.689 168.662C265.531 158.177 258.059 148.512 249.454 139.9C251.235 130.81 252.517 114.058 245.238 107.676C239.134 102.325 231.256 107.317 225.937 111.323C220.749 115.397 216.43 120.46 213.233 126.216C203.948 121.535 192.831 123.168 183.546 127.857C183.436 126.991 183.069 126.176 182.493 125.517C181.916 124.858 181.156 124.384 180.308 124.156C179.174 123.855 177.985 123.813 176.832 124.034C175.679 124.255 174.592 124.733 173.651 125.432C170.96 127.494 168.947 133.76 172.856 135.524C163.571 144.581 157.645 158.927 160.517 171.814C160.552 171.926 160.626 172.021 160.724 172.084C160.823 172.147 160.941 172.174 161.057 172.159C161.173 172.145 161.281 172.09 161.361 172.005C161.441 171.919 161.488 171.809 161.495 171.693C160.46 161.819 162.946 151.898 168.518 143.664C174.09 135.43 182.393 129.407 191.976 126.649C198.734 124.985 205.837 125.364 212.377 127.738C211.154 129.865 210.008 132.062 208.894 134.243C203.825 144.183 199.001 154.666 199.121 165.973C181.695 173.467 176.821 174.364 160.029 179.59C159.929 179.618 159.835 179.666 159.753 179.731C159.671 179.796 159.603 179.876 159.552 179.967C159.501 180.058 159.469 180.158 159.457 180.261C159.445 180.364 159.454 180.469 159.482 180.569C159.511 180.669 159.559 180.763 159.624 180.844C159.689 180.926 159.77 180.994 159.861 181.044C159.953 181.095 160.053 181.127 160.157 181.139C160.261 181.151 160.366 181.142 160.467 181.114C162.18 180.896 163.889 180.506 165.538 180.203C161.6 234.302 146.148 236.264 126.984 270.29C140.617 256.441 161.259 250.288 174.322 236.188ZM173.712 134.794C171.391 132.728 172.428 128.957 174.629 127.257C177.07 125.369 181.164 125.493 181.592 129.079C178.72 130.624 176.07 132.547 173.712 134.794ZM208.345 140.325C212.086 132.613 215.917 124.398 221.844 118.077C236.028 102.956 247.927 103.833 248.415 124.461C248.531 129.704 248.06 134.944 247.011 140.083L242.245 144.825C230.945 152.241 218.47 157.49 206.157 162.999C204.263 163.846 202.37 164.701 200.416 165.492C201.657 156.727 204.335 148.225 208.345 140.325Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M242.974 168.227C241.925 167.682 240.769 167.373 239.587 167.32C238.405 167.268 237.226 167.474 236.133 167.925C235.208 168.38 234.405 169.048 233.789 169.872C233.173 170.696 232.763 171.654 232.59 172.667C232.402 173.455 233.586 174.014 233.995 173.274C234.892 171.654 235.59 170.069 237.478 169.505C239.186 169.228 240.934 169.31 242.608 169.747C242.778 169.726 242.937 169.654 243.065 169.541C243.192 169.428 243.282 169.279 243.321 169.113C243.361 168.948 243.349 168.774 243.287 168.616C243.225 168.458 243.116 168.322 242.974 168.227Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M375.716 276.188C370.56 274.564 364.959 273.664 359.651 272.541C354.343 271.417 348.961 270.231 343.588 269.197C343.76 267.276 343.78 265.346 343.647 263.422C343.642 263.252 343.595 263.085 343.51 262.936C343.425 262.788 343.304 262.663 343.159 262.571C339.234 260.504 334.892 259.341 330.455 259.168C329.538 259.155 329.597 260.453 330.455 260.566C333.527 260.884 336.534 261.663 339.372 262.876C340.114 263.222 341.144 263.483 341.51 264.274C343.339 267.459 339.838 277.912 337.661 282.563C337.582 282.723 337.567 282.907 337.618 283.078C337.668 283.249 337.782 283.395 337.936 283.487C338.09 283.579 338.273 283.61 338.448 283.574C338.624 283.538 338.78 283.437 338.884 283.292C341.217 279.621 342.737 275.497 343.343 271.195C348.78 272.41 354.282 273.39 359.712 274.476C364.926 275.733 370.208 276.688 375.533 277.335C376.263 277.403 376.322 276.371 375.716 276.188Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M431.961 341.881L286.926 345.946C286.668 345.975 286.417 346.056 286.19 346.185C285.963 346.313 285.764 346.486 285.605 346.694C285.445 346.902 285.328 347.14 285.261 347.394C285.194 347.648 285.178 347.913 285.214 348.174L287.859 407.404C287.92 407.864 288.148 408.286 288.5 408.585C288.851 408.885 289.301 409.041 289.76 409.023L433.787 404.986C434.277 404.967 434.739 404.754 435.075 404.394C435.411 404.034 435.595 403.556 435.586 403.061L433.903 343.599C433.904 343.352 433.852 343.108 433.751 342.882C433.65 342.657 433.503 342.457 433.319 342.294C433.135 342.131 432.918 342.01 432.684 341.939C432.45 341.868 432.204 341.848 431.961 341.881ZM339.384 397.341L303.286 398.353C302.764 398.363 302.259 398.168 301.875 397.81C301.491 397.452 301.259 396.959 301.226 396.432C300.881 389.922 299.81 369.204 299.226 357.074C299.212 356.803 299.251 356.532 299.342 356.277C299.433 356.022 299.574 355.788 299.757 355.589C299.939 355.39 300.159 355.231 300.404 355.119C300.648 355.008 300.913 354.948 301.181 354.941L337.439 353.925C337.968 353.907 338.482 354.101 338.87 354.464C339.258 354.827 339.489 355.33 339.512 355.864C339.886 366.248 341.039 387.083 341.348 395.186C341.36 395.458 341.318 395.73 341.225 395.985C341.133 396.241 340.991 396.476 340.809 396.676C340.626 396.876 340.407 397.038 340.162 397.152C339.918 397.266 339.653 397.33 339.384 397.341ZM350.61 366.558C351.707 365.781 353.049 365.881 353.476 366.723C353.665 367.271 353.656 367.87 353.451 368.412C353.246 368.955 352.859 369.407 352.357 369.689C351.249 370.452 349.917 370.366 349.488 369.525C348.935 368.685 349.493 367.349 350.61 366.558ZM349.821 379.991C349.627 379.432 349.643 378.821 349.865 378.274C350.087 377.727 350.501 377.281 351.026 377.021C352.208 376.254 353.588 376.341 354.055 377.182C354.245 377.74 354.227 378.35 354.005 378.896C353.782 379.442 353.371 379.887 352.847 380.149C351.701 380.956 350.313 380.881 349.821 379.991ZM353.682 389.664C352.501 390.431 351.12 390.344 350.653 389.504C350.464 388.945 350.481 388.336 350.703 387.79C350.925 387.244 351.336 386.799 351.859 386.537C353.041 385.77 354.421 385.857 354.888 386.695C355.088 387.253 355.075 387.866 354.852 388.415C354.629 388.964 354.212 389.409 353.682 389.664ZM395.829 388.728C382.716 389.81 367.888 390.12 362.586 389.415C357.282 388.667 363.611 387.184 376.73 386.083C389.849 384.981 404.671 384.691 409.974 385.396C415.231 386.145 408.902 387.648 395.829 388.728ZM368.686 375.59C375.35 374.651 382.971 374.581 385.694 375.356C388.419 376.178 385.193 377.572 378.485 378.494C371.819 379.415 364.2 379.502 361.477 378.725C358.753 377.948 361.976 376.534 368.686 375.59ZM395.755 367.533C381.95 368.714 366.244 369.093 360.619 368.396C355.036 367.697 361.725 366.163 375.522 365.002C389.326 363.804 405.032 363.441 410.657 364.139C416.241 364.842 409.589 366.352 395.749 367.535L395.755 367.533Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M433.711 311.33L287.853 315.418C287.062 315.44 286.499 316.541 286.537 317.878L286.893 330.443C286.931 331.78 287.64 332.93 288.432 332.823L434.291 328.735C435.081 328.713 435.644 327.612 435.606 326.275L435.25 313.71C435.133 312.375 434.506 311.308 433.711 311.33ZM432.058 321.78C432.065 321.961 432.037 322.142 431.977 322.312C431.916 322.482 431.824 322.637 431.705 322.769C431.587 322.901 431.444 323.006 431.286 323.079C431.128 323.152 430.957 323.191 430.784 323.193L291.325 327.102C291.152 327.108 290.98 327.079 290.818 327.015C290.656 326.951 290.508 326.854 290.383 326.729C290.257 326.604 290.156 326.454 290.086 326.288C290.016 326.122 289.979 325.943 289.975 325.762L289.882 322.462C289.875 322.281 289.902 322.1 289.963 321.93C290.023 321.761 290.116 321.605 290.234 321.474C290.352 321.342 290.495 321.237 290.653 321.164C290.811 321.091 290.981 321.052 291.154 321.049L430.613 317.14C430.786 317.133 430.958 317.163 431.12 317.227C431.282 317.291 431.43 317.388 431.556 317.513C431.682 317.638 431.783 317.788 431.853 317.954C431.923 318.12 431.961 318.299 431.965 318.48L432.058 321.78Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M9.00781 353.375C9.00781 384.104 29.3086 413.772 47.4209 433.231C58.2328 444.849 73.9254 450 89.8176 450H401.795C463.871 450 560.943 352.939 562.04 291.042C562.177 283.276 561.893 275.138 561.042 266.578C552.254 178.142 492.479 151.119 430.066 117.549C367.654 83.9751 408.091 34.8443 300.849 5.36591C193.604 -24.1127 80.2097 73.3301 83.7259 164.222C87.2421 255.114 9.00781 268.217 9.00781 353.375Z",
    fill: "#EFEBFF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M475.628 116.566C439.386 104.277 416.433 69.2777 409.486 53.3138C396.801 17.1692 433.949 36.145 460.227 68.6754C486.501 101.206 520.931 131.928 475.628 116.566Z",
    fill: "#EFEBFF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M263.917 237.355C227.675 225.066 204.722 190.067 197.775 174.103C185.09 137.958 222.238 156.934 248.516 189.464C274.79 221.996 309.22 252.717 263.917 237.355Z",
    fill: "#EFEBFF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M47.3762 66.4327L40.5417 75.5541C40.1257 76.1091 39.4475 76.3763 38.7834 76.2465L30.3358 74.5971C28.5185 74.2423 27.4221 76.6224 28.8246 77.8777L35.4638 83.8198C35.9485 84.2537 36.1775 84.9219 36.066 85.5774L34.4005 95.3753C34.0874 97.2173 36.2636 98.3569 37.4959 96.997L44.3155 89.4675C44.7161 89.0252 45.2965 88.8117 45.8746 88.8936L53.7674 90.0138C55.5452 90.266 56.5522 87.957 55.2001 86.7276L49.3305 81.3901C48.8593 80.9615 48.6341 80.3095 48.7352 79.6663L50.5859 67.8968C50.8886 65.9718 48.5285 64.8952 47.3762 66.4327ZM513.028 83.6817L512.314 88.7983C512.268 89.1097 512.053 89.3772 511.751 89.4914L507.915 90.9464C507.089 91.2593 507.183 92.4257 508.045 92.554L512.121 93.1609C512.417 93.2052 512.663 93.4006 512.767 93.6752L514.323 97.7763C514.616 98.546 515.767 98.4427 515.962 97.6263L517.036 93.113C517.099 92.848 517.287 92.6248 517.543 92.5137L521.031 90.9959C521.817 90.6537 521.703 89.5363 520.867 89.4054L517.244 88.8372C516.955 88.7915 516.712 88.6012 516.608 88.3339L514.677 83.4444C514.363 82.6447 513.15 82.8192 513.028 83.6817Z",
    fill: "#EFEBFF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M156.938 353.375C156.938 384.104 177.238 413.772 195.351 433.231C206.162 444.849 221.855 450 237.747 450H549.725C611.8 450 708.873 352.939 709.97 291.042C710.107 283.276 709.823 275.138 708.972 266.578C700.183 178.142 640.408 151.119 577.996 117.549C515.584 83.9751 556.021 34.8443 448.779 5.36591C341.534 -24.1127 228.139 73.3301 231.656 164.222C235.172 255.114 156.938 268.217 156.938 353.375Z",
    fill: "#EFEBFF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M195.298 66.4347L188.464 75.5561C188.048 76.111 187.369 76.3783 186.705 76.2484L178.258 74.599C176.44 74.2443 175.344 76.6243 176.746 77.8797L183.386 83.8218C183.87 84.2557 184.099 84.9238 183.988 85.5794L182.322 95.3773C182.009 97.2193 184.186 98.3589 185.418 96.9989L192.237 89.4694C192.638 89.0272 193.218 88.8137 193.797 88.8956L201.689 90.0158C203.467 90.2679 204.474 87.9589 203.122 86.7296L197.252 81.392C196.781 80.9634 196.556 80.3114 196.657 79.6683L198.508 67.8988C198.811 65.9738 196.45 64.8972 195.298 66.4347ZM660.95 83.6836L660.235 88.8003C660.19 89.1117 659.974 89.3792 659.673 89.4934L655.837 90.9484C655.011 91.2613 655.105 92.4276 655.966 92.556L660.043 93.1628C660.339 93.2072 660.585 93.4026 660.689 93.6772L662.244 97.7782C662.538 98.548 663.689 98.4446 663.884 97.6282L664.958 93.1149C665.021 92.8499 665.209 92.6268 665.464 92.5156L668.953 90.9978C669.738 90.6557 669.624 89.5383 668.788 89.4074L665.166 88.8391C664.877 88.7935 664.634 88.6031 664.53 88.3359L662.599 83.4464C662.285 82.6466 661.071 82.8211 660.95 83.6836Z",
    fill: "#EFEBFF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M609.236 78.3956L602.401 87.517C601.985 88.072 601.307 88.3392 600.643 88.2094L592.195 86.5599C590.378 86.2052 589.281 88.5853 590.684 89.8406L597.323 95.7827C597.808 96.2166 598.037 96.8848 597.925 97.5403L596.26 107.338C595.947 109.18 598.123 110.32 599.355 108.96L606.175 101.43C606.575 100.988 607.156 100.775 607.734 100.857L615.627 101.977C617.405 102.229 618.412 99.9199 617.059 98.6905L611.19 93.353C610.719 92.9244 610.493 92.2724 610.595 91.6292L612.445 79.8597C612.748 77.9347 610.388 76.8581 609.236 78.3956Z",
    fill: "#EFEBFF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M19.1887 225.985L12.3542 235.107C11.9382 235.662 11.26 235.929 10.5959 235.799L2.1483 234.15C0.331041 233.795 -0.765446 236.175 0.637086 237.43L7.27631 243.373C7.76097 243.806 7.99 244.475 7.87852 245.13L6.21302 254.928C5.89988 256.77 8.07613 257.91 9.30841 256.55L16.128 249.02C16.5286 248.578 17.109 248.364 17.6871 248.446L25.5799 249.567C27.3577 249.819 28.3647 247.51 27.0126 246.28L21.143 240.943C20.6718 240.514 20.4466 239.862 20.5477 239.219L22.3984 227.45C22.7011 225.525 20.341 224.448 19.1887 225.985Z",
    fill: "#EFEBFF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M399.424 379.112C393.256 396.748 386.297 408.287 367.967 418.501C326.399 441.687 277.199 442.949 241.465 426.526C222.031 417.599 211.273 406.574 199.074 391.087C198.636 390.54 197.792 391.267 198.096 391.816C206.254 406.508 220.267 418.264 235.053 426.039C269.673 444.249 319.94 445.852 365.34 422.392C382.385 413.585 396.958 398.862 400.83 379.475C400.879 379.29 400.851 379.092 400.754 378.927C400.656 378.762 400.496 378.642 400.31 378.594C400.217 378.57 400.121 378.564 400.027 378.577C399.932 378.59 399.841 378.622 399.759 378.67C399.593 378.767 399.472 378.926 399.424 379.112Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M376.215 400.567C375.727 401.175 376.392 402.198 377.07 401.723C386.721 394.521 393.217 383.898 395.209 372.058C395.246 371.901 395.221 371.736 395.139 371.596C395.058 371.456 394.926 371.353 394.771 371.306C394.616 371.26 394.448 371.274 394.303 371.345C394.158 371.417 394.045 371.541 393.989 371.692C389.11 386.646 384.675 391.225 376.215 400.567Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M388.242 368.471C377.887 387.455 376.078 386.948 367.841 397.832C367.289 398.559 368.44 399.278 369.064 398.744C373.541 394.592 377.499 389.918 380.852 384.823C384.614 380.063 387.527 374.697 389.465 368.957C389.496 368.804 389.472 368.646 389.397 368.509C389.322 368.372 389.202 368.265 389.057 368.208C388.911 368.15 388.75 368.145 388.601 368.193C388.453 368.241 388.326 368.34 388.242 368.471Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M359.241 394.914C363.636 391.358 367.593 387.298 371.029 382.817C374.568 379.005 377.438 374.628 379.52 369.869C379.774 369.144 378.73 368.839 378.358 369.383C372.601 378.287 365.838 386.506 358.202 393.88C357.471 394.55 358.513 395.467 359.241 394.914Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M456.421 79.2435C456.585 80.3086 457.128 81.2795 457.953 81.9781C456.788 83.141 455.919 84.5644 455.42 86.1295C454.92 87.6946 454.805 89.3559 455.082 90.9746C444.515 100.276 435.639 111.43 431.504 124.712C431.086 126.053 432.734 126.728 433.642 125.99C435.495 124.431 437.675 123.306 440.022 122.695C442.369 122.085 444.824 122.005 447.206 122.462C451.297 123.333 454.846 125.55 458.813 126.719C465.024 128.355 471.629 127.549 477.26 124.47C477.479 124.47 476.823 124.034 489.293 134.864C491.544 131.58 494.8 129.107 498.576 127.812C498.576 127.812 489.293 121.308 484.589 118.086C488.374 112.336 488.066 104.705 478.787 96.7488C472.928 91.7258 466.704 88.3989 473.167 80.4584C474.151 79.2478 472.556 77.6018 471.517 78.575C471.412 78.5657 471.307 78.5861 471.213 78.6338C466.359 81.8572 461.689 85.3462 457.224 89.0847C457.138 86.8169 457.78 84.5807 459.058 82.701C459.759 82.8627 460.491 82.8418 461.183 82.6402C461.874 82.4386 462.502 82.0632 463.005 81.5502C463.508 81.0371 463.87 80.4037 464.056 79.711C464.242 79.0183 464.245 78.2896 464.066 77.5953C463.064 73.2799 455.666 74.3163 456.421 79.2435ZM482.198 103.984C483.246 105.504 483.919 107.248 484.163 109.075C484.407 110.902 484.215 112.761 483.603 114.5C481.739 112.906 479.781 111.424 477.739 110.063C475.727 108.56 473.531 107.316 471.204 106.361C470.467 106.068 470.174 107.139 470.714 107.515C474.755 110.346 478.105 114.446 482.321 117C481.028 118.878 479.339 120.454 477.372 121.618C470.231 126 462.471 125.809 454.894 122.591C451.278 120.75 447.289 119.753 443.229 119.673C445.088 114.323 448.257 109.519 452.45 105.693C452.94 105.205 452.275 104.243 451.656 104.72C446.828 108.443 441.518 113.647 440.662 119.978C438.693 120.343 436.796 121.02 435.042 121.983C441.15 105.083 455.443 92.1961 469.494 81.3772C463.171 92.3811 477.234 96.2262 482.198 103.984Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M454.283 66.7791C454.361 66.9516 454.489 67.097 454.65 67.1969C454.812 67.2968 454.999 67.3466 455.189 67.3401C455.379 67.3335 455.563 67.2709 455.717 67.1602C455.871 67.0494 455.989 66.8956 456.055 66.7182C457.377 60.879 457.85 54.8811 457.459 48.908C457.416 46.3541 456.726 41.0067 452.756 41.9778C449.275 42.8291 449.8 48.6054 450.008 51.1572C450.683 56.5395 452.122 61.7993 454.283 66.7791Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M433.691 69.3954C437.719 71.8317 442.182 71.9471 446.763 72.191H446.825C447.114 72.2164 447.403 72.144 447.646 71.9855C447.889 71.827 448.071 71.5917 448.163 71.3176C448.254 71.0435 448.251 70.7465 448.152 70.4748C448.053 70.203 447.865 69.9723 447.619 69.8199C445.066 68.2136 442.726 66.2942 440.655 64.1068C439.377 62.5821 437.922 61.2145 436.319 60.0331C433.98 58.6636 430.46 58.6984 429.416 61.6138C428.261 64.8383 431.186 67.8778 433.691 69.3954Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M436.379 91.0957C439.02 87.7187 442.809 80.9931 446.579 79.4233C447.793 78.9204 447.373 76.9935 446.03 77.418C442.043 78.578 438.369 80.6138 435.279 83.3751C433.345 85.2192 430.494 88.6005 431.56 91.5203C432.573 94.3246 435.148 92.6699 436.379 91.0957Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M479.498 253.22C479.38 252.131 479.498 251.385 478.52 250.91C476.949 250.602 475.334 250.581 473.755 250.849C462.514 250.971 451.278 251.457 440.039 251.881C437.879 249.016 398.619 199.877 390.257 191.399C391.126 190.48 391.6 189.26 391.577 187.999C391.554 186.738 391.036 185.535 390.134 184.649C387.102 181.768 380.07 181.37 378.834 186.41C378.594 187.439 378.637 188.513 378.959 189.519C379.282 190.525 379.871 191.426 380.666 192.126C369.792 203.728 355.352 221.954 339.497 242.033C335.708 246.823 331.555 251.515 328.256 256.621C321.66 256.926 315.064 257.309 308.467 257.71C306.255 257.688 304.045 257.878 301.869 258.276C300.038 258.761 299.933 260.588 299.731 262.288C297.699 279.489 300.359 355.613 303.702 384.651C303.707 384.901 303.792 385.142 303.947 385.338C304.101 385.535 304.316 385.676 304.558 385.74C319.833 388.447 335.398 389.162 350.859 387.867C351.896 387.798 351.953 386.178 350.859 386.226C335.824 386.952 320.755 386.096 305.901 383.674C301.679 341.498 300.213 268.864 302.359 260.455C303.488 260.455 304.278 260.283 305.291 260.211C308.59 259.981 476.871 253.039 477.299 253.039C476.823 254.931 483.644 302.768 482.988 377.29C449.753 381.814 428.292 380.822 407.917 383.674C407.062 383.794 407.245 385.198 408.101 385.198C433.51 383.737 459.051 382.764 484.27 379.239C484.494 379.172 484.692 379.036 484.835 378.85C484.977 378.665 485.057 378.44 485.064 378.207C485.337 336.478 483.479 294.762 479.498 253.22ZM330.457 256.501C334.017 252.425 365.217 211.064 381.46 192.796C382.637 193.527 384.01 193.884 385.396 193.819C386.782 193.753 388.115 193.269 389.218 192.431C389.218 192.431 435.457 249.146 438.021 252.003C426.844 252.43 355.134 255.286 330.457 256.501Z",
    fill: "#282828"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M554.818 170.849C554.277 169.144 548.709 165.316 545.471 163.189C544.06 162.272 542.365 161.89 540.694 162.113C539.024 162.337 537.49 163.15 536.372 164.406L535.211 165.743C534.854 166.134 534.656 166.643 534.656 167.171C534.656 167.699 534.854 168.209 535.211 168.6C537.18 170.82 545.358 180.028 548.337 180.028C551.831 180.028 555.603 173.322 554.818 170.849Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M466.803 101.917C466.602 101.869 466.394 101.86 466.191 101.892C465.987 101.924 465.791 101.995 465.615 102.102C465.439 102.21 465.287 102.35 465.166 102.517C465.045 102.683 464.958 102.871 464.91 103.071C464.864 103.251 464.855 103.438 464.883 103.621C464.91 103.805 464.974 103.981 465.071 104.14C465.168 104.298 465.295 104.436 465.446 104.545C465.597 104.654 465.768 104.732 465.95 104.774C466.138 104.83 466.336 104.848 466.531 104.828C466.727 104.807 466.917 104.749 467.089 104.656C467.262 104.563 467.415 104.436 467.539 104.284C467.663 104.132 467.755 103.958 467.811 103.77C467.867 103.583 467.886 103.386 467.865 103.191C467.845 102.997 467.786 102.808 467.693 102.636C467.599 102.464 467.472 102.312 467.32 102.188C467.167 102.065 466.991 101.973 466.803 101.917Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M309.762 266.711C312.064 266.568 314.374 266.629 316.665 266.894C317.825 266.909 317.759 265.204 316.665 265.13C309.393 264.642 308.003 264.166 306.953 264.825C305.903 265.485 305.914 266.711 305.859 267.804C305.859 269.384 306.1 286.648 306.227 293.639C306.549 311.563 307.382 359.493 311.051 377.589C311.224 378.44 312.469 378.072 312.335 377.223C309.106 356.756 307.824 268.211 307.936 267.804C308.264 266.595 308.607 266.92 309.762 266.711Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M470.03 372.363C466.54 372.646 442.36 374.801 433.747 375.522C427.883 376.014 421.959 377.046 416.093 377.102C415.945 377.111 415.806 377.176 415.705 377.284C415.603 377.391 415.547 377.533 415.547 377.681C415.547 377.828 415.603 377.97 415.705 378.077C415.806 378.185 415.945 378.25 416.093 378.259C429.537 378.287 449.226 376.517 469.846 374.557C471.957 374.489 474.06 374.265 476.138 373.889C478.464 373.294 478.015 371.213 478.033 369.269C478.063 365.62 478.275 343.189 478.275 335.591C478.275 335.325 478.169 335.07 477.98 334.882C477.791 334.694 477.535 334.588 477.268 334.588C477.001 334.588 476.745 334.694 476.556 334.882C476.367 335.07 476.261 335.325 476.261 335.591C476.261 341.609 475.924 361.851 475.893 365.985C475.893 367.019 476.442 371.091 475.711 371.759C474.919 372.482 471.071 372.278 470.03 372.363Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M537.906 241.726C521.69 259.266 505.5 276.854 489.336 294.49C488.84 295.03 489.64 295.827 490.13 295.28C507.171 278.563 523.659 261.123 539.057 242.88C539.735 242.09 538.637 240.936 537.906 241.726Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M520.003 282.091C513.945 287.016 508.948 293.214 503.389 298.625C502.833 299.167 503.643 299.975 504.245 299.476C510.197 294.397 515.827 288.957 521.104 283.186C521.23 283.037 521.295 282.846 521.286 282.652C521.278 282.458 521.197 282.273 521.058 282.136C520.92 281.998 520.735 281.917 520.54 281.909C520.344 281.901 520.153 281.965 520.003 282.091Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M265.228 269.751C265.729 269.152 265.042 268.044 264.311 268.594C254.558 275.958 245.968 285.231 237.13 293.579C227.941 302.251 218.752 310.919 209.826 319.839C209.769 319.89 209.724 319.952 209.692 320.02C209.66 320.089 209.643 320.164 209.641 320.24C209.639 320.316 209.652 320.391 209.681 320.461C209.709 320.532 209.751 320.596 209.805 320.649C209.859 320.703 209.923 320.745 209.994 320.773C210.065 320.802 210.141 320.815 210.217 320.813C210.293 320.811 210.368 320.794 210.437 320.762C210.507 320.731 210.569 320.685 210.62 320.629C221.25 311.267 241.015 292.858 251.361 283.18C256.247 278.981 260.878 274.497 265.228 269.751Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M281.596 268.655C270.766 279.105 259.761 289.413 248.978 299.962C248.299 300.615 249.284 301.542 250.017 300.994C261.408 291.106 272.236 280.594 282.451 269.506C282.878 268.898 282.154 268.117 281.596 268.655Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M271.163 165.622C275 164.768 278.578 163.017 281.601 160.514C281.791 160.396 281.952 160.238 282.073 160.051C282.194 159.863 282.273 159.652 282.302 159.431C282.331 159.21 282.311 158.986 282.243 158.773C282.174 158.561 282.06 158.367 281.907 158.204C278.002 153.676 273.863 149.354 269.506 145.256C268.765 144.602 267.424 145.443 268.041 146.344C271.272 150.754 274.78 154.956 278.542 158.927C275.855 160.629 272.992 162.038 270.296 163.717C269.325 164.348 270.069 165.809 271.163 165.622Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M254.894 153.22C256.344 151.924 255.266 149.752 254.345 148.541C253.373 147.261 252.391 145.682 250.626 145.562C248.379 145.562 249.035 149.793 250.503 151.7C251.459 152.937 253.288 154.659 254.894 153.22Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M272.495 134.861C268.745 134.861 273.092 145.811 276.711 142.582C278.159 141.286 277.048 139.135 276.16 137.901C275.215 136.584 274.206 135.038 272.495 134.861Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M251.423 139.483C251.538 139.448 251.643 139.385 251.726 139.298C251.809 139.212 251.869 139.106 251.9 138.99C251.931 138.874 251.931 138.753 251.901 138.637C251.871 138.521 251.812 138.414 251.73 138.327C250.566 137.623 249.225 137.261 247.864 137.282C246.502 137.304 245.174 137.708 244.033 138.449C243.047 139.253 242.267 140.278 241.757 141.441C241.248 142.603 241.023 143.87 241.101 145.135C241.108 145.282 241.161 145.422 241.253 145.537C241.344 145.651 241.469 145.735 241.611 145.775C241.752 145.815 241.903 145.811 242.041 145.762C242.18 145.712 242.299 145.621 242.383 145.501C243.3 143.86 243.56 141.874 245.07 140.637C247.048 139.022 249.222 139.771 251.423 139.483Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M264.616 175.469C265.657 180.439 269.565 189.103 275.855 188.532C283.075 187.879 281.421 177.892 280.985 173.03C280.978 172.877 280.937 172.728 280.866 172.592C280.795 172.457 280.694 172.339 280.572 172.246C280.45 172.153 280.309 172.088 280.159 172.055C280.009 172.023 279.853 172.023 279.703 172.057C274.836 172.627 270.003 173.459 265.226 174.55C265.121 174.562 265.021 174.596 264.931 174.651C264.841 174.706 264.764 174.78 264.706 174.867C264.647 174.955 264.609 175.054 264.594 175.158C264.578 175.262 264.586 175.368 264.616 175.469ZM279.091 174.254C279.581 178.569 280.497 186.592 275.303 186.653C270.234 186.714 267.79 179.967 266.333 175.832C270.632 175.789 274.912 175.259 279.091 174.254Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M491.785 162.037C492.52 160.395 492.706 160.03 491.907 158.51C490.32 155.641 489.566 152.391 489.728 149.12C489.891 145.85 490.963 142.689 492.826 139.99C494.689 137.292 497.269 135.161 500.279 133.838C503.288 132.514 506.608 132.048 509.867 132.493C510.845 132.602 511.027 130.969 510.11 130.791C506.539 130.102 502.846 130.424 499.45 131.719C496.054 133.014 493.09 135.23 490.896 138.117C488.701 141.003 487.364 144.444 487.035 148.049C486.707 151.653 487.4 155.277 489.037 158.51C489.932 160.252 489.582 160.818 488.73 162.647C480.988 179.283 461.028 199.456 435.162 228.183C434.615 228.792 435.457 229.63 436.017 229.034C451.31 212.754 482.786 182.151 491.785 162.037Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M507.481 150.304C507.599 151.155 508.956 150.912 508.947 150.123C508.871 147.651 509.334 145.192 510.304 142.915C511.274 140.638 512.727 138.597 514.565 136.931C518.827 133.267 523.973 133.034 529.287 133.467C529.459 133.463 529.624 133.403 529.758 133.297C529.892 133.19 529.987 133.042 530.029 132.877C530.07 132.711 530.056 132.536 529.988 132.379C529.92 132.222 529.802 132.092 529.652 132.008C520.035 127.33 505.494 136.176 507.481 150.304Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M519.938 143.253C517.83 145.072 516.286 147.451 515.485 150.111C514.685 152.771 514.661 155.603 515.418 158.276C515.615 158.929 516.768 158.883 516.7 158.093C516.365 155.728 516.595 153.318 517.37 151.058C518.145 148.798 519.443 146.752 521.161 145.084C525.482 141.236 530.131 141.994 535.382 142.471C536.174 142.543 536.241 141.491 535.747 141.134C531.225 137.838 523.9 139.897 519.938 143.253Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M542.602 151.519C543.275 151.574 543.457 150.607 542.908 150.302C536.25 145.865 526.937 151.713 524.583 158.267C524.342 158.935 525.381 159.301 525.677 158.752C527.369 155.653 530.12 153.259 533.432 152.003C536.413 151.154 539.548 150.989 542.602 151.519Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M547.789 158.816C547.141 157.622 546.131 156.661 544.903 156.071C543.674 155.482 542.29 155.293 540.947 155.533C537.925 156.327 535.337 158.27 533.741 160.943C533.318 161.494 534.239 162.232 534.719 161.734C537.344 158.997 543.056 155.219 545.835 160.031C546.544 161.261 548.436 160.105 547.789 158.816Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M527.64 174.679C517.428 193.508 520.217 189.485 506.751 208.599C494.39 226.15 484.72 234.173 477.981 242.882C477.369 243.673 478.655 244.467 479.325 243.916C485.087 238.826 490.4 233.253 495.206 227.26C508.888 211.648 520.15 194.089 528.618 175.165C528.676 175.036 528.681 174.891 528.634 174.759C528.586 174.627 528.489 174.518 528.363 174.456C528.237 174.393 528.091 174.381 527.957 174.423C527.822 174.465 527.709 174.556 527.64 174.679Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M263.881 354.49C263.945 354.45 264 354.398 264.044 354.337C264.088 354.275 264.119 354.206 264.136 354.133C264.153 354.06 264.156 353.984 264.143 353.909C264.131 353.835 264.104 353.764 264.063 353.701C264.023 353.637 263.971 353.582 263.91 353.538C263.848 353.494 263.778 353.463 263.705 353.446C263.631 353.429 263.555 353.427 263.48 353.439C263.406 353.452 263.334 353.479 263.27 353.519C244.729 364.971 225.537 375.579 204.326 380.994C200.791 381.585 197.301 382.418 193.881 383.487C191.134 377.408 188.02 371.632 185.758 365.311C178.95 346.856 177.407 326.887 181.299 307.613C186.161 285.908 199.918 266.874 216.849 252.783C228.066 243.851 240.727 236.883 254.292 232.177C255.086 234.304 255.856 236.44 256.613 238.62C257.206 240.329 259.908 239.593 259.302 237.89C253.432 221.423 243.468 197.667 234.746 184.329C235.6 183.775 236.311 183.03 236.822 182.152C237.373 181.24 236.006 180.066 235.233 180.937C230.958 185.755 224.487 183.184 221.918 178.139C219.844 174.065 221.848 164.117 228.211 166.954C228.267 166.986 228.329 167.007 228.393 167.015C228.457 167.023 228.522 167.018 228.584 167.001C228.647 166.985 228.705 166.955 228.756 166.916C228.807 166.877 228.85 166.827 228.882 166.772C228.914 166.716 228.935 166.654 228.943 166.59C228.951 166.526 228.946 166.462 228.929 166.4C228.912 166.337 228.883 166.279 228.844 166.228C228.804 166.178 228.755 166.135 228.698 166.103C223.415 162.757 217.88 169.554 218.987 176.317C218.925 176.256 218.925 176.195 218.864 176.195C216.105 184.434 214.784 192.431 207.991 199.111C194.356 212.523 169.502 220.211 156.796 236.253C144.57 259.985 135.027 289.67 141.098 315.765C144.279 329.44 150.381 336.249 150.442 336.31C150.474 336.342 150.512 336.367 150.555 336.385C150.597 336.402 150.642 336.411 150.687 336.411C150.733 336.411 150.778 336.402 150.82 336.385C150.862 336.367 150.9 336.342 150.932 336.31C157.955 329.452 167.105 325.167 176.891 324.152C176.514 337.666 178.604 351.137 183.06 363.909C185.42 371.388 188.769 378.523 193.017 385.124C193.117 385.283 193.275 385.397 193.457 385.442C193.64 385.487 193.833 385.46 193.995 385.366C197.739 385.151 201.437 384.436 204.989 383.239C230.278 376.935 249.373 363.377 263.881 354.49Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M207.385 196.319C216.862 186.085 213.233 171.633 224.61 162.571C226.071 161.408 227.672 160.322 229.191 159.288C237.621 148.401 238.721 131.266 238.903 126.341C240.419 125.588 242.998 124.73 253.624 119.655C259.274 122.529 265.543 123.99 271.888 123.909C279.583 123.706 283.703 119.746 288.868 114.547C289.415 113.996 290.2 114.723 289.907 115.337C288.089 118.962 285.184 121.936 281.594 123.846C281.5 123.87 281.413 123.915 281.339 123.976C281.265 124.038 281.205 124.115 281.165 124.202C281.124 124.289 281.103 124.384 281.103 124.48C281.104 124.576 281.126 124.671 281.167 124.758C293.086 151.199 300.181 157.949 299.49 168.892C298.451 185.365 281.331 200.516 264.795 198.191C264.001 198.078 263.82 199.404 264.614 199.589C268.081 200.278 271.651 200.267 275.114 199.556C278.577 198.846 281.86 197.45 284.77 195.452C285.326 199.173 289.881 208.411 292.646 210.893C295.033 212.577 297.91 213.432 300.833 213.325C301.625 213.388 302.422 213.445 303.155 213.445C301.354 230.537 285.468 242.597 266.568 239.548C266.491 239.528 266.412 239.524 266.334 239.534C266.256 239.545 266.181 239.57 266.113 239.61C266.045 239.649 265.985 239.701 265.937 239.764C265.89 239.826 265.855 239.897 265.835 239.973C265.815 240.049 265.81 240.128 265.82 240.205C265.831 240.283 265.857 240.358 265.896 240.426C265.936 240.493 265.988 240.553 266.051 240.6C266.114 240.648 266.185 240.682 266.261 240.702C271.309 242.021 276.604 242.089 281.685 240.901C286.765 239.713 291.476 237.305 295.405 233.888C301.336 228.575 305.115 221.292 306.034 213.404C314.159 213.404 324.296 211.39 334.865 213.038C341.289 213.989 347.637 215.39 353.862 217.231C354.656 217.475 355.201 216.212 354.411 215.895C345.201 211.999 335.338 209.857 325.335 209.58C326.527 181.231 319.373 153.152 304.752 128.793C298.593 118.308 291.122 108.643 282.517 100.031C284.298 90.9407 285.58 74.1887 278.301 67.8071C272.197 62.4554 264.319 67.4479 259 71.4541C253.812 75.5276 249.492 80.5907 246.295 86.3466C237.01 81.6655 225.894 83.2984 216.609 87.9883C216.499 87.1214 216.132 86.3066 215.555 85.6475C214.979 84.9885 214.218 84.5149 213.371 84.2869C212.236 83.9855 211.048 83.9437 209.895 84.1647C208.742 84.3857 207.654 84.8637 206.713 85.5628C204.022 87.6247 202.009 93.8909 205.919 95.6545C196.634 104.712 190.707 119.058 193.58 131.945C193.615 132.057 193.688 132.152 193.787 132.215C193.886 132.278 194.003 132.304 194.12 132.29C194.236 132.275 194.343 132.221 194.423 132.136C194.504 132.05 194.551 131.94 194.558 131.823C193.523 121.95 196.009 112.029 201.581 103.795C207.153 95.5606 215.456 89.5379 225.038 86.7799C231.796 85.1158 238.899 85.4948 245.44 87.8685C244.217 89.9957 243.07 92.1926 241.957 94.3742C236.888 104.314 232.063 114.797 232.184 126.104C214.758 133.598 209.883 134.495 193.092 139.72C192.991 139.749 192.897 139.797 192.815 139.862C192.733 139.926 192.665 140.007 192.614 140.098C192.564 140.188 192.531 140.289 192.519 140.392C192.507 140.495 192.516 140.6 192.545 140.7C192.574 140.8 192.622 140.894 192.687 140.975C192.752 141.057 192.832 141.125 192.924 141.175C193.015 141.226 193.116 141.258 193.22 141.27C193.324 141.282 193.429 141.273 193.529 141.244C195.242 141.027 196.951 140.637 198.601 140.334C194.663 194.433 179.21 196.395 160.047 230.421C173.679 216.572 194.321 210.419 207.385 196.319ZM206.774 94.9251C204.453 92.8589 205.49 89.0878 207.691 87.3874C210.133 85.4997 214.226 85.6238 214.655 89.2097C211.783 90.7551 209.132 92.6774 206.774 94.9251ZM241.408 100.455C245.149 92.7435 248.98 84.5286 254.907 78.208C269.09 63.0868 280.99 63.9642 281.478 84.5917C281.594 89.8348 281.123 95.0744 280.073 100.214L275.308 104.956C264.008 112.372 251.533 117.621 239.22 123.13C237.325 123.976 235.433 124.832 233.479 125.623C234.719 116.858 237.398 108.356 241.408 100.455Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M276.036 128.358C274.988 127.813 273.831 127.504 272.649 127.451C271.467 127.399 270.288 127.605 269.195 128.055C268.27 128.511 267.467 129.179 266.852 130.003C266.236 130.827 265.825 131.785 265.653 132.798C265.465 133.586 266.648 134.145 267.058 133.405C267.955 131.785 268.652 130.2 270.541 129.636C272.249 129.359 273.997 129.441 275.671 129.878C275.841 129.857 276 129.785 276.127 129.672C276.254 129.559 276.344 129.409 276.384 129.244C276.424 129.079 276.412 128.905 276.349 128.747C276.287 128.589 276.178 128.453 276.036 128.358Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M408.779 236.319C403.622 234.694 398.021 233.795 392.714 232.672C387.406 231.548 382.024 230.362 376.651 229.327C376.822 227.407 376.842 225.477 376.71 223.553C376.704 223.383 376.657 223.216 376.572 223.067C376.487 222.919 376.367 222.793 376.222 222.702C372.296 220.635 367.955 219.472 363.517 219.299C362.6 219.286 362.659 220.584 363.517 220.697C366.59 221.015 369.596 221.793 372.435 223.007C373.176 223.353 374.207 223.614 374.572 224.405C376.401 227.59 372.901 238.043 370.724 242.694C370.645 242.854 370.629 243.038 370.68 243.209C370.731 243.38 370.845 243.526 370.998 243.618C371.152 243.71 371.335 243.741 371.511 243.704C371.686 243.668 371.842 243.568 371.947 243.423C374.28 239.752 375.8 235.628 376.406 231.326C381.842 232.541 387.345 233.521 392.775 234.607C397.988 235.864 403.271 236.819 408.595 237.466C409.326 237.534 409.385 236.502 408.779 236.319Z",
    fill: "#191919"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M465.024 302.012L319.989 306.077C319.73 306.106 319.48 306.187 319.253 306.316C319.026 306.444 318.827 306.617 318.667 306.825C318.507 307.032 318.391 307.27 318.324 307.525C318.257 307.779 318.241 308.044 318.277 308.304L320.922 367.534C320.982 367.995 321.211 368.416 321.562 368.716C321.914 369.015 322.363 369.172 322.823 369.154L466.85 365.117C467.339 365.098 467.802 364.885 468.138 364.525C468.474 364.165 468.657 363.687 468.648 363.191L466.966 303.73C466.966 303.483 466.914 303.238 466.813 303.013C466.713 302.788 466.565 302.587 466.381 302.425C466.197 302.262 465.981 302.141 465.747 302.07C465.513 301.999 465.266 301.979 465.024 302.012ZM372.446 357.472L336.348 358.484C335.827 358.493 335.321 358.299 334.937 357.941C334.553 357.583 334.321 357.089 334.289 356.563C333.944 350.053 332.872 329.335 332.288 317.205C332.274 316.934 332.314 316.663 332.405 316.408C332.496 316.153 332.637 315.919 332.819 315.72C333.002 315.521 333.222 315.361 333.466 315.25C333.711 315.139 333.975 315.078 334.244 315.072L370.502 314.056C371.03 314.038 371.544 314.232 371.932 314.595C372.321 314.958 372.551 315.461 372.574 315.995C372.948 326.379 374.101 347.214 374.411 355.317C374.422 355.589 374.381 355.86 374.288 356.116C374.195 356.372 374.054 356.606 373.871 356.807C373.689 357.007 373.469 357.169 373.225 357.283C372.98 357.397 372.716 357.461 372.446 357.472ZM383.672 326.688C384.769 325.912 386.112 326.012 386.539 326.853C386.727 327.402 386.718 328.001 386.514 328.543C386.309 329.086 385.921 329.538 385.419 329.82C384.312 330.583 382.98 330.497 382.551 329.655C381.998 328.815 382.556 327.48 383.672 326.688ZM382.883 340.121C382.69 339.563 382.706 338.952 382.928 338.405C383.15 337.857 383.563 337.412 384.089 337.152C385.27 336.385 386.651 336.472 387.118 337.312C387.307 337.871 387.289 338.481 387.067 339.027C386.845 339.573 386.434 340.018 385.91 340.28C384.764 341.086 383.376 341.012 382.883 340.121ZM386.745 349.795C385.563 350.562 384.183 350.475 383.716 349.635C383.526 349.076 383.544 348.467 383.766 347.921C383.988 347.375 384.398 346.929 384.922 346.667C386.103 345.9 387.483 345.987 387.95 346.826C388.15 347.384 388.138 347.997 387.915 348.546C387.692 349.095 387.275 349.54 386.745 349.795ZM428.891 348.859C415.778 349.94 400.95 350.251 395.648 349.546C390.344 348.798 396.674 347.315 409.793 346.214C422.911 345.112 437.734 344.822 443.036 345.527C448.293 346.276 441.965 347.779 428.891 348.859ZM401.749 335.72C408.412 334.782 416.033 334.712 418.756 335.487C421.481 336.309 418.256 337.703 411.547 338.625C404.881 339.545 397.263 339.633 394.539 338.856C391.816 338.079 395.039 336.665 401.749 335.72ZM428.817 327.663C415.013 328.845 399.307 329.224 393.681 328.526C388.099 327.827 394.788 326.294 408.584 325.133C422.388 323.935 438.095 323.572 443.72 324.27C449.303 324.973 442.651 326.483 428.811 327.666L428.817 327.663Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M466.774 271.461L320.915 275.549C320.124 275.571 319.562 276.672 319.6 278.009L319.955 290.574C319.993 291.911 320.702 293.061 321.495 292.954L467.353 288.866C468.144 288.844 468.706 287.743 468.668 286.406L468.313 273.841C468.196 272.506 467.568 271.439 466.774 271.461ZM465.121 281.911C465.128 282.092 465.1 282.273 465.039 282.443C464.979 282.613 464.886 282.768 464.768 282.9C464.649 283.031 464.507 283.137 464.348 283.21C464.19 283.282 464.02 283.321 463.847 283.324L324.387 287.233C324.215 287.239 324.043 287.21 323.881 287.146C323.719 287.082 323.571 286.985 323.445 286.86C323.319 286.735 323.219 286.585 323.149 286.419C323.079 286.253 323.041 286.074 323.038 285.893L322.944 282.593C322.937 282.412 322.965 282.231 323.025 282.061C323.086 281.892 323.178 281.736 323.296 281.605C323.415 281.473 323.557 281.368 323.715 281.295C323.873 281.222 324.043 281.183 324.216 281.18L463.676 277.271C463.848 277.264 464.021 277.294 464.182 277.358C464.344 277.422 464.493 277.519 464.618 277.644C464.744 277.769 464.845 277.918 464.915 278.084C464.986 278.251 465.024 278.43 465.027 278.611L465.121 281.911Z",
    fill: "#0167FF"
  })))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "card-footer"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "row align-items-center"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "col-lg-6 text-center text-lg-start"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enjoyed', 'store-banner'), " ", _data_json__WEBPACK_IMPORTED_MODULE_3__.name, " ", (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('? Please leave us a rating. We really appreciate your support!', 'store-banner')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "col-lg-6 text-center text-lg-end"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "btn-group"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "#",
    className: "button button-solid button-solid-blue"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Create New Page', 'store-banner')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "#",
    className: "button"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Visit Our Website', 'store-banner')))))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__["default"], {
    className: "col-lg-4 right-content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "card-box"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "card-body"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "img-box d-flex gap-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "part-img"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 40 40",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
    cx: "20",
    cy: "20",
    r: "20",
    fill: "#0167FF",
    fillOpacity: "0.2"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M29.1229 27.6212C28.5859 26.0228 26.4453 25.0222 24.9192 24.3516C24.3213 24.0897 22.6661 23.6454 22.4672 22.8926C22.396 22.6214 22.4056 22.3657 22.464 22.1206C22.3712 22.1389 22.2768 22.1482 22.1821 22.1486H21.1877C20.8062 22.1482 20.4404 21.9964 20.1706 21.7266C19.9009 21.4568 19.7492 21.091 19.7488 20.7094C19.7488 19.9166 20.3941 19.2721 21.1877 19.2721H22.1821C22.5107 19.2721 22.8221 19.3833 23.0733 19.5817C23.4308 19.5346 23.7836 19.4573 24.128 19.3508C24.5629 18.4396 24.9021 17.35 24.9781 16.4121C25.3027 12.3993 22.8427 10.0516 19.3155 10.4574C16.7509 10.7526 15.2189 12.6649 15.0533 15.1268C14.8859 17.6361 15.8163 19.4894 16.8045 20.8489C17.2373 21.4433 17.692 21.8254 17.6221 22.5417C17.5411 23.3886 16.6355 23.6246 15.9877 23.8849C15.2203 24.1932 14.3936 24.6609 14.0032 24.8772C12.6584 25.6198 11.1824 26.5142 10.8507 27.7377C10.116 30.4492 12.5971 31.2705 14.6453 31.6497C16.4032 31.974 18.3853 31.9996 20.0157 31.9996C22.9648 31.9996 28.2677 31.8814 29.1229 29.6646C29.3661 29.0356 29.2619 28.0332 29.1229 27.6212Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M22.81 20.3048C22.7419 20.2 22.6487 20.1138 22.5389 20.054C22.4291 19.9943 22.3061 19.9629 22.1812 19.9627H21.1868C21.0867 19.96 20.9871 19.9774 20.8939 20.0138C20.8007 20.0503 20.7157 20.105 20.644 20.1749C20.5723 20.2447 20.5153 20.3282 20.4764 20.4204C20.4375 20.5126 20.4174 20.6116 20.4174 20.7117C20.4174 20.8118 20.4375 20.9109 20.4764 21.0031C20.5153 21.0953 20.5723 21.1788 20.644 21.2486C20.7157 21.3184 20.8007 21.3732 20.8939 21.4096C20.9871 21.4461 21.0867 21.4635 21.1868 21.4608H22.1812C22.318 21.4607 22.4521 21.4228 22.5687 21.3513C22.6854 21.2799 22.78 21.1776 22.8422 21.0557C24.2286 20.9467 25.4345 20.5232 26.2809 19.8979C26.4753 20.0232 26.7052 20.0965 26.9532 20.0965H27.0156C27.1798 20.0966 27.3425 20.0642 27.4943 20.0013C27.6461 19.9384 27.784 19.8462 27.9001 19.73C28.0162 19.6137 28.1082 19.4758 28.171 19.3239C28.2337 19.1721 28.2659 19.0094 28.2657 18.8451V16.3469C28.2657 16.111 28.1988 15.8799 28.0727 15.6805C27.9465 15.4811 27.7664 15.3216 27.5532 15.2205C27.3697 11.2091 24.0489 8 19.9924 8C15.9358 8 12.6145 11.2091 12.4318 15.2205C12.2184 15.3214 12.0381 15.4809 11.9119 15.6803C11.7856 15.8797 11.7186 16.1109 11.7188 16.3469V18.8451C11.7185 19.0093 11.7507 19.1719 11.8134 19.3237C11.876 19.4754 11.968 19.6134 12.084 19.7296C12.2 19.8458 12.3377 19.9381 12.4894 20.001C12.641 20.064 12.8036 20.0964 12.9678 20.0965H13.031C13.1953 20.0965 13.3579 20.0641 13.5096 20.0012C13.6614 19.9382 13.7992 19.846 13.9153 19.7298C14.0314 19.6136 14.1234 19.4756 14.1861 19.3238C14.2489 19.172 14.2811 19.0093 14.2809 18.8451V16.3469C14.2808 16.1143 14.2156 15.8863 14.0927 15.6888C13.9698 15.4912 13.7941 15.332 13.5854 15.2291C13.7638 11.8491 16.5686 9.15493 19.9924 9.15493C23.4148 9.15493 26.2209 11.8491 26.3985 15.2291C26.19 15.3322 26.0146 15.4915 25.8918 15.689C25.7691 15.8865 25.704 16.1144 25.7038 16.3469V18.8451C25.7038 19.0109 25.7361 19.1653 25.7929 19.3096C25.0644 19.8309 24.0038 20.2024 22.81 20.3048Z",
    fill: "#0167FF"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "part-content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Get 5-star Support', 'store-banner')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Need some help? Our awesome support team is here to help you with any question you have.', 'store-banner')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "#",
    target: "_blank"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Get Support', 'store-banner')))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "card-box"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "card-body"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "img-box d-flex gap-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "part-img"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 40 40",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
    cx: "20",
    cy: "20",
    r: "20",
    fill: "#0167FF",
    fillOpacity: "0.2"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M25.624 23.3904V24.5737C25.624 24.5945 25.624 24.6154 25.6198 24.6362C25.6041 24.9082 25.4848 25.1639 25.2864 25.3507C25.088 25.5375 24.8256 25.6411 24.5531 25.6404H15.424C14.8531 25.6404 14.3865 25.1945 14.3573 24.6362C14.3531 24.6154 14.3531 24.5945 14.3531 24.5737V23.3904C14.346 22.1349 15.229 21.0662 16.4156 20.7612L17.3531 20.4487C18.726 21.7737 21.2552 21.7737 22.6281 20.4487L23.5698 20.7612C24.749 21.0779 25.6344 22.1362 25.624 23.3904ZM30.1156 20.5904L29.4865 20.382C28.5698 21.3758 26.8906 21.7208 25.6365 21.1237C26.1689 21.7587 26.4597 22.5616 26.4573 23.3904V24.5737C26.4573 24.5945 26.4573 24.6154 26.4531 24.6362H30.7198C30.9692 24.6351 31.2081 24.5355 31.3844 24.3592C31.5608 24.1828 31.6604 23.9439 31.6615 23.6945V22.7404C31.6615 21.7654 31.0406 20.9029 30.1156 20.5904ZM29.6406 17.9737C29.6406 16.532 28.4698 15.3612 27.0281 15.3612C25.5906 15.3612 24.4156 16.532 24.4156 17.9737C24.4156 19.4154 25.5906 20.5862 27.0281 20.5862C28.4698 20.5862 29.6406 19.4154 29.6406 17.9737ZM16.8531 17.4904C16.8531 19.2195 18.2615 20.6237 19.9906 20.6237C21.7156 20.6237 23.124 19.2195 23.124 17.4904C23.124 15.7612 21.7156 14.357 19.9906 14.357C18.2615 14.357 16.8531 15.7612 16.8531 17.4904ZM10.349 17.9737C10.349 19.4154 11.5198 20.5862 12.9615 20.5862C14.399 20.5862 15.5698 19.4154 15.5698 17.9737C15.5698 16.532 14.399 15.3612 12.9615 15.3612C11.5198 15.3612 10.349 16.532 10.349 17.9737ZM13.5198 24.5737V23.3904C13.5198 22.5487 13.8115 21.757 14.3365 21.132C13.9028 21.3214 13.4347 21.4192 12.9615 21.4195C11.999 21.4195 11.1281 21.0237 10.5073 20.382L9.87396 20.5945C9.42344 20.7443 9.03159 21.0323 8.75408 21.4175C8.47657 21.8027 8.32753 22.2656 8.32813 22.7404V23.6945C8.32922 23.9439 8.42879 24.1828 8.60515 24.3592C8.78151 24.5355 9.02039 24.6351 9.26979 24.6362H13.524C13.5198 24.6154 13.5198 24.5945 13.5198 24.5737ZM29.8006 25.5312C29.754 25.5024 29.7022 25.4831 29.6482 25.4744C29.5941 25.4657 29.5388 25.4677 29.4856 25.4804C29.4323 25.4931 29.3821 25.5162 29.3377 25.5484C29.2934 25.5805 29.2559 25.6212 29.2273 25.6679C27.2377 28.9012 23.7865 30.832 19.9948 30.832C16.2031 30.832 12.7519 28.9016 10.7623 25.6679C10.7342 25.6201 10.6968 25.5785 10.6524 25.5454C10.608 25.5123 10.5575 25.4883 10.5037 25.475C10.4499 25.4616 10.3941 25.4591 10.3393 25.4676C10.2846 25.4761 10.2321 25.4955 10.1849 25.5245C10.1377 25.5535 10.0968 25.5917 10.0646 25.6367C10.0323 25.6817 10.0094 25.7328 9.99704 25.7868C9.98473 25.8408 9.98332 25.8967 9.99287 25.9513C10.0024 26.0058 10.0228 26.0579 10.0527 26.1045C12.1948 29.5862 15.9115 31.6654 19.9948 31.6654C24.0781 31.6654 27.7948 29.5862 29.9369 26.1045C29.9656 26.0579 29.9848 26.0062 29.9935 25.9521C30.0022 25.8981 30.0002 25.8429 29.9875 25.7896C29.9749 25.7364 29.9518 25.6862 29.9198 25.6418C29.8877 25.5975 29.8472 25.5599 29.8006 25.5312ZM8.74438 20.1654C8.85449 20.1661 8.96054 20.1238 9.03999 20.0476C9.11943 19.9713 9.166 19.8671 9.16979 19.757C9.29354 13.9174 14.1498 9.16536 19.9948 9.16536C25.8398 9.16536 30.696 13.917 30.8198 19.757C30.822 19.8661 30.8668 19.9699 30.9447 20.0463C31.0226 20.1226 31.1274 20.1654 31.2365 20.1654H31.2448C31.2995 20.1642 31.3535 20.1523 31.4036 20.1303C31.4537 20.1083 31.499 20.0767 31.5369 20.0372C31.5748 19.9977 31.6045 19.9511 31.6244 19.9001C31.6442 19.8491 31.6539 19.7947 31.6527 19.7399C31.5198 13.4495 26.2898 8.33203 19.9948 8.33203C13.6998 8.33203 8.46979 13.4495 8.33646 19.7399C8.33423 19.8504 8.37594 19.9572 8.45243 20.0369C8.52893 20.1166 8.63394 20.1627 8.74438 20.1649V20.1654ZM12.7694 25.6295C12.7013 25.5424 12.6014 25.4859 12.4917 25.4724C12.3819 25.4589 12.2713 25.4896 12.1842 25.5577C12.097 25.6257 12.0405 25.7256 12.027 25.8354C12.0136 25.9451 12.0442 26.0557 12.1123 26.1429C14.0265 28.5933 16.8994 29.9987 19.9948 29.9987C23.0902 29.9987 25.9631 28.5933 27.8773 26.1429C27.9454 26.0558 27.9761 25.9452 27.9626 25.8355C27.9492 25.7258 27.8927 25.6259 27.8056 25.5579C27.7185 25.4898 27.608 25.4591 27.4983 25.4725C27.3886 25.486 27.2887 25.5425 27.2206 25.6295C25.4656 27.8766 22.8319 29.1654 19.9948 29.1654C17.1577 29.1654 14.524 27.8766 12.769 25.6295H12.7694ZM27.2527 14.4079C27.2854 14.4532 27.3269 14.4916 27.3747 14.5206C27.4225 14.5496 27.4756 14.5687 27.531 14.5767C27.5863 14.5848 27.6427 14.5816 27.6968 14.5673C27.7509 14.5531 27.8015 14.5282 27.8458 14.494C27.89 14.4597 27.9269 14.417 27.9543 14.3682C27.9816 14.3194 27.9989 14.2656 28.005 14.2101C28.0111 14.1545 28.006 14.0982 27.9899 14.0447C27.9739 13.9911 27.9472 13.9413 27.9115 13.8983C25.9977 11.4195 23.1119 9.9987 19.9948 9.9987C16.8777 9.9987 13.9919 11.4199 12.0777 13.8983C12.0101 13.9857 11.9801 14.0965 11.9941 14.2061C12.0082 14.3157 12.0652 14.4153 12.1527 14.4829C12.2402 14.5504 12.3509 14.5805 12.4605 14.5664C12.5702 14.5524 12.6697 14.4953 12.7373 14.4079C14.4923 12.1354 17.1377 10.832 19.9948 10.832C22.8519 10.832 25.4977 12.1354 27.2527 14.4079Z",
    fill: "#0167FF"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "part-content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Join the Community', 'store-banner')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Got a question about the plugin, want to share your awesome project or just say hi? Join our wonderful community!', 'store-banner')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "#",
    target: "_blank"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Get Support', 'store-banner')))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "card-box"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "card-body"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "img-box d-flex gap-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "part-img"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 40 40",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
    cx: "20",
    cy: "20",
    r: "20",
    fill: "#0167FF",
    fillOpacity: "0.2"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    clipPath: "url(#clip0_3833_12928)"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M28.2271 21.2512L25.4032 24.004L26.0699 27.8906C26.3189 29.3451 24.7911 30.4495 23.4905 29.7644L20 27.9295L16.5095 29.7644C15.2118 30.449 13.6807 29.3472 13.9301 27.8906L14.5968 24.004L11.7729 21.2512C10.718 20.2239 11.3008 18.4303 12.7579 18.2191L16.6606 17.6519L18.4056 14.1158C19.0557 12.7988 20.9391 12.7907 21.5944 14.1158L23.3394 17.6519L27.2421 18.2191C28.6994 18.4303 29.2819 20.224 28.2271 21.2512Z",
    fill: "#0167FF"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M32.9256 16.1858L30.7706 18.2863L31.2795 21.2524C31.4669 22.3456 30.316 23.1773 29.3384 22.6624L28.5012 22.2224C28.8175 21.9143 28.9677 21.7822 29.1368 21.5524C30.3181 19.9465 29.3678 17.6291 27.3673 17.3391L23.9274 16.8391L22.3908 13.7259L24.1435 13.4714L25.4752 10.7726C25.966 9.77888 27.3838 9.77899 27.8746 10.7726L29.2062 13.4714L32.1845 13.9042C33.279 14.0624 33.7202 15.4104 32.9256 16.1858ZM17.6042 13.7259L16.0675 16.8391L12.6276 17.3391C10.4412 17.6561 9.5682 20.3466 11.1498 21.8874L11.4937 22.2224L10.6565 22.6624C9.67553 23.1787 8.52822 22.3444 8.71544 21.2524L9.22432 18.2863L7.06935 16.1858C6.27431 15.4101 6.71608 14.0623 7.81101 13.9042L10.7887 13.4714L12.1204 10.7726C12.6112 9.77893 14.029 9.77899 14.5198 10.7726L15.8514 13.4714L17.6042 13.7259Z",
    fill: "#0167FF"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("clipPath", {
    id: "clip0_3833_12928"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
    width: "26.6667",
    height: "26.6667",
    fill: "white",
    transform: "translate(6.66406 6.66602)"
  }))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "part-content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Rate Us', 'store-banner')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('We love to hear from you, we would appreciate your every single review.', 'store-banner')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "#",
    target: "_blank"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Get Support', 'store-banner')))))))))));
  /*return (
      <div>
        
        <h1>React Settings Page</h1>
        
        <div>
          <label>Options 1</label>
          <input
              value={option1}
              onChange={(event) => {
                setOption1(event.target.value);
              }}
          />
        </div>
          <div>
          <label>Options 2</label>
          <input
              value={option2}
              onChange={(event) => {
                setOption2(event.target.value);
              }}
          />
        </div>
          <button onClick={() => {
            wp.apiFetch({
            path: '/react-settings-page/v1/options',
            method: 'POST',
            data: {
              'plugin_option_1': option1,
              'plugin_option_2': option2,
            },
          }).then(data => {
            alert('Options saved successfully!');
          });
          }}>{__('Save settings', 'react-settings-page')}
        </button>
        </div>
    );*/
}
;

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
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Container.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Row.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Col.js");



function Settings() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("section", {
    className: "settings-page-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["default"], {
    fluid: "fluid"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "content-part"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["default"], {
    className: "justify-content-lg-center"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_bootstrap__WEBPACK_IMPORTED_MODULE_4__["default"], {
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
    className: "options-area"
  }))))))));
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var bootstrap_dist_css_bootstrap_min_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bootstrap/dist/css/bootstrap.min.css */ "./node_modules/bootstrap/dist/css/bootstrap.min.css");
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./App */ "./src/App.js");

const {
  render
} = wp.element;
// import ReactDOM from 'react-dom';




/*
if (document.getElementById('react-settings-page')) {
  render(<App/>, document.getElementById('react-settings-page'));
}
*/

/*ReactDOM.render(<App />, document.getElementById('react-settings-page'));*/
if (document.getElementById('store-banner-settings')) {
  const container = document.getElementById('store-banner-settings');
  const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_2__.createRoot)(container);
  root.render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_App__WEBPACK_IMPORTED_MODULE_3__["default"], null));
}
})();

/******/ })()
;
//# sourceMappingURL=index.js.map