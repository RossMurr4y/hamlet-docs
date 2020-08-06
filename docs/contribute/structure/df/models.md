---
sidebar_label: models
title: Models
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* a Model is a defined data skeleton used by the Hamlet engine to sort configuration into a structure that it can reliably seek and retrieve data from
* Once input-data is sorted into a model, Hamlet can reliably retrieve and_or confirm the presence_absence of configuration.

# Context Model / Default Model
* The default deployment framework (link) defines the “context” model
	* also known as the “default” model
* Once compiled the context model represents the provided solution in its current “context” of input-data values
* The default model is defined within the shared provider (link to docs)

### Example:
```json
// example of the context model during template generation
```

## Set Context
* SetContext is responsible for instantiating the context model by discovering discovering input data and incorporating it into the context model
* Unlike macros or functions that are invoked with parameters, the context model is defined within its own file - `setContext.ftl`
* Set Context is included by the `bootstrap.ftl` which is used to “bootstrap” the engine at runtime for most activities