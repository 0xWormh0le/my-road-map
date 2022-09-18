# Third-party packages

This folder contains third-party packages used by the app.

## ckeditor-build-classic-tweaked

We use [CKEditor React component](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/react.html) 
and [CKEditor Classic Build](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html#available-builds).

However, classic build contains only CKFinder-based upload adapter which isn't compatible with the backend.

To make it work we have to use [Simple upload adapter](https://ckeditor.com/docs/ckeditor5/latest/features/image-upload/simple-upload-adapter.html) 
instead and tweak classic build to include the corresponding plugin. That's achieved by creating a custom build based on 
the classic build.

To create tweaked build one should follow the guide [here](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/installing-plugins.html#adding-a-plugin-to-a-build). 
This should be done in case of bringing this dependency up to date.
