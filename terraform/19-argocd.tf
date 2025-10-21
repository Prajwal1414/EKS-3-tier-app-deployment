resource "helm_release" "argocd" {
  name       = "argocd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  namespace  = "argocd"
  version    = "8.6.1"
  create_namespace = true


  depends_on = [aws_eks_node_group.workers]
}
