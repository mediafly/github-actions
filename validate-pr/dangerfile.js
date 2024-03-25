'use strict';

// always import danger first
const { fail, warn, danger } = require('danger');

// danger-plugin-jira-issue exports a default function to hacking to get it imported
const jiraIssue = require('danger-plugin-jira-issue').default;
const _ = require('lodash');

const ALLOWED_ISSUE_TYPES = ['PS', 'INSIGHT', 'AI', 'CE', 'FOUND', 'COACH'];

const pr = _.get(danger, 'github.pr');

if (_.get(pr, 'user.type') === 'Bot') {
    warn('Skipping PR title validation since this is from a bot.  If you wish to merge this PR, please open an issue and update the title!');
    process.exit(0);
}

const title = _.trim(_.get(pr, 'title'))
let issueType;
let passed = true;

try {
    [issueType] = title.match(/^(\w+)-.*$/);
} catch {
    passed = false;
    fail('PR Validation Failed :disappointed:.  Could not detect issue type from PR title.');
}

issueType = issueType.toUpperCase();

if (!_.includes(ALLOWED_ISSUE_TYPES, issueType)) {
    passed = false;
    fail(`PR Validation Failed :disappointed:.  Issue type ${issueType} not recognized.`);
}

if (passed) {
    jiraIssue({
        key: issueType,
        url: 'https://mediafly.atlassian.net/browse',
        location: 'title',
        format: (emoji, jiraUrls) => {
            return _.size(jiraUrls) === 1
                ? `${emoji} JIRA ticket: ${jiraUrls[0]}`
                : `${emoji} JIRA tickets:<br>- ${jiraUrls.join('<br>- ')}`;
        }
    });
}
