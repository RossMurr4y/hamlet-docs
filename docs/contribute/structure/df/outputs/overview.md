---
sidebar_label: overview
title: Outputs
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* Output types are defined by a deployment-framework
* Each framework must specify a “default” output type, but can include additional types
* the default provider’s default output type is documented here (link)

# Generation Contract Output Type Mappings
* an Output Type is made available to the engine by defining the Generation Contract Output Mappings (link to function definition for addContractGenerationStepOutputMapping)
* this tells the Generation Contract (link) what the output should look like as a result of the contract (link)
* Generation Contract Output mappings consist of the following:
	* provider
	* subset name - if applicable (link to below)
	* output type
	* output format
	* output suffix
* More information can be found in the common macros list (link)

# outputSubset
* subsets are a more specific implementation of an output type
	* they are often directly associated with template passes (link to passes docs)

# outputFormat
* output formats allow the assignment of a specific language format
* this is typically used with the “Script” output type (link) 
	* allows the configuration of the particular scripting language to be output

# outputSuffix
* determines the file suffix and filetype of all files created 


#work/tenants/gosource/hamlet/docs/engine/deployment-frameworks/outputs