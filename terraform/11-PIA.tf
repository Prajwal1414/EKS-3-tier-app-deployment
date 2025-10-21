resource "aws_eks_addon" "PIA" {
  cluster_name  = aws_eks_cluster.main.name
  addon_name    = "eks-pod-identity-agent"
  addon_version = "v1.3.8-eksbuild.2"
}