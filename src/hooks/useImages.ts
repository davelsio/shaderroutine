import { Skia, type SkImage } from '@shopify/react-native-skia';
import { Asset } from 'expo-asset';
import { useEffect, useState } from 'react';

import { withAbort } from '../utils/withAbort';

const imageCache = new Map<string, SkImage>();

/**
 * Load a set of Skia images using their URIs.
 * @param imageURIs image URIs
 */
export function useImages(imageURIs: string[]) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<SkImage[]>([]);

  /**
   * Clean up unused Skia resources.
   */
  useEffect(() => {
    return () => images.forEach((img) => img.dispose());
  }, [images]);

  /**
   * Initialize and handle state.
   */
  useEffect(() => {
    const abortController = new AbortController();

    setLoading(true);
    loadImages(imageURIs)
      .then((images) => {
        withAbort(() => setImages(images), abortController);
      })
      .catch((error) => {
        withAbort(() => setError(error.message), abortController);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      abortController.abort();
    };
  }, [imageURIs]);

  return { error, loading, images };
}

/**
 * Load the Skia images from remote or cache.
 * @param uris image URIs
 */
function loadImages(uris: string[]) {
  const skImages = uris.map(async (uri) => {
    if (imageCache.has(uri)) {
      return imageCache.get(uri)!;
    }

    const asset = await Asset.fromURI(uri).downloadAsync();

    if (!asset.localUri) {
      throw new Error('Failed to download image');
    }

    const data = await Skia.Data.fromURI(asset.localUri);
    const skImage = Skia.Image.MakeImageFromEncoded(data);

    if (!skImage) {
      throw new Error('Failed to create image');
    }

    imageCache.set(uri, skImage);

    return skImage;
  });

  return Promise.all(skImages);
}
