<?php
/* Fallback template: blog posts and other pages. The portfolio itself is front-page.php. */
get_header(); ?>
<main class="section"><div class="wrap">
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
	<article <?php post_class( 'reveal' ); ?> style="margin-bottom:48px">
		<h2><a href="<?php the_permalink(); ?>" style="text-decoration:none"><?php the_title(); ?></a></h2>
		<div style="color:var(--muted);max-width:68ch"><?php is_singular() ? the_content() : the_excerpt(); ?></div>
	</article>
<?php endwhile; the_posts_pagination(); else : ?>
	<p><?php esc_html_e( 'Nothing found.', 'shahkar-portfolio' ); ?></p>
<?php endif; ?>
<p><a class="btn btn-ghost" href="<?php echo esc_url( home_url( '/' ) ); ?>">&larr; Back to portfolio</a></p>
</div></main>
<?php get_footer(); ?>
