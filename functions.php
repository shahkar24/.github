<?php
/**
 * Shahkar Portfolio theme functions.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function shahkar_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'custom-logo' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'script', 'style' ) );
}
add_action( 'after_setup_theme', 'shahkar_setup' );

function shahkar_assets() {
	$v = wp_get_theme()->get( 'Version' );
	wp_enqueue_style( 'shahkar-fonts', 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=IBM+Plex+Mono:wght@400;500;600&family=Manrope:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@600&display=swap', array(), null );
	wp_enqueue_style( 'shahkar-style', get_stylesheet_uri(), array(), $v );
	wp_enqueue_style( 'shahkar-portfolio', get_template_directory_uri() . '/assets/css/portfolio.css', array( 'shahkar-style' ), $v );
	wp_enqueue_script( 'shahkar-portfolio', get_template_directory_uri() . '/assets/js/portfolio.js', array(), $v, true );
}
add_action( 'wp_enqueue_scripts', 'shahkar_assets' );

/* Customizer: swap the profile photo from Appearance > Customize > Portfolio Photo. */
function shahkar_customize( $wp_customize ) {
	$wp_customize->add_section( 'shahkar_photo', array( 'title' => __( 'Portfolio Photo', 'shahkar-portfolio' ), 'priority' => 30 ) );
	$wp_customize->add_setting( 'shahkar_profile_photo', array( 'default' => '', 'sanitize_callback' => 'esc_url_raw' ) );
	$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'shahkar_profile_photo', array(
		'label'   => __( 'Profile photo', 'shahkar-portfolio' ),
		'section' => 'shahkar_photo',
	) ) );
}
add_action( 'customize_register', 'shahkar_customize' );

function shahkar_photo_url() {
	$custom = get_theme_mod( 'shahkar_profile_photo' );
	return $custom ? $custom : get_template_directory_uri() . '/assets/images/profile.jpg';
}
