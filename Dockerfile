# ------------------------
# Build the Hamlet Schemas
# ------------------------
FROM hamletio/hamlet:latest AS hamlet

RUN hamlet entrance -i mock -p aws -p awstest -p azure -p azuretest invoke-entrance -e schema -u component -o ~/schema \
    && hamlet entrance -i mock -p aws -p awstest -p azure -p azuretest invoke-entrance -e schema -u reference -o ~/schema \
    && hamlet entrance -i mock -p aws -p awstest -p azure -p azuretest invoke-entrance -e schema -u metaparameter -o ~/schema