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
		add_option('store_banner_do_activation_redirect', true);
	}
}
