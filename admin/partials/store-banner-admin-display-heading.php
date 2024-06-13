<section class="container-fluid">
    <div class="topbar-part bg-dark-blue">
        <div class="text-center">
            <?php printf(
                esc_html__('You\'re Using %1$s %2$s Free Version %3$s', 'store-banner'),
                '<strong>' . esc_html(STORE_BANNER_NAME) . '</strong>',
                '<span class="d-inline-block text-lite-blue">',
                '</span>'
            ); ?>
        </div>
    </div>
</section>
<section class="container-fluid">
    <div class="header-part bg-lite-blue">
        <div class="row align-items-center">
            <div class="col-lg-8 left-header">
                <div class="d-flex flex-column flex-lg-row align-items-center">
                    <img class="img-fluid" src="<?php echo esc_url(plugin_dir_url(__DIR__) . 'images/icon.svg') ?>" alt="<?php echo esc_html(STORE_BANNER_NAME . '-Logo') ?>">
                    <img class="img-fluid" src="<?php echo esc_url(plugin_dir_url(__DIR__) . 'images/logo.svg') ?>" alt="<?php echo esc_html('Programme-lab-Logo') ?>">
                    <ul class="list-inline">
                        <li class="list-inline-item"><a href="#" class="welcome-link"><?php echo esc_html__('Welcome', 'store-banner') ?></a></li>
                        <li class="list-inline-item"><a href="#" class="settings-link"><?php echo esc_html__('Settings', 'store-banner') ?></a></li>
                    </ul>
                </div>
            </div>
            <div class="col-lg-4 right-header text-center text-lg-end">
                <ul class="list-inline">
                    <li class="list-inline-item"><a href="<?php echo esc_url("https://www.programmelab.com/") ?>" class="leanrmore-link" target="_blank"><?php echo esc_html__('Learn More', 'store-banner') ?></a></li>
                    <li class="list-inline-item">
                        <a href="#" class="review-link">

                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_3319_11057)">
                                    <path d="M10 0C4.48598 0 0 4.48598 0 10C0 15.514 4.48598 20 10 20C15.514 20 20 15.514 20 10C20 4.48598 15.514 0 10 0ZM10 18.75C5.17523 18.75 1.25 14.8248 1.25 10C1.25 5.17523 5.17523 1.25 10 1.25C14.8248 1.25 18.75 5.17523 18.75 10C18.75 14.8248 14.8248 18.75 10 18.75ZM15.2678 13.0469C14.1751 14.9393 12.2059 16.0691 10.0002 16.0691C7.79434 16.0691 5.825 14.9393 4.73223 13.0469C4.55961 12.748 4.66199 12.3657 4.9609 12.1931C5.25988 12.0205 5.64211 12.1229 5.81465 12.4218C6.68148 13.9229 8.24617 14.8191 10.0001 14.8191C11.754 14.8191 13.3186 13.9229 14.1853 12.4218C14.3579 12.1229 14.7402 12.0205 15.0391 12.1931C15.338 12.3657 15.4404 12.7479 15.2678 13.0469ZM4.63586 7.53684C4.63586 6.8473 5.19684 6.28629 5.88641 6.28629C6.57598 6.28629 7.13695 6.84727 7.13695 7.53684C7.13695 8.22641 6.57598 8.78738 5.88641 8.78738C5.19684 8.78738 4.63586 8.22641 4.63586 7.53684ZM15.3642 7.53684C15.3642 8.22637 14.8032 8.78738 14.1136 8.78738C13.4241 8.78738 12.8631 8.22641 12.8631 7.53684C12.8631 6.84727 13.4241 6.28629 14.1136 6.28629C14.8032 6.28633 15.3642 6.8473 15.3642 7.53684Z" fill="white" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_3319_11057">
                                        <rect width="20" height="20" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</section>