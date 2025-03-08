import React, { useState, useEffect } from 'react';

const VendAccount = ({ userData }) => {
  // state hooks
  const [userInfo, setUserInfo] = useState(null)
  const [isEditing, setIsEditing] = useState(false);

  // 初始化用户信息
  useEffect(() => {
    if (userData) {
      setUserInfo({
        email: userData.email,
        nick_name: userData.nick_name,
        profile_image: userData.profile_image,
        description: userData.description, // 假设你可以从数据库获取description
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserInfo((prevData) => ({
        ...prevData,
        profile_image: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 这里需要把修改的内容发送到后端进行更新
    console.log('Updated User Data:', userInfo);
    // 发送到后端的 API 代码应该在这里
  };

  return (
    <div className="vend-account-container">
      <h1>Vendor Account</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={userInfo.email}
              onChange={handleInputChange}
            />
          ) : (
            <p>{userInfo.email}</p>
          )}
        </div>
        <div>
          <label>Nickname:</label>
          {isEditing ? (
            <input
              type="text"
              name="nick_name"
              value={userInfo.nick_name}
              onChange={handleInputChange}
            />
          ) : (
            <p>{userInfo.nick_name}</p>
          )}
        </div>
        <div>
          <label>Profile Image:</label>
          {isEditing ? (
            <input type="file" onChange={handleFileChange} />
          ) : (
            <img
              src={userInfo.profile_image}
              alt="Profile"
              style={{ width: '100px', height: '100px' }}
            />
          )}
        </div>
        <div>
          <label>Description:</label>
          {isEditing && (
            <textarea
              name="description"
              value={userInfo.description}
              onChange={handleInputChange}
            />
          )}
        </div>
        <div>
          <button type="button" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          {isEditing && <button type="submit">Save</button>}
        </div>
      </form>
    </div>
  );
};

export default VendAccount;
