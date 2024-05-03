# Use the official Python image with your preferred version
FROM python:3.12

# Set the working directory inside the container
WORKDIR /code

# Install Poetry
RUN pip install --no-cache-dir poetry

# Copy the pyproject.toml and (optionally) poetry.lock files
COPY ./pyproject.toml ./poetry.lock* /code/

# Install project dependencies
# The `--no-root` flag tells Poetry to not install the current project package.
RUN poetry config virtualenvs.create false \
    && poetry install --no-dev --no-interaction --no-ansi

# Set PYTHONPATH
ENV PYTHONPATH=/code/app

# Copy the rest of your application
COPY ./app /code/app

# Command to run the application
CMD ["hypercorn", "--bind", "0.0.0.0:8080", "app.main:app"]