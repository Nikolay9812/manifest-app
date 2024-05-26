import React, { useState } from 'react';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';

export default function DashAddUser() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        // Handle successful user creation (e.g., navigate to user list)
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Add User</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <Label value="Username" />
          <TextInput type="text" placeholder="Username" id="username" onChange={handleChange} />
        </div>
        <div>
          <Label value="Email" />
          <TextInput type="email" placeholder="name@company.com" id="email" onChange={handleChange} />
        </div>
        <div>
          <Label value="Password" />
          <TextInput type="password" placeholder="Password" id="password" onChange={handleChange} />
        </div>
        <Button gradientDuoTone="greenToBlue" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Loading...</span>
            </>
          ) : (
            'Add User'
          )}
        </Button>
      </form>
      {errorMessage && (
        <Alert className="mt-5" color="failure">
          {errorMessage}
        </Alert>
      )}
    </div>
  );
}
