---
sidebar_label: macros & functions
title: Shared Macros & Functions
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* this page details the commonly used macros and functions that are implemented within the shared provider and provides additional context where necessary
* they are recommended for use across providers wherever possible

---
# Settings: Functions & Macros
## addSettings
* macro
* combines the specified settings object into the global variable  `settingsObject`

## asFlattenedSettings
* function
* restructure an object of unknown depth into single-depth object by concatenating the paths to each setting’s value with `formatSettingName`

## formatSettingName
* function
* concatenates a series of name-parts - usually capitalised - joined with underscores
	* This is the convention for setting names

## getFirstSetting
* function
* attempts to find a setting name using arrays of string names
	* formats a setting name out of each set and checks for its existance
	* used for checking for the existence of settings, often using setting scopes as parts of the setting names
* returns the first found
* searches in decreasing order of specificity

## getSettingAsEnvironment
* function
* todo

## getAsFileSettings
* function
* retrieve settings from an AsFile configuration
	* include link to asFile definition

## markAsSensitiveSetting
* function
* adds the “Sensitive” attribute to a setting configuration

# Outputs: Functions & Macros
## addToDefaultJsonOutput
* macro
* *adds* the provided content into the default output object

## mergeWithDefaultJsonOutput
* macro
* *merges* the provided content into the default output object

## addGenerationContractStepOutputMapping
* macro
* adds a new Output  Mapping definition to the Generation Contract Step (link)
```freemarker
[@addGenerationContractStepOutputMapping
    provider=EXAMPLE_PROVIDER
    subset="examplesubset"
    outputType=EXAMPLE_DEFAULT_OUTPUT_TYPE
    outputFormat="bash"
    outputSuffix="example.sh"
/]
```


#work/tenants/gosource/hamlet/docs/developer-reference