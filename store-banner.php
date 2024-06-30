<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://www.programmelab.com/
 * @since             1.0.0
 * @package           Store_Banner
 *
 * @wordpress-plugin
 * Plugin Name:       Store Banner
 * Plugin URI:        https://www.programmelab.com/store-banner
 * Description:       Lorem Ipsum is simply dummy text of the printing and typesetting industry.
 * Version:           1.0.0
 * Author:            Programmelab
 * Author URI:        https://www.programmelab.com//
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       store-banner
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define('STORE_BANNER_VERSION', '1.0.0');
define('STORE_BANNER_NAME', 'Store Banner');
define('STORE_BANNER_PATH', plugin_dir_url(__FILE__));

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-store-banner-activator.php
 */
function store_banner_activate()
{
	require_once plugin_dir_path(__FILE__) . 'includes/class-store-banner-activator.php';
	Store_Banner_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-store-banner-deactivator.php
 */
function store_banner_deactivate()
{
	require_once plugin_dir_path(__FILE__) . 'includes/class-store-banner-deactivator.php';
	Store_Banner_Deactivator::deactivate();
}

register_activation_hook(__FILE__, 'store_banner_activate');
register_deactivation_hook(__FILE__, 'store_banner_deactivate');

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path(__FILE__) . 'includes/class-store-banner.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function store_banner_run()
{

	$plugin = new Store_Banner();
	$plugin->run();
}
store_banner_run();
