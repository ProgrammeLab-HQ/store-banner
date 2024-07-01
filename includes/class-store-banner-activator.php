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
			'_shop_page' => [
				'_enable' => 1,
				'_banner_internal_image' => [
					'url' => 'http://wordpress.test/wp-content/uploads/2024/05/banner.png',
					'thumbnail' => 'http://wordpress.test/wp-content/uploads/2024/05/banner-150x150.png',
					'id' => '1868',
				],
				'_banner_external_image' => [
					'url' => '',
					'alt' => '',
				],
				'_banner_width' => 'align-center', //align-center, align-wide, align-full-width 
				'_banner_url' => 'http://wordpress.test/shop/',
			],
			'_all_product_page' => [
				'_enable' => 1,
				'_banner_internal_image' => [
					'url' => 'http://wordpress.test/wp-content/uploads/2024/05/banner.png',
					'thumbnail' => 'http://wordpress.test/wp-content/uploads/2024/05/banner-150x150.png',
					'id' => '1868',
				],
				'_banner_external_image' => [
					'url' => '',
					'alt' => '',
				],
				'_banner_width' => 'align-center', //align-center, align-wide,align-full-width 
				'_banner_url' => 'http://wordpress.test/shop/',

			],
			'_specific_product' => [
				'_enable' => 1,
			],
		];
		update_option('programmelab_store_banner', $programmelab_store_banner);
		add_option('store_banner_do_activation_redirect', true);
	}
}
