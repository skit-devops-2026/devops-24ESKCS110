pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Project') {
            steps {
                bat 'echo Checking DevVault project...'
                bat 'dir'
            }
        }

        stage('Build') {
            steps {
                bat 'echo DevVault frontend build completed.'
            }
        }
    }
}