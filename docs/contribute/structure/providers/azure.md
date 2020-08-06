---
sidebar_label: azure
title: Azure Provider Plugin
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

# Azure Deployment Frameworks
## Azure Resource Manager (ARM)

# Azure Supported Components
# Azure Services
# Azure References
* the Azure provider plugin adds some provider-specific references (link) to the Hamlet engine
*  Additionally Hamlet extends some shared references (link) which are identified in the Reference Data definitions (link)
	* Where the plugin extends an existing reference, the reference is namespaced
```json
// provide example of namespacing an attribute within the solution
```

* Azure defines the following reference data types:

* SkuProfile (link to reference data)
* VMImageProfile


# Utility Script
* Azure provides the Hamlet engine its own Utilities script for use at runtime
* this includes content for working with:
	* Storage Accounts
	* SSH keypair generation
	* Interactions with KeyVault
	* Purging content from the CDN
	* Lambda deployment

# Azure Testing Framework
* the Azure provider plugin is accompanied by a secondary testing provider - `azuretest`
* this provider defines the test cases for the outputs of the primary Azure provider
* CI test definitions can be located in the azure provider plugin at `<plugin-root>/azuretest/scenarios`

## Available Test Cases
* the following test case types are available for use within Azure

### Structural
* JSON match
	* Does a JSON Path match a specific value
* JSON length
	* length of an array at a given path
* JSON exists
	* does a JSON path exist
* JSON not empty
	* Is a given JSON path not empty

#work/tenants/gosource/hamlet/docs/engine/providers