# Welcome to Sunflower Land docs contributing guide

Thank you for joining our journey and helping us build the #1 Community Metaverse game

In this guide you will get an overview of the contribution workflow from opening an issue, creating a PR, reviewing, and merging the PR.

## New contributor guide

To get an overview of the project, read the [README](../README.md). Here are some resources to help you get started with open source contributions:

### Disclaimer

By contributing to this repository you provide Sunflower Land the ownership of any IP contributed to the project to use indefinitely. This includes code, discussions (ideas) and all types of artwork. While often designers and developers are rewarded with the NFTs and airdrops, there is no guarantee of reward.

You confirm you have the rights to the content you are contributing to the project.

## Getting started

Please read the [README.md](../README.md) for details on how to setup and run the repo locally.

### Issues

#### Create a new issue

If you spot a problem with the docs, [search if an issue already exists](https://docs.github.com/en/github/searching-for-information-on-github/searching-on-github/searching-issues-and-pull-requests#search-by-the-title-body-or-comments). If a related issue doesn't exist, you can open a new issue using a relevant [issue form](https://github.com/github/docs/issues/new/choose).

#### Solve an issue

Scan through our [existing issues](https://github.com/sunflower-land/sunflower-land/issues) to find one that interests you. You can narrow down the search using `labels` as filters. See [Labels](https://docs.github.com/en/issues/tracking-your-work-with-issues/filtering-and-searching-issues-and-pull-requests#filtering-issues-and-pull-requests-by-labels) for more information.

As a general rule, we assign features with deadlines to core team members. If a ticket is already assigned and you are passionate about it, please reach out to the developer on the issue comments and help them out.

## How can I help?

If you have a bright idea, open an issue or join our active Discord #devs-chat first and start a discussion. We love to bring in the community ideas where possible!

Don't have any ideas? We would suggest scanning the open issues and seeing if there is something that catches your eye.

You can search by labels as well to see which items are more urgent than others.

### Make Changes

#### Make changes locally

1. Ensure you have git installed locally

2. Fork the repository.

3. Create a working branch and start with your changes!

### Commit your update

Commit the changes once you are happy with them. We prefer atomic commits that are easily revertable.

> **TIP:** If your changes include **only** documentation updates/additions/deletions,
> make sure that you add below line to your commit message while commiting:
>
> **`[skip ci]`**
>
> This **_won't_** trigger the GitHub Actions CI Workflow in turn, it **_won't_** waste the resources. 🤗 🌏
>
> > E.g.
> >
> > ```
> > [CHORE] Update README.md
> > [skip ci]
> > ```

### Preparing to submit

Before you submit, ensure you have done the following:

- Manually tested your code by running the repo
- Written tests for any business logic code
- Provided sufficient comments on the code

### Pull Request

When you're finished with the changes, create a pull request, also known as a PR.

You will want to prefix the name of your PR with the category it falls under:

- [FEAT] Feature or enhancment
- [CHORE] Admin type work (scripts, documentation etc)
- [FIX] A bug fix

For example - "[FEAT] Craft a sausage"

- Once you submit your PR, a Sunflower Land team member will review your proposal. We may ask questions or request for additional information.
- We may ask for changes to be made before a PR can be merged
- As you update your PR and apply changes, mark each conversation as [resolved](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/commenting-on-a-pull-request#resolving-conversations).
- If you run into any merge issues, checkout this [git tutorial](https://lab.github.com/githubtraining/managing-merge-conflicts) to help you resolve merge conflicts and other issues.

When a PR is opened we run Github Actions to ensure the quality of the code is up to standards. This includes:

- Typescript check
- Jest (unit testing)

### Your PR is merged!

Congratulations :tada::tada: The Sunflower Land team thanks you :sparkles:.
