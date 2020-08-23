---
sidebar_label: devcontainer
title: VS Code .devcontainer
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* For those using VS Code, we recommend using the following `.devcontainer` environment for development
* This is particularly helpful for those on macOS who may experience a performance decrease whilst developing from outside of the container


# For Development
#### .devcontainer
```json
// incl. devcontainer file with only essential plugins
```

#### .code-workspace
```json
// incl. workspace file that clones the repositories into the correct structure from source and into .devcontainer vol mount
```


# For Production Workloads
* The following container is the same however uses separate environment variables to tell Hamlet to execute from the version of Hamlet setup in the container
	* This will prevent Production workloads being impacted by repo development branches
```json
// devcontainer
```
	
# How This Works
* Creates a volume mount to hold all the repos
* Clones all the Hamlet repos into that volume mount in the correct structure
* Creates the necessary environment variables to have Hamlet run
* Installs VS Code and listed recommended plugins _inside_ the container
* Links your local VS Code instance to the one inside the container

# Further Reading
* Links to VS Code Devcontainers
* Links to VS Code Workspaces

#work/tenants/gosource/hamlet/docs/contributing/developer-environment