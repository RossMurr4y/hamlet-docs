---
sidebar_label: generate cloud templates
title: Generate Cloud Templates
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

With `hamlet` correctly reading from the CMDB, we now have everything required to begin generating the cloud infrastructure templates for our product. You may have recognised from the output of our earlier query - our CMDB defines the components necessary for a Single Page Application (SPA). 

TODO: Insert Mermaid graph of the SPA infrastructure here.

Now all we need to do is tell `hamlet` which of our templates we want to generate. The `baseline` component contains all the standard, non-network resources (that's another component!) that are required across deployments. Let's begin with that template.

<Tabs
    defaultValue="hamlet"
    values={[
        {label: 'hamlet container', value: 'hamlet'},
    ]
}>
<TabItem value='hamlet'>

```bash
cot create template \
    --level segment \
    --provider aws \
    --framework cf \
    --deployment-unit baseline

# run "cot create template --help" to see a full list of parameters.
```

</TabItem>
</Tabs>

Now let's break down what the arguments are here.

- **level** We'll cover Levels in depth during our [Tutorials](../tutorials/overview.md), but for now just know that segment level templates are deployed and updated first, because many if not all other templates will rely on their resources.
- **provider** Which Provider should your template be created for. This must match your CMDB, however more complex CMDB's may have multiple providers. the hamlet_demo CMDB is configured for AWS.
- **framework** Which framework within a Provider should the template create? This may be a simple choice if your Provider only offers the one Framework (such as a CLI) however if you have multiple options you could specify the precise framework here. AWS most commonly uses Cloud Formation templatates to deploy infrastructure with, so we've used that here.
- **deployment-unit** A Deployment Unit is an individual instance of a component. The names of these are defined within the CMDB. Here we've just used "baseline" for simplicity, but in an actual `hamlet` CMDB you would call this as you wish. Typically, something related to the component type is recommended.

Run the create command above now. Upon completion you should see a message confirming the successful creation of the template. Continue on to review the template.
