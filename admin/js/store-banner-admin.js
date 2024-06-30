 
jQuery(document).ready(function($) {
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

	/*$(".store-banner-setting-unit").find("button.single-image-uploader-button").on("click", function(add){
        add.preventDefault();		
        var button = $(this);
        var imageUploader = wp.media({
            // 'title'     : 'Upload Image',
            // 'button'    : {
            //     'text'  : 'Set the image'
            // },
            library: {type: 'image'},
            'multiple'  : false
        });
		imageUploader.on("open", function() {
			let selection = imageUploader.state().get('selection');
			let attachment = wp.media.attachment(button.closest('.image-uploader').find('input.imageId').val());
			selection.add(attachment ? [attachment] : []);
			
			// let ids = []; // array of IDs of previously selected files. You're gonna build it dynamically
			// ids.forEach(function(id) {
			//   let attachment = wp.media.attachment(id);
			//   selection.add(attachment ? [attachment] : []);
			// }); // would be probably a good idea to check if it is indeed a non-empty array
			
		});
        imageUploader.on("select", function(){
            var image = imageUploader.state().get("selection").first().toJSON();
            var thumbnail = (image.sizes.thumbnail.url)?image.sizes.thumbnail.url:image.url;
            console.log(image);
			button.closest('.image-uploader').find('input.id').val(image.id);
			button.closest('.image-uploader').find('input.url').val(image.url);
			button.closest('.image-uploader').find('input.thumbnail').val(thumbnail);

			button.closest('.image-uploader').find('.option-image').attr('src',thumbnail);
			button.closest('.image-uploader').find('.gallery').attr({'data-fancybox': 'gallery-' + (Math.floor(Math.random() * 1000) + 1), 'data-src':image.url});
            button.closest('.image-uploader').find('.file-name').addClass('with-close-button');
        });		
        imageUploader.open();
    });*/
	$('body').on('click', '.store-banner-remove-image', function (e){
    // $(".store-banner-setting-unit").find('.remove-image').on('click', function(e){
        e.preventDefault();
        var base = $(this).data('base');
		console.log(base);
        $(this).closest('.file-name').removeClass('with-close-button');
        $(this).closest('.image-uploader').find('input.id').val('');
        $(this).closest('.image-uploader').find('input.url').val('');
        $(this).closest('.image-uploader').find('input.thumbnail').val('');
        $(this).closest('.image-uploader').find('.option-image').attr({'src':base, 'data-src':''});
		$(this).closest('.image-uploader').find('.gallery').removeAttr('data-fancybox');
    });

});
