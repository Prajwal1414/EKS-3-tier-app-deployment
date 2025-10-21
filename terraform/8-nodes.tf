resource "aws_iam_role" "nodes" {
  name               = "${local.env}-${local.eks_name}-eks-cluster-nodes"
  assume_role_policy = <<POLICY
		{
			"Version": "2012-10-17",
			"Statement": [
				{
					"Effect": "Allow",
					"Action": "sts:AssumeRole",
					"Principal": {
						"Service": "ec2.amazonaws.com"
					}
				}
			]
		}
    POLICY
}

resource "aws_iam_role_policy_attachment" "eks_worker_node_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.nodes.name
}

resource "aws_iam_role_policy_attachment" "amazon_eks_cni_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.nodes.name
}

resource "aws_iam_role_policy_attachment" "amazon_ec2_container_registry_read_only" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.nodes.name
}

resource "aws_launch_template" "workers_lt" {
  name_prefix = "${local.env}-${local.eks_name}-lt-"
  description = "Launch template with max-pods=110 for worker nodes"

  user_data = base64encode(<<-EOT
    MIME-Version: 1.0
    Content-Type: multipart/mixed; boundary="==MYBOUNDARY=="

    --==MYBOUNDARY==
    Content-Type: text/x-shellscript; charset="us-ascii"

    #!/bin/bash
    /etc/eks/bootstrap.sh ${local.env}-${local.eks_name}-eks-cluster --kubelet-extra-args "--max-pods=110"

    --==MYBOUNDARY==--
  EOT
  )

  block_device_mappings {
    device_name = "/dev/xvda"

    ebs {
      volume_size           = 25
      volume_type           = "gp3"
      delete_on_termination = true
    }
  }
}

resource "aws_eks_node_group" "workers" {
  cluster_name    = aws_eks_cluster.main.name
  version         = local.eks_version
  node_group_name = "${local.env}-${local.eks_name}-node-group"
  node_role_arn   = aws_iam_role.nodes.arn

  subnet_ids = [
    aws_subnet.private_zone1.id,
    aws_subnet.private_zone2.id
  ]

  capacity_type  = "ON_DEMAND"
  instance_types = ["t2.medium"]

  scaling_config {
    desired_size = 3
    min_size     = 2
    max_size     = 3
  }

  update_config {
    max_unavailable = 1
  }

  launch_template {
    id      = aws_launch_template.workers_lt.id
    version = "$Latest"
  }

  labels = {
    role = "workers"
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.amazon_eks_cni_policy,
    aws_iam_role_policy_attachment.amazon_ec2_container_registry_read_only
  ]

  lifecycle {
    ignore_changes = [scaling_config[0].desired_size]
  }
}
