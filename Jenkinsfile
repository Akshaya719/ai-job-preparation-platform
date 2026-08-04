pipeline {
    agent any

    environment {
        // Assuming a standard Jenkins credential ID for DockerHub containing username and password
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-credentials'
        
        // These will be populated if you use the withCredentials block, 
        // or we can just rely on the Docker plugin's withRegistry.
        // For image naming, we often need the username. Let's assume it's passed as an env var 
        // or we hardcode the org/username if it's fixed. 
        // Here we use a placeholder that the user should replace or configure in Jenkins.
        DOCKER_ORG = 'akshaya786'
        BACKEND_IMAGE = "${DOCKER_ORG}/interview-ai-backend"
        FRONTEND_IMAGE = "${DOCKER_ORG}/interview-ai-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Images') {
            parallel {
                stage('Build Backend') {
                    steps {
                        script {
                            dir('Backend') {
                                backendImage = docker.build("${BACKEND_IMAGE}:${env.GIT_COMMIT}", "-f Dockerfile .")
                            }
                        }
                    }
                }
                
                stage('Build Frontend') {
                    steps {
                        script {
                            dir('Frontend') {
                                frontendImage = docker.build("${FRONTEND_IMAGE}:${env.GIT_COMMIT}", "--build-arg VITE_API_URL=http://localhost:3000 -f Dockerfile .")
                            }
                        }
                    }
                }
            }
        }

        stage('Push Images') {
            // Only push images on the main branch (equivalent to 'push' event on main in GH Actions)
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    // Login and push using the Jenkins Docker plugin
                    docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS_ID) {
                        backendImage.push()
                        backendImage.push('latest')
                        
                        frontendImage.push()
                        frontendImage.push('latest')
                    }
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}
