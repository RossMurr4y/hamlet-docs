---
sidebar_label: repository index
title: Github Repository Overview
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

The following hamlet code repositories make up all current official content. For a higher level view of their structure and future changes, see the hamlet-io [projects page](https://github.com/orgs/codeontap/projects).

| Name                  	| Category 	| Description                                                                                                 	| Roadmap Project                                                	|
|-----------------------	|----------	|-------------------------------------------------------------------------------------------------------------	|----------------------------------------------------------------	|
| cloudinit-aws         	| hamlet   	| Also known as "Startup", this repository contains plugin content for bootstrapping AWS infrastructure.      	| [hamlet roadmap](https://github.com/orgs/hamlet-io/projects/4) 	|
| docker-hamlet         	| docker   	| Contains the Dockerfile and associated scripts required to build the hamletio/hamlet docker image.          	| [hamlet roadmap](https://github.com/orgs/hamlet-io/projects/4) 	|
| docs                  	| docs     	| the official hamlet documentation (this site), running on the Docusaurus v2 framework.                      	| [hamlet roadmap](https://github.com/orgs/hamlet-io/projects/4) 	|
| engine                	| hamlet   	| integral to hamlet, the engine creates the generation contract for a deployment unit.                       	| [hamlet roadmap](https://github.com/orgs/hamlet-io/projects/4) 	|
| engine-core           	| hamlet   	| a CLI wrapper for the freemarker template engine. Used by hamlet to interpret freemarker.                   	| [hamlet roadmap](https://github.com/orgs/hamlet-io/projects/4) 	|
| engine-plugin-aws     	| hamlet   	| a hamlet plugin to be utilised within the engine for generating content specific to AWS.                    	| [hamlet roadmap](https://github.com/orgs/hamlet-io/projects/4) 	|
| engine-plugin-azure   	| hamlet   	| a hamlet plugin that enables the generation of content specific to Microsoft Azure. Currently supports ARM. 	| [hamlet roadmap](https://github.com/orgs/hamlet-io/projects/4) 	|
| executor-bash         	| hamlet   	| A code executor utilised by hamlet - enables the execution of bash content.                                 	| [hamlet roadmap](https://github.com/orgs/hamlet-io/projects/4) 	|
| executor-cookiecutter 	| hamlet   	| An executor for 'cookiecutter'. Extends hamlet to re-use architectural patterns.                            	| [hamlet roadmap](https://github.com/orgs/hamlet-io/projects/4) 	|
| executor-python       	| hamlet   	| A python executor. Extends hamlet with a python CLI based on 'Click'.                                       	| [hamlet roadmap](https://github.com/orgs/hamlet-io/projects/4) 	|