#!/bin/bash
source chatbot/bin/activate
exec python -m uvicorn main:app --port 8000