// This file is web-only and used to configure the root HTML for every web page
// during static rendering. The contents of this function only run in Node.js
// environments and do not have access to the DOM or browser APIs.
// Learn more https://docs.expo.dev/router/reference/static-rendering/#root-html

import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

import { darkTheme } from '@theme/default-dark';
import { lightTheme } from '@theme/default-light';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Add any additional <head> elements that you want globally available on web... */}

        {/*
          Escape-hatch to ensure the background color does not flicker in dark
          mode. Set the body background synchronously before JS loads, matching
          the theme's grayBase color for both light and dark modes.
        */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body {
                background-color: ${lightTheme.colors.grayBase};
              }
              @media (prefers-color-scheme: dark) {
                body {
                  background-color: ${darkTheme.colors.grayBase};
                }
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
