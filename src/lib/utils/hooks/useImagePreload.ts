import { useEffect, useState } from "react";

type ImagePreloadResult = {
  isLoaded: boolean;
  hasError: boolean;
  src?: string;
};

/**
 * Preloads an image and provides a local object URL to avoid flashing
 * when the image is displayed for the first time.
 */
export const useImagePreload = (src?: string | null): ImagePreloadResult => {
  const [result, setResult] = useState<ImagePreloadResult>({
    isLoaded: false,
    hasError: false,
    src: undefined,
  });

  useEffect(() => {
    if (!src) {
      setResult({ isLoaded: false, hasError: false, src: undefined });
      return;
    }

    let cancelled = false;
    let objectUrl: string | undefined;
    let image: HTMLImageElement | undefined;

    const cleanupImageListeners = () => {
      if (!image) return;
      image.removeEventListener("load", handleImageLoad);
      image.removeEventListener("error", handleImageError);
      image = undefined;
    };

    const handleImageLoad = () => {
      if (!cancelled) {
        setResult({ isLoaded: true, hasError: false, src });
      }
      cleanupImageListeners();
    };

    const handleImageError = () => {
      if (!cancelled) {
        setResult({ isLoaded: false, hasError: true, src: undefined });
      }
      cleanupImageListeners();
    };
    setResult({ isLoaded: false, hasError: false, src: undefined });

    const loadWithFetch = async () => {
      try {
        const response = await fetch(src, { mode: "cors" });
        if (!response.ok) {
          throw new Error(`Failed to preload image: ${response.status}`);
        }

        const blob = await response.blob();
        if (cancelled) return;

        objectUrl = URL.createObjectURL(blob);
        setResult({ isLoaded: true, hasError: false, src: objectUrl });
      } catch (error) {
        if (cancelled) return;
        loadWithImage();
      }
    };

    const loadWithImage = () => {
      try {
        image = new Image();

        image.addEventListener("load", handleImageLoad);
        image.addEventListener("error", handleImageError);
        image.crossOrigin = "anonymous";
        image.src = src;

        if (image.complete && image.naturalWidth > 0) {
          handleImageLoad();
        }
      } catch (error) {
        setResult({ isLoaded: false, hasError: true, src: undefined });
      }
    };

    loadWithFetch();

    return () => {
      cancelled = true;
      cleanupImageListeners();

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  return result;
};
