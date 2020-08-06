---
sidebar_label: default
title: JSON "default" Output Type
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* the “default” deployment framework defines the “default” output type - JSON
* used extensively by the engine to produce many of the prerequisite models (link) and output subsets (link) for processing templates of any other type

# Subsets
* this deployment framework defines the following JSON Output Type subsets:

## testcase
output format: null
output suffix: `testcase.json`
* created during the test case template pass (link)
* used for test case file creation by all testing providers (link to testing)

## cli
Output format: null
Output suffix: `cli.json`
* created during the cli template pass (link)
* used for storing CLI arguments as JSON file
* 

## config
Output format: null
Output suffix: `config.json`
* created by the config template pass (link)

## parameters
Output format: null
Output suffix: `parameters.json`
* created by the parameters template pass (link) 
* used for creating parameter files that store parameter values outside of their associated templates

#work/tenants/gosource/hamlet/docs/engine/deployment-frameworks/outputs