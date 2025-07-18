---
id: reference
title: Reference
sidebar_label: Reference
---

```tsx
import { buildProperty } from "./builders";

const productsReferenceProperty = buildProperty({
    title: "Product",
    dataType: "reference",
    path: "products",
    previewProperties: ["name", "main_image"],
});
```

## `path`

Absolute collection path of the collection this reference
points to. The schema of the entity is inferred based on the root navigation,
so the filters and search delegate existing there are applied to this view as
well.

## `previewProperties`

List of properties rendered as this reference preview.
Defaults to first 3.

## `validation`

- `required` Should this field be compulsory.
- `requiredMessage` Message to be displayed as a validation error.

---

The widget that gets created is

- [`ReferenceField`] Field that opens a
  reference selection dialog

Links:

- [API]
