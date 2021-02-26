---
title: "Buffalo Box"
date: "2021-02-07"
---

For [Buffalo Startup week 2020](https://emamo.com/event/buffalo-startup-week-2020), one of my friends was the coordinator and asked me to give a talk, and boy did I give one!

If you weren't there or were curious how the actual **talking** went, here's the youtube link since it was recorded:

https://www.youtube.com/watch?v=bcOxAyzabb0

All the docs below were transfered from the markup nested directly in the Repo I created for the presentation.

https://github.com/BailyTroyer/buffalo-startup-week-2020

## Bflo Box

### An overview

You just made your billion dollar startup idea but you only have it running on localhost. Where do you go from there? Do you pay monthly for Heroku or Netlify? What if you could manage it all on your own while saving monies?

This repo will go through deploying an API and React App running on localhost to a live running .com domain. We’ll use tools including Docker, Make, Github Actions, ECR, Route53, Cloudfront and more!

Before we get our hands dirty let's go through what we're building exactly...

Alrighty - let's say you're a new Buffalo based startup called "BuffBox." You're a next generation subscription service that ships out Buffalo themed swag, food and more! Sweet :chicken-wing: :buffalo:

You and your dev team just created a sweet website in React, and a backend API in Golang. It all works on localhost:3000 and localhost:8080 however your customers can't view anything ... because bflobox.com doesn't exist!

So we need to somehow ship our code to a live environment that real users can interact and use 24-7. That's what we're going to do in this repo.

### The Process

1. (API) First let's make sure we're using version control: I personally love Github. After that we need to easily run our codebase from anywhere; and I mean anywhere. On Linux, Ubuntu, Centos, MacOS, or your grandmas Windows XP laptop XD. To do so we'll use a fancy containerization tool called Docker. You've probably heard of it, and if you haven't that's ok (I guess patrick wasn't the only one living under a rock).

2. (API) Once we have our services containerized, we're going to want to store our image remotely so we can run it in a production environment later!. For that we'll use ECR to privately store our bundled application.

3. (API) The next series of steps sort of fall in place in parallel. We're going to dive into AWS and see how we can run our docker image in a Kubernetes cluster. Similarlly we're going to want to easily access this service using our domain name we bought: bflobox.com. To do so we're going to interact with some AWS services: Route53 & ELB. More on that later.

4. (API) At this point, a. we've built our image b. stored it remotely c. ran it remotely in a cluster exposed by an elastic load balancer which sits behind our public facing DNS entry for bflobox.com. Woah!

5. (API) What happens next? What if we push a new update to the site? Do we have to manually go through that process again?? What if we could easily "do all the things" but only when we push code to our trunk in Github (i.e. the main/master branch)? We'll use Github Actions, Github's version of CI/CD.

6. (Web) Great, our API is running at api.bflobox.com. What about our website? Since we want to build assets and serve them like any other website, we're going to use S3 as our storage with CloudFront as our delivery method.

## Getting Started

This part is really quick, but I wanted to make sure we're all on the same page that you need some form of version control if you're going to be successful. And trust me, I'm not overexaggerating.

Having a predefined trunk, and feature/bug branches that are PR'ed into your main branch is highly essential in making sure no unwanted features or code get out into production, because keep in mind we're using CI/CD and anything that merges to master goes to a real environment.

Also, you'll see a .github/ directory at the root of this repository which contains not only our CI/CD pipeline, but a CODEOWNERS file and a PULL_REQUEST_TEMPLATE which is very nice to have. This way maintainers can be added to PRs, and every PR you create has fields you just need to add text to. Its that simple 🎉

Alright, I promised this would be short. Onto the next phase -> Docker!

## Docker Build

### Intro 

Now that we're on the same page about git and some best practices let's dive into getting our stuff hosted somewhere!

If you haven't already noticed the `example/` directory at the root of this repo take a chance to get slightly familiar with what we're deploying. You don't have to understand what language/framework they're using, but be aware that we have **both** an API and a webapp. One has a dev server that runs on `localhost:3000` and the other runs regularly on `localhost:8080`. Note the webapp will __not__ run on a port in production, rather we'll build static assets and ship them to a remote bucket that we'll host on a CDN, or, content delivery network. More on that later...

### Building With Docker

Let's first start with the API located in [example/api](../example/api). This is a simple Go API that runs on localhost:8080. If you're not familiar with Go, you probably don't have it installed and that's more of a reason why we're using Docker! Not only does it make deploying easier, but it also makes developer onboarding much simpler since you don't have to worry about dev dependencies, you just need Docker installed (docs on installing docker can be found [here](https://docs.docker.com/get-docker/)).

1st we're going to need a `Dockerfile` to containerize and "bundle" our service and all of its dependencies. Think of Docker as a Virtual Machine that runs its own operating system separate from your host machine (technically containerization uses the same kernel as the host, but we won't talk about that here).

The basic "commands" or keywords you'll want to know and understand are:

1. `FROM` - this is the base image you're Dockerfile is based off-of. There's an "app store" full of nifty base images you can use on Dockerhub that have most of the heavy lifting already done for you. Common examples are golang, python, alpine, node and much much more!

2. `WORKDIR` - you're stuff is going in a directory somewhere right? this just sets that :)

3. `COPY | ADD` - the whole point in creating a Dockerfile is to run some code from your machine in a "container". This simply copies your local code and places it where you specify in the image.

4. `RUN` - depending on your usecase you might want to install some dependencies in your image, from `go get ...` to `npm install` to base packages in the images OS using `apk, apt-get, yum`

5. `ENTRYPOINT | CMD` - this is the money maker here. This simply runs your app so when we eventually run your container, this command is what's being run. Think of this is the command used to start your application.

```
FROM base-image:tag-name

WORKDIR some/image/directory

COPY local/path image/path

RUN some command maybe apt-get, yum install, apk add?

ENTRYPOINT ["path/to/binary"]
```

From there once our Dockerfile is built we can build the image by running the following:

```
$ docker build -t api:latest -f Dockerfile . 
```

In english we are docker `build`ing, `-t` tagging our image as api:latest and `-f Dockerfile` building the image based on the file we called Dockerfile.

Once built you'll see the following successful message:

```
...
Removing intermediate container f1009d955d22
 ---> 7d34317b688c
Successfully built 7d34317b688c
Successfully tagged api:latest
```

After that we can simply run our container like so:

```
$ docker run api:latest
```

From there we should be able to go to `localhost:8080` and see our API running....

...

...

OK, I wasn't so honest :( we forgot one thing. We want to port forward the running app in our container to an open port on our machine. Simply add the following argument to our run statement above `-p 8080:8080` which would make for `docker run -p 8080:8080 api:latest`

Sweet :tada:

Remember when I said there was a fancy "app store" for docker images that houses tons of pre-built nifty images you can use? We're going to host and store this image we just made in AWS using a tool called ECR, or, Elastic Container Registry. Its essentially a private version of docker hub, since I doubt you want random people pulling your api image and stealing your precious startup code ;)

We'll dive into creating the registry next since we need an AWS account however for the sake of doing all things docker right here and now you would essentially run the following to push your image to your registry.

```
$ aws ecr create-repository --region us-east-1 --repository-name bflobox-api
$ docker tag api:latest ECR_REGISTRY_URL/api:latest
$ docker push ECR_REGISTRY_URL/api:latest
```

:tada: :allthethings:


## AWS Overview

### Intro

This probably seems pre-mature, however, we're going to need to talk about it sooner-or-later. AWS a.k.a Amazon Web Services.

You've probably used Amazon, and you've probably heard of the internet right? We'll roughly 40% of it runs on AWS [reference](https://www.theverge.com/2018/7/28/17622792/plugin-use-the-internet-without-the-amazon-cloud).

Today, right now, in a few minutes we're going to use AWS to create some resources to run our API and website. And its gonna be cheap, really cheap. And its gonna be freakin' awesome. Alright let's go!

### Create An Account & Login

It comes as no surprise, you're going to need to create an account. You can start [here](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/). Make sure you turn on billing alerts, just for the peace-of-mind; I know I have. 

You're also going to want an "Admin" IAM user you can use at the CLI level that has access to tools we're going to use. Its' not the best but for the sake of time feel free to create a user called admin that has the following permissions:

* AmazonEC2FullAccess
* IAMFullAccess
* AmazonEC2ContainerRegistryFullAccess
* AmazonS3FullAccess
* AmazonVPCFullAccess
* AmazonRoute53FullAccess

After that you should have an access and secret key you can use to confugre the AWS CLI. 

### AWS CLI

We're going to use the AWS CLI more often than the console since its quick, easy and much easier to show in a markdown file than tons of screenshots. You can easily configure the AWS CLI [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).

For my examples I have an `admin` user in my `~/.aws/credentials` file that has access to all the permissions I listed above. 

### What's next?

We just built our API and pushed it to ECR. That's great progress but there's much more to be done. Let's quickly go over what we have left to go over to get our stuff up-and-running live.

1. Run our API in k8s, exposing our service running on port `8080` behind an AWS ELB
2. Register our domain, create a hosted zone, and generate a TLS cert
3. Back-track, and get our website stored in an S3 bucket, hosted on a global CDN using CloudFront.

## DNS

### Overview

DNS is one of those things that's not really technical but you just need to get done. You've probably heard of GoDaddy and Google Domains, but you can also easily purchase domains directly in AWS within Route53. I personally prefer this since you can easily interact with your domain, create hosted zones and TLS certs without having to import a domain from a 3rd party. 

For this example we're interacting with a domain `bflobox.com` which I personally bought on AWS for $12/year. 

### Buy a Domain (Route53)

Head over to **Route53 > Domains > Register Domain** search for an available domain, **Add to cart** and then press **continue**, enter your personal information (don't forget to enable privcy protection), press **continue** and then press **complete Order**. Welcome! You're now a proud owner of a domain!

**Note:** More detailed information on purchasing a domain on Route53 can be found [here](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-register.html).

### Create a Hosted Zone

Assuming you purchased a domain via Route53, you should have a hosted zone already created named after the domain you bought. For me its `bflobox.com`. This hosted zone is the catch all bucket for adding DNS entries to your domain name. You can add more hosted zones, add single entries and tons of more like performing DNS swaps between multiple hosts and much more!

In the next section we're going to create another hosted zone for our Kubernetes cluster, so keep this tab open.

### Create a TLS Cert

While we're doing DNS configuration we're probably going to want to create a certificate so we can run everything with `https` prepended. To do so we just need to press a few more buttons in the AWS console.

Navigate to the AWS service **Certificate Manager**, select **request certificate > Request a public certificate** and then enter the following 2 domain names:

* `*.domain.com` - for me it was `bflobox.com`
* `domain.com` - for me it was `*.bflobox.com`

The wildcard (*) simply allows us to attach a cert to any subdomains off-of `bflobox.com` if we want other domains such as `api.bflobox.com`, `www.bflobox.com`, `dev.bflobox.com`, etc.

Upon creating a cert, you're going to need to validate your certificate. Select the DNS option as opposed to an email address since it tends to be much quicker. 

### Create a DNS Entry

From there you're going to need to add an entry in Route53 for a random wacky validation entry used by Certificate Manager to validate the cert created. 

For me my entry looked like this `asdffdsfdafds.bflobox.com. ` with a value of `fdafdsa.fdsafd.acm-validations.aws.`

To add that entry go back to **Route53**, select **Hosted Zones > {YOUR HOSTED ZONE} > Create record**. Check **Simple Routing > Define simple record** and add your subdomain entry which was `asdffdsfdafds.bflobox.com.` or more specifically just `asdffdsfdafds` and then for **value/Route traffic to** choose IP address or another value depending on record type.

After that select **CNAME** and enter the value you were given back in Cert Manager which looked like `fdafdsa.fdsafd.acm-validations.aws.`

Select **Define Simple Record > Create Records** and then grab a coffee. This takes a few minutes. After that you should be all green and that cert is setup and ready-to-use. 

## KOPS

### Overview

Now that we have our API running in a Docker environment, with an image stored in ECR we need to run that somewhere. For sake of time and monies, we're going to evaluate [KOPS, or, Kubernetes Operations](https://github.com/kubernetes/kops). Its a very very helpful tool used to spinup Kubernetes clusters without using a managed service like GKE or EKS. Why would we not just use EKS? Mainly becuase `You pay $0.10 per hour for each Amazon EKS cluster that you create` which is absolutely disappointing since that would be roughly $70/month for just operating a cluster with no nodes... that's the price of two t2.medium nodes :(

So to save time and money we can easily create a k8s cluster with a few commands and get up and running in no time. 

### Install & Configure our KOPS Cluster

More information on what we're about to do can be found [here](https://kubernetes.io/docs/setup/production-environment/tools/kops/).

You can easily install kops using brew:

```
$ brew update && brew install kops
```

Once installed let's make a Route53 hosted zone for our cluster. I used `dev.bflobox.com` but feel free to use whatever you prefer. You can easily create a hosted zone in Route53 by selecting **Create Hosted Zone** and entering the required fields. 

With our hosted zone configured, lets create an S3 bucket to store our cluster configurations generated and managed by KOPS. I used the domain name `clusters.dev.bflobox.com`, but, it's a free country use whatever you prefer!

Create an S3 bucket by going into the S3 console, selecting **Create Bucket** and entering in your bucket name. Feel free to use all the default configurtions since we want this bucket to be private. 

With our S3 bucket created export the following environment variable for KOPS and create the cluster like below.

It will by default create one master node based on a t3.medium and two worker nodes that are also t3.mediums. These nodes cost roughly $30/month, so feel free to use small or micros if you prefer. I used a small since this example service won't get tons of traffic. 

```
$ export KOPS_STATE_STORE=s3://clusters.dev.bflobox.com
$ kops create cluster --zones=us-east-1c useast1.bflobox.example.com

// run edit if you want to change the node type to something cheaper :)
$ kops edit ig --name=useast1.dev.example.com nodes

$ kops update cluster useast1.bflobox.example.com --yes
```

Once created you can run the following and go grab a coffee while everything spins up:

```
$ kops validate cluster --wait 10m
...
NODE STATUS
NAME				ROLE	READY
ip-{HIDDEN}.ec2.internal	node	True
ip-{HIDDEN}.ec2.internal	node	True
ip-{HIDDEN}.ec2.internal	master	True

Your cluster useast1.dev.bflobox.com is ready
```

Sick! We have a Kubernetes cluster now!!!

## Web App

### Overview

I won't lie, our happy little webapp hasn't had as much love as you probably imagined. After all its the one customer facing piece of software your users care about. However, quite frankly its easy as sh** to deploy a webapp in 2020. Like, **really really** easy. And I'm not talking about using Heroku or Netlify, we're going to use AWS and its going to be great. Let's go!

### Intro To Codebase

Let's first head over to the webapp in [example/bflobox](https://github.com/BailyTroyer/buffalo-startup-week-2020/tree/master/example/bflobox). This is a simple React app that runs on `localhost:3000` when running the dev server.

Assuming you have yarn installed locally (if not you can [here](https://classic.yarnpkg.com/en/docs/install/#mac-stable)) go ahead and start the app like below. Note once you run `yarn start` your browser should pop up with localhost automatically. 

```
$ yarn install
$ yarn start
```

:tada:

Welcome to the frontend of our new startup ;) It's not much but once we figure out how to deploy and setup CI/CD you can just run with it!

### AWS CloudFront

So before we were running a dev server that automatically bundles and runs your application with hot-reload enabled. This is **not** how we're going to deploy to production. Instead we are going to bundle (more information on that [here](https://reactjs.org/docs/code-splitting.html)) which essentially turns all of your react-specific javascript code into viewable HTML that users can view without having React installed. It's really nice.

Thankfully `create-react-app` (the tool used to bootstrap this project) comes with a fancy yarn command to bundle the static assets that we need to "put somewhere." Just run `yarn build` and you should see a new directory `build` with an `index.html` inside. This is what we're going to deploy to production.

To do so, we're going to push the following build directory to S3, and then host it behind a CDN (Content Delivery Network). More information on CDNs can be found [here](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/).

First we need an S3 bucket, which can be done really simply by following this doc. After that all we need to do is copy our built assets and push them up to our bucket like so. 

**Note:** In this case our s3 bucket is called www.bflobox.com.

```
$ aws s3 sync ./build s3://www.bflobox.com --cache-control max-age=30
```

You're going to want to create a bucket policy with the following information to allow anonymous read acess since this is a public website:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::{S3_BUCKET_HERE}/*"
        }
    ]
}
```

From there all we need to do is create a CDN in CloudFront, which can be easily done in the console under **CloudFront > Create Distribution > Web (Get Started)**

From there you will need to configure the following parts:

* Origin Domain Name - 
* Origin Path - 
* Viewer Protocol Policy > Redirect HTTP to HTTPS -
* Distribution Settings > Price Class - I only used US, Canada & Europe since its cheaper
* Alternate Domain Names (CNAMEs) - for this I used www.bflobox.com & bflobox.com since not everyone uses www anymore :(
* SSL Certificate > Custom SSL Certificate > Select your cert we made in p4-dns

Then select **Create Distribution** ... 

From there your distribution will have a domain name that goes directly to our webapp example that we pushed to s3. The last final touch would be creating a `CNAME` Route53 entry for www.bflobox.com and bflobox.com that maps to our distributon: `fdsaffdafds.cloudfront.net`

## Kubectl/Helm

### Overview

As of right now, we have our website running in a global CDN, and our API bunded and store in ECR. Time to meet Kubernetes, one of the largest and biggest open source projects in the world that has blown up the industry since July 21, 2015. I'm not sure if there's a metric on % of the internet running on k8s but I bet its a sizeable amount (except for legacy boomer companies and Government related contractors/agencies).

### Kubernetes

Before in [Section 5](p5-kops.md) we created a k8s cluster with KOPS, and just left it hanging. Now we get to play and interact using a very handy CLI: `kubectl` ([link](https://kubernetes.io/docs/tasks/tools/install-kubectl/) to install).

I won't go into **too** much depth on Kubernetes, kubectl and its resources since we are limited for time however here we go:

So previously we created a Docker container that runs our application bundled inside its own "virtual environment" with its own operating system and dependencies pre-packaged and ready-to-use. Now that's great and all, but docker alone doesn't really solve our problem in wanting to host a highly available, fault tolerant service. With Kubernetes we get several benefits on top of just running locally:

* A higher layer of abstraction to represent large meshes of microservices running in user-defined spaces, or, namespaces
* Automatic rolling deployments and straight forward configurations that allow us to specify a plethora of settings from number of replicas, health probes, secrets information, volume mounted data, and much much more
* A very large living open source community with thousands of articles, documentation and even companies that specialize in handling Kubernetes for you if you can foot the $$

Now aside from the business pitch in Kuberenetes, let's talk more specifics in what we're going to do with our simple API example. 

We're going to deploy a `Deployment` kubernetes resource with a `Service` resource exposing the Deployment's pod's port 8080 through an Elastic Load Balancer, or, ELB which we can then CNAME in route53 and expose to the rest of the world; yes that was a mouth full so let's digest what I just said. 

I didn't mention this before, but Kubernetes is made of a bunch of "resources" that specify the state of the world. The smallest `unit` in Kubernetes would be a Pod which is essentially your docker container but with a few bells and whistles. From there you have a `Deployment | StatefulSet | DaemonSet | CronJob | Job` which all wrap the Pod resource. There's tons of information on the internet explaining the use-case for each (Google it on your own) but for this example we need a Deployment. Why? Because our service can be easily replicated horizontally across multiple nodes and AZs and we don't care about any state since its just an API (any real state would exist in a DB not on disk in a volume). 

Even that above was a lot to take in, so let's take a brief tour of the cluster you should have made in Step 5.

One last thing, as I mentioned above namespaces are how we group anything and everything in Kubernetes. You could group it by domains in a SOA, or just have one main namespace for everything (**not recommended**).

```
// list namespaces in the cluster
$ kubectl get namespaces
bflobox           Active   30h
default           Active   30h
kube-node-lease   Active   30h
kube-public       Active   30h
kube-system       Active   30h

// get "everything in the namespace"
$ kubectl get all --namespace bflobox
NAME                               READY   STATUS    RESTARTS   AGE
pod/bflobox-api-8458b56d8f-skrzz   1/1     Running   0          29m

NAME                  TYPE           CLUSTER-IP       EXTERNAL-IP                                                               PORT(S)                      AGE
service/bflobox-api   LoadBalancer   100.71.182.220   fdsafd-fdsafds.us-east-1.elb.amazonaws.com   443:30294/TCP,80:31135/TCP   3h27m

NAME                          READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/bflobox-api   1/1     1            1           3h27m

NAME                                     DESIRED   CURRENT   READY   AGE
replicaset.apps/bflobox-api-8458b56d8f   1         1         1       120m

// get only pods
$ kubectl get pods --namespace bflobox
NAME                           READY   STATUS    RESTARTS   AGE
bflobox-api-8458b56d8f-skrzz   1/1     Running   0          30m
```

Right there we looked at all namespaces in the cluster, then all resources in our bflobox namespace, then did some filtering to just see the pods in our namespace. Remember, a pod is a runner container of the image we pushed to ECR.

In the Kubernetes world all of these resources are made up of `yaml` files that specify anything and everything about itself. From the ports it exposes, to the labels and annotations set, to the name and namespace its deployed to, to container level information like environment variables, secrets, the image URL, and much more. 

### Helm

Without going too deep in the kubernetes resources induvidually I figured it'd be easier to just go straight to Helm. Think of this as the package manager for Kubernetes, where you can easily install a whole bundle of resources (which are just plain yaml files) in one command. The structure is really simple `helm install {CHART_PATH} --name {NAME} --namespace {NAMESPACE}` and boom you can view, create and delete hundreds of yaml configurations with no sweat. 

It's a life saver whether you believe it or not. 

If you head over to [example/helm](https://github.com/BailyTroyer/buffalo-startup-week-2020/tree/master/example/helm) you'll see the helm chart I've created for our bflobox API. It has a `Deployment` and `Service` which are our kubernetes resources we'll use to deploy and expose the API running on `:8080`.

You can easily install the chart by running the following command which will simply install everything for you.

```
$ helm upgrade --install bflobox-api example/helm --namespace bflobox --set containers.bfloBoxApi.image.tag={ECR_IMAGE_TAG_HERE} --wait
```

## CI/CD

### Overview

I won't sell CI/CD to you because I have faith you understand its benefits and what it really provides for not only a startup but any development team. What I'm going to briefly touch upon is creating a pipeline in Github Actions.

Note you can find the example actions in `.github/workflows`; they run on PRs and merges to `master`

### Github Actions

I've broken this repo's CI/CD into two pipeline files: `master-ci-cd.yaml` and `pull-request.yaml`. One runs on merge to master, which updates the S3 buckets exposed through CloudFront, and our helm chart which is running live on a kubernetes cluster. 

If you take a look at the [master-ci-cd.yaml](../.github/workflows/master-ci-cd.yaml) you'll see a common theme in the pipeline:

* deploy presentation webapp
    * build static assets
    * push static assets
* deploy bflobox webapp
    * build image
    * build statoc assets
    * push static assets
* deploy API
    * build image
    * push image to ECR
    * helm upgrade

If you take a look at the [pull-request.yaml](../.github/workflows/pull-request.yaml) you'll see a common theme in the pipeline:

* lint & test web
    * build image
    * lint codebase
    * unit test codebase
* lint and test API
    * build image
    * lint codebase
    * unit test codebase

This is a common theme, and is often best practice when creating a CI/CD pipeline, where you build, lint, test and then once merged, push, deploy and upgrade the service. In production grade pipelines, you would also want to include monitoring to maybe a slack channel and add some post-deploy smoketests.

**Note:** More information and documentation on interacting with and building Github actions can be found [here](https://docs.github.com/en/free-pro-team@latest/actions).
