---
sidebar_label: settings
title: Settings
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* the Setting input-data type defines the global variable `settingsObject` and its getter/setter macros
* This input-data type implements a mechanism for Hamlet users to define scoped configuration that is specific to their needs within their solution
	* The settings are then compiled into a fixed data structure within Hamlet where the engine and plugin providers can expect to find it

# Settings.json
* Within a solution, settings.json files enable hamlet users to define the settings for the scope the file exists at
* Settings can then be defined per tier_environment_segment

```json
// example of tree output of a settings.json file in a solution

// exmaple of the JSON structure of that file
```


# Settings Handling
## Names
* Within a solution settings are scoped and when merged into the solution (link to solution docs) will create a complex JSON object of unknown depth
* To simplify accessing Settings, when creating the occurrence (link to docs) the engine will create a flat structure at a known depth
	* The full settings path will be maintained in the JSON Key of the new object
* the example below shows the Settings defined in the above Settings.json and how they will later be exposed in the occurrence

```json
// example of the above Settings.json settings now flattened in the occurrence settings.
```


## Sensitive Settings
* todo

## Settings Functions
* Handling input-data that is entirely defined by the end user is complex
* To assist with this, the Setting input-data has a number of helper functions
See the Settings section of the Function index for details (link to “common macros_functions_patterns” index)

#work/tenants/gosource/hamlet/docs/engine/input-data