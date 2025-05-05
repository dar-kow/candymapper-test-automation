#!/bin/bash

# Create test-results directory if it doesn't exist
mkdir -p test-results

# Build and run the Docker container
echo "Building and running tests in Docker..."
docker-compose up --build

# Check if the tests were successful
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "Tests completed successfully!"
  
  # Check if we have a generated report
  if [ -d "test-results" ] && [ "$(ls -A test-results)" ]; then
    echo "Opening HTML report..."
    
    # Try to open the report with the appropriate command based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
      # macOS
      open test-results/index.html
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
      # Linux
      xdg-open test-results/index.html 2>/dev/null || \
      echo "Could not open report automatically. Report is available at: $(pwd)/test-results/index.html"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
      # Windows with Git Bash or similar
      start test-results/index.html 2>/dev/null || \
      echo "Could not open report automatically. Report is available at: $(pwd)/test-results/index.html"
    else
      echo "Report is available at: $(pwd)/test-results/index.html"
    fi
  else
    echo "No test results found."
  fi
else
  echo "Tests failed with exit code: $EXIT_CODE"
  echo "Check the logs above for details."
fi

exit $EXIT_CODE