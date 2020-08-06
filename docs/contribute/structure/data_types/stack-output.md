---
sidebar_label: stack outputs
title: Stack Outputs
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* stack outputs are the output of a Hamlet deployment
* the outputs for a given cloud provider are captured after the deployment and formatted into a JSON structure defined here.
	* This is then the known state of that component
* stack outputs have two primary purposes
	* to provide a local mechanism to lookup current component states
	* to define that a deploment-unit is deployed
		* If a deployment-unit does not have a stack-output file in the CMDB then it is not considered deployed
		
* though the name is taken from AWS “stacks” it is applicable to all providers.

# Composite Stack Outputs
* Composite Stack Outputs are a single JSON object comprised of all discovered stack output files
* This object is then queried to retrieve existing values using the function `getExistingReference()`

# Structure
* stack outputs for a given provider must fit into the following JSON structure
* Hamlet then knows how to handle and merge these files
	* though it is up to each provider to handle how to look up and process the original output content

```json
// show the skeleton structure of all stack output files
```

#work/tenants/gosource/hamlet/docs/engine/input-data