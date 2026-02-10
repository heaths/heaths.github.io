---
title: Table formatting in GitHub CLI 2.0
date: 2021-08-24T11:00:00-07:00
excerpt: Use table formatting functions in template to get the same great table output as with built-in GitHub CLI commands.
categories: tips
tags:
- github
- git
- productivity
- tips
---
New in the [GitHub CLI 2.0](https://github.com/cli/cli/releases/tag/v2.0.0) is the ability to format results from built-in commands or custom API calls. The [pull request](https://github.com/cli/cli/pull/3519) was born from the desire to improve the output of my [`git user`](2021-04-21-gh-user.md) command - to use the same table formatting as built-in commands.

![gh user output](/assets/images/tips/gh-user-table-formatting.png)

To create this alias, you can [use another change](2021-05-19-gh-alias-set-from-stdin.md) I made to set the alias from stdin:

{% raw %}
```bash
gh alias set users - << 'EOF'
api graphql --paginate
--template '{{range .data.repository.assignableUsers.nodes}}{{if .status}}{{tablerow (autocolor "green" .login) .name (autocolor "yellow" .status.message)}}{{else}}{{tablerow (autocolor "green" .login) .name ""}}{{end}}{{end}}'
-F owner=':owner' -F repo=':repo' -F name='$1' -f query='
query ($repo: String!, $owner: String!, $name: String!, $endCursor: String) {
  repository(name: $repo, owner: $owner) {
    assignableUsers(first: 100, after: $endCursor, query: $name) {
      nodes {
        login
        name
        status {
          message
        }
      },
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
'
EOF
```
{% endraw %}

**Updated**: You can now install a simple script extension with GitHub CLI version 2.0 or newer:

```bash
gh extension install heaths/gh-users
```

See <https://github.com/heaths/gh-users> for details.

## Template functions

Table formatting is exposed in template using the following functions:

{% raw %}
* `{{tablerow <fields>}}`: aligns fields in output vertically as a table
* `{{tablerender}}`: renders fields added by tablerow in place

`{{tablerender}}` is optional and allows you to render the table immediately, which may be necessary if you output multiple tables like in the following example:
{% endraw %}

{% raw %}
```bash
gh alias set prcomments - << 'EOF'
pr view $1 --json number,title,reviewDecision,body,assignees,comments --template '{{printf "#%v" .number | autocolor "green"}} {{.title}} ({{autocolor "yellow" .reviewDecision}})

{{.body}}

{{tablerow (autocolor "gray+h" "ASSIGNEE") (autocolor "gray+h" "NAME")}}{{range .assignees}}{{tablerow (autocolor "green" .login) .name}}{{end}}{{tablerender}}
{{tablerow (autocolor "gray+h" "COMMENTER") (autocolor "gray+h" "ROLE") (autocolor "gray+h" "COMMENT")}}{{range .comments}}{{tablerow (autocolor "green" .author.login) .authorAssociation .body}}{{end}}'
EOF
```
{% endraw %}

This sample also shows you how you can output column headers: just output a row outside a `{{range}}`.

## Setting aliases in PowerShell

You can set aliases in PowerShell similarly using string literals:

{% raw %}
```powershell
@'
api graphql --paginate
--template '{{range .data.repository.assignableUsers.nodes}}{{if .status}}{{tablerow (autocolor "green" .login) .name (autocolor "yellow" .status.message)}}{{else}}{{tablerow (autocolor "green" .login) .name ""}}{{end}}{{end}}'
-F owner=':owner' -F repo=':repo' -F name='$1' -f query='
query ($repo: String!, $owner: String!, $name: String!, $endCursor: String) {
  repository(name: $repo, owner: $owner) {
    assignableUsers(first: 100, after: $endCursor, query: $name) {
      nodes {
        login
        name
        status {
          message
        }
      },
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
'
'@ | gh alias set users -
```
{% endraw %}
