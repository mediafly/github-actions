'use strict';

// always import danger first
const { fail, danger } = require('danger');

// danger-plugin-jira-issue exports a default function to hacking to get it imported
const jiraIssue = require('danger-plugin-jira-issue').default;
const _ = require('lodash');

const pr = _.get(danger, 'github.pr');
let issueType;

if (title.startsWith('INSIGHT-')) {
    issueType = 'INSIGHT';
} else if (title.startsWith('PS-')) {
    issueType = 'PS';
} else {
    fail('PR Validation Failed :disappointed:');
}

if (pr) {
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