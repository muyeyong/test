
const snabbdom = window.snabbdom

const patch = snabbdom.init([
    snabbdom_class, // makes it easy to toggle classes
    snabbdom_props, // for setting properties on DOM elements
    snabbdom_style, // handles styling on elements with support for animations
    snabbdom_eventlisteners, // attaches event listeners
  ]);
const h = snabbdom.h
const container = document.getElementById("container");
const vnode = h('ul#list',{},[
    h('li.item',{},'第一项'),
    h('li.item',{},'第二项')
])

patch(container,vnode)
