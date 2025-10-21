###Provision the infrastructure using these commands

> **Note:** You should configure your aws credentials in your console using `aws configure` before running these commands.

```bash
terraform init

terraform plan -out=plan.out

terraform apply plan.out
```
