module.exports = {
  apps: [{
    name: 'app',
    script: './dist/src/main.js',
    instances: 'max', // 몇개 열건지 설정 필수
    exec_mode: 'cluster',
  }]
}