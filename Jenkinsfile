pipeline {
    agent {
        docker {
            image 'mhart/alpine-node:11' 
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
