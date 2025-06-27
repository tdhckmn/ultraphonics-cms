---
id: intro
title: Introduction
sidebar_label: Introduction
slug: /
---

<video class="intro_video" loop autoPlay muted>
  <source src="/img/dark_mode.mp4" type="video/mp4"/>
</video>

FireCMS is an **open source headless CMS and admin panel** built by developers
for developers.

It generates **CRUD views** based on your configuration. It is easy to set up
for the straight forward cases and easy to extend and customise.

FireCMS does **not** enforce any data structure on your side, and works out of
the box with any project.

The goal of this CMS is to generate collection and form views that bind nicely
to the collection/document model. We have built in many basic (and not
so basic) use cases; but FireCMS is built with extensibility in mind, so it is
easy to create your custom form fields, or your complete views.

There are two ways to build top level views in FireCMS:

- By creating mapping configurations for **collections** (to datasource
  collections, such as Firestore collections)
  and **schemas** (to datasource entities, such as Firestore documents).
  The best way to get a grasp of how
  this works is checking the [Quickstart](quickstart.md),
  [Collections](collections/collections.md) and [Entity schema](entities/entity_schemas.md)
  documentation.
- Create **custom views** that sit in the main level of your navigation tree. In
  this case you can build your custom React component and make use of the
  internal components of the CMS as well as the provided hooks.
  Check [Custom top level views](custom_top_level_views.md) for more details

:::note Custom backend
FireCMS was built with Firebase/Firestore as the default backend, but nothing
stops you from implementing your own `DataSource`, `AuthController` and
`StorageSource` and override the default implementations.
:::

### Core technologies

FireCMS is based on these great technologies:

- Typescript
- Firebase
- React
- React Router
- Material UI
- Formik + Yup

:::important
You can use this library as a full application, with routing enabled.
But if you need better customisation and to use the internal components, tweak the
MUI theme, control the routes or replace the backend altogether
(including auth, storage and data), you can do it starting from version 1.0.0.
Check the details in the [Custom CMSApp](custom_cms_app.md) section
:::

## Firebase

If Firebase is your chosen backend:

- You need to enable the **Firestore** database in your Firebase project.
- If you want to have **authentication** enabled in your CMS config, you need to enable
  the corresponding auth method in your project.
- Also, if you are using **storage** fields in your string properties, you need
  to enable Firebase Storage.

More details in [Firebase setup section](firebase_setup.md).

## Deployment to Firebase hosting

If you are deploying this project to firebase hosting, and the app is properly
linked to it, you can omit the `firebaseConfig` specification, since it gets
picked up automatically.

More details in [the deployment section](deployment.md)

## Features

FireCMS has been meticulously built to make it extremely easy for developers to
build a CMS/admin tool. At the same time it offers the best data editing
experience and has an extremely thoughtful UX designed to make it super easy to
use, for marketers and content managers.

### 🏓 Awesome spreadsheet view

We have developed a super performant windowed **spreadsheet view** for
collections, where you can do inline editing on most of the common fields, and
have a popup view in the rest of the cases and your custom field
implementations.

It has **real-time** support, making it suitable for apps that need to be always
updated.

It also supports **text search** (through an external provider such as Algolia,
if you are using Firestore), as well as **filtering and sorting** and
**exporting** data

### ✨ Powerful forms

![fields](/img/form_editing.webp)

When editing an entity, FireCMS offers a nested system of side dialogs that
allow to navigate through **subcollections** and access custom views (such as a
custom form, or a blog preview).

FireCMS includes **more than 15 built-in fields** with hundreds of customization
and validation options. The components have been meticulously crafted for a
great user experience, and we include advanced features such as **references**
to other collections, **markdown** or **arrays reordering**.

If your use case is not supported, you can build your own **custom field**, just
as any other React component.

It also supports **conditional fields** in forms, allowing for declaring rules
of what fields are active , based on your own logic.

### 👮 Authentication, permissions and role system

You will be able to define which navigation views can a user see, and the
operations (create, edit, delete) that can be executed on them, based on your
role system. You can even define this configuration on a per-entity or
collection level.

By default, all the authorization mechanisms of Firebase are supported, but you
are free to implement your own.

### 🏹 Relational support

You can define references to entities in other collections, and benefit from the
integrated reference fields and shortcuts included.

It is also possible to define subcollections at the entity level, so you can
nest data in a collection/document/collection model

### 🆒 Real time data

Every view in the CMS has real time data support. This makes
it suitable for displaying data that needs to be always updated.

Forms also support this feature, any modified value in the database will be
updated in any currently open form view, as long as it has not been touched by
the user. This allows for advanced cases where you trigger a Cloud
Function after saving an entity that modifies some values, and you want to get
real time updates.

### 🗂️ Files storage

FireCMS supports uploading files to Firebase Storage out of the box, and
provides specific fields for handling single and multiple file uploads, also
allowing for reordering.

You can change the Firebase Storage implementation with your own.

### 🙌 Your logic

You can add your custom logic or validation in multiple points of the user flow.
There are built-in hooks `onPreSave`, `onSaveSuccess`, `onSaveFailure`,
`onPreDelete` and `onDelete`.

FireCMS has a good separation of concerns. All the logic related to
Firebase/Firestore is abstracted away behind 3 interfaces: `DataSource`,
`StorageSource` and `AuthDelegate`. This means you can extend or even completely
replace those 3 implementations with your own.
