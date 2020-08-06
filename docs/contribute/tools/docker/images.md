---
sidebar_label: images
title: Docker Images
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* Project’s docker images use a multi-stage build process to build each of the images
* Each image is defined within its own `Dockerfile` 
* The content and intent for each image is outlined below


# hamlet
* builds from base
* adds the hamlet user
* adds some quality-of-life updates like styled shell prompt
* Intended for development and production usage - intended for interactive usage
	* link to setting up docker articles

# base
* the origin base image for all others in the build process
* Installs on the bare minimum that will be used by all other images
* adds hamlet-centric env vars to container
* installs pre-requisite OS, python, npm packages
* clones in hamlet from source
* clones in the hamlet cli

# builder-meteor
* builds from base
* installs [Meteor](https://www.meteor.com/) 
* Intended for use in build pipelines - not intended for interactive use

### Environment Variables
* Configured with the following variables at runtime:
	* todo

### Example Usage
```sh
// simple example usage
```

# jenkins
* builds from base
* installs the JNLP agent
* designed to work with container-based cloud agents - not intended for interactive use

### Environment Variables
* Configured with the following variables at runtime:
	* todo

### Example Usage
```sh
// simple example usage
```

# azpipelines
* builds from base
* installs an Azure Pipelines agent
* used for CI/CD within Azure Pipelines - not intended for interactive use

### Environment Variables
* Configured with the following variables at runtime:
	* todo

### Example Usage
```sh
// simple example usage
```


#work/tenants/gosource/hamlet/docs/docker/images