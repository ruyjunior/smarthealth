import Image from 'next/image';

const DEFAULT_LOGO = '/images/logo.png';

/** Fixed pixel heights keep every logo crisp and stop squashing non-square marks. */
const heights = {
  sm: 28,
  md: 40,
  lg: 56,
} as const;

/**
 * Intrinsic sizes of the bundled marks. Knowing them lets Next.js reserve layout
 * space and build a tight srcSet instead of generating variants up to 3840px.
 * Uploaded clinic logos are not listed and fall back to intrinsic sizing.
 */
const intrinsicSizes: Record<string, { width: number; height: number }> = {
  '/images/logo.png': { width: 1080, height: 1080 },
  '/images/logos/logoApp.png': { width: 1080, height: 1080 },
  '/images/logos/logoDev.png': { width: 1160, height: 323 },
};

export type LogoSize = keyof typeof heights;

/**
 * Renders a logo preserving its natural aspect ratio.
 *
 * The height is fixed and the width is derived automatically, so square marks
 * (app icon) and wide wordmarks (dev logo) both render undistorted. A max-width
 * guard prevents uploaded clinic logos from overflowing their container.
 */
export default function Logo({
  src,
  alt = 'Smart Health',
  size = 'md',
  priority = false,
  className,
}: {
  src?: string | null;
  alt?: string;
  size?: LogoSize;
  priority?: boolean;
  className?: string;
}) {
  const height = heights[size];
  const resolved = src || DEFAULT_LOGO;
  const intrinsic = intrinsicSizes[resolved];
  const renderedWidth = intrinsic ? Math.round(height * (intrinsic.width / intrinsic.height)) : 160;

  return (
    <span className={`inline-flex items-center justify-center leading-none ${className ?? ''}`}>
      <Image
        src={resolved}
        alt={alt}
        width={intrinsic?.width ?? 0}
        height={intrinsic?.height ?? 0}
        sizes={`${renderedWidth}px`}
        priority={priority}
        style={{ height, width: 'auto', maxWidth: '100%' }}
        className="object-contain"
      />
    </span>
  );
}
