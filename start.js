// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import shell from "shelljs"

const run = () => {
  shell.env["TARGET"] = "dev"
  shell.env["AWS_REGION"] = "us-east-1"

  shell.exec(`localstack stop`)
  shell.exec(`AWS_ENDPOINT_URL=http://127.0.0.1:4566 AWS_ENDPOINT_URL_S3=http://127.0.0.1:4566 localstack start -d --no-banner`)
  shell.exec(`localstack config show`)

  shell.cd("cdk")
  shell.exec(`cdklocal bootstrap`)
  shell.exec(`AWS_ENDPOINT_URL=http://127.0.0.1:4566 AWS_ENDPOINT_URL_S3=http://127.0.0.1:4566 cdklocal deploy --require-approval never`)

  shell.exec(
    `awslocal apigateway get-rest-apis --output json --query "items[0].{apiId: id}" > ../frontend/src/.local.json`
  )
  shell.cd("..")
  shell.cp("./frontend/src/.local.json", "./lambda/src/.local.json")
}
run()
