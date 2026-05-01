import { Html, ScrollViewStyleReset } from 'expo-router/build/static/html';

const Document = ({ children }: { children: React.ReactNode }) => (
  <Html>
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <title>User List</title>
      <meta
        name="description"
        content="Browse, search, and sort users in a fast React Native web app built with Expo Router."
      />
      <ScrollViewStyleReset />
    </head>
    <body>{children}</body>
  </Html>
);

export default Document;
