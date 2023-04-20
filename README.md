# Getting Started

Welcome to your new project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`package.json` | project metadata and configuration
`readme.md` | this getting started guide


## Next Steps

- Open a new terminal and run `cds watch` 
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start adding content, for example, a [db/schema.cds](db/schema.cds).


## Learn More

Learn more at https://cap.cloud.sap/docs/get-started/.

##notes for kyma deployment

build for local
`cds build`

The detailed procedure is described in the Deploy to Cloud Foundry guide. Run this command to fast-forward:
`cds add hana,xsuaa --for production`

CAP provides a configurable Helm chart for Node.js and Java applications.
`cds add helm`


Build steps - https://developers.sap.com/tutorials/btp-app-kyma-deploy-application.html

CONTAINER_REGISTRY=<your-container-registry>
`CONTAINER_REGISTRY=dewdale`

build for production
`rm -rf node_modules package-lock.json`
`cds build --production`
`rm -rf gen/db/data`

create the srv and app image
`docker build -t dewdale/cpapp-srv .`
Above approached created issue in deployment as non-root user, however the UI was packed into srv layer. IN below approach, the UI needs to be deployed separately

pack build $CONTAINER_REGISTRY/cpapp-srv --path gen/srv \
--buildpack gcr.io/paketo-buildpacks/nodejs \
--builder paketobuildpacks/builder:base \
--env BP_NODE_RUN_SCRIPTS=""

create hana deployer image
`docker build -t dewdale/cpapp-hdi-deployer -f Dockerfile.hdi-deploy .`
Above approached created issue in deployment as non-root user

pack build $CONTAINER_REGISTRY/cpapp-hana-deployer --path gen/db \
    --buildpack gcr.io/paketo-buildpacks/nodejs \
    --builder paketobuildpacks/builder:base \
    --env BP_NODE_RUN_SCRIPTS=""


Test it in docker locally  
`docker run --rm -p 4004:4004 -t dewdale/cpapp-srv`

push images to repo
`docker login`
`docker push dewdale/cpapp-srv`
`docker push dewdale/cpapp-hdi-deployer`

#Deploy Helm chart

1. Create Subscrption instance of HANA Cloud via tool plan in BTP
2. Create HANA database going into the HANA cloud via sunscriptions
3. Obtain the kyma guid
`kubectl get cm sap-btp-operator-config -n kyma-system -o jsonpath='{.data.CLUSTER_ID}'`
4. Instance mapping in HANA DB -> Manage configuration
5. create HDI service instance from kyma
6. create service binding from kyma
7. In the db section of the srv module bindings, replace serviceInstanceName: hana with fromSecret: cpapp-schema-binding so that it points to the SAP HANA HDI container secret. the secret created in kyma will be the anem chosen for the service binding
 

#Deploy CAP Helm Chart

Review the helm chart
`helm template cpapp ./chart >new-helm-template.yaml`


This installs the Helm chart from the chart folder with the release name bookshop in the namespace bookshop-namespace.

`helm upgrade --install bookshop ./chart \
      --namespace bookshop-namespace
      --create-namespace`


Another version
`helm upgrade cpapp ./chart --install --set-file xsuaa.jsonParameters=xs-security.json`



FIORI UI

After using fiori generator 
https://developers.sap.com/tutorials/btp-app-kyma-work-zone-setup.html and correcting issue in manifest wwith forum siggestion in https://answers.sap.com/questions/13564516/error-on-command-fiori-add-deploy-config-cf.html
by Manju to replace the manifest.sjson for risk and mitigation.


pack build $CONTAINER_REGISTRY/cpapp-html5-deployer \
     --env BP_NODE_RUN_SCRIPTS=build \
     --path app \
     --buildpack gcr.io/paketo-buildpacks/nodejs \
     --builder paketobuildpacks/builder:base

#Add the HTML5 Application Deployer to your Helm chart:

Upgrade @sap/cds-dk to @sap/cds-dk: 6.7.1 to for 
`cds add html5-repo` feature support



