import requests

BASE_URL = 'http://127.0.0.1:8000/api'

print('=== Test 1: Unauthorized access (no token) ===')
response = requests.delete(f'{BASE_URL}/services/1')
print(f'DELETE /services/1 (no token): {response.status_code}')
print('PASS: 401 Unauthorized returned' if response.status_code == 401 else f'FAIL: Expected 401, got {response.status_code}')

print('\n=== Test 2: Wrong token ===')
response = requests.get(f'{BASE_URL}/auth/me', headers={'Authorization': 'Bearer fakefakefake'})
print(f'GET /auth/me (fake token): {response.status_code}')
print('PASS: 401 Unauthorized returned' if response.status_code == 401 else f'FAIL: Expected 401, got {response.status_code}')

print('\n=== Test 3: Valid login ===')
login_res = requests.post(f'{BASE_URL}/auth/login', data={'username': 'admin@alpha.com', 'password': 'admin123'})
if login_res.status_code == 200:
    token = login_res.json()['access_token']
    print('PASS: Login successful, token received')
    
    print('\n=== Test 4: GET /me with valid token ===')
    response = requests.get(f'{BASE_URL}/auth/me', headers={'Authorization': f'Bearer {token}'})
    if response.status_code == 200:
        user = response.json()
        print(f'PASS: 200 - User: {user["email"]}, is_admin: {user["is_admin"]}')
    else:
        print(f'FAIL: {response.status_code}')
    
    print('\n=== Test 5: POST /services with valid token ===')
    service_data = {'title': 'Test Service', 'category': 'design', 'description': 'Test', 'icon_url': ''}
    response = requests.post(f'{BASE_URL}/services', json=service_data, headers={'Authorization': f'Bearer {token}'})
    print(f'POST /services: {response.status_code}')
    print('PASS: 201 Created' if response.status_code == 201 else f'FAIL: Expected 201, got {response.status_code}')
else:
    print(f'FAIL: Login failed - {login_res.status_code}')
