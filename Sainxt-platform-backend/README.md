# Sainxt Platform Backend

## Overview
This is the FastAPI backend for the Sainxt Platform. It handles data processing, metrics, user profiles, and mock AI intelligence tasks via local LLMs.

## Prerequisites
- Python 3.9+
- Local MongoDB (Ensure Mongo is running locally on port `27017`)

## Installation
1. Create a virtual environment (optional but recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Ensure you have your `.env` configured inside this directory.

## Running the Application
1. Start the FastAPI server using Python:
   ```bash
   python fastapi_app.py
   ```
   Or explicitly using uvicorn:
   ```bash
   uvicorn fastapi_app:app --reload --host 0.0.0.0 --port 5000
   ```
2. The API will be accessible at [http://localhost:5000](http://localhost:5000). You can also view the Swagger UI documentation at [http://localhost:5000/docs](http://localhost:5000/docs).
