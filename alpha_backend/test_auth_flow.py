#!/usr/bin/env python
"""Test auth and upload flow"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

# Step 1: Login
print("Step 1: Testing login...")
login_data = {
    "username": "admin@alpha.com",
    "password": "admin123"
}

response = requests.post(f"{BASE_URL}/auth/login", data=login_data)
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")

if response.status_code == 200:
    token = response.json().get("access_token")
    print(f"✓ Login successful! Token: {token[:30]}...")
    
    # Step 2: Test authenticated request
    print("\nStep 2: Testing authenticated request (GET /me)...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Step 3: Test upload endpoint (without actual file)
    print("\nStep 3: Testing upload endpoint...")
    with open("test.txt", "w") as f:
        f.write("test")
    
    with open("test.txt", "rb") as f:
        files = {"file": f}
        params = {"image_type": "service"}
        response = requests.post(f"{BASE_URL}/upload", files=files, headers=headers, params=params)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json() if response.status_code < 400 else response.text}")
else:
    print("✗ Login failed")
