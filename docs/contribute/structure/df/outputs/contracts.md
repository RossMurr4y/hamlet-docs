---
sidebar_label: contracts
title: Contracts
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* the Hamlet engine generates contracts that outline a series of tasks to perform
* Tasks can be sheduled and ordered through two mechanisms - Stages and Steps

## Contract Stages
* stages group steps and specify how each step is to be executed - either in parallel or serially 

## Contract Steps
* A contract step define a task that is to be executed and a collection of parameters to pass to the task executor at runtime

```json
// include basic contract
```

# Generation Contracts
* Generation Contracts are the contract (Link) that define the stages and steps that should be taken by the executor during template generation template pass (link)
* They use the process template pass task type
* Generation Contracts are a subset of the default output type (link) 

### Generation Contract Stages

#### Pregeneration
* if a `pregeneration` template generation pass (link) is required, a separate stage is also defined for it  as it must be run after the Generation Contract itself is created, but prior to all template generation passes .
* the `pregeneration` stage also includes a `generation` step, which creates the contract itself that is given to the Executor for action

#### Generation Contract Steps
* Generation Contracts define a step for each subset (link to docs) required during template generation

#### Example Generation Contract
```json
// example generation contract
```


# Deployment Contracts
* todo

#work/tenants/gosource/hamlet/docs/engine/deployment-frameworks/outputs