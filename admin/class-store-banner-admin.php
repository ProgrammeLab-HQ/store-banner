<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://www.programmelab.com/
 * @since      1.0.0
 *
 * @package    Store_Banner
 * @subpackage Store_Banner/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Store_Banner
 * @subpackage Store_Banner/admin
 * @author     Programmelab <rizvi@programmelab.com>
 */
class Store_Banner_Admin
{

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct($plugin_name, $version)
	{

		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles()
	{

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Store_Banner_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Store_Banner_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		$current_screen = get_current_screen();
		// var_dump($current_screen);
		if ($current_screen->base == 'toplevel_page_store-banner') {
			wp_enqueue_style($this->plugin_name . '-bootstrap.min', plugin_dir_url(__FILE__) . 'css/bootstrap.min.css', array(), $this->version, 'all');
			// wp_deregister_style('forms');
			wp_enqueue_style($this->plugin_name . '-hint-css', STORE_BANNER_PATH . 'assets/plugins/cool-hint-css/src/hint.css', array(), $this->version, 'all');
			wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/store-banner-admin.css', array(), $this->version, 'all');
		}

		// wp_enqueue_style($this->plugin_name . '-grid', plugin_dir_url(__FILE__) . 'css/grid.css', array(), $this->version, 'all');
		// wp_enqueue_style($this->plugin_name . '-utilities', plugin_dir_url(__FILE__) . 'css/utilities.css', array(), $this->version, 'all');




	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts()
	{

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Store_Banner_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Store_Banner_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */



		$current_screen = get_current_screen();
		// var_dump($current_screen);
		if ($current_screen->base == 'toplevel_page_store-banner') {

			wp_enqueue_media();
			$plugin_url  = plugin_dir_url(__DIR__);
			wp_enqueue_script(
				'react-store-banner',
				$plugin_url . 'build/index.js',
				array('wp-element', 'wp-components', 'wp-api-fetch', 'wp-i18n', 'wp-media-utils', 'wp-block-editor', 'react', 'react-dom'),
				$this->version,
				true
			);
		}
		wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/store-banner-admin.js', array('jquery'), $this->version, false);

		$ajax_params = array(
			'admin_url' => admin_url(),
			'ajax_url' => admin_url('admin-ajax.php'),
			'security' => esc_attr(wp_create_nonce('store_banner_page_security_nonce')),
		);
		wp_localize_script($this->plugin_name, 'store_banner_page_ajax_obj', $ajax_params);
	}

	/**
	 * Adding Woocommerce dependency to our plugin.
	 *
	 * @since    1.0.0
	 */
	public function store_banner_woo_check()
	{

		if (current_user_can('activate_plugins')) {
			if (!is_plugin_active('woocommerce/woocommerce.php') && !file_exists(WP_PLUGIN_DIR . '/woocommerce/woocommerce.php')) {
?>
				<div id="message" class="error">
					<?php /* translators: %1$s: WooCommerce plugin url start, %2$s: WooCommerce plugin url end */ ?>
					<p>
						<?php printf(
							esc_html__(
								'%1$s requires %2$s WooCommerce %3$s to be activated.',
								'store-banner'
							),
							esc_html(STORE_BANNER_NAME),
							'<strong><a href="https://wordpress.org/plugins/woocommerce/" target="_blank">',
							'</a></strong>'
						); ?>
					</p>
					<p><a id="store_banner_wooinstall" class="install-now button" data-plugin-slug="woocommerce"><?php esc_html_e('Install Now', 'store-banner'); ?></a></p>
				</div>

				<script>
					jQuery(document).on('click', '#store_banner_wooinstall', function(e) {
						e.preventDefault();
						var current = jQuery(this);
						var plugin_slug = current.attr("data-plugin-slug");
						var ajax_url = '<?php echo esc_url(admin_url('admin-ajax.php')) ?>';

						current.addClass('updating-message').text('Installing...');

						var data = {
							action: 'store_banner_ajax_install_plugin',
							_ajax_nonce: '<?php echo esc_attr(wp_create_nonce('updates')); ?>',
							slug: plugin_slug,
						};

						jQuery.post(ajax_url, data, function(response) {
								current.removeClass('updating-message');
								current.addClass('updated-message').text('Installing...');
								current.attr("href", response.data.activateUrl);
							})
							.fail(function() {
								current.removeClass('updating-message').text('Install Failed');
							})
							.always(function() {
								current.removeClass('install-now updated-message').addClass('activate-now button-primary').text('Activating...');
								current.unbind(e);
								current[0].click();
							});
					});
				</script>

			<?php
			} elseif (!is_plugin_active('woocommerce/woocommerce.php') && file_exists(WP_PLUGIN_DIR . '/woocommerce/woocommerce.php')) {
			?>

				<div id="message" class="error">
					<?php /* translators: %1$s: WooCommerce plugin url start, %2$s: WooCommerce plugin url end */ ?>
					<p>
						<?php printf(
							esc_html__(
								'%1$s requires %2$s WooCommerce %3$s to be activated.',
								'store-banner'
							),
							esc_html(STORE_BANNER_NAME),
							'<strong><a href="https://wordpress.org/plugins/woocommerce/" target="_blank">',
							'</a></strong>'
						); ?>
					</p>
					<p><a href="<?php echo esc_url(get_admin_url()); ?>plugins.php?_wpnonce=<?php echo esc_attr(wp_create_nonce('activate-plugin_woocommerce/woocommerce.php')); ?>&action=activate&plugin=woocommerce/woocommerce.php" class="button activate-now button-primary"><?php esc_html_e('Activate', 'store-banner'); ?></a></p>
				</div>
			<?php
			} elseif (version_compare(get_option('woocommerce_db_version'), '2.5', '<')) {
			?>

				<div id="message" class="error">
					<p>
						<?php printf(
							esc_html__(
								'%1$s %2$s is inactive.%3$s This plugin requires WooCommerce 2.5 or newer. Please %4$supdate WooCommerce to version 2.5 or newer%5$s',
								'store-banner'
							),
							'<strong>',
							esc_html(STORE_BANNER_NAME),
							'</strong>',
							'<a href="' . esc_url(admin_url('plugins.php')) . '">',
							'&nbsp;&raquo;</a>'
						); ?>
					</p>
				</div>

<?php
			}
		}
	}

	/**
	 * Adding menu to admin menu.
	 *
	 * @since    1.0.0
	 */
	public function store_banner_admin_menu()
	{
		add_menu_page(
			esc_html(STORE_BANNER_NAME),
			esc_html(STORE_BANNER_NAME),
			'manage_options',
			$this->plugin_name,
			array($this, 'store_banner_dashboard_page_html'),
			plugin_dir_url(__DIR__) . 'admin/images/menu-icon.svg',
			57
		);
		add_submenu_page(
			$this->plugin_name,
			esc_html__('Welcome', 'store-banner'),
			esc_html__('Welcome', 'store-banner'),
			'manage_options',
			$this->plugin_name,
			array($this, 'store_banner_dashboard_page_html')
		);
		add_submenu_page(
			$this->plugin_name,
			esc_html__('Settings', 'store-banner'),
			esc_html__('Settings', 'store-banner'),
			'manage_options',
			$this->plugin_name . '&path=settings',
			array($this, 'store_banner_dashboard_page_html')
		);
	}

	/**
	 * Loading plugin Welcome page.
	 *
	 * @since    1.0.0
	 */
	public function store_banner_dashboard_page_html()
	{
		if (!current_user_can('manage_options')) {
			return;
		}
		// include_once('partials/' . $this->plugin_name . '-admin-display-settings.php');
		include_once('partials/' . $this->plugin_name . '-admin-display-settings.php');
	}

	/**
	 * Add settings action link to the plugins page.
	 *
	 * @since    1.0.0
	 */
	public function store_banner_add_action_links($links)
	{

		/**
		 * Documentation : https://codex.wordpress.org/Plugin_API/Filter_Reference/plugin_action_links_(plugin_file_name)
		 * The "plugins.php" must match with the previously added add_submenu_page first option.
		 * For custom post type you have to change 'plugins.php?page=' to 'edit.php?post_type=your_custom_post_type&page='
		 * 
		 */
		$settings_link = array(
			'<a href="' . admin_url('admin.php?page=' . $this->plugin_name) . '">' . esc_html__('Welcome', 'store-banner') . '</a>',
			'<a href="' . admin_url('admin.php?page=' . $this->plugin_name . '-settings') . '">' . esc_html__('Settings', 'store-banner') . '</a>'
		);
		return array_merge($settings_link, $links);
	}

	/**
	 * Add body classes to the settings pages.
	 *
	 * @since    1.0.0
	 */
	public function store_banner_admin_body_class($classes)
	{

		$current_screen = get_current_screen();
		// var_dump($current_screen->id);
		// toplevel_page_store-banner, store-banner_page_store-banner-settings

		if (
			$current_screen->id == 'toplevel_page_store-banner'
			|| $current_screen->id == 'store-banner_page_store-banner-settings'
		) {
			$classes .= ' ' . $this->plugin_name . '-settings-template';
			if ($current_screen->id == 'toplevel_page_store-banner') {
				$classes .= ' ' . $this->plugin_name . '-welcome-template';
			} else {
				$classes .= ' ' . $this->plugin_name . '-option-template';
			}
		}
		return $classes;
	}

	/**
	 * Redirect to the welcome pages.
	 *
	 * @since    1.0.0
	 */
	public function store_banner_do_activation_redirect()
	{
		if (get_option('store_banner_do_activation_redirect')) {
			delete_option('store_banner_do_activation_redirect');
			wp_safe_redirect(admin_url('admin.php?page=' . $this->plugin_name));
		}
	}

	/**
	 * Removing all notieces from settings page.
	 *
	 * @since    1.0.0
	 */
	public function store_banner_hide_admin_notices()
	{
		$current_screen = get_current_screen();
		if ($current_screen->base == 'toplevel_page_store-banner') {
			remove_all_actions('user_admin_notices');
			remove_all_actions('admin_notices');
		}
	}

	/*
	* Add custom routes to the Rest API
	*
	* @since    1.0.0
	*/
	public function store_banner_rest_api_register_route()
	{

		//Add the GET 'store_banner/v1/options' endpoint to the Rest API
		register_rest_route(
			'store_banner/v1',
			'/options',
			array(
				'methods'  => 'GET',
				'callback' => [$this, 'rest_api_store_banner_read_options_callback'],
				'permission_callback' => '__return_true'
			)
		);

		//Add the POST 'store_banner/v1/options' endpoint to the Rest API
		register_rest_route(
			'store_banner/v1',
			'/options',
			array(
				'methods'             => 'POST',
				'callback'            => [$this, 'rest_api_store_banner_update_options_callback'],
				'permission_callback' => '__return_true'
			)
		);
	}
	/*
	* Callback for the GET 'store_banner/v1/options' endpoint of the Rest API
	*/
	public function rest_api_store_banner_read_options_callback($data)
	{

		//Check the capability
		if (!current_user_can('manage_options')) {
			return new WP_Error(
				'rest_read_error',
				'Sorry, you are not allowed to view the options.',
				array('status' => 403)
			);
		}

		//Generate the response
		$response = [];
		$response['plugin_option_1'] = get_option('plugin_option_1');
		$response['plugin_option_2'] = get_option('plugin_option_2');
		$response['programmelab_store_banner'] = get_option('programmelab_store_banner', []);


		//Prepare the response
		$response = new WP_REST_Response($response);

		return $response;
	}
	public function rest_api_store_banner_update_options_callback($request)
	{

		if (!current_user_can('manage_options')) {
			return new WP_Error(
				'rest_update_error',
				'Sorry, you are not allowed to update the DAEXT UI Test options.',
				array('status' => 403)
			);
		}

		//Get the data and sanitize
		//Note: In a real-world scenario, the sanitization function should be based on the option type.
		$plugin_option_1 = sanitize_text_field($request->get_param('plugin_option_1'));
		$plugin_option_2 = sanitize_text_field($request->get_param('plugin_option_2'));
		$programmelab_store_banner = $request->get_param('programmelab_store_banner');

		//Update the options
		update_option('plugin_option_1', $plugin_option_1);
		update_option('plugin_option_2', $plugin_option_2);
		update_option('programmelab_store_banner', $programmelab_store_banner);

		$response = new WP_REST_Response('Data successfully added.', '200');

		return $response;
	}
}
