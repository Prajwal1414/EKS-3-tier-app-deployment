@Library('Shared') _
pipeline{
  agent any
  environment{
    SONAR_HOME = tool "Sonar"
  }
  parameters{
    string(name: "FRONTEND_DOCKER_TAG", defaultValue: '', description: "Setting frontend docker image tag")
    string(name: "BACKEND_DOCKER_TAG", defaultValue: '', description: "Setting backend docker image tag")
  }
  stages{
    stage("Validate parameters"){
      steps{
        script{
          if(params.FRONTEND_DOCKER_TAG == '' || params.BACKEND_DOCKER_TAG == ''){
            error("FRONTEND_DOCKER_TAG and BACKEND_DOCKER_TAG must be provided")
          }
        } 
      }
    }
    stage("Workspace cleanup"){
      steps{
        script{
          cleanWs()
        }
      }
    }
    stage("Git: Code checkout"){
      steps{
        script{
          code_checkout("https://github.com/Prajwal1414/blog-app.git", "local-k8s")
        }
      }
    }
    stage("Trivy: Filesystem scan"){
      steps{
        script{
          trivy_scan()
        }
      }
    }
    stage("OWASP: Dependency check"){
      steps{
        script{
          owasp_dependency()
        }
      }
    }
    stage("SonarQube: Code analysis"){
      steps{
        script{
          sonarqube_analysis("Sonar", "wanderlust", "wanderlust")
        }
      }
    }
    stage("SonarQube: Code quality gate"){
      steps{
        withSonarQubeEnv('Sonar') {
            timeout(time: 5, unit: 'MINUTES') {
                waitForQualityGate abortPipeline: false
            }
        }
      }
    }
    stage("Docker: Build images"){
      steps{
        script{
          dir("backend"){
            docker_build("backend", "${params.BACKEND_DOCKER_TAG}", "prajwalkumar1453")
          }
          dir("frontend"){
            docker_build("frontend", "${params.FRONTEND_DOCKER_TAG}", "prajwalkumar1453")
          }
        }
      }
    }
    stage("Trivy: Image scan"){
      steps{
        script{
          trivy_image_scan("prajwalkumar1453/backend:${params.BACKEND_DOCKER_TAG}")
          trivy_image_scan("prajwalkumar1453/frontend:${params.FRONTEND_DOCKER_TAG}")
        }
      }
    }
    stage("Docker: Push to DockerHub"){
      steps{
        script{
          docker_push("frontend", "${params.FRONTEND_DOCKER_TAG}", "prajwalkumar1453")
          docker_push("backend", "${params.BACKEND_DOCKER_TAG}", "prajwalkumar1453")
        }
      }
    }
  }
  post{
    success{
      archiveArtifacts artifacts: '*.xml', followSymlinks: false
      build job: "Wanderlust-CD", parameters: [
      string(name: 'FRONTEND_DOCKER_TAG', value: "${params.FRONTEND_DOCKER_TAG}"),
      string(name: 'BACKEND_DOCKER_TAG', value: "${params.BACKEND_DOCKER_TAG}")
    ]
    }
  }
}
