---
sidebar_label: pulls
title: Submitting Pull Requests
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

# Pull Requests
* Hamlet is maintained using git-flow practices outlined below
* Contributing to one or many of the repositories is encouraged
	* But it is required you follow the following guidelines

# GitHub Flow
* create your own fork of repositories you wish to work on
	* Convention used throughout these docs is:
		* “upstream” = the hamlet-io repos.
		* “origin” = your fork in GitHub
		* “local” = your locally cloned fork
* Create a branch off of master
* Make changes accordingly
* Commit using the “Conventional Commit” practices
	* this makes documentation of changes per-Release much easier
* Submit a Pull Request from your branch on `origin` to `upstream master`
* PR will then be reviewed / commented on  - repeat until everyones happy
* A maintainer will then merge your PR

# New Features
* Please log a ticket against the appropriate repo for new features before you start work on them
* This will give the maintainers a chance to identify if the item is something that belongs in Hamlet or should be developed as a separate plugin

# PR Template
* The pull request template in Github should be completed for every PR
	* incl. adding appropriate labels
	* incl. adding to the Hamlet Project

# Documentation
* To ensure the Hamlet documentation is maintained, please ensure any PR submitted against a Hamlet repository has a matching PR to include/update relevant information in the Hamlet Docs repository.
* See the docs-site documentation for more information. Link
