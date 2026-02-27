import React from 'react';
import FormInput    from '../../components/FormInput/FormInput';
import FormTextarea from '../../components/FormTextarea/FormTextarea';

function Contact() {
  return (
    <div>
      <h1>CONTACT TEST</h1>
      <FormInput label="Test" id="test" value="" onChange={() => {}} />
      <FormTextarea label="Test" id="test2" value="" onChange={() => {}} />
    </div>
  );
}

export default Contact;