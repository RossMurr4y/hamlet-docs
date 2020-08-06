---
sidebar_label: aws
title: AWS Provider Plugin
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* Support of the AWS provider is made available to hamlet through the AWS provider plugin
* Within the plugin are the following deployment frameworks (link to def), components (link to def), references (link to def) and services (link to def) to deploy to AWS
* The following are a list of the engine content that is unique to the AWS provider plugin

# Deployment Frameworks
## Cloud Formation (CF)
* Cloud Formation stacks (link) are the primary template hamlet will generate for deployment to AWS

# AWS Supported Components
* Components supported by AWS can be viewed at the Components Index (link)
* Component reference data available here. (Provide link) 

# AWS Services List
* the AWS provider plugin utilises the following AWS Services in its component implementation.
* The Services are consumed by the hamlet engine and are not intended for end-user interaction directly.

* List all currently implemented Services
	* provide a link to their AWS documentation pages 


# AWS Testing Framework
* testing framework for the AWS provider
* Accompanies the AWS provider plugin

# Available Testing Types
* the following testing options are available for use on Hamlet’s that contain AWS-configuration

## Structural
* JSON match
	* Does a JSON Path match a specific value
* JSON length
	* length of an array at a given path
* JSON exists
	* does a JSON path exist
* JSON not empty
	* Is a given JSON path not empty

* Cloud Formation
	* Type Exists - Does a resource with a specified type exist
	* Output Exists - does a given output exist

## Tool-based Testing
* CFNLint for Cloud Formation linter
* CFNNag

#work/tenants/gosource/hamlet/docs/engine/providers