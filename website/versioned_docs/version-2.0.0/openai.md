---
id: openai
title: ChatGPT plugin
sidebar_label: ✨ ChatGPT plugin
---

The OpenAI plugin allows you to use the **OpenAI API** to generate content using
the latest **GPT models**. This plugin is able to understand the structure of
your
data and generate content that fits your schema.

<p align="center">
    <img src="/img/data_enhancement.png" width="800px" alt="Data enhancement UI" />
</p>

In order to be able to use this plugin you need to have a valid subscription.

You can add the plugin in a couple of simple steps.

## Install the plugin

:::note
Make sure you have a working FireCMS installation. If you don't, you can
follow the [quickstart](./quickstart).
:::

```bash
npm install @firecms/data_enhancement
```

or

```bash
yarn add @firecms/data_enhancement
```

The plugin is then initialised as a React hook, which is added to the `plugins`
array of the `FirebaseCMSApp` (or `FireCMS` if you are using a custom app)
component.

```tsx
import React from "react";
import { FirebaseCMSApp } from "@firecms/core";
import "typeface-rubik";
import "@fontsource/ibm-plex-mono";

import { useDataEnhancementPlugin } from "@firecms/data_enhancement";

// TODO: Replace with your Firebase config
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
};

export default function App() {
    const dataEnhancementPlugin = useDataEnhancementPlugin();

    return (
        <FirebaseCMSApp
            name={"My Online Shop"}
            plugins={[dataEnhancementPlugin]}
            authentication={myAuthenticator}
            collections={
                [
                    //...
                ]
            }
            firebaseConfig={firebaseConfig}
        />
    );
}
```

### Configuring the plugin

The only optional prop is the `getConfigForPath` callback, which allows you to
enable or disable the plugin for specific collections.

```typescript
const dataEnhancementPlugin = useDataEnhancementPlugin({
    // Optional callback for defining which collections should be enhanced
    getConfigForPath: ({ path }) => {
        return true;
    },
});
```

## How does it work?

This plugin is able to understand the structure of your data and generate
content that fits your schema.

Some tips in order to get the best results:

- Make sure you select the **right data** type for your fields.
- The **field names** are used to generate the content and are usually enough to
  generate good results. If you want to get even better results, you can
  **add a description** to your fields. This will help the plugin understand the
  context of your data and generate better results.
- The **collection name** is important as well.
- You can establish **relations between fields** and the plugin will pick it up.
  e.g. if you have a field called `author` and another field called `book`, the
  plugin will understand that the author is related to the book and will
  generate content accordingly. You can use this for making **summaries, reviews,
  translations, SEO content**, etc.

## Pricing and subscriptions

You have a 20 **free weekly usages** of the plugin, **no subscription needed**!

After that, you will need to create a subscription in
the [FireCMS dashboard](https://app.firecms.co/subscriptions).

You need to specify the Firebase project id you would like to use the plugin
with, in the website. And that's it!

You will not need to specify a subscription key when configuring the plugin.

<a href="https://app.firecms.co/subscriptions"
rel="noopener noreferrer"
target="_blank"
class="btn px-6 my-2 py-2 md:px-12 md:py-4 text-white bg-primary hover:
text-white hover:bg-blue-700 hover:text-white uppercase border-solid rounded
text-center">
Create a subscription
</a>
