import urllib.request
import urllib.error

try:
    response = urllib.request.urlopen('http://localhost:8000/api/upload')
    print(f"Status: {response.status}")
except urllib.error.HTTPError as e:
    print(f"Status: {e.code}")
    print(f"Response: {e.read().decode()[:200]}")
except Exception as e:
    print(f"Error: {e}")

