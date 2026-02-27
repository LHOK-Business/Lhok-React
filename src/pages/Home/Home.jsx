import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import FormInput from '../../components/FormInput/FormInput';

function Home() {
  const [name, setName] = useState('');

  return (
    <div>
      <h1>Home</h1>
      <FormInput
        label="Your Name"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="John Smith"
        required={true}
      />
      <FormInput
        label="Broken Field"
        id="broken"
        value=""
        onChange={() => {}}
        error="This field has an error"
      />
      <Button label="Click Me" onClick={() => alert('Button works!')} />
    </div>
  );
}

export default Home;