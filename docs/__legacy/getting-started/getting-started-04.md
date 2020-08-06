---
sidebar_label: update & re-deploy
title: Update & Re-Deploy
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

So now you've had a taste of creating a template and deploying it, lets show you how `hamlet` keeps your templates and infrastructure in alignment with your evolving projects.

We're going to swap into another **Account** now within the CMDB you've already downloaded. The new account mimics the one you've just created and deployed the baseline component for - except for one minor change. We've added a new Deployment Unit into the CMDB to reflect the growing nature of projects over time. Though you may never wish to change your templates, cloud providers introduce new features, deprecate outdated ones and otherwise continue to change and your project should evolve with it. But that doesn't mean the hamlet process changes.

<Tabs
    defaultValue="bash"
    values={[
        {label: 'hamlet container', value: 'bash'},
    ]
}>
<TabItem value='bash'>

```bash
# remove old account environment variable
unset ACCOUNT

# set new account environment variable
export ACCOUNT=mswdevupdated

# re-create the baseline template
cot create template \
    --level segment \
    --provider aws \
    --framework cf \
    --deployment-unit baseline
```

</TabItem>
</Tabs>

Now lets compare the two templates that we've created. Note that the new template will have a similar path, except the directory named after the account will have changed.

```
# initial baseline template.
<hamlet_docs dir>/cmdb/<account>/<product>/state/cf/integration/default/baseline/default/seg-baseline-mswdev-westus-template.json

# updated baseline template.
<hamlet_docs dir>/cmdb/mswdevupdated/<product>/state/cf/integration/default/baseline/default/seg-baseline-mswdev-westus-template.json
```

Can you see which resource has been added? And now as with template creation, template deployment is the same as it was before.

```
TODO
```