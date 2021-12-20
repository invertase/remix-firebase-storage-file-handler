# remix-firebase-storage-file-handler

Store files on Firebase Storage with Remix.

> **Note**: Uploaded files are made publicly readable.

## Installation

```bash
npm i remix-firebase-storage-file-handler --save
```

If you haven't already done so, ensure you setup and configure your Firebase project with the [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup).

```bash
npm install firebase-admin --save
```

```js
import { initializeApp } from "firebase-admin/app";

initializeApp({
  credential: cert(require("path/to/serviceAccountKey.json")),
  storageBucket: "my-application.appspot.com",
});
```

## Usage

First, ensure your page sends the `multipart/form-data` encoding type:

```jsx
<Form method="post" encType="multipart/form-data">
  <input type="file" name="my-file-input" />
</Form>
```

Within your [Action](https://remix.run/docs/en/v1/tutorials/blog#actions), provide the handler to the `parseMultipartFormData` function with the
`createFirebaseStorageFileHandler` function:

```tsx
import { unstable_parseMultipartFormData as parseMultipartFormData } from "remix";
import { getStorage } from "firebase-admin/storage";

import createFirebaseStorageFileHandler from "remix-firebase-storage-file-handler";

export const action: ActionFunction = async ({ request }) => {
  const formData = await parseMultipartFormData(
    request,
    createFirebaseStorageFileHandler({
      // Required: provide a reference to a file
      file({ filename }) {
        return getStorage().bucket().file(filename);
      },
    })
  );

  const url = formData.get("my-file-input");

  // Do something with the URL!
};
```

### Filtering

You can optionally filter what files are uploaded by providing a `filter` function:

```ts
createFirebaseStorageFileHandler({
  filter({ name }) {
    if (name !== 'my-file-input') {
      return;
    }
  },
  // ...
})
```
