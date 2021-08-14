module.exports = {
    apps : [
        {
          name: "chatapp",
          script: "./index.js",
          instances: 4,
          exec_mode: "cluster",
          watch: true,
          increment_var : 'PORT',
          env: {
              "PORT": 8090,
          }
        }
    ]
  }