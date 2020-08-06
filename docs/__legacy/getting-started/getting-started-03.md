---
sidebar_label: review & deploy
title: Review & Deploy Infrastructure
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

`hamlet` has now placed your new cloud infrastructure template within your CMDB. Let's review it.

Because we've used a volume-mount on your running docker container to share your CMDB with the container, you can view the new template either in the container or in your favourite code editor from your computer.

<Tabs
    defaultValue="bash"
    values={[
        {label: 'container', value: 'bash'},
        {label: 'local computer', value: 'cmd'},
    ]
}>
<TabItem value='bash'>

```bash
vim /opt/codeontap/cmdb/msw-cmdb/djankywalks/state/cf/integration/default/baseline/default/seg-baseline-mswdev-westus-template.json
```

</TabItem>
<TabItem value='cmd'>

```bash
<hamlet_docs dir>/cmdb/<account>/<product>/state/cf/integration/default/baseline/default/seg-baseline-mswdev-westus-template.json
```

</TabItem>

</Tabs>
