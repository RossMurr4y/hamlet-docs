---
sidebar_label: overview
title: Deployment Frameworks
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* Deployment Frameworks define the necessary routines, macros and functions (link to this section) to construct the output file types used by Hamlet to deploy to a chosen provider
* Not all provider frameworks expose the full potential of that provider
* by implementing multiple frameworks that interact with a provider, Hamlet is then capable of orchestrating the best, simplest or sometimes only method of a desired configuration
* hamlet can then incorporate cloud provider configurations no matter how they are offered to end users

* Hamlet internally uses the “default” deployment framework which is defined within the shared provider
* Additional Deployment Frameworks can be added to Hamlet by way of engine plugins (link)

# Deployment Framework Features
* Deployment Frameworks must define their output types
	* as well as all supporting functions and macros for their generation
* They also may optionally define data models (link to models docs) relevant to that provider and framework

# Official Deployment Frameworks
* “default” (link)
* Cloud Formation (link)
* Azure Resource Manager (link)