---
sidebar_label: CLI
title: Hamlet CLI
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* The Hamlet CLI tool provides a helpful python wrapper around the core Hamlet repositories
* Though can be built from source, it is strongly encouraged to run Hamlet from its container
* 

# Usage
* Container publicly available from docker hub repository - just run `docker run -it --rm hamletio/hamlet:latest`
* More specific uses can be found in
	* the Jenkins section for CI integration
	* The developer environment setup section

# Click Overview
* What Click is 
* How the CLI is structured

# CLI Command Reference
* Supported Arguments /w available options
```bash 
// brief list of available commands
```

* All commands support `--help` flag for more information

# Shortcutting the CLI
* As the CLI is just a wrapper around the bash scripts in the Executor, some features newly implemented there may not yet exist in the CLI
* You can shortcut the CLI by executing the scripts directly with the CLI same arguments / options
	* `${GENERATION_DIR}/createTemplate.sh ... etc`

# Further Reading
* Link to Click docs