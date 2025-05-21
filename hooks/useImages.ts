import { Skia, type SkImage } from '@shopify/react-native-skia';
import { Asset } from 'expo-asset';
import { useCallback, useEffect, useState } from 'react';

import { withAbort } from '@utils/withAbort';

export function useImages(imageURIs: string[]) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<SkImage[]>([]);

  /**
   * Load images from a set of URIs.
   */
  const loadImages = useCallback(async (uris: string[]) => {
    const skImages = uris.map(async (uri) => {
      const asset = await Asset.fromURI(uri).downloadAsync();

      if (!asset.localUri) {
        throw new Error('Failed to download image');
      }

      const data = await Skia.Data.fromURI(asset.localUri);
      const skImage = Skia.Image.MakeImageFromEncoded(data);

      if (!skImage) {
        throw new Error('Failed to create image');
      }

      return skImage;
    });

    return Promise.all(skImages);
  }, []);

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
  }, [imageURIs, loadImages]);

  return { error, loading, images };
}
