# Docker Test Setup for CandyMapper Tests

This setup allows you to run the CandyMapper test automation suite in a Docker container, ensuring consistent test environment and easy integration with CI/CD pipelines.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone this repository:

   ```bash
   git clone https://github.com/dar-kow/candymapper-test-automation.git
   cd candymapper-test-automation
   ```

2. Make the run script executable:

   ```bash
   chmod +x run-tests.sh
   ```

3. Run the tests:
   ```bash
   ./run-tests.sh
   ```

## How It Works

- The `Dockerfile` creates an image with Playwright and all dependencies installed
- The container clones the test repository from GitHub
- Tests are executed inside the container
- Test results are copied to a mounted volume on your local machine
- The shell script automatically opens the HTML report when tests complete

## Customization

### Using a Local Repository

If you want to use your local repository instead of cloning from GitHub, modify the `docker-compose.yml` file:

```yaml
services:
  tests:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - ./test-results:/app/test-results
      # Add this line to mount your local repository
      - /path/to/your/local/candymapper-test-automation:/app
    environment:
      - CI=true
```

### Modifying Test Parameters

To change test parameters, create a `.env` file and add environment variables, then update the `docker-compose.yml` file to use these variables.

## Troubleshooting

- **Tests fail to run**: Make sure the Docker service is running and you have enough system resources
- **Report not generated**: Check Docker logs with `docker-compose logs`
- **Browser issues**: The Playwright Docker image includes browsers, but you may need to install additional dependencies for specific browser features

## CI/CD Integration

This setup can be easily integrated with CI/CD systems:

### GitHub Actions example:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests in Docker
        run: docker-compose up --build --exit-code-from tests
      - name: Upload test results
        uses: actions/upload-artifact@v2
        if: always()
        with:
          name: playwright-report
          path: test-results/
          retention-days: 30
```

### Jenkins example:

```groovy
pipeline {
    agent any

    stages {
        stage('Run Tests') {
            steps {
                sh 'docker-compose up --build --exit-code-from tests'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'test-results/**/*', fingerprint: true
        }
    }
}
```
