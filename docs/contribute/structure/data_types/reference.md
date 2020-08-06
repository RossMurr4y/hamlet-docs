---
sidebar_label: reference
title: Reference Data
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* Reference input-data is used to compile all “references” into the global variable `referenceData`
* References offer a common structure for defining a new data class in a Solution or Masterdata
* The shared provider defines common “references” across all providers, whilst each plugin provider will define references that are appropriate to only that provider
* For information on different reference types and their structures, see the shared provider “Reference” section (link)

# Structure
* the following is the common structure for the global `referenceData` variable

```json
// example referenceData object with trimmed content
//  - make sure it shows the namespaced provider-specific content
```

#work/tenants/gosource/hamlet/docs/engine/input-data