pipeline {
  agent any

  triggers {
    // Poll SCM mỗi 5 phút (chỉ build khi repo có commit mới)
    pollSCM('H/5 * * * *')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Environment') {
      steps {
        sh 'node -v'
        sh 'npm -v'
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Syntax check') {
      steps {
        sh 'node --check index.js'
      }
    }
  }
}
