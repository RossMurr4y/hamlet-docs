---
sidebar_label: definition
title: Definition
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* the definition input-data type implements a global variable (`definitionsObject`) that is used to compile API specification data structures
* This enables the Hamlet engine to read and extend an API specification with settings and configuration defined in other input-data types

# Structure
* the following is an example structure of the definition input-data type

```json
// example of skeleton definitionsObject structure
```

# OpenAPI Extensions
* the hamlet engine is able to extend OpenAPI definitions using values from the context at generation time
* the `createOpenapiExtensions.ftl` file is used during generation time by the executor in order to add additional AWS-specific API extensions to the definition

#work/tenants/gosource/hamlet/docs/engine/input-data