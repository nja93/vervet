# Vervet Alerts

![vervet](https://socialify.git.ci/nja93/vervet/image?description=1&descriptionEditable=Let%20the%20people%20know&font=Raleway&logo=https%3A%2F%2Fvervet.info%2Fimg%2Fvervet.png&name=1&owner=1&pattern=Circuit%20Board&theme=Light)

## Overview

Vervet alerts is a web application who's intent is to have a platform where users can alert other users based on entities called _Feeds_ which users can follow to get updates on.

This harkens back to a time where RSS Feeds were more common place and more often use, but whose usefulness has slightly waned with the rise of social media platforms and their marketing power.

The main goal of this product is to allow users to get exactly what they need without requiring them to waddle through a sea of content that may not be of interest (or harmful). This idea necessitates that the user is aware of the individual/business before patroning it.

## Deployments

Find the project live on [vervet.info](https://www.vervet.info)

## Authors

<a href="https://github.com/nja93/vervet/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=nja93/vervet" />
</a>

- Paul Wahome - [Github](https://github.com/Wakadaisho), [LinkedIn](https://www.linkedin.com/in/paul-wahome), [Twitter](https://twitter.com/PaulWahome_IX), [project blogpost](https://www.linkedin.com/posts/paul-wahome_vervetan-attempt-at-alerts-and-alliteration-activity-7130550837172420608-JH4r?utm_source=share&utm_medium=member_desktop)
- Lorna Chege - [Github](https://github.com/nja93) [LinkedIn](https://www.linkedin.com/in/lorna-njanja/), [Twitter](https://twitter.com/teletubbies254), [project blogpost]()

## Installation

```bash
git clone https://github.com/nja93/vervet.git
cd vervet
npm install
```

# Usage

To run the development server:

```bash
pnpm run dev:http
```

which will allow for facilites such as hot-reloading.

What is with the _dev:http_? That is the script that allows for a typical localhost server. But the application makes use of OAuth in its authentication cycle, and to make use of that in a local environment would require some fashion of self-signed TLS certificates. Good news! Next.js 13+ has a feature just for that!

A script is added for convinience and you guessed it:

```bash
pnpm run dev:https
```

to start the https script. This uses the command `next dev --experimental-https` (experimental at the time of writing -- Next.js v13.5.6) to generate self-signed certificates. You may need to allow this on some systems (looking at you Windows) with a confirmation dialog.
Read on the details [here](docs/1-Application%20Server.md).

# Documentation

Read more on the details of the project [here](docs).

# Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

# Related Projects

[Apprise](https://github.com/caronc/apprise)

# Licensing

Vervet is [MIT licensed](LICENSE)
