---
sidebar_label: workspace setup
title: Container Workspace Setup
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Using the official docker container for hamlet is the simplest and fastest way to get set up and using hamlet. Following the User Setup section below will get typical users up and running immediately. For those who perform a lot of work in hamlet, there are also a few optional quality-of-life actions that will allow you to navigate hamlet faster.

## Pre-Requisites
- [Docker](https://docs.docker.com/install/)

## User Setup

If you are looking to develop templates for a supported provider with hamlet - i.e typical usage - then you will only require the docker container image to get started. You will want to follow the instructions below for setting up a volume mount, to place your CMDB directory inside of the docker container on run. Whether or not the CMDB's exist yet or not, set this up now as an alias (see below) so that when you do create it, hamlet can load it immediately, no more setup required.

### Steps
1. Ensure docker is installed.
2. Pull the latest docker image with `docker pull hamletio/hamlet:latest
3. Pick and/or create a directory for your CMDB's to live on your computer
4. Run hamlet with `docker run --it --rm --volume <cmdb-dir>:/hamlet/cmdb hamletio/hamlet:latest`

5. **Optional** - Follow the sections below to setup an Alias, so you don't have to remember the above command
6. **Optional** - Once you have a CMDB setup, consider adding the Workdir into your Alias so the container loads directly into your CMDB.

## Framework or Plugin Developer Setup

Similarly to a typical hamlet user workspace, whether you are setting up a workspace to start work on hamlet for the first time or just have a new computer, you will want to follow the steps below for setting up an alias that includes bind mounts for your CMDBs. Additionally, for every hamlet code repository you are working on - be it any of the official hamlet-io repositories or your own plugins - you will want to ensure that when the container is run that it is your working copy of the repository that hamlet loads, not the one already installed inside the container. To accomplish this we use additional docker volume mounts to place your local framework/plugin repository into the container. When a directory is mounted into a container, any directory with a matching name to the mounted directory is hidden behind the mounted directory. In this way you can develop locally on your machine on the framework or plugin and immediately test it out inside the docker container.

### Example
Imagine a scenario where you wish to perform some changes to the hamlet-io/engine repository. It is a fundamental piece of hamlet and as such it has been installed into the docker container. When within the container this repository's contents can be found at the path `/opt/hamlet/engine/core` and this path is also set to the Environment Variable `GENERATION_ENGINE_DIR`. hamlet will use this environment variable to find the contents of the repository, so you have two options: 

| Example 	| Description                                                                                                                                                                                                  	|
|---------	|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| 1       	| volume-mount a local copy of the engine-core repository directly on top of the container path ` /opt/hamlet/engine/core` (preferred)                                                                         	|
| 2       	| volume-mount a local copy of the engine-core repository elsewhere in the container, and additionally tell the container to update the ` GENERATION_ENGINE_DIR` to the container path of your mounted volume. 	|

<Tabs
    defaultValue="example1"
    values={[
        {label: 'Example 1', value: 'example1'},
        {label: 'Example 2', value: 'example2'},
    ]
}>
<TabItem value='example1'>

```bash {3}
docker run --it --rm \
    --volume <cmdb-dir>:/hamlet/cmdb \
    --volume <local-engine-core-directory>:/opt/hamlet/engine/core \
    hamletio/hamlet:latest
```

</TabItem>
<TabItem value='example2'>

```bash {3,4}
docker run --it --rm \
    --volume <cmdb-dir>:/hamlet/cmdb \
    --volume <local-engine-core-directory>:/opt/myawesomedirectory \
    --env GENERATION_ENGINE_DIR=/opt/myawesomedirectory \
    hamletio/hamlet:latest
```

</TabItem>
</Tabs>

<Admonition type="tip" title="Volume Mounts and Environment Variables">
    For every additional repository that you wish to work on inside of the container you will need to add corresponding volume mounts and - if not placing the volume mount over the top of an existing directory - corresponding Environment Variables. A list of all environment variables can be found below.
</Admonition>

## Alias (Optional)

Depending on how many volume mounts and environment variables you're going to be using, the command to start up the container may be quite lengthy. Using an alias is an effective way to run the same command every time. Instead of writing the full command you can now run a single word of your choosing.

**Note** that `$(pwd)` is used to reference the current working directory.

| Example 	| Description                                                                                                                                                                                                                                                                                                                                                                                                                                                              	|
|---------	|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| 1       	| Create an alias called "hamletgo" that: a) navigates into my desired CMDB directory; b) uses a single volume mount to place my CMDB inside the container at the expected location.                                                                                                                                                                                                                                                                                       	|
| 2       	| Create an alias called "hamletrun" that: a) changes into a local copy of the engine-core hamlet repository; b) uses an additional volume mount to mount the local engine-core "in front" of the installed version of that repository inside the container.                                                                                                                                                                                                               	|
| 3       	| Create an alias called "hamletstart" that: a) changes into the root of a hamlet project directory that contains a number of hamlet-io repositories. b) As I've previously set up my project directory to mimic the directory tree of the container, this alias mounts them all with one volume mount. Any directories that exist are mounted "in front" of their counterparts, and any that I haven't cloned locally are covered by those existing within the container. 	|
| 4       	| Create an alias called "hamletup" that: a) Uses a volume mount to place a local engine-core repository into a non-standard location inside the container. b) Passes an environment variable to the container, overriding the variable that exists inside the container with the updated volume mount path.                                                                                                                                                               	|

<Tabs
    defaultValue="example1"
    values={[
        {label: 'Example 1', value: 'example1'},
        {label: 'Example 2', value: 'example2'},
        {label: 'Example 3', value: 'example3'},
        {label: 'Example 4', value: 'example4'},
    ]
}>
<TabItem value='example1'>

```bash {4}
alias hamletgo="
    cd ${cmdb-path} && \
    docker run --it --rm \
        --volume $(pwd):/hamlet/cmdb \
        hamletio/hamlet:latest"
```

</TabItem>
<TabItem value='example2'>

```bash {5}
alias hamletrun="
    cd ${engine-core-path} && \
    docker run --it --rm \
        --volume ${cmdb-path}:/hamlet/cmdb \
        --volume $(pwd):/opt/hamlet/engine/core \
        hamletio/hamlet:latest"
```
</TabItem>
<TabItem value='example3'>

```bash {2,5}
alias hamletstart="
    cd ${hamlet-project-dir} && \
    docker run --it --rm \
        --volume ${cmdb-path}:/hamlet/cmdb \
        --volume $(pwd):/opt/hamlet \
        hamletio/hamlet:latest"
```
</TabItem>
<TabItem value='example4'>

```bash {5,6}
alias hamletup="
    cd ${cmdb-dir} && \
    docker run --it --rm \
        --volume $(pwd):/hamlet/cmdb \
        --volume ${engine-core-path}:/opt/myawesomedirectory \
        --env GENERATION_ENGINE_DIR=/opt/myawesomedirectory \
        hamletio/hamlet:latest"
```

</TabItem>
</Tabs>

```bash
# source the ~/.bashrc file afterwards, so the alias is immediately available.
source ~/.bashrc
```

## Paths & Environment Variables Reference

Whether you are using the docker container or your local environment, the following environment variables will need to be set. If you are in the container, they will already be set to the defaults. If your repo structure is not the same as defined in this guide then you will need to pass the `-e <env variable>` flag to the `docker run` command in order to pass updated Environment Variables into the container.

| Repository          	| Env Variable           	| Container Mount Path                        	| Notes                                                                    	|
|---------------------	|------------------------	|---------------------------------------------	|--------------------------------------------------------------------------	|
| executor-bash       	| GENERATION_BASE_DIR    	| /opt/hamlet/executor                        	|                                                                          	|
| executor-bash       	| GENERATION_DIR         	| /opt/hamlet/executor/cli                    	|                                                                          	|
| engine              	| GENERATION_ENGINE_DIR  	| /opt/hamlet/engine/core                     	|                                                                          	|
| engine-plugin-aws   	| GENERATION_PLUGIN_DIRS 	| /opt/hamlet/engine/plugins/aws              	| The Env Variable is a semicolon-delimited list of plugin directories.    	|
| engine-plugin-azure 	| GENERATION_PLUGIN_DIRS 	| /opt/hamlet/engine/plugins/azure            	| Load multiple plugins with `export GENERATION_PLUGIN_DIRS=<dir1>;<dir2>` 	|
| cloudinit-aws       	| GENERATION_STARTUP_DIR 	| /opt/hamlet/startup                         	|                                                                          	|
| executor-bash       	| AUTOMATION_BASE_DIR    	| /opt/hamlet/executor/automation             	|                                                                          	|
| executor-bash       	| AUTOMATION_DIR         	| /opt/hamlet/executor/automation/jenkins/aws 	|                                                                          	|

## Additional Docker Arguments (Optional) 

If you are always working with the same Account and/or CMDBs, adding the following additional arguments to your docker commands (or alias!) will be a big time saver.

| Argument                     	| Usage                                                                                                     	|
|------------------------------	|-----------------------------------------------------------------------------------------------------------	|
| --env ACCOUNT=< cmdb-account > 	| Sets the environment variable ACCOUNT, which is used by hamlet to determine which account to run against. 	|
| --workdir < path >             	| Instructs docker to navigate you to the provided path upon loading.                                       	|
