pipeline {
    agent any

    environment {
        NODE_VERSION = '20'
        DOTNET_VERSION = '10.0'
        APP_NAME = 'sgia'
        REGISTRY = 'docker.io'
        REGISTRY_USERNAME = 'grooverdev'
        DOCKERHUB_REPO = 'grooverdev'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    options {
        timeout(time: 45, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                echo 'Building backend (.NET)...'
                dir('sgia') {
                    sh 'dotnet restore'
                    sh 'dotnet build --configuration Release --no-restore'
                    sh 'dotnet publish --configuration Release --no-build --output ./publish'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building frontend (Angular)...'
                dir('sgia-front') {
                    sh 'yarn install --frozen-lockfile'
                    sh 'yarn build'
                }
            }
        }

        stage('Test Backend') {
            steps {
                echo 'Running backend tests...'
                dir('sgia') {
                    sh 'dotnet test --configuration Release --no-build --verbosity minimal || true'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                echo 'Running frontend tests...'
                dir('sgia-front') {
                    sh 'yarn test --watch=false --browsers=ChromeHeadless || true'
                }
            }
        }

        stage('Build Docker Images') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                echo 'Logging into Docker Hub...'
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                }
                
                echo 'Building Docker images...'
                
                sh '''
                    cd sgia
                    docker build -t ${DOCKERHUB_REPO}/${APP_NAME}-backend:${IMAGE_TAG} .
                    docker tag ${DOCKERHUB_REPO}/${APP_NAME}-backend:${IMAGE_TAG} ${DOCKERHUB_REPO}/${APP_NAME}-backend:latest
                '''
                
                sh '''
                    cd sgia-front
                    docker build -t ${DOCKERHUB_REPO}/${APP_NAME}-frontend:${IMAGE_TAG} .
                    docker tag ${DOCKERHUB_REPO}/${APP_NAME}-frontend:${IMAGE_TAG} ${DOCKERHUB_REPO}/${APP_NAME}-frontend:latest
                '''
            }
        }

        stage('Push Docker Images') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                echo 'Pushing Docker images to registry...'
                
                sh '''
                    docker push ${DOCKERHUB_REPO}/${APP_NAME}-backend:${IMAGE_TAG}
                    docker push ${DOCKERHUB_REPO}/${APP_NAME}-backend:latest
                    docker push ${DOCKERHUB_REPO}/${APP_NAME}-frontend:${IMAGE_TAG}
                    docker push ${DOCKERHUB_REPO}/${APP_NAME}-frontend:latest
                '''
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Deploying to staging environment...'
                sh '''
                    docker-compose -f compose.yaml down || true
                    docker-compose -f compose.yaml pull
                    docker-compose -f compose.yaml up -d
                '''
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to production environment...'
                
                script {
                    def deployChoice = input(
                        message: 'Deploy to production?',
                        ok: 'Deploy',
                        parameters: [
                            choice(name: 'STRATEGY', choices: ['rolling', 'blue-green', 'canary'], description: 'Choose deployment strategy')
                        ]
                    )
                    env.DEPLOY_STRATEGY = deployChoice.STRATEGY
                }
                
                echo "Deploying with strategy: ${env.DEPLOY_STRATEGY}"
                
                sh '''
                    docker-compose -f compose.yaml down
                    docker-compose -f compose.yaml up -d
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo 'Waiting for services to be healthy...'
                sh '''
                    sleep 30
                    
                    echo "Checking PostgreSQL..."
                    docker-compose -f compose.yaml exec -T postgres pg_isready -U postgres || exit 1
                    
                    echo "Checking Keycloak..."
                    curl -f http://localhost:8088/health/ready || exit 1
                    
                    echo "Checking Backend API..."
                    curl -f http://localhost:5150/health || exit 1
                    
                    echo "Checking Frontend..."
                    curl -f http://localhost:42000 || exit 1
                    
                    echo "All services are healthy!"
                '''
            }
        }
    }

    post {
        always {
            echo 'Cleaning workspace...'
            sh 'docker logout || true'
            cleanWs()
        }
        success {
            echo 'Build and deployment completed successfully!'
            emailext(
                subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Pipeline completed successfully.\nBuild: ${env.BUILD_URL}",
                to: '${DEFAULT_EMAIL_RECIPIENTS}'
            )
        }
        failure {
            echo 'Build failed!'
            emailext(
                subject: "FAILURE: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Pipeline failed.\nBuild: ${env.BUILD_URL}",
                to: '${DEFAULT_EMAIL_RECIPIENTS}'
            )
        }
    }
}