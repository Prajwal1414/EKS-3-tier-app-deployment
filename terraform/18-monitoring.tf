resource "helm_release" "prometheus" {
  name       = "prometheus"
  repository = "https://prometheus-community.github.io/helm-charts"
  chart      = "kube-prometheus-stack"
  namespace  = "monitoring"
  version    = "78.0.0"
  create_namespace = true


  values = [
    <<-YAML
    prometheus:
      prometheusSpec:
        retention: 1d
      service:
        type: ClusterIP
      storageSpec:
        volumeClaimTemplate:
          spec:
            storageClassName: ebs-sc
            accessModes: ["ReadWriteOnce"]
            resources:
              requests:
                storage: 10Gi
      resources:
        requests:
          memory: 400Mi
          cpu: 500m
        limits: 
          memory: 800Mi
          cpu: 1
      serviceMonitorSelectorNilUsesHelmValues: false
      podMonitorSelectorNilUsesHelmValues: false


    grafana:
      enabled: true
      adminPassword: admin
      persistence: 
        enabled: true
        storageClassName: ebs-sc
        size: 10Gi
      service:    
        type: ClusterIP
      operator:
        dashboardsConfigMapRefEnabled: false

    alertmanager: 
      enabled: true
      alertmanagerSpec:
        storage:
          volumeClaimTemplate:
            spec:
              accessModes: ["ReadWriteOnce"]
              resources:
                requests:
                  storage: 10Gi
    YAML
  ]

  depends_on = [aws_eks_node_group.workers]
}

