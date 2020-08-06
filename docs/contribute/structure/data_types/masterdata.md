---
sidebar_label: masterdata
title: Masterdata
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* Masterdata input data are separate solution instances that are provided by either the engine or plugin providers
* They enable the defining of default values and datasets such as Reference Data (link to ref data page)  and commonly used configurations
* Hamlet users are providing their own masterdata by way of their Solution (provide link to solution docs)

## Masterdata.ftl Data Type
* the `masterdata.ftl` input-data file defines the macros and functions required to compile all masterdata configurations (shared provider & discovered plugin providers) into one global object during engine runtime
* The object then becomes the foundations which will become the blueprint (link)
* The shared provider provides its own masterdata file that includes configuration that is applicable across many providers
* Each provider is then responsible for defining its own masterdata file for common content across that plugin


# Common Masterdata Content
* Industry convention naming standards for
	* Environments
	* Tiers
* Description attributes
* Mapping common knowledge port names with numbers
* Defining commonly used security configurations such as OWASP Top 10 (link to their site) as Profile types
* Provider region names (in that providers masterdata)



#work/tenants/gosource/hamlet/docs/engine/input-data