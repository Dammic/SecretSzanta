pipeline {
    agent {
        docker {
            image 'node:11.4-slim' 
            args '-p 3001:3001' 
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh 'npm install' 
            }
        }
    }
}
