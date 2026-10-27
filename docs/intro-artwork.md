# Introduction leaf artwork

The supplied leaf artwork is preserved as an optional introduction asset. The current introduction restores the arched photo frame as a crossfade slideshow; see `intro-slideshow.md`. To use the leaf artwork again, render it with the `intro-leaf-canvas` and `intro-leaf-image` classes described here.

## Adjust the image

Edit the first `.intro-leaf-canvas` block in `src/app/intro-artwork.css`:

```css
--intro-image-height: 92%; /* Try 80%, 100%, or a pixel value such as 500px. */
--intro-image-scale: 1; /* 1.1 enlarges the artwork by 10%. */
--intro-image-x: 0px; /* Positive moves right; negative moves left. */
--intro-image-y: 0px; /* Positive moves down; negative moves up. */
--intro-image-rotation: 0deg;
```

These controls affect only the absolutely positioned artwork. They do not change the heading's font, line breaks, position or surrounding layout. Artwork extending beyond its reserved column is clipped so it cannot cover the copy. The optional commented media query provides separate mobile adjustments when needed.

The image is decorative and does not add repeated screen-reader content. It retains genuine transparency and is stored at `public/images/intro-leaves.webp`.

## Asset preparation

The built-in imagegen tool was used for background extraction from the user-attached image, followed by lossless WebP conversion for the project. The original generated PNG remains in the image tool's output directory.

Final edit prompt:

> Use case: background-extraction. Asset type: decorative leaf artwork for a hospitality website. The most recent user-attached image is the edit target. Remove ONLY the gray-and-white checkerboard background and replace it with genuine alpha transparency, including the spaces between leaves and the narrow internal cutouts. Preserve the exact original banana-leaf arrangement, orientation, shapes, stems, dark forest green coloration (#0E1F0D family), and subtle shading. Do not redraw, rearrange, restyle, add, or remove any leaves. No text, no extra objects, no border, no shadow, no opaque canvas. Keep the complete artwork inside the image bounds.
