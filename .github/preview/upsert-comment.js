/* eslint-env node */
// Create or update the single sticky "PR preview" comment on a pull request.
// Loaded by actions/github-script in preview-deploy.yml / preview-cleanup.yml:
//
//   const upsert = require(`${process.env.GITHUB_WORKSPACE}/.github/preview/upsert-comment.js`);
//   await upsert({ github, context, core }, prNumber, body);

const MARKER = "<!-- sfl-pr-preview -->";

module.exports = async function upsertPreviewComment(
  { github, context, core },
  prNumber,
  body,
) {
  const { owner, repo } = context.repo;
  const fullBody = `${MARKER}\n${body}`;

  const comments = await github.paginate(github.rest.issues.listComments, {
    owner,
    repo,
    issue_number: prNumber,
    per_page: 100,
  });

  const existing = comments.find(
    (comment) =>
      comment.user?.type === "Bot" && comment.body?.startsWith(MARKER),
  );

  if (existing) {
    await github.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existing.id,
      body: fullBody,
    });
    core.info(`Updated preview comment ${existing.id} on #${prNumber}`);
  } else {
    const { data } = await github.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: fullBody,
    });
    core.info(`Created preview comment ${data.id} on #${prNumber}`);
  }
};
