pipeline {
    agent {
        docker {
            image 'node:current' 
            args '-p 3001:3001' 
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh 'npm install'
                sh 'npm run build:prod'
            }
        }
        stage('Test') { 
            steps {
                sh 'npm run test'
            }
        }
    }
}
