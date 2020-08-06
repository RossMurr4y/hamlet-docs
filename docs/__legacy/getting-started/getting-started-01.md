---
sidebar_label: the hamlet CMDB
title: hamlet CMDB
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The CMDB is at the heart of `hamlet` and it is where we will define  all the infrastructure, their policies as well as how they talk to each other (known as links - but we'll get to that later). 

Our CMDB is what drives `hamlet`. Any changes we wish to see performed in our infrastructure are made here and **only** here. By updating our CMDB and then passing it on to `hamlet` to construct (and deploy, if you so wish) our cloud templates, we are free to stay focused on the big picture  - "I need a Web Application with a DataBase, and I need them to talk to eachother!" - and not the specifics of any single provider's dozen ways to implement that.

<Admonition type="tip" title="A note on the CMDB Language">
    hamlet CMDB's may be written in either JSON or YAML formats. Use the one you are most comfortable with.
</Admonition>

# Creating the CMDB

As this is a short introduction to `hamlet`, lets dive right in with a pre-configured example CMDB. You can learn more about the design and structure of the CMDB in our [Tutorials](./overview.md).

<Tabs
    defaultValue="bash"
    values={[
        {label: 'Bash', value: 'bash'},
    ]
}>
<TabItem value='bash'>

```bash
# setup a directory for our demo
mkdir hamlet_demo
cd hamlet_demo

# use git to download a copy of the demo CMDB
git clone hamlet/hamlet-demo #TODO
```

</TabItem>
</Tabs>

You should now be able to see our demo CMDB files in your hamlet_demo directory.

# Run the hamlet container

Now we've got our CMDB in order, we're ready to start up our `hamlet` docker container.

<Tabs
    defaultValue="bash"
    values={[
        {label: 'Bash', value: 'bash'},
    ]
}>
<TabItem value='bash'>

```bash
# start up an interactive copy of the hamlet container.
# Note that this uses a volume mount to share the demo directory.
docker run -it --rm -v ./hamlet_demo:/opt/cmdb -w /opt/cmdb hamlet/gen3:latest
```

</TabItem>
</Tabs>

The volume-mount in this docker command has just loaded the CMDB into the container where `hamlet` will be able to find it. To verify that this has worked, lets run a query against our CMDB.

<Tabs
    defaultValue="hamlet"
    values={[
        {label: 'hamlet container', value: 'hamlet'},
    ]
}>
<TabItem value='hamlet'>

```bash
# Set an Environment Variable to let hamlet know
# which Account we're working with.
export ACCOUNT=hamletdemo

cot query list-components
```

</TabItem>
</Tabs>

If you are seeing a list of common cloud components, you're ready to move on.