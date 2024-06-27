 
(function( $ ) {
	'use strict';
	let timer;
	function startTimer() {
		timer = setInterval(function () {
			const urlParams = new URLSearchParams(window.location.search);
			const page = urlParams.get('page');
			const path = urlParams.get('path');
			if (path === 'settings') {
				if (!$('#toplevel_page_store-banner').find('li:last').hasClass("current")) {
					$('#toplevel_page_store-banner').find('li').removeClass("current");
					$('#toplevel_page_store-banner').find('li:last').addClass("current");
				}
			}
			else  {
				if (!$('#toplevel_page_store-banner').find('li:nth-child(2)').hasClass("current")) {
					$('#toplevel_page_store-banner').find('li').removeClass("current");
					$('#toplevel_page_store-banner').find('li:nth-child(2)').addClass("current");
				}
			}
			//console.log(path);
		}, 100);
	}
	startTimer(); 
	/**
	 * All of the code for your admin-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */

})( jQuery );
