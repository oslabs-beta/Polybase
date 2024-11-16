pipeline {
    
    agent any

    environment {
        NODE_ENV = 'development'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                script {
                  
                    dir('Polybase-Platform') {
                        sh 'npm install'
                    }
                    dir('Polybase-Package') {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Build Polybase-Platform') {
            steps {
                script {
                    dir('Polybase-Platform') {
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Build Polybase-Package') {
            steps {
                script {
                    dir('Polybase-Package') {
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    
                    dir('Polybase-Platform') {
                        sh 'npm run test || true'
                    }
                    dir('Polybase-Package') {
                        sh 'npm run test || true'
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo "Deploying application from the main branch..."
                
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            cleanWs() 
        }
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}