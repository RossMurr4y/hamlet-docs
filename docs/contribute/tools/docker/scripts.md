---
sidebar_label: scripts
title: Docker Scripts & Misc Files
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* The following scripts are used within the multi-stage docker build
* They keep some of the more complex logic out of the Dockerfiles

# azpipelines-agent/start
* installs and configures a self-hosted agent for Azure pipelines
	* [Azure Pipelines Agents - Azure Pipelines | Microsoft Docs](https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/agents?view=azure-devops&tabs=browser#install)

# base/build_hamlet.sh
* builds the core hamlet repositories from source, by:
	* feeds  `./config.json` to `jq` , which it uses to create a new script within the container - `clone.sh`
	* Make the new script executable
	* generate a new `version.json` file by reading from environment variables

# hamlet/shellprompt.sh
* Installs a pre-defined bash prompt
	* will appear for all users

# jenkins-jnlp-agent/jenkins-agent
* bash script that starts up the JNLP agent

```sh
# Usage jenkins-agent.sh [options] -url http://jenkins [SECRET] [AGENT_NAME]
# Optional environment variables :
# * JENKINS_TUNNEL : HOST:PORT for a tunnel to route TCP traffic to jenkins host, when jenkins can't be directly accessed over network
# * JENKINS_URL : alternate jenkins URL
# * JENKINS_SECRET : agent secret, if not set as an argument
# * JENKINS_AGENT_NAME : agent name, if not set as an argument
# * JENKINS_AGENT_WORKDIR : agent work directory, if not set by optional parameter -workDir
# * JENKINS_WEB_SOCKET: true if the connection should be made via WebSocket rather than TCP
# * JENKINS_DIRECT_CONNECTION: Connect directly to this TCP agent port, skipping the HTTP(S) connection parameter download.
#                              Value: "<HOST>:<PORT>"
# * JENKINS_INSTANCE_IDENTITY: The base64 encoded InstanceIdentity byte array of the Jenkins master. When this is set,
#                              the agent skips connecting to an HTTP(S) port for connection info.
# * JENKINS_PROTOCOLS:         Specify the remoting protocols to attempt when instanceIdentity is provided.
```

# jenkins-jnlp-agent/wait-for-it
* Evaluates the status of a given TCP host/port and if its busy, waits for it
```bash
Usage:
    $cmdname host:port [-s] [-t timeout] [-- command args]
    -h HOST | --host=HOST       Host or IP under test
    -p PORT | --port=PORT       TCP port under test
                                Alternatively, you specify the host and port as host:port
    -s | --strict               Only execute subcommand if the test succeeds
    -q | --quiet                Don't output any status messages
    -t TIMEOUT | --timeout=TIMEOUT
                                Timeout in seconds, zero for no timeout
    -- COMMAND ARGS             Execute command with args after the test finishes

```

#work/tenants/gosource/hamlet/docs/docker/scripts