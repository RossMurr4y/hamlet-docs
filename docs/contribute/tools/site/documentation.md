---
sidebar_label: documentation
title: Documentation
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* The documentation site for hamlet.io
* There are a few kinds of documentation we keep on the site, and they are handled differently


## Authored Documentation
* This covers pretty much all of the “docs” section, except for the “Reference” section.
* These files are written in markdown, and to add a new one you just need to add a new one to the correct directory under `./docs`
* If you are adding a new section, you will need to update the sidebar section of the `docusaurus.config` file in the root of the repo
	* Link to info on the docusaurus site about how to do this


## Generated Reference Documentation

* the “Reference” docs page is different to the rest of the “docs” pages
	* it is a Docusaurus “page”, unlike the documentation “docs” which is just a different view over each of the markdown files.
* As a templating engine, Hamlet is capable of generating its own Reference documentation by way of JSONSchema
* The JSONSchema is used to generate Reference Data tables for the site
* You do not need to make updates to this documentation yourself.


#work/tenants/gosource/hamlet/docs/ecosystem/docs-site