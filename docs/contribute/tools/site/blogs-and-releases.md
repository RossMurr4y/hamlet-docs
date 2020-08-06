---
sidebar_label: blog & releases
title: Blog & Releases
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* Blog page is a feature of the Docusaurus (link) framework
* Releases are just a second blog type
* Formatting a new markdown file with the latest Release/Blog information you wish to publish and placing the `.md` file in the `./blog` directory is all it takes to publish one.
* Docusaurus will sort each by date and present them on their respective pages

# Requirements
* Filename must be in the format `YYYY-MM-DD-<title>.md` 
	* This informs Docusaurus (link to our article on this) of the date to use
	* The `<title>` must match the title in the header block below
* File should start with the following header block to render correctly:
```md
---
title: Azure Plugin Breakdowns pt 3
author: rossmurr4y
author_url: https://github.com/rossmurr4y
---
```
* If using Admonitions (link to definition) then you should include the following after the above header block:
`import Admonition from ‘react-admonitions’;`

#work/tenants/gosource/hamlet/docs/ecosystem/docs-site/releases