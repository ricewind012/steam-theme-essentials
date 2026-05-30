# Theme Essentials

This plugin adds additional elements (later - essentials) that may be used by themes. It does not depend on any particular theme, despite the essentials' naming, but are named this way because they met a certain theme's vision.

## Theming

The plugin adds each enabled essential as a child in certain Steam elements with the class name `ThemeEssentialPart` and the `data-name`, `data-part` attributes. Initially hidden with `display: none` to prevent unthemed content from appearing.

Each enabled essential is also added as a space-separated string in the `data-loaded-essentials` attribute to the `<html>` element. Note that if it errored but is enabled, it does not get added.

## Localization

You can translate this plugin to your own language by translating [this file](locales/english.json). See [here](https://partner.steamgames.com/doc/store/localization/languages#supported_languages) in "API language code" on how to name the translated file.
