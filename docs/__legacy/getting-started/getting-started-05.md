---
sidebar_label: review
title: Review
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This has been a whirlwind tour of what `hamlet` has to offer. Let's recap what we've accomplished.

1. Created a concise CMDB that defines the infrastructure for our product. (Alright, so you had a bit of a help from us here. In our [Tutorials](../tutorials/overview.md) and [Reference](../reference/cmdb-reference.md) documentation we cover the CMDB design in-depth.)
2. Promptly generated the "baseline" Deployment Unit template for our chosen cloud provider and framework.
3. Deployed the "baseline" Deployment Unit into the cloud. 
4. Mimic'd the process you would go through to update your templates and keep them current with both `hamlet` and the cloud.
5. Updated your cloud infrastructure with your updated template.

<Admonition type="note" title="Remember">
    Though we only generated and deployed the one Deployment Unit template in this guide, the hamlet_demo CMDB is complete with all Deployment Units for a Single Page Application. Refer to your earlier `cot query list-components` results to see what else you can create and deploy.
</Admonition>

# Further Reading

To learn more about `hamlet` we recommend you progress to the [Tutorials](../tutorials/overview.md) which will cover off each of these steps in much greater detail. 

Once you are ready to begin authoring your own CMDB, take a look at our [Reference](../reference/cmdb-reference.md) docs or [Examples](../examples/big-data-analytics-aws.md) to get you started.

Don't forget to drop by the [Community](https://gitter.im/hamlet-io/community) channel either to talk all things `hamlet`.