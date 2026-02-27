import React from 'react';
import Button from '../../components/Button/Button';

function StyleSheet() {
  return (
    <div>
      <h1>Buttons</h1>
      {/* Button Test */}
      <Button label="Click Me" onClick={() => alert('Button works!')} />
      <Button label="Submit Form" type="submit" />
      <Button label="Disabled" disabled={true} />
    </div>



  );
}

export default StyleSheet;
