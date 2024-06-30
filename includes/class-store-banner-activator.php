<?php

/**
 * Fired during plugin activation
 *
 * @link       https://www.programmelab.com/
 * @since      1.0.0
 *
 * @package    Store_Banner
 * @subpackage Store_Banner/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Store_Banner
 * @subpackage Store_Banner/includes
 * @author     Programmelab <rizvi@programmelab.com>
 */
class Store_Banner_Activator
{

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate()
	{
		$programmelab_store_banner = [
			'_enable_shop_page' => 1,
			'_shop_page_banner_internal_image' => [
				'url' => 'http://wordpress.test/wp-content/uploads/2024/05/banner.png',
				'thumbnail' => 'http://wordpress.test/wp-content/uploads/2024/05/banner-150x150.png',
				'id' => '1868',
			],
			'_shop_page_banner_external_image' => [
				'url' => '',
				'alt' => '',
			],
			'_shop_page_banner_width' => 'align-center', //align-center, align-wide,align-full-width 
			'_shop_page_banner_url' => 'http://wordpress.test/shop/',

			'_enable_all_product_page' => 1,
			'_enable_specific_product' => 1,
		];
		update_option('programmelab_store_banner', $programmelab_store_banner);
		add_option('store_banner_do_activation_redirect', true);
	}
}
