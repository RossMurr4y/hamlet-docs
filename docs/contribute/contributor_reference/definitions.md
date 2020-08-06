---
sidebar_label: definitions
title: Patterns, Routines, Macros & Functions
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* This section documents common macros, functions and patterns
* This is not intended to be an exhaustive list, but a starting point for understanding the design of common features

# Definitions
## Patterns
* Code practices that are repeated a number of times
* Ensures consistency across Hamlet
* Decrease the amount of learning required as different features share a common implementation approach

## Routines
* Macros that require a specific naming structure and must support a fixed parameter set
* Such macros are not invoked directly, but dynamically after routine names are constructed from other data - commonly command line options
* Includes component state and setup macros
* Routines will be identified as such
	* Their filename, parent directory, macro name and accepted parameters must all be in the format defined
* See the routines page for specific information (link to routines docs)

## Macros
* Freemarker macros, using the square-bracket syntax (link)
* perform a defined action
* they cannot return a result
* Usually macros are `add`, `create`, and `internal` prefixed
* link to the Common Settings, Macros and Functions

## Functions
* Freemarker functions, using the square-bracket syntax (link)
* will perform a defined action
* they **must** return a result
* usually functions are `get`, `format`
* * link to the Common Settings, Macros and Functions

## Conventions
* camelCase should be used for all function and macro names

### Prefixes
* `get`  prefix for all “getter” functions
* `add` prefix for all macros that combine to a global variable
* `format` prefix for all functions that handle data structure rearrangement
	* very commonly used for constructing names, paths etc
* `as` prefix for data type conversion functions
* `internal` these macros are not intended for use outside of the engine

### Suffixes
* `Mapping` suffix for assignment of configuration

### Common Parameter Inputs
* where possible, parameter inputs should be selected from the following list.
* this ensures consistency across Hamlet
* todo

#work/tenants/gosource/hamlet/docs/developer-reference