# Animated photo journal

`src/components/sections/GalleryMosaic.tsx` cycles the three existing photo frames together, keeping their dimensions fixed. Captions change with their photographs. The current set remains visible until all three replacement images finish decoding; a failed or timed-out set is skipped.

Edit `src/lib/gallery-slides.ts` to change the three photo sets, featured notes, hold time (5200 ms) and crossfade duration (1400 ms).

Styles are in `src/app/gallery-journal.css`. `--journal-ivory` controls the warm ivory text and subtle transition wash. `--journal-caption-x` and `--journal-caption-y` position the captions. Each photograph remains clickable and opens its matching image in the existing gallery.

Autoplay pauses while off screen, while the browser tab is hidden, during hover or keyboard focus, and while the photo dialog is open. Reduced motion and no-JavaScript browsing retain the original three photographs and captions without autoplay.
