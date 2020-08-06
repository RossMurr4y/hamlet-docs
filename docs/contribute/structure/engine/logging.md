---
sidebar_label: logging
title: Logging
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* Hamlet has the following log levels which will add additional context to output at engine runtime
* Logging output is determined by the environment variable `GENERATION_LOG_LEVEL`
* Default logging level is set to “fatal”

# Log Levels
* Debug
* Trace
* Info
* Timing
* Warn
* Error
* Fatal

# Logging Functions
* common logging macros and functions can be found in the developer-reference guide (link direct to the logging subsection)

# Debugging
* Debug macros are placed throughout Hamlet freemarker files to aide in troubleshooting
* Additionally, component setup files contain existing debug statements for simple troubleshooting of an occurrence
	* due to the size of each occurrence, these are disabled by default and can be enabled inline:
	`[@debug message="example" context={ "key" : "value" } enabled=true /]`
* To enable a default level of debugging in the engine, set the following global variable in your shell:

```sh
# Enable Debugging
export GENERATION_LOG_LEVEL=debug 

# Disable Debugging
unset GENERATION_LOG_LEVEL
```
