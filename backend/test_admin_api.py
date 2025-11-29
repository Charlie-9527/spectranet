"""
测试管理员创建用户 API
"""
import requests

# 1. 登录获取 token
login_url = "http://localhost:8000/api/auth/login"
login_data = {
    "username": "2024180168",
    "password": "070032"
}

print("🔐 登录中...")
login_response = requests.post(login_url, data=login_data)

if login_response.status_code == 200:
    token = login_response.json()["access_token"]
    print(f"✅ 登录成功! Token: {token[:20]}...")
    
    # 2. 使用管理员权限创建新用户
    create_user_url = "http://localhost:8000/api/auth/admin/create-user"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    new_user = {
        "username": "apitest",
        "email": "apitest@example.com",
        "password": "test123",
        "full_name": "API测试用户",
        "institution": "测试机构"
    }
    
    print("\n👤 创建新用户中...")
    create_response = requests.post(create_user_url, json=new_user, headers=headers)
    
    if create_response.status_code == 201:
        user_data = create_response.json()
        print("✅ 用户创建成功!")
        print(f"   用户名: {user_data['username']}")
        print(f"   邮箱: {user_data['email']}")
        print(f"   姓名: {user_data.get('full_name', 'N/A')}")
        print(f"   机构: {user_data.get('institution', 'N/A')}")
    else:
        print(f"❌ 创建失败: {create_response.status_code}")
        print(f"   错误信息: {create_response.json()}")
else:
    print(f"❌ 登录失败: {login_response.status_code}")
    print(f"   错误信息: {login_response.json()}")
