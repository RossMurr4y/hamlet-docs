---
sidebar_label: scripts
title: Scripts
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* the default deployment framework (link) defines the “script” output type
* Used for the generation of script files in one of the supported formats

# Formats
* The default deployment framework defines two output formats
	* bash (default)
	* powershell (ps)

# Bash (Default) Script Subsets
* the shared provider implements the following subsets for the default script output type:

## Pregeneration Subset
* used to define bash scripts for tasks that must occur prior to the generation of subsequent subsets
* An example of this is for the `apigateway` component (link), the API definition (link) is consumed at runtime by the template pass (link). This can only happen if the file exists locally, so a pregeneration subset is used to stage the file locally beforehand.

## Prologue Subset
* The prologue subset is used for operations that must occur prior to **deployment** of a deployment-unit
* Typical use-cases for a prologue subset are the creation of users or roles, or generating secrets for consumption by a component at deployment time.

## Epilogue Subset
* the epilogue subset is used for operations that must occur after the deployment of a deployment-unit
* This typically involves final configuration of a deployment-unit that is unavailable through the usual deployment framework for that provider
* Epilogues will also commonly produce pseudo stack outputs (link) to incorporate their changes into the context model.


# Pseudo Stack Outputs
* Defined by the shared provider, pseudo stack outputs allow a script to generate its own outputs during runtime which are then saved in the CMDB alongside other stack outputs. 
* Pseudo stack outputs are then consumed by the engine as if they were standard stack outputs
* In this way, any task that is performed outside of a providers typical deployment framework can still generate content that informs the Hamlet context
* For component setup routines (link) that perform tasks solely with scripts, a pseudo stack output is necessary for hamlet to interpret its deployment-units as having been deployed.

```json
// example of a basic structure for a pseudo stack output file
```

#work/tenants/gosource/hamlet/docs/engine/deployment-frameworks/outputs